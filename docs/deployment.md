# Deployment — Expose Frontend ra Internet qua MikroTik

Quy trình đưa **frontend** (`kt-xnk`) ra Internet để truy cập từ bên ngoài
mạng công ty, dùng modem/router **MikroTik**. Backend (`BE-kt-xnk`) **không**
expose ra ngoài — vẫn chạy trong LAN như `BE-kt-xnk/docs/deployment.md` đã
mô tả, vì trình duyệt không bao giờ gọi thẳng backend (xem kiến trúc bên
dưới).

## Kiến trúc: vì sao chỉ cần expose Frontend

`src/app/api/backend/[...path]/route.js` là một **backend-for-frontend
(BFF) proxy**: mọi request từ trình duyệt gọi `/api/backend/...` trên chính
domain của frontend, route handler đó (chạy trên server Next.js) mới gắn
token và gọi sang backend thật. Trình duyệt **không bao giờ** biết địa chỉ
backend, không có CORS, không cần backend có TLS/domain riêng.

```
Người dùng (Internet)
      │ HTTPS
      ▼
┌─────────────────────────────┐
│ nginx (TLS) → app (Next.js) │  ← EXPOSE ra Internet (mục này)
└─────────────┬───────────────┘
              │ HTTP nội bộ (server gọi server)
              ▼
┌─────────────────────────────┐
│ CompanyManagement API       │  ← CHỈ trong LAN công ty
│ (BE-kt-xnk/docker-compose   │     (BE-kt-xnk/docs/deployment.md)
│  .lan.yml)                  │
└─────────────────────────────┘
```

Hệ quả: chỉ máy chạy **frontend** cần mở port ra ngoài qua MikroTik. Máy
chạy backend chỉ cần địa chỉ LAN cố định để frontend gọi tới — không đổi gì
so với hướng dẫn LAN đã có.

> Nếu sau này thực sự cần một bên thứ ba (app mobile, đối tác) gọi thẳng
> API, đó là một quyết định riêng, cần domain + TLS + hardening cho backend
> — không nằm trong tài liệu này.

---

## 0. Yêu cầu trước khi bắt đầu

- Máy chạy frontend có Docker + Docker Compose v2, nằm trong mạng LAN công
  ty, truy cập được tới máy chạy backend qua IP LAN (`http://<IP-LAN-BE>:8080`
  — xem `BE-kt-xnk/docs/deployment.md`). Có thể là cùng một máy vật lý với
  backend hoặc máy khác, miễn cùng LAN.
- Modem/router công ty là **MikroTik** (RouterOS), có quyền quản trị
  (Winbox/WebFig/SSH).
- Chưa có domain — dùng **MikroTik Cloud DDNS** (miễn phí, có sẵn trong
  RouterOS, không cần tài khoản bên thứ ba) để có một hostname public ổn
  định dù IP WAN là động.

```bash
docker --version
docker compose version
```

---

## 1. MikroTik — đặt IP LAN cố định cho máy chạy frontend

Máy chủ cần một địa chỉ LAN **không đổi** để port-forward luôn trỏ đúng máy.
Cách đơn giản nhất: **DHCP reservation** theo địa chỉ MAC (không cần đổi cấu
hình mạng trên chính máy chủ).

Lấy MAC của máy chủ trước:

```bash
# Linux
ip link show
# Windows
ipconfig /all
```

Trên MikroTik (Winbox → Terminal, hoặc SSH), giả sử dải LAN mặc định
`192.168.100.0/24` và muốn gán `192.168.100.34` cho frontend:

```
/ip dhcp-server lease
add address=192.168.100.34 mac-address=AA:BB:CC:DD:EE:FF server=[find] comment="frontend-server"
```

(`server=[find]` lấy DHCP server đầu tiên đang cấu hình — nếu MikroTik có
nhiều DHCP server, thay bằng tên cụ thể từ `/ip dhcp-server print`.)

Khởi động lại kết nối mạng trên máy chủ (hoặc `ipconfig /renew` /
`dhclient -r && dhclient`) để nhận đúng IP mới.

Xác nhận:

```
/ip dhcp-server lease print where address=192.168.100.34
```

---

## 2. MikroTik — bật Cloud DDNS (miễn phí, không cần domain)

RouterOS có sẵn dịch vụ DDNS của chính MikroTik, tự động cập nhật khi IP WAN
đổi — không cần cài thêm client hay đăng ký dịch vụ ngoài:

```
/ip cloud
set ddns-enabled=yes
print
```

Kết quả `print` cho ra một hostname dạng
`xxxxxxxxxxxxxxx.sn.mynetname.net` — đây chính là domain dùng ở các bước
sau. Ghi lại hostname này.

> Muốn dùng domain riêng thay vì hostname MikroTik? Trỏ một A record của
> domain đó về IP WAN hiện tại, và tự thêm một client DDNS khác (vd
> DuckDNS/Cloudflare) nếu IP WAN là động — MikroTik Cloud DDNS chỉ tự cập
> nhật cho chính hostname `*.sn.mynetname.net` của nó.

---

## 3. MikroTik — port forwarding (dst-nat)

Xác định interface WAN (cổng ra Internet) trước:

```
/interface print
/ip address print
```

Tìm interface có địa chỉ IP public (không phải dải LAN `192.168.x.x`) —
thường là `ether1` hoặc `pppoe-out1` nếu dùng PPPoE. Gọi tên đó là
`<WAN>` trong các lệnh dưới.

Forward port 80 và 443 từ WAN vào máy chủ frontend (`192.168.100.34` — IP đã
đặt ở mục 1):

> Port 80 trên máy `192.168.100.34` đang bị IIS (Windows) chiếm sẵn, nên
> nginx container publish ra host ở port **8090** thay vì 80 (xem
> `docker-compose.prod.yml`). Vì vậy rule dst-nat cho HTTP phải trỏ
> `to-ports=8090` — người dùng bên ngoài vẫn gõ port 80 bình thường, chỉ có
> bước NAT dịch sang 8090 trước khi vào máy. Port 443 không xung đột nên giữ
> nguyên `to-ports=443`.

```
/ip firewall nat
add chain=dstnat in-interface=<WAN> protocol=tcp dst-port=80 action=dst-nat to-addresses=192.168.100.34 to-ports=8090 comment="Frontend HTTP (ACME + redirect)"
add chain=dstnat in-interface=<WAN> protocol=tcp dst-port=443 action=dst-nat to-addresses=192.168.100.34 to-ports=443 comment="Frontend HTTPS"
```

**Không forward thêm port nào khác** — đặc biệt không forward port của
backend (8080), MySQL (3306), RDP/SSH của bất kỳ máy nào trong công ty.

---

## 4. MikroTik — firewall filter cho phép traffic đã forward

Cấu hình mặc định của RouterOS (`defconf`) thường đã có rule chặn hết traffic
mới vào LAN trừ khi khớp NAT — kiểm tra và thêm rule accept **phía trên**
mọi rule `drop`/`reject` cuối chain `forward`:

```
/ip firewall filter print
```

Thêm rule (điều chỉnh số thứ tự `place-before` theo rule `drop all` hiện có
trong danh sách vừa in ra — luôn đặt accept phía TRÊN drop):

> Lưu ý: NAT (dstnat) chạy ở giai đoạn prerouting, **trước** khi packet tới
> chain `forward` — nên tại `forward`, `dst-port` đã là port **sau khi dịch**
> (8090 cho HTTP), không phải port 80 gốc mà người ngoài gõ vào.

```
/ip firewall filter
add chain=forward protocol=tcp dst-port=8090 dst-address=192.168.100.34 action=accept place-before=<số-thứ-tự-rule-drop> comment="Allow inbound HTTP to frontend"
add chain=forward protocol=tcp dst-port=443 dst-address=192.168.100.34 action=accept place-before=<số-thứ-tự-rule-drop> comment="Allow inbound HTTPS to frontend"
```

Nếu chain `forward` của bạn vốn không có rule drop nào (chính sách mặc định
là accept), có thể bỏ qua bước này — port forwarding ở mục 3 đã đủ. Kiểm tra
kỹ bằng cách thử truy cập từ mạng ngoài sau khi hoàn tất (mục 8).

---

## 5. Lấy code

```bash
git clone https://github.com/tienlx97/kt-xnk.git
cd kt-xnk
git checkout main
git pull
```

---

## 6. Tạo file `.env`

```bash
cp .env.production.example .env
```

Điền trong `.env`:

| Biến | Giá trị |
|---|---|
| `API_BASE_URL` | Địa chỉ LAN của backend, vd `http://192.168.100.34:8080` (backend chạy chung máy với frontend, theo `BE-kt-xnk/docker-compose.lan.yml`) |

---

## 7. Sửa hostname trong cấu hình nginx và lấy chứng chỉ TLS

```bash
sed -i 's/app.your-ddns-hostname.example/hd6089xzez8.sn.mynetname.net/g' nginx/conf.d/app.conf
```

Lấy chứng chỉ Let's Encrypt lần đầu (chi tiết: `nginx/README.md`):

```bash
mkdir -p certbot/conf certbot/www

docker run --rm -p 80:80 \
  -v "$PWD/certbot/www:/var/www/certbot" \
  -v "$PWD/certbot/conf:/etc/letsencrypt" \
  certbot/certbot certonly --standalone \
  -d hd6089xzez8.sn.mynetname.net \
  --email you@example.com --agree-tos --no-eff-email
```

> Bước này cần port 80 đã forward đúng tới máy chủ (mục 3) — Let's Encrypt
> gọi ngược từ Internet vào để xác minh quyền sở hữu hostname.

---

## 8. Build và chạy stack

```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml logs -f app
```

Kiểm tra container healthy:

```bash
docker compose -f docker-compose.prod.yml ps
```

---

## 9. Xác minh end-to-end

Từ **một mạng khác** (4G điện thoại, tắt Wi-Fi công ty) để chắc chắn thật sự
truy cập được từ Internet:

```bash
curl -I http://hd6089xzez8.sn.mynetname.net          # phải redirect sang https
curl -I https://hd6089xzez8.sn.mynetname.net          # phải trả về 200
```

Mở trình duyệt, đăng nhập thử bằng tài khoản Admin đã seed ở backend
(`BE-kt-xnk/docs/deployment.md`) — xác nhận toàn bộ luồng (frontend → BFF
proxy → backend LAN) hoạt động.

Kiểm tra backend **không** truy cập được từ ngoài mạng công ty (đúng như kỳ
vọng — nó không được port-forward):

```bash
curl -m 5 http://<IP-WAN-cong-ty>:8080   # phải timeout/connection refused
```

---

## 10. Deploy bản cập nhật

```bash
git pull
docker compose -f docker-compose.prod.yml build app
docker compose -f docker-compose.prod.yml up -d app
```

---

## Checklist tổng hợp

- [ ] Máy chủ frontend có IP LAN cố định (DHCP reservation, mục 1)
- [ ] MikroTik Cloud DDNS bật, có hostname ổn định (mục 2)
- [ ] Port 80/443 (chỉ hai port này) forward đúng tới máy chủ frontend (mục 3)
- [ ] Firewall filter cho phép traffic đã forward, không có rule drop chặn nhầm (mục 4)
- [ ] `.env` có `API_BASE_URL` trỏ đúng IP LAN backend
- [ ] Chứng chỉ TLS lấy thành công, không tự ký
- [ ] Truy cập được từ mạng ngoài (4G), đăng nhập được
- [ ] Xác nhận backend **không** truy cập được từ ngoài mạng công ty
- [ ] Không có port nào khác bị forward ngoài 80/443 (kiểm tra lại `/ip firewall nat print` trên MikroTik)

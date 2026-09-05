# nginx + Let's Encrypt setup (production)

`docker-compose.prod.yml` runs `nginx` (TLS termination, reverse proxy to
the `app` service) and `certbot` (cert issuance/renewal) side by side,
sharing `./certbot/conf` and `./certbot/www` with the host.

Same pattern as BE-kt-xnk's `nginx/README.md` — see that file if anything
here is unclear, it's more heavily annotated.

## One-time setup on the server

1. Get a hostname pointing at this machine's public IP. If you don't have a
   domain, MikroTik's built-in Cloud DDNS is free and needs no third-party
   account — see `docs/deployment.md`'s MikroTik section. It gives you
   something like `abcd1234.sn.mynetname.net`.
2. Replace `app.your-ddns-hostname.example` in `nginx/conf.d/app.conf` with
   the real hostname (both server blocks). Already done for this deployment —
   `nginx/conf.d/app.conf` uses `hd6089xzez8.sn.mynetname.net`.
3. Get the first certificate before nginx can start with the real config —
   it needs a cert file to exist to even parse the `server { listen 443 }`
   block.

   > Host port 80 is taken by IIS on this machine (`W3SVC`), so the
   > standalone certbot run below publishes on host port **8090** instead —
   > matching the router's dst-nat (`external 80 -> 192.168.100.34:8090`,
   > see `docs/deployment.md` section 3) and the `docker-compose.prod.yml`
   > nginx port mapping. Let's Encrypt still connects to the public
   > hostname on plain port 80; the router/host quietly translate that to
   > 8090.

   **Linux / macOS (bash):**

   ```bash
   mkdir -p certbot/conf certbot/www

   docker run --rm -p 8090:80 \
     -v "$PWD/certbot/www:/var/www/certbot" \
     -v "$PWD/certbot/conf:/etc/letsencrypt" \
     certbot/certbot certonly --standalone \
     -d hd6089xzez8.sn.mynetname.net \
     --email you@example.com --agree-tos --no-eff-email
   ```

   **Windows (PowerShell):**

   ```powershell
   New-Item -ItemType Directory -Force certbot\conf, certbot\www | Out-Null

   docker run --rm -p 8090:80 -v "${PWD}/certbot/www:/var/www/certbot" -v "${PWD}/certbot/conf:/etc/letsencrypt" certbot/certbot certonly --standalone -d hd6089xzez8.sn.mynetname.net --email you@example.com --agree-tos --no-eff-email
   ```

4. Now bring up the full stack — nginx will find the cert certbot just
   issued (same command on both platforms):

   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

The `certbot` service takes over renewal from here (checks every 12h,
Let's Encrypt certs renew inside their last 30 days of validity). The
`nginx` service reloads every 12h to pick up a renewed cert without
downtime.

## Verifying

Works the same in bash or PowerShell (`curl` is aliased to `Invoke-WebRequest`
on Windows by default — use `curl.exe` if you want the real curl output):

```bash
curl -I https://hd6089xzez8.sn.mynetname.net
```

Check HTTP redirects to HTTPS, and the cert is Let's Encrypt-issued and not
self-signed/expired.

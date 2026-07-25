# OpenSpec × Harness — Shared Template (OpenAI standard)

Template dùng chung kết hợp **OpenSpec** (lớp đặc tả) và **Harness Engineering
theo chuẩn OpenAI** (lớp vận hành). Một harness phải làm 4 việc:
**Constrain** (giới hạn) · **Inform** (dẫn đường) · **Verify** (kiểm chứng) · **Correct** (tự sửa).

Nguồn:
- [OpenAI: Harness engineering](https://openai.com/index/harness-engineering/) — chuẩn chính của template này
- [OpenSpec](https://github.com/Fission-AI/OpenSpec) — spec-driven development
- [Anthropic: Harness design](https://www.anthropic.com/engineering/harness-design-long-running-apps) — sprint contract, handoff qua file
- [Learn Harness Engineering](https://walkinglabs.github.io/learn-harness-engineering) — 5 subsystem

## Cấu trúc

```
template/
├── AGENTS.md                  # MAP ~100 dòng, trỏ đến nguồn sự thật (Inform)
├── CLAUDE.md                  # Trỏ về AGENTS.md
├── init.sh                    # Khởi tạo phiên: cài đặt + audit môi trường
├── docs/                      # Nguồn sự thật có version mà AGENTS.md trỏ tới
│   ├── architecture.md        # Sơ đồ hệ thống + trách nhiệm từng layer
│   └── adr/                   # Architecture Decision Records (+ mục Enforcement)
├── openspec/
│   ├── project.md             # Stack, convention (phải lint được), ngưỡng chất lượng bằng SỐ
│   ├── changes/_template/     # proposal / design (sprint contract) / tasks / specs
│   └── archive/
└── harness/
    ├── structure.rules.cjs    # Structural test: types→config→repo→service→runtime→ui (Constrain)
    ├── verify.sh              # Cổng kiểm định + ghi evidence vào harness/runs/ (Verify)
    ├── GOLDEN_RULES.md        # Quy tắc có version, mỗi quy tắc kèm cơ chế enforcement
    ├── ENTROPY.md             # Quality grades + cleanup agent định kỳ (Correct)
    ├── quality-grades.json    # Grade A/B/C từng thư mục — chỉ copy pattern từ code grade A
    ├── PROGRESS.md            # Log phiên + "Harness gaps" (lỗi lặp lại → rule mới)
    └── audit-harness.sh       # Tự kiểm tra harness còn nguyên vẹn
```

## Các nguyên tắc OpenAI được mã hóa vào template

1. **Map, not manual** — `AGENTS.md` ≤ ~100 dòng, chỉ trỏ; chi tiết sống trong `docs/` và `openspec/`.
2. **Ràng buộc kiến trúc cơ học** — chuỗi dependency `types → config → repo → service → runtime → ui` được enforce bằng dependency-cruiser (`structure.rules.cjs`); thông báo lỗi dạy cách sửa, không chỉ báo sai.
3. **Bounded solution space** — agent làm việc tốt hơn trong không gian nghiệm bị giới hạn: scope 1 task, layer rules, golden rules.
4. **Chất lượng là con số** — ngưỡng nằm trong `openspec/project.md`; project phải nối từng ngưỡng vào một check chạy trong `verify.sh`. Evidence lưu ở `harness/runs/<timestamp>/`.
5. **Quản lý entropy** — agent nhân bản pattern nó nhìn thấy, nên: quality grades A/B/C, cleanup agent định kỳ mở PR nhỏ, golden rules có version.
6. **Mỗi lỗi của agent là một lỗ hổng của harness** — sửa tay 2 lần cùng một lỗi = harness failure; thêm lint/structural test/rule để lỗi đó không thể xảy ra nữa (mục "Harness gaps" trong `PROGRESS.md`).

## Cách dùng

1. **Khởi tạo**: copy `template/` vào repo; xóa `.harness-template`; điền `openspec/project.md`, `docs/architecture.md`, mô tả trong `AGENTS.md`; thêm các script bắt buộc `lint`, `typecheck`, `test`, `build`, `verify:quality`. Script cuối phải đo các ngưỡng đã khai báo, chẳng hạn coverage, startup time hoặc bundle size. Khi đã có file trong `src/`, thiếu bất kỳ script nào hoặc còn placeholder đều làm verification fail.
2. **Mỗi change**: copy `openspec/changes/_template/` → `openspec/changes/<ten>/`; điền proposal → specs → design (kèm tiêu chí verify chốt trước — sprint contract) → tasks.
3. **Mỗi phiên agent**: đọc `AGENTS.md` → `PROGRESS.md` → change active; chạy `./init.sh`; làm **một** task; `./harness/verify.sh` pass mới được tick; cập nhật state; commit.
4. **Hoàn tất change**: mọi task xong → chuyển sang `openspec/archive/YYYY-MM-DD-<ten>/`.
5. **Định kỳ**: chạy cleanup agent theo `harness/ENTROPY.md`; review "Harness gaps" và biến chúng thành rule cơ học.

## Multi-agent (Claude Code + Codex + con người)

Template được thiết kế agent-agnostic:

- **`AGENTS.md`** là chuẩn chung — Codex đọc trực tiếp; Claude Code đi qua `CLAUDE.md` (chỉ trỏ về `AGENTS.md`). Không có instruction nào chỉ một agent biết.
- **Memory dùng chung = file trong repo**: `harness/PROGRESS.md` (handoff giữa phiên, bất kể agent nào), `docs/adr/` (quyết định), `openspec/` (spec + decision log). Đây là hard rule trong `AGENTS.md`.
- **Lớp recall dùng chung = memsearch** ([zilliztech/memsearch](https://github.com/zilliztech/memsearch), xem `docs/adr/0002-memory-layer.md`): memory là markdown trong `.memsearch/memory/` (git-tracked, **review trước khi commit** vì transcript tự động dễ dính secrets); index Milvus là shadow local, rebuild được. Cài cho Claude Code qua plugin, cho Codex qua `plugins/codex/scripts/install.sh`. Thứ bậc nguồn sự thật: `openspec/` > `docs/adr/` > `PROGRESS.md` > memory — fact quan trọng phải được promote lên trên, memory chỉ để tìm lại.
- **Không dùng memory riêng của tool khác làm nguồn sự thật** (claude-mem, ChatGPT/Codex memory...): agent khác không nhìn thấy, teammate không nhìn thấy, và không đi theo git.
- Mọi cơ chế enforce (`verify.sh`, structural test, CI) là shell/CI thuần — agent nào cũng chạy được y hệt.
- `pnpm run test:harness` kiểm thử chính các rule kiến trúc bằng fixture hợp lệ và không hợp lệ; thay đổi rule mà làm mất enforcement sẽ khiến CI fail.

> `harness/runs/` đã nằm trong `.gitignore` — evidence log không commit vào repo.

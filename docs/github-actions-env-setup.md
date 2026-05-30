# GitHub Actions Environment Setup (SIT/UAT)

Dokumen ini menjelaskan cara setup secrets dan variables untuk workflow GitHub Actions secara bulk (tanpa input satu-satu di UI).

## Prasyarat

1. Sudah login `gh` CLI ke akun yang punya akses repo.
2. `jq` sudah terpasang.
3. Jalankan command dari root repository.

Cek cepat:

```bash
command -v gh
command -v jq
gh auth status -h github.com
```

## 1) Set default repo di gh CLI

```bash
gh repo set-default YusufRajaTamba-inc/playwright-project
gh repo view --json nameWithOwner -q .nameWithOwner
```

Output verifikasi harus menampilkan:

```text
YusufRajaTamba-inc/playwright-project
```

## 2) Buat GitHub Environments

```bash
gh api --method PUT repos/YusufRajaTamba-inc/playwright-project/environments/SIT
gh api --method PUT repos/YusufRajaTamba-inc/playwright-project/environments/UAT
```

Verifikasi:

```bash
gh api repos/YusufRajaTamba-inc/playwright-project/environments -q '.environments[].name'
```

Harus ada `SIT` dan `UAT`.

## 3) Bulk upload secrets dari file JSON lokal

Sumber file config lokal:

- `packages/common-module/config/env.sit.json`
- `packages/common-module/config/env.uat.json`

### SIT

```bash
jq -r 'to_entries[] | "\(.key)=\(.value)"' packages/common-module/config/env.sit.json > .secrets.sit.env
gh secret set --env SIT -f .secrets.sit.env
gh secret list --env SIT
```

### UAT

```bash
jq -r 'to_entries[] | "\(.key)=\(.value)"' packages/common-module/config/env.uat.json > .secrets.uat.env
gh secret set --env UAT -f .secrets.uat.env
gh secret list --env UAT
```

Minimal secret yang harus muncul:

- `BASE_URL`
- `USERNAME`
- `PASSWORD`

## 4) Set environment variable `ENV`

```bash
echo "ENV=SIT" > .vars.sit.env
echo "ENV=UAT" > .vars.uat.env

gh variable set --env SIT -f .vars.sit.env
gh variable set --env UAT -f .vars.uat.env

gh variable list --env SIT
gh variable list --env UAT
```

Minimal variable yang harus muncul:

- SIT: `ENV=SIT`
- UAT: `ENV=UAT`

## 5) Jalankan workflow manual

1. Buka tab Actions di GitHub repo.
2. Pilih workflow **Playwright Tests**.
3. Klik **Run workflow**.
4. Pilih branch yang dipakai (contoh: `setup-repo-v2`).
5. Pilih `target_env` (`SIT` atau `UAT`).
6. Jalankan workflow.

Checklist hasil:

- Job `Lint` sukses.
- Job `Web Tests` sukses.
- Job `API Tests` sukses.
- Artifact tersedia:
  - `web-playwright-report`
  - `api-playwright-report`

## 6) Cleanup file sementara lokal

File ini untuk import CLI saja dan tidak boleh di-commit:

- `.secrets.sit.env`
- `.secrets.uat.env`
- `.vars.sit.env`
- `.vars.uat.env`

Hapus setelah selesai:

```bash
rm -f .secrets.sit.env .secrets.uat.env .vars.sit.env .vars.uat.env
```

## Troubleshooting

### Error: repository not found di gh CLI

Penyebab umum:

- Akun aktif `gh` tidak punya akses repo.
- Host/auth account tidak sesuai.

Perbaikan:

```bash
gh auth status -h github.com
gh auth logout -h github.com
gh auth login -h github.com -p ssh -w
gh api repos/YusufRajaTamba-inc/playwright-project -q .full_name
```

### Workflow gagal karena env file tidak ditemukan

Untuk CI, pastikan secrets/variables environment sudah terisi. Jangan bergantung pada file lokal `.json` yang di-ignore git.

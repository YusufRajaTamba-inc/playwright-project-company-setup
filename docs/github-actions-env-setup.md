# GitHub Actions Env Setup with TEST_CONFIG_JSON

Dokumen ini menjelaskan setup environment GitHub Actions dengan pola single secret `TEST_CONFIG_JSON`.

Tujuan pola ini:

1. Workflow YAML tetap bersih.
2. Penambahan key env baru tidak perlu edit workflow.
3. Cukup update JSON secret per environment dan pakai key tersebut di JavaScript.

## Prasyarat

1. Sudah login `gh` CLI ke akun yang punya akses repo.
2. Jalankan command dari root repository.

Cek cepat:

```bash
command -v gh
gh auth status -h github.com
```

## 1) Set default repo di gh CLI

```bash
gh repo set-default YusufRajaTamba-inc/playwright-project
gh repo view --json nameWithOwner -q .nameWithOwner
```

Output verifikasi:

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

## 3) Set single secret TEST_CONFIG_JSON

Sumber file config lokal:

- `packages/common-module/config/env.sit.json`
- `packages/common-module/config/env.uat.json`

### SIT

```bash
gh secret set TEST_CONFIG_JSON --env SIT < packages/common-module/config/env.sit.json
```

### UAT

```bash
gh secret set TEST_CONFIG_JSON --env UAT < packages/common-module/config/env.uat.json
```

Verifikasi:

```bash
gh secret list --env SIT
gh secret list --env UAT
```

Di masing-masing environment harus ada:

- `TEST_CONFIG_JSON`

## 4) Set variable ENV per environment

```bash
echo "ENV=SIT" > .vars.sit.env
echo "ENV=UAT" > .vars.uat.env

gh variable set --env SIT -f .vars.sit.env
gh variable set --env UAT -f .vars.uat.env

gh variable list --env SIT
gh variable list --env UAT
```

Harus muncul:

- SIT: `ENV=SIT`
- UAT: `ENV=UAT`

## 5) Jalankan workflow manual

1. Buka tab Actions di GitHub repo.
2. Pilih workflow **Playwright Tests**.
3. Klik **Run workflow**.
4. Pilih branch yang dipakai.
5. Pilih `target_env` (`SIT` atau `UAT`).
6. Jalankan workflow.

Checklist hasil:

- Job API dan Web tests sukses.
- Report job sukses.
- Artifact report ter-upload.

## 6) Format JSON yang direkomendasikan

Contoh isi `TEST_CONFIG_JSON`:

```json
{
  "BASE_URL": "https://your-url",
  "USERNAME": "your-user",
  "PASSWORD": "your-password",
  "API_KEY": "your-api-key",
  "TENANT_ID": "your-tenant-id"
}
```

Kalau nanti butuh key baru, cukup tambahkan di JSON secret dan akses di JavaScript melalui `getEnvConfig()`.

## 7) Migrasi dari setup lama (BASE_URL/USERNAME/PASSWORD terpisah)

Jika sebelumnya memakai secret terpisah, bisa dihapus agar tidak membingungkan:

```bash
gh secret delete BASE_URL --env SIT
gh secret delete USERNAME --env SIT
gh secret delete PASSWORD --env SIT

gh secret delete BASE_URL --env UAT
gh secret delete USERNAME --env UAT
gh secret delete PASSWORD --env UAT
```

## Troubleshooting

### Error: repository not found di gh CLI

Penyebab umum:

1. Akun aktif `gh` tidak punya akses repo.
2. Host/auth account tidak sesuai.

Perbaikan:

```bash
gh auth status -h github.com
gh auth logout -h github.com
gh auth login -h github.com -p ssh -w
gh api repos/YusufRajaTamba-inc/playwright-project -q .full_name
```

### Workflow gagal karena TEST_CONFIG_JSON tidak ada

Pastikan secret `TEST_CONFIG_JSON` sudah di-set di GitHub Environment yang dijalankan (`SIT` atau `UAT`).

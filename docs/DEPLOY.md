# Deploying to the Hostinger VPS

How production works, and how to set up the server from zero.

```
GitHub (push to main)
  └─ Actions: verify (lint, typecheck, test, build)
       └─ deploy: docker build → push ghcr.io/yasserrabie/smart-care-web:{latest,<sha>}
                  └─ SSH to VPS → docker compose pull web && docker compose up -d

VPS  /opt/smart-care
  docker-compose.yml   (copy of docker/docker-compose.prod.yml)
  Caddyfile            (copy of docker/Caddyfile)
  .env                 (secrets, only on the server)

  caddy :80/:443 (auto HTTPS) ──► web :3000 (Next.js + Payload) ──► postgres :5432
  volumes: pgdata (database), media (uploads), caddy_data (certificates)
```

The VPS never builds anything. It only pulls the image CI built. Database migrations run
automatically when the `web` container starts (`prodMigrations` in `payload.config.ts`).

Throughout this guide, replace:

| Placeholder | Meaning                                            |
| ----------- | -------------------------------------------------- |
| `YOUR_IP`   | The VPS IPv4 address from hPanel                   |
| `deploy`    | The Linux user we create on the server (keep this) |

Commands marked **Mac** run in your local terminal inside the repo. Commands marked **VPS** run on
the server after `ssh deploy@YOUR_IP`.

---

## 0. Before you start

Have these ready:

- [ ] Access to hPanel (Hostinger) with the KVM 2 VPS
- [ ] Access to the DNS for `smartcareco.com` (registrar or Cloudflare)
- [ ] The repo pushed to `github.com/YasserRABIE/smart-care` and at least one CI run that built the
      image (the `deploy` job may fail at the SSH step; that is fine for now)
- [ ] An SSH key on your Mac. Check with `ls ~/.ssh/id_ed25519.pub`. If missing:

```bash
ssh-keygen -t ed25519 -C "yasser-mac"
```

---

## 1. Install the operating system

1. hPanel → **VPS** → your server → **OS & Panel** → **Operating System**.
2. Choose **Ubuntu 24.04 with Docker** (under "OS with application"). If it is not listed, pick plain
   **Ubuntu 24.04**; we install Docker in step 3.
3. Set a strong root password and store it in your password manager.
4. hPanel → **VPS** → **Settings** → **SSH keys** → add the contents of your public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

5. Wait for the install to finish and copy the **IPv4 address** from the VPS overview.

## 2. First login and updates

**Mac**

```bash
ssh root@YOUR_IP
```

**VPS (as root)**

```bash
apt update && apt upgrade -y && apt install -y ufw fail2ban unattended-upgrades
```

```bash
timedatectl set-timezone Africa/Cairo
```

Reboot if the upgrade asked for it (`reboot`), then log in again.

## 3. Docker

**VPS (as root)**: check whether Docker is already installed:

```bash
docker --version && docker compose version
```

If either command fails, install Docker from the official script:

```bash
curl -fsSL https://get.docker.com | sh
```

Limit container log size so logs never fill the disk:

```bash
cat > /etc/docker/daemon.json <<'EOF'
{ "log-driver": "local", "log-opts": { "max-size": "20m", "max-file": "5" } }
EOF
systemctl restart docker
```

## 4. Create the `deploy` user

**VPS (as root)**

```bash
adduser --gecos "" deploy
```

```bash
usermod -aG sudo,docker deploy && rsync -a --chown=deploy:deploy ~/.ssh /home/deploy
```

**Mac**: in a **new** terminal, confirm you can log in before going further:

```bash
ssh deploy@YOUR_IP
```

```bash
docker ps
```

`docker ps` should print an empty table (no permission error).

## 5. Lock down SSH

Only do this after step 4 works, or you can lock yourself out. (If that happens, hPanel has a
browser console under **VPS → Overview → Browser terminal**.)

**VPS**

```bash
sudo tee /etc/ssh/sshd_config.d/00-hardening.conf <<'EOF'
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
EOF
sudo systemctl restart ssh
```

**Mac**: check that `ssh root@YOUR_IP` is now refused and `ssh deploy@YOUR_IP` still works.

## 6. Firewall

**VPS**

```bash
sudo ufw default deny incoming && sudo ufw default allow outgoing
```

```bash
sudo ufw allow OpenSSH && sudo ufw allow 80,443/tcp && sudo ufw allow 443/udp && sudo ufw --force enable
```

```bash
sudo ufw status
```

`fail2ban` (installed in step 2) bans IPs that brute-force SSH with its default config; no setup
needed. Check it with `sudo fail2ban-client status sshd`.

> Docker-published ports bypass ufw. That is why Postgres is published on `127.0.0.1` only in the
> compose file. Never change it to `5432:5432`.

## 7. DNS

At your DNS provider for `smartcareco.com`:

| Type | Name  | Value     |
| ---- | ----- | --------- |
| A    | `@`   | `YOUR_IP` |
| A    | `www` | `YOUR_IP` |

Delete any other `A`/`AAAA` records for `@` and `www` (for example a registrar parking page).

If the DNS is on **Cloudflare**, set both records to **DNS only** (grey cloud) for the first launch so
Caddy can get its certificate. You can switch to **Proxied** later; then set Cloudflare
**SSL/TLS → Full (strict)**.

Check propagation from your Mac (both must print `YOUR_IP`):

```bash
dig +short smartcareco.com && dig +short www.smartcareco.com
```

## 8. Project folder and config files

**Mac**

```bash
ssh deploy@YOUR_IP "sudo mkdir -p /opt/smart-care && sudo chown deploy:deploy /opt/smart-care"
```

```bash
scp docker/docker-compose.prod.yml deploy@YOUR_IP:/opt/smart-care/docker-compose.yml
```

```bash
scp docker/Caddyfile docker/.env.production.example deploy@YOUR_IP:/opt/smart-care/
```

**VPS**: create the real `.env` from the example:

```bash
cd /opt/smart-care && cp .env.production.example .env && chmod 600 .env
```

Generate two secrets (run twice, use one for each):

```bash
openssl rand -hex 32
```

Edit the file with `nano .env` and fill it in:

| Key                    | Value                                                                 |
| ---------------------- | --------------------------------------------------------------------- |
| `GHCR_OWNER`           | `yasserrabie`                                                         |
| `POSTGRES_PASSWORD`    | first secret                                                          |
| `DATABASE_URI`         | `postgres://smartcare:<first secret>@postgres:5432/smartcare`         |
| `PAYLOAD_SECRET`       | second secret. **Never change it later** (it invalidates all logins). |
| `NEXT_PUBLIC_SITE_URL` | `https://smartcareco.com`                                             |

Save with `Ctrl+O`, `Enter`, `Ctrl+X`. The app refuses to start if any of these are missing or
malformed, and the error in `docker compose logs web` names the bad key.

Validate the compose file (prints the merged config, or an error):

```bash
docker compose config --quiet && echo OK
```

## 9. Let the VPS pull the private image

The image lives in GitHub's registry (GHCR) and is private.

1. GitHub → avatar → **Settings** → **Developer settings** → **Personal access tokens** →
   **Tokens (classic)** → **Generate new token (classic)**.
2. Name `smart-care-vps`, expiration **No expiration** (or a long one; note the date), scope
   **`read:packages` only**.
3. Copy the token, then on the **VPS**:

```bash
docker login ghcr.io -u YasserRABIE
```

Paste the token as the password. Test it:

```bash
cd /opt/smart-care && docker compose pull web
```

## 10. Connect GitHub Actions to the VPS

CI logs in over SSH with its own key, separate from yours.

**Mac**

```bash
ssh-keygen -t ed25519 -f ~/.ssh/smartcare_deploy -N "" -C "github-actions-deploy"
```

```bash
ssh-copy-id -i ~/.ssh/smartcare_deploy.pub deploy@YOUR_IP
```

```bash
ssh -i ~/.ssh/smartcare_deploy deploy@YOUR_IP "echo key works"
```

GitHub → repo **smart-care** → **Settings** → **Secrets and variables** → **Actions**:

| Tab       | Name          | Value                                                                                         |
| --------- | ------------- | --------------------------------------------------------------------------------------------- |
| Secrets   | `VPS_HOST`    | `YOUR_IP`                                                                                     |
| Secrets   | `VPS_USER`    | `deploy`                                                                                      |
| Secrets   | `VPS_SSH_KEY` | full output of `cat ~/.ssh/smartcare_deploy` (the private key, including the BEGIN/END lines) |
| Variables | `SITE_URL`    | `https://smartcareco.com`                                                                     |

Or with the GitHub CLI from the repo folder:

```bash
gh secret set VPS_HOST -b "YOUR_IP" && gh secret set VPS_USER -b "deploy" && gh secret set VPS_SSH_KEY < ~/.ssh/smartcare_deploy && gh variable set SITE_URL -b "https://smartcareco.com"
```

## 11. WhatsApp number

Inquiries go through WhatsApp: the contact form opens WhatsApp with the visitor's message
prefilled, addressed to the number in **Admin → Site Settings → WhatsApp number** (digits only,
with the country code, e.g. `20123456789`). The site sends no email and stores no inquiries, so
there are no email or spam-protection keys to set up.

After launch, check that number is the company's real WhatsApp (Business) number.

## 12. First start: database and content

Choose **one** option.

### Option A: copy your local content (recommended)

This moves everything you entered locally (products, pages, users, images) to the server. The
`web` container must **not** have started yet, because its migrations would create an empty schema
first.

The local database is usually built by Payload's dev "push" mode, not by the migration files, so it
cannot be copied as-is: the server would try to run every migration on top of existing tables. The
commands below build a fresh database from the migrations, load only your **data** into it, and
dump that.

**Mac** (with `pnpm db:up` running): build the release database:

```bash
docker exec smart-care-postgres-1 psql -U smartcare -d smartcare -c "DROP DATABASE IF EXISTS smartcare_release" -c "CREATE DATABASE smartcare_release"
```

```bash
cd apps/web && DATABASE_URI=postgres://smartcare:smartcare@localhost:5433/smartcare_release pnpm migrate && cd ../..
```

```bash
docker exec smart-care-postgres-1 sh -c 'pg_dump -U smartcare -d smartcare --data-only -Fc "--exclude-table-data=payload_migrations*" -f /tmp/data.dump && pg_restore -U smartcare -d smartcare_release --data-only --disable-triggers --exit-on-error /tmp/data.dump'
```

```bash
docker exec smart-care-postgres-1 pg_dump -U smartcare -Fc smartcare_release > smartcare.dump
```

Upload it with the images:

```bash
scp smartcare.dump deploy@YOUR_IP:/opt/smart-care/ && scp -r apps/web/media deploy@YOUR_IP:/opt/smart-care/media-upload
```

**VPS**: start only Postgres and restore:

```bash
cd /opt/smart-care && docker compose up -d --wait postgres
```

```bash
docker compose exec -T postgres pg_restore -U smartcare -d smartcare --no-owner --exit-on-error < smartcare.dump
```

Create the media volume and copy the images into it (owned by the container's `node` user, uid 1000):

```bash
docker compose create web && docker run --rm -v smart-care_media:/m -v /opt/smart-care/media-upload:/src alpine sh -c "cp -r /src/. /m/ && chown -R 1000:1000 /m"
```

Clean up:

```bash
rm -rf smartcare.dump media-upload
```

Your local admin login now works in production. Change its password after launch (Admin →
account), because it was a development password.

### Option B: start empty

Skip to step 13. After launch, open `https://smartcareco.com/admin`, create the first admin user, and
**fill in Site Settings right away** (at least the phone number). Public pages error until Site
Settings has a phone number.

## 13. Launch

**VPS**

```bash
cd /opt/smart-care && docker compose up -d
```

Watch the start (`Ctrl+C` stops watching, not the app):

```bash
docker compose logs -f web caddy
```

What to look for:

- `web`: `Migrating: …` / `Migrated: …` lines (or none if Option A already had them), then
  `✓ Ready`.
- `caddy`: `certificate obtained successfully` for `smartcareco.com` and `www.smartcareco.com`.

Then trigger the automatic pipeline once, so you know future pushes deploy by themselves: GitHub →
**Actions** → latest **CI** run → **Re-run all jobs**. Both jobs should go green.

## 14. Verify

- [ ] `https://smartcareco.com` loads with a valid padlock
- [ ] `https://www.smartcareco.com` and `http://smartcareco.com` redirect to `https://smartcareco.com`
- [ ] Home, `/products`, a product line, and `/contact` show real content and images
- [ ] `/admin` logs in; uploading an image works, and it is still there after
      `docker compose restart web`
- [ ] The contact form opens WhatsApp with the message prefilled, addressed to the company number
      (try it from a phone, and with a product via "Send Inquiry")
- [ ] `/sitemap.xml` and `/robots.txt` use `https://smartcareco.com`
- [ ] `sudo ufw status` shows only 22, 80, 443; `ss -tlnp | grep 5432` shows `127.0.0.1` only

## 15. Backups

Hostinger: hPanel → **VPS** → **Backups & monitoring** → enable automatic backups (full-server
snapshots, kept by Hostinger).

On top of that, a nightly database dump and media archive that you can restore by itself:

**VPS**

```bash
cat > /opt/smart-care/backup.sh <<'EOF'
#!/bin/sh
set -e
cd /opt/smart-care
mkdir -p backups
d=$(date +%F)
docker compose exec -T postgres pg_dump -U smartcare -Fc smartcare > "backups/db-$d.dump"
docker run --rm -v smart-care_media:/m -v /opt/smart-care/backups:/b alpine tar czf "/b/media-$d.tgz" -C /m .
find backups -type f -mtime +14 -delete
EOF
chmod +x /opt/smart-care/backup.sh && /opt/smart-care/backup.sh && ls -lh /opt/smart-care/backups
```

Run it every night at 03:00:

```bash
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/smart-care/backup.sh >> /opt/smart-care/backups/cron.log 2>&1") | crontab -
```

These copies live on the same server. For off-server copies, create a bucket on Backblaze B2 or
Cloudflare R2, install `rclone` (`sudo apt install -y rclone`, then `rclone config`), and add this
line to the end of `backup.sh`:

```sh
rclone copy /opt/smart-care/backups remote:smart-care-backups --max-age 48h
```

**Restoring a backup**

```bash
cd /opt/smart-care && docker compose stop web
```

```bash
docker compose exec -T postgres pg_restore -U smartcare -d smartcare --clean --if-exists --no-owner < backups/db-YYYY-MM-DD.dump
```

```bash
docker run --rm -v smart-care_media:/m -v /opt/smart-care/backups:/b alpine sh -c "tar xzf /b/media-YYYY-MM-DD.tgz -C /m && chown -R 1000:1000 /m"
```

```bash
docker compose start web
```

## 16. Day-to-day operations

All commands run on the **VPS** in `/opt/smart-care`.

| Task                          | Command                                                                     |
| ----------------------------- | --------------------------------------------------------------------------- |
| Deploy a new version          | Push to `main`. CI does the rest.                                           |
| Status                        | `docker compose ps`                                                         |
| Logs                          | `docker compose logs -f --tail=100 web`                                     |
| Restart the app               | `docker compose restart web`                                                |
| Apply `.env` changes          | `docker compose up -d`                                                      |
| Roll back to a commit         | `TAG=<commit sha> docker compose up -d web`                                 |
| Back to latest after rollback | `docker compose pull web && docker compose up -d web`                       |
| Disk usage                    | `df -h /` and `docker system df`                                            |
| OS updates                    | `sudo apt update && sudo apt upgrade -y` (security updates install nightly) |

Changing `NEXT_PUBLIC_SITE_URL` needs a new image, not just `.env`: update the `SITE_URL` variable
on GitHub, then re-run the CI workflow.

**Open the production database from your Mac** (TablePlus, `psql`, or running the seed) through an
SSH tunnel. Leave this running:

```bash
ssh -N -L 5434:127.0.0.1:5432 deploy@YOUR_IP
```

Then connect to `postgres://smartcare:<POSTGRES_PASSWORD>@localhost:5434/smartcare`.

## 17. Troubleshooting

| Symptom                                                     | Check                                                                                                                                                                  |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Browser shows a certificate error                           | `docker compose logs caddy`. Usually DNS not pointing at `YOUR_IP` yet, Cloudflare proxy (orange) on, or port 80 blocked. Fix it, then `docker compose restart caddy`. |
| `502 Bad Gateway`                                           | `web` is down or still starting: `docker compose ps`, `docker compose logs web`.                                                                                       |
| `Invalid environment variables` in web logs                 | The named key in `.env` is missing or malformed. Fix it, then `docker compose up -d`.                                                                                  |
| `denied` or `unauthorized` when pulling                     | Redo step 9 (`docker login ghcr.io`), check `GHCR_OWNER=yasserrabie`.                                                                                                  |
| CI deploy job: `ssh: handshake failed`                      | `VPS_SSH_KEY` must be the private key with BEGIN/END lines; `VPS_USER` must be `deploy`; test with step 10's `ssh -i` command.                                         |
| Pages error, logs show `reading 'replace'`                  | Site Settings has no phone number. Fill it in at `/admin`.                                                                                                             |
| WhatsApp opens the wrong chat or says the number is invalid | Fix **Site Settings → WhatsApp number**: digits only, country code first, no `+` or spaces.                                                                            |
| Disk full                                                   | `docker system prune -af` (removes unused images), then check `backups/`.                                                                                              |

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
   the real hostname (both server blocks).
3. Get the first certificate before nginx can start with the real config —
   it needs a cert file to exist to even parse the `server { listen 443 }`
   block:

   ```bash
   mkdir -p certbot/conf certbot/www

   docker run --rm -p 80:80 \
     -v "$PWD/certbot/www:/var/www/certbot" \
     -v "$PWD/certbot/conf:/etc/letsencrypt" \
     certbot/certbot certonly --standalone \
     -d app.your-ddns-hostname.example \
     --email you@example.com --agree-tos --no-eff-email
   ```

4. Now bring up the full stack — nginx will find the cert certbot just
   issued:

   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

The `certbot` service takes over renewal from here (checks every 12h,
Let's Encrypt certs renew inside their last 30 days of validity). The
`nginx` service reloads every 12h to pick up a renewed cert without
downtime.

## Verifying

```bash
curl -I https://app.your-ddns-hostname.example
```

Check HTTP redirects to HTTPS, and the cert is Let's Encrypt-issued and not
self-signed/expired.

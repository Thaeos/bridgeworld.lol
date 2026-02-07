# Cloudflare Tunnel Setup - bridgeworld.lol

## Tunnel Status: ACTIVE
- **Name**: Lucy
- **ID**: 4f8524f8-7869-4aa0-acef-24734ce73dce
- **Status**: Healthy (4 connections)

## Configured Services

| Hostname | Service |
|----------|---------|
| ssh.bridgeworld.lol | SSH (port 22) |
| api.bridgeworld.lol | HTTP (port 8080) |

## SSH Access

To connect via Cloudflare tunnel:
```bash
cloudflared access ssh --hostname ssh.bridgeworld.lol
```

Or add to ~/.ssh/config:
```
Host ssh.bridgeworld.lol
    ProxyCommand cloudflared access ssh --hostname %h
    User root
```

Then: `ssh ssh.bridgeworld.lol`

## Environment Variables

Stored in: `/home/theos/.termius/cloudflare_env.sh`
```bash
source /home/theos/.termius/cloudflare_env.sh
```

## Termius API Bridge

When Docker is available, run:
```bash
export BRIDGE_CREDENTIALS_FILE=/home/theos/.termius/termius-bridge-credentials.json
./start_termius_bridge.sh
```

The bridge will be accessible at: https://api.bridgeworld.lol

## Credentials File

Location: `/home/theos/.termius/termius-bridge-credentials.json`
- Email: theosmagic.uni.eth@ethermail.io
- Password: (needs to be set)

## Cloudflare Account

- Account ID: 7e40a8af4a6129833c1cb6f5bcbfd662
- Zone: bridgeworld.lol
- Email: sosmanagic@att.net

# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin
- totum-alibaba → iZt4nikbefyhl6jyuczexzZ, user: root, key-auth: ~/.ssh/authorized_keys
  - IP Interno: 10.184.5.43
  - IP Público: (variável/NAT - usar Cloudflare Tunnel)
  - Apps: 4173 (upixel), 4174 (totum), 4175 (apps-totum), 3000 (stark-api)

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

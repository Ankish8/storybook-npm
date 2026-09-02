# Storybook (myOperator UI) — Setup Notes (sumant-ubantu)

Set up 2026-07-08. Native install (NOT dockerized), matching the Mac dev setup.
Project: ~/Downloads/Code/storybook-npm

## How it runs
- Node v24.12.0 installed natively at /usr/local/bin (node, npm).
- Dependencies installed with `npm install` (project .npmrc sets legacy-peer-deps=true).
- Runs as a systemd service `storybook` = `npm run storybook -- --no-open`
  (i.e. `storybook dev -p 6006`), same command as on the Mac.
- Listens on 0.0.0.0:6006.

## Access
- On this machine:  http://localhost:6006/
- Over Tailscale:   http://100.77.212.81:6006/

## Manage
```bash
sudo systemctl status storybook       # state
sudo systemctl restart storybook      # restart
sudo systemctl stop storybook         # stop
journalctl -u storybook -f            # live logs
```
Enabled at boot — starts automatically after reboot (give it ~30-60s to build).

## Run manually instead (like the Mac), if you prefer
```bash
sudo systemctl stop storybook
cd ~/Downloads/Code/storybook-npm
npm run storybook          # foreground, port 6006
```

## Notes
- HUSKY=0 is set (no .git in the copied project, so git hooks are skipped).
- To update deps later: cd project && npm install, then `sudo systemctl restart storybook`.

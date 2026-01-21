Instructions for removing Haloy components from your system.

## Client Uninstallation

Remove the Haloy CLI (`haloy`) from your local machine.

### Remove Client Only

#### Shell Script

If you installed via the shell script, you can run the uninstall script:

```bash
curl -sL https://sh.haloy.dev/uninstall-haloy.sh | sh
```

#### Homebrew

If you installed via Homebrew, you can uninstall the package and untap the repository:

```bash
brew uninstall haloy && brew untap haloydev/tap
```

This removes:

- The `haloy` CLI tool from `~/.local/bin/`
- Shell completion scripts (if installed)

This does NOT remove:

- Client configuration (`~/.config/haloy/`)
- Server configurations and tokens

#### JavaScript Package Managers

If you installed globally:

**npm**
```bash
npm uninstall -g haloy
```

**pnpm**
```bash
pnpm remove -g haloy
```

**bun**
```bash
bun remove -g haloy
```

If you added it as a dev dependency in your project:

**npm**
```bash
npm uninstall haloy
```

**pnpm**
```bash
pnpm remove haloy
```

**bun**
```bash
bun remove haloy
```

### Remove Client Configuration

Manually remove configuration files associated with the `haloy` CLI (not needed if you run the uninstall script).

```bash
# Remove client configuration
rm -rf ~/.config/haloy/

# Remove client data
rm -rf ~/.local/share/haloy/
```

## Server Uninstallation

Remove Haloy components from your server.

### Complete Server Removal

Remove all Haloy components, data, and configurations:

```bash
curl -sL https://sh.haloy.dev/uninstall-server.sh | sh
```

The uninstall script will:
- Detect what's installed before removing
- Offer to back up your data before deletion
- Ask for confirmation before destructive actions
- Support all init systems (systemd, OpenRC, SysVinit)
- Optionally remove the `haloy` system user

This removes:

- `haloyd` service and binary
- All Haloy configuration files (`/etc/haloy/`)
- All Haloy data (databases, certificates) (`/var/lib/haloy/`)
- Docker network

This does NOT remove:

- Your application containers (must be stopped/removed separately)
- Docker volumes created by your applications

### Stop Applications Before Removal

Before complete server removal, stop your applications:

```bash
# From your local machine
haloy stop --all --remove-containers

# Or on the server
docker ps --filter "label=dev.haloy.role=app" -q | xargs docker stop
docker ps --filter "label=dev.haloy.role=app" -qa | xargs docker rm
```

## Complete Cleanup

For a full cleanup of everything Haloy-related:

### On Local Machine

```bash
# 1. Remove CLI
curl -sL https://sh.haloy.dev/uninstall-haloy.sh | sh

# 2. Remove configuration
rm -rf ~/.config/haloy/
rm -rf ~/.local/share/haloy/

# 3. Remove shell completion (if installed)
# Bash (Linux)
sudo rm -f /etc/bash_completion.d/haloy
# Bash (macOS)
sudo rm -f /usr/local/etc/bash_completion.d/haloy
# Zsh
rm -f ~/.local/share/zsh/site-functions/_haloy
# Fish
rm -f ~/.config/fish/completions/haloy.fish
```

### On Server

```bash
# 1. Stop all applications
docker ps --filter "label=dev.haloy.role=app" -q | xargs docker stop
docker ps --filter "label=dev.haloy.role=app" -qa | xargs docker rm

# 2. Remove server components
curl -sL https://sh.haloy.dev/uninstall-server.sh | sh

# 3. Optional: Remove application data volumes
docker volume ls --filter "label=dev.haloy.role=app" -q | xargs docker volume rm

# 4. Optional: Clean up unused Docker resources
docker system prune -a --volumes
```

## Selective Removal

### Keep Data, Remove Service

Stop the service but preserve data for later reinstallation:

```bash
# Stop service (systemd)
sudo systemctl stop haloyd
sudo systemctl disable haloyd

# Or for OpenRC
sudo rc-service haloyd stop
sudo rc-update del haloyd

# Remove only the binary
sudo rm /usr/local/bin/haloyd

# Data remains in /var/lib/haloy/ and /etc/haloy/
# Can be restored by reinstalling haloyd
```

### Remove Everything Except Applications

Remove Haloy but keep applications running:

```bash
# Applications will continue running but:
# - No more deployments possible
# - No SSL/TLS (proxy removed)
# - No domain routing
# - Direct access to container ports needed

# Stop haloyd service
sudo systemctl stop haloyd

# Remove Haloy components
curl -sL https://sh.haloy.dev/uninstall-server.sh | sh

# Applications still running
docker ps --filter "label=dev.haloy.role=app"
```

**Warning**: Applications will lose routing and SSL. You'll need alternative routing.

## What Gets Removed

### Client Uninstallation

| Item             | Location                             | Removed        |
| ---------------- | ------------------------------------ | -------------- |
| `haloy` CLI      | `~/.local/bin/haloy`                 | Yes            |
| Shell completion | `/etc/bash_completion.d/` or similar | Yes            |
| Client config    | `~/.config/haloy/`                   | No (manual)    |
| Client data      | `~/.local/share/haloy/`              | No (manual)    |

### Server Uninstallation (Complete)

| Item                   | Location                  | Removed        |
| ---------------------- | ------------------------- | -------------- |
| `haloyd` binary        | `/usr/local/bin/haloyd`   | Yes            |
| `haloyd` service       | systemd/OpenRC/SysVinit   | Yes            |
| Configuration          | `/etc/haloy/`             | Yes            |
| Data                   | `/var/lib/haloy/`         | Yes            |
| Docker network         | `haloy`                   | Yes            |
| `haloy` user           | System user               | Optional       |
| Application containers | User-deployed             | No (manual)    |
| Application volumes    | User-created              | No (manual)    |

## Reinstallation

After uninstallation, you can reinstall Haloy:

### Reinstall Client

```bash
curl -fsSL https://sh.haloy.dev/install-haloy.sh | sh
```

### Reinstall Server

```bash
# Install haloyd
curl -fsSL https://sh.haloy.dev/install-haloyd.sh | sh

# If you preserved /etc/haloy/ and /var/lib/haloy/,
# haloyd will use the existing configuration
```

## Troubleshooting

### Docker Containers Won't Stop

```bash
# Force stop
docker stop $(docker ps -q --filter "label=dev.haloy.role=app")

# Force remove
docker rm -f $(docker ps -qa --filter "label=dev.haloy.role=app")
```

### Permission Denied Errors

```bash
# Ensure using sudo for server operations
sudo su

# Then run uninstall script
curl -sL https://sh.haloy.dev/uninstall-server.sh | sh
```

### Files Still Remain

```bash
# Manually remove remaining files
sudo rm -rf /etc/haloy/
sudo rm -rf /var/lib/haloy/
sudo rm -f /usr/local/bin/haloyd
```

### Service Still Running

```bash
# For systemd
sudo systemctl stop haloyd
sudo systemctl disable haloyd
sudo rm /etc/systemd/system/haloyd.service
sudo systemctl daemon-reload

# For OpenRC
sudo rc-service haloyd stop
sudo rc-update del haloyd
sudo rm /etc/init.d/haloyd
```
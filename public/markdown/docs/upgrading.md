## Upgrading Haloy CLI

### Shell Script

To upgrade the Haloy CLI from the previous version:

```bash
curl -fsSL https://sh.haloy.dev/install-haloy.sh | sh
```

The installation script will upgrade your existing installation to the latest version.

### Homebrew

If you installed Haloy via Homebrew:

```bash
brew upgrade haloy
```

###  Javascript Package Managers

If you installed Haloy as a global package:

**npm**
```bash
npm install -g haloy@latest
```

**pnpm**
```bash
pnpm add -g haloy@latest
```

**bun**
```bash
bun add -g haloy@latest
```

If you installed Haloy as a project dev dependency:

**npm**
```bash
npm install --save-dev haloy@latest
```

**pnpm**
```bash
pnpm add -D haloy@latest
```

**bun**
```bash
bun add -D haloy@latest
```

### Verify Upgrade

Check that the upgrade was successful:

```bash
haloy version
```

## Upgrading Server Components

There are several ways to upgrade `haloyd` on your server:

### Via haloy CLI (Recommended)

From your local machine, use the `haloy server upgrade` command:

```bash
haloy server upgrade
```

This connects to the server's API and triggers a self-upgrade. The service will restart automatically after the upgrade.

### Via Upgrade Script

SSH into your server and run the upgrade script:

```bash
curl -fsSL https://sh.haloy.dev/upgrade-server.sh | sh
```

This script will:
1. Download the latest `haloyd` binary
2. Stop the service
3. Replace the binary
4. Restart the service

### Via haloyd Self-Upgrade

SSH into your server and use the built-in upgrade command:

```bash
sudo haloyd upgrade
```

This downloads and installs the latest version, then restarts the service.

### Manual Upgrade Instructions

If you prefer to upgrade manually or need specific instructions:

```bash
haloy server upgrade --manual
```

This displays step-by-step instructions for upgrading via SSH.

### Verify Server Upgrade

Check the server version from your local machine:

```bash
haloy server version
```

Or on the server:

```bash
haloyd version
```
The `haloy` CLI tool runs on your local machine and triggers deployments to your servers.

## Installation

### Shell Script

To install the latest version via the official shell script:

```bash
curl -fsSL https://sh.haloy.dev/install-haloy.sh | sh
```

### Homebrew

If you are using macOS or Linux with Homebrew:

```bash
brew install haloydev/tap/haloy
```

### JavaScript Package Managers

**npm**
```bash
npm install -g haloy
```

**pnpm**
```bash
pnpm add -g haloy
```

**bun**
```bash
bun add -g haloy
```

#### Project Dev Dependency

For project-specific installations, add haloy as a dev dependency:

**npm**
```bash
npm install --save-dev haloy
```

**pnpm**
```bash
pnpm add -D haloy
```

**bun**
```bash
bun add -D haloy
```

Then use it via npm scripts in your `package.json`:

```json
// ...
{
  "scripts": {
    "deploy": "haloy deploy",
    "deploy:staging": "haloy deploy --target staging",
    "deploy:prod": "haloy deploy --target production",
    "status": "haloy status"
  }
}
```

## Verify Installation

Check that `haloy` is installed correctly:

```bash
haloy version
```

## Uninstalling

See the [Uninstalling guide](/docs/uninstalling) for instructions on removing Haloy from your system.

## Next Steps

- [Install Haloy on your server](/docs/server-installation)
- View [haloy CLI Command Reference](/docs/haloy)
- [Set up shell completion](/docs/shell-completion)
This guide will walk you through setting up Haloy and deploying your first application.

## Prerequisites

- **Server**: Any modern Linux server
- **Local**: Docker for building your app
- **Domain**: A domain or subdomain pointing to your server for secure API access

## 1. Install haloy

**curl**
```bash
curl -fsSL https://sh.haloy.dev/install-haloy.sh | sh
```

**homebrew**
```bash
brew install haloydev/tap/haloy
```

**npm**
```bash
npm i -g haloy
```

**pnpm**
```bash
pnpm add -g haloy
```

**bun**
```bash
bun add -g haloy
```

## 2. Server Setup

SSH into your server and run the install script:

```bash
curl -fsSL https://sh.haloy.dev/install-haloyd.sh | sudo sh
```

The script will prompt you for:
- **API domain**: A subdomain pointing to your server (e.g., `haloy.yourserver.com`)
- **ACME email**: Your email for Let's Encrypt certificates

Or provide them directly:

```bash
curl -fsSL https://sh.haloy.dev/install-haloyd.sh | sudo API_DOMAIN=haloy.yourserver.com ACME_EMAIL=you@email.com sh
```

After installation completes, copy the API token from the output and add the server to your local machine:

```bash
haloy server add haloy.yourserver.com <token>
```

See the [Server Installation](/docs/server-installation) guide for more details.

## 3. Create haloy.yaml

Create a `haloy.yaml` file:

```yaml
name: "my-app"
server: haloy.yourserver.com
domains:
  - domain: "my-app.com"
    aliases:
      - "www.my-app.com" # Redirects to my-app.com
```

This will look for a Dockerfile in the same directory as your config file, build it and upload it to the server. This is the Haloy configuration in its simplest form.

Check out the [examples repository](https://github.com/haloydev/examples) for complete configurations showing how to deploy common web apps like Next.js, TanStack Start, static sites, and more.

## 4. Deploy

```bash
haloy deploy

# Check status
haloy status
```

That's it! Your application is now deployed and accessible at your configured domain.

## Next Steps

- View [Commands Reference](/docs/haloy) for all available haloy CLI commands
- Browse [examples](https://github.com/haloydev/examples) for common frameworks and apps
- Learn about [Configuration Options](/docs/configuration-reference)
- Explore [Multi-Server Deployments](/docs/multi-server-deployments)
- Set up [Authentication & Token Management](/docs/server-authentication)
- Understand the [Architecture](/docs/architecture)
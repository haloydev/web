This guide walks you through deploying a TanStack Start application with SQLite database to your own server using Haloy. Any Linux-based VPS or dedicated server will work.

The complete source code for this guide is available at:
[haloydev/examples/tanstack-start-sqlite](https://github.com/haloydev/examples/tree/main/tanstack-start-sqlite)

## What You'll Build

A full-stack React application using:

- **TanStack Start** - React meta-framework with file-based routing and server functions
- **SQLite** - Lightweight, file-based database
- **Drizzle ORM** - TypeScript ORM for type-safe database queries
- **Haloy** - Simple deployment to your own server

## Prerequisites

- Node.js 20+ installed
- Haloy installed ([Quickstart](/docs/quickstart))
- A linux server (VPS or dedicated server)
- A domain or a subdomain
- Basic familiarity with React and TypeScript

This guide uses [pnpm](https://pnpm.io/), but you can use `npm` instead by replacing `pnpm add` with `npm install` and `pnpm` with `npm run` for scripts.

### 1. Initialize the Project

```bash
mkdir my-tanstack-app
cd my-tanstack-app
pnpm init
```

### 2. Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "target": "ES2022",
    "skipLibCheck": true,
    "strictNullChecks": true
  }
}
```

### 3. Install Dependencies

Install TanStack Start and React:

```bash
pnpm add @tanstack/react-start @tanstack/react-router react react-dom nitro
```

Install dev dependencies
```bash
pnpm add -D vite @vitejs/plugin-react typescript @types/react @types/react-dom @types/node vite-tsconfig-paths
```

Install Drizzle and SQLite:

```bash
pnpm add drizzle-orm @libsql/client dotenv drizzle-kit
```

**Note:** `drizzle-kit` is installed as a production dependency (not `-D`) because we need it available in the Docker container to run migrations at startup.

### 4. Update package.json

Update your `package.json` with the required configuration and scripts:

```json
{
  // ...
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "start": "node .output/server/index.mjs",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  }
}
```

### 5. Create Vite Configuration

Create `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    nitro(),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
  ],
  nitro: {},
});
```

#### About Nitro

TanStack Start uses [Nitro](https://nitro.build/) as its server engine. For this deployment, we're using the default Node.js preset, which works perfectly with Haloy. No additional configuration is needed. The empty `nitro: {}` object is sufficient.

## Database Setup

### 1. Configure Drizzle

Create `drizzle.config.ts`:

```typescript
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: databaseUrl,
  },
});
```

### 2. Create Database Client

Create `src/db/index.ts`:

```typescript
import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const client = createClient({ url: databaseUrl });
const db = drizzle({ client });
export { client, db };
```

### 3. Define Your Schema

Create `src/db/schema.ts`:

```typescript
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id", { mode: "number" }).primaryKey({
    autoIncrement: true,
  }),
  title: text("title").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql${"\`"}(unixepoch())${"\`"}
  ),
});
```

### 4. Create Environment File

Create `.env` for local development:

```bash
DATABASE_URL=file:local.db
```

### 5. Generate and Run Migrations

```bash
pnpm db:generate
pnpm db:migrate
```

This creates migration files in the `drizzle/` directory that will be used in production.

## Application Code

### 1. Create the Router

Create `src/router.tsx`:

```tsx
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultNotFoundComponent: () => <div>404 - not found</div>,
  });

  return router;
}
```

**Note:** You might see a TypeScript error about `./routeTree.gen` not being found. This is expected. TanStack Start automatically generates this file when you run the dev server in the next steps.

### 2. Create the Root Route

Create `src/routes/__root.tsx`:

```

```

  import {
    createRootRoute,
    HeadContent,
    Outlet,
    Scripts,
  } from "@tanstack/react-router";
  import type { ReactNode } from "react";

  export const Route = createRootRoute({
    head: () => ({
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: "TanStack Start Starter",
        },
      ],
    }),
    component: RootComponent,
  });

  function RootComponent() {
    return (
      <RootDocument>
        <Outlet />
      </RootDocument>
    );
  }

  function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    return (
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          {children}
          <Scripts />
        </body>
      </html>
    );
  }
`} lang="tsx" />

### 3. Create the Index Route

Create `src/routes/index.tsx`:

```

```
            <button type="submit">Add</button>
          </form>
        </div>
      );
    }
`} lang="tsx" />

## Docker Configuration

### 1. Create Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.output /app/.output
CMD [ "sh", "-c", "pnpm db:migrate && pnpm start" ]
```

Key points:

- Uses multi-stage builds for smaller final image
- Runs database migrations at container startup. This is safe because Drizzle migrations are idempotent (running them multiple times has no effect if the database is already up to date)
- Production dependencies include `drizzle-kit` for migrations

### 2. Create .dockerignore

Create `.dockerignore`:

We need to exclude files from the built Docker image. Notice `*.db` is excluded. Your local database should never be copied to production. The production database lives in the persistent volume.

```text
node_modules
.git
.gitignore
*.md
dist
.DS_Store
*.db
```

## Haloy Configuration

Create `haloy.yml`:

This file tells the `haloy` CLI tool how to deploy your app. It's pretty simple and straightforward.

```yaml
name: my-tanstack-app
server: your-server.haloy.dev
domains:
  - domain: my-app.example.com
port: 3000
env:
  - name: NODE_ENV
    value: production
  - name: DATABASE_URL
    value: "file:/app/db-data/production.db"
volumes:
  - "db-data:/app/db-data"
```

### Configuration Explained

| Field     | Description                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------- |
| `name`    | Unique identifier for your application                                                                        |
| `server`  | Your Haloy server domain                                                                                      |
| `domains` | Public domain(s) for your app (HTTPS is automatic)                                                            |
| `port`    | The port your app listens on inside the container. Nitro defaults to port 3000, which matches the Vite config |
| `env`     | Environment variables passed to your container                                                                |
| `volumes` | Persistent storage - **critical for SQLite data**                                                             |

### Volume Configuration

The `volumes` configuration is critical for SQLite. See [Volumes](/docs/volumes) for more details on persistent storage.

```yaml
volumes:
  - "db-data:/app/db-data"
```

This creates a named volume `db-data` mounted at `/app/db-data` inside the container. The `DATABASE_URL` points to a file in this directory, ensuring your database persists across deployments and container restarts.

## Deploy

### 1. Test Locally

Before deploying, verify everything works locally. If you haven't already, make sure you've completed the database setup steps above (create `.env`, generate and run migrations).

```bash
pnpm dev
```

Visit `http://localhost:3000` and try adding a todo to verify both the app and database are working correctly.

### 2. Deploy with Haloy

If everything is working locally, you can now deploy to your server. Make sure you have Haloy installed and have configured your domain's DNS to point to your server. Check out the [Quickstart](/docs/quickstart) if you haven't set it up yet.

```bash
haloy deploy
```

Haloy will:

1. Build your Docker image locally
2. Push it to your server
3. Run the container with your configuration
4. Set up HTTPS automatically
5. Route traffic to your app

### 3. Verify Deployment

```bash
# Check status
haloy status

# View logs
haloy logs
```

Your app should now be live.

## Production Considerations

### Database Backups

SQLite stores all data in a single file. To back up your database:

```bash
# Execute a backup command in the container
haloy exec -- cp /app/db-data/production.db /app/db-data/backup-$(date +%Y%m%d).db
```

Consider setting up automated backups using a cron job or scheduled task.

### Monitoring

View your application logs:

```bash
# Stream logs
haloy logs

# Check application status
haloy status
```

## Troubleshooting

### Database Not Persisting

Ensure your `volumes` configuration matches your `DATABASE_URL`:

```yaml
env:
  - name: DATABASE_URL
    value: "file:/app/db-data/production.db"  # Must be inside the volume mount
volumes:
  - "db-data:/app/db-data"  # Volume mounted here
```

You can use `haloy exec` to run commands inside your container for debugging. Verify the database file exists and is being written to the correct location:
```bash
haloy exec -- ls -la /app/db-data/
```

### Migration Errors

If migrations fail at startup, check:
1. The `drizzle/` directory is included in your Docker image
2. `drizzle-kit` is a production dependency (not devDependency)
3. Logs for specific error messages: `haloy logs`

Verify the migration files are present in the container:
```bash
haloy exec -- ls -la /app/drizzle/
```

### Connection Issues

If you can't connect to your deployed app:

1. Verify the domain is correctly configured: `haloy status`
2. Check the app is running: `haloy logs`
3. Ensure port 3000 matches your app's listening port

### Scaling Limitations
SQLite is designed for single-server deployments. If you need to run multiple replicas of your application, you have two options:

1. **Switch to a client-server database** like PostgreSQL or MySQL
2. **Use a distributed SQLite solution** like [Turso](https://turso.tech/) or [LiteFS](https://fly.io/docs/litefs/)

For most applications, a single replica with SQLite can handle significant traffic. Often more than you'd expect.
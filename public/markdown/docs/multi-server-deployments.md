Deploy your application to multiple servers with a single configuration file. Perfect for multi-environment setups, geographic distribution, and A/B testing.

## Use Cases

- **Multi-environment deployments**: Production, staging, and development
- **Geographic distribution**: Deploy to multiple regions with geo-based load balancing
- **A/B testing**: Deploy different versions to separate infrastructure
- **Gradual rollouts**: Test in staging before promoting to production

## Basic Multi-Target Configuration

```yaml
# Base configuration inherited by all targets
image:
  repository: "ghcr.io/your-username/my-app"
  tag: "latest"
acme_email: "you@email.com"

targets:
  production:
    server: production.haloy.com
    image:
      tag: "v1.2.3" # Override with stable release
    domains:
      - domain: "my-app.com"
    replicas: 3
  staging:
    server: staging.haloy.com
    image:
      tag: "main" # Use latest main branch
    domains:
      - domain: "staging.my-app.com"
    replicas: 1
```

## Deploying to Targets

### Deploy to Specific Target

```bash
# Deploy to production only
haloy deploy --target production
# Short form
haloy deploy -t staging
```

### Deploy to All Targets

```bash
haloy deploy --all
```

## Configuration Inheritance

Base configuration provides defaults that targets can override:

```yaml
# Base configuration - inherited by all targets
image:
  repository: "ghcr.io/my-org/my-app"
  tag: "latest"
replicas: 2
port: "8080"
env:
  - name: "LOG_LEVEL"
    value: "info"
targets:
  production:
    # Inherits: replicas=2, port="8080", base env (LOG_LEVEL)
    # Overrides: image.tag, adds domains, adds/overrides env variables
    server: "prod.haloy.com"
    image:
      tag: "v1.2.3"
    domains:
      - domain: "my-app.com"
    env:
      - name: "NODE_ENV"
        value: "production"
      - name: "LOG_LEVEL"
        value: "warn"  # Overrides base LOG_LEVEL
      # Base LOG_LEVEL would be inherited if not overridden
  staging:
    # Inherits: image (repo + tag), port="8080", base env (LOG_LEVEL)
    # Overrides: server, replicas, adds domains
    server: "staging.haloy.com"
    replicas: 1
    domains:
      - domain: "staging.my-app.com"
    # Inherits all base env variables (LOG_LEVEL="info")
```

**Inheritance Rules:**

- Base values provide defaults for all targets
- Most target values completely override base values (no merging)
- Only specified fields in targets override the base
- **Exception:** Environment variables (`env`) are merged - target values override base values with the same name, while preserving other base variables
- Other arrays (like `domains`, `volumes`) are replaced entirely, not merged

**Container Naming:** In multi-target configurations, containers are named using the target key (e.g., `production-abc123`, `staging-abc123`). This ensures each target's containers are uniquely identifiable. You can override this by setting a name for the target explicitly.

## Multi-Environment Example

Complete setup for production, staging, and development:

```yaml
# Base configuration
image:
  repository: "ghcr.io/my-org/my-app"
  tag: "latest"
replicas: 1
port: "8080"
acme_email: "devops@my-app.com"

# Global hooks run once before/after all deployments
global_pre_deploy:
  - "echo 'Starting deployment pipeline'"
  - "npm run build"
global_post_deploy:
  - "echo 'All deployments completed'"
  - "curl -X POST https://status.io/webhook"
targets:
  production:
    server: prod.haloy.com
    image:
      tag: "v1.2.3"
    domains:
      - domain: "my-app.com"
    aliases:
      - "www.my-app.com"
    replicas: 3
    env:
      - name: "NODE_ENV"
        value: "production"
      - name: "DATABASE_URL"
        from:
          secret: "onepassword:prod-db.url"
    pre_deploy:
      - "npm run migrate:production"
    post_deploy:
      - "echo 'Production deployed'"
  staging:
    server: staging.haloy.com
    image:
      tag: "main"
    domains:
      - domain: "staging.my-app.com"
    replicas: 2
    env:
      - name: "NODE_ENV"
        value: "staging"
      - name: "DATABASE_URL"
        from:
          env: "STAGING_DATABASE_URL"
    pre_deploy: - "npm run migrate:staging"
  development:
    server: dev.haloy.com
    image:
      tag: "develop"
    domains:
      - domain: "dev.my-app.com"
    replicas: 1
    env:
      - name: "NODE_ENV"
        value: "development"
      - name: "DEBUG"
        value: "true"
      - name: "DATABASE_URL"
        from:
          env: "DEV_DATABASE_URL"
```

## Geographic Distribution

Deploy to multiple regions:

```yaml
image:
  repository: "ghcr.io/my-org/api"
  tag: "v2.0.0"

targets:
  us-east:
    server: us-east.haloy.com
    domains: - domain: "us-api.my-app.com"
    replicas: 2
    env:
      - name: "REGION"
        value: "us-east-1"
      - name: "DATABASE_URL"
        from:
          secret: "onepassword:us-db.url"

  eu-west:
    server: eu-west.haloy.com
    domains:
      - domain: "eu-api.my-app.com"
    replicas: 2
    env:
      - name: "REGION"
        value: "eu-west-1"
      - name: "DATABASE_URL"
        from:
          secret: "onepassword:eu-db.url"

  asia-pacific:
    server: ap-southeast.haloy.com
    domains:
      - domain: "ap-api.my-app.com"
    replicas: 2
    env:
      - name: "REGION"
        value: "ap-southeast-1"
      - name: "DATABASE_URL"
        from:
          secret: "onepassword:ap-db.url"
```

## Deployment Hooks

### Global Hooks

Run once before or after all target deployments:

```yaml
global_pre_deploy:
  - "npm run build"
  - "docker build -t my-app ."
  - "npm run test"

global_post_deploy:
  - "npm run cleanup"
  - "echo 'All deployments complete'"

targets:
  production:
     server: prod.haloy.com
  staging:
    server: staging.haloy.com
```

### Target-Specific Hooks

Run before or after individual target deployments:

```yaml
targets:
  production:
    server: prod.haloy.com
    pre_deploy:
      - "npm run migrate:production"
      - "npm run cache:clear:production"
    post_deploy:
      - "curl https://my-app.com/api/health"
      - "echo 'Production health check passed'"

  staging:
    server: staging.haloy.com
    pre_deploy:
      - "npm run migrate:staging"
    post_deploy:
      - "npm run test:e2e:staging"
```

## Target-Specific Commands

All commands support target selection:

```bash
# Check status of specific target
haloy status --target production
haloy status -t staging

# View logs from specific target
haloy logs --target production

# Stop specific target
haloy stop --target staging

# Rollback specific target
haloy rollback --target production <deployment-id>

# Apply to all targets
haloy status --all
haloy stop --all
```

## Managing Multiple Servers

Add all your servers to the local client:

```bash
# Add production server
haloy server add production.haloy.com <prod-token>

# Add staging server
haloy server add staging.haloy.com <staging-token>

# Add development server
haloy server add dev.haloy.com <dev-token>

# List all configured servers
haloy server list

# Remove a server
haloy server delete staging.haloy.com
```

## Build Once, Deploy Everywhere
When using the image builder, the image is built once and distributed to all targets:

```yaml
image:
  repository: "my-app"
  tag: "latest"
  builder:
    context: "../"
    dockerfile: "Dockerfile-version2"

# Build once before all deployments
global_pre_deploy:
  - "npm run test"

targets:
  production:
    server: prod.haloy.com

staging:
  server: staging.haloy.com
```

## Best Practices

1. **Use version tags for production**: Pin to specific versions like `v1.2.3`
2. **Use branch tags for staging**: Track branches like `main` or `develop`
3. **Separate secrets per environment**: Different credentials for each target
4. **Test in staging first**: Deploy to staging before production
5. **Use global hooks for builds**: Build once, deploy everywhere
6. **Document target purposes**: Add comments explaining each target

## Troubleshooting

### Target Not Found

Ensure the target name matches exactly:

```bash
haloy deploy --target production  # Correct
haloy deploy --target prod         # Wrong if target is named "production"
```

### Server Not Configured

Add the server if you see authentication errors:

```bash
haloy server add <server-domain> <api-token>
```

### Different Results Per Target

Use `--show-resolved-config` to see the final configuration per target:

```bash
haloy validate-config --show-resolved-config
```

## Next Steps

- [Learn about Deployment Strategies](/docs/deployment-strategies)
- [Configure Horizontal Scaling](/docs/scaling)
- [Set up Rollbacks](/docs/rollbacks)
- [Manage Authentication](/docs/server-authentication)
Configure environment variables for your deployed applications using multiple methods.

## Plain Text Values

The simplest way to set environment variables:

```yaml
name: "my-app"
env:
  - name: "DATABASE_URL"
    value: "postgres://localhost:5432/myapp"
  - name: "DEBUG"
    value: "true"
  - name: "MAX_CONNECTIONS"
    value: "100"
```

## From Environment Variables

Reference environment variables from your local machine:

```yaml
name: "my-app"
env:
  - name: "DATABASE_URL"
    from:
      env: "PRODUCTION_DATABASE_URL"
  - name: "API_KEY"
    from:
      env: "MY_API_KEY"
  - name: "SECRET_KEY"
    from:
      env: "APP_SECRET"
```

Set these in your shell before deploying:

```bash
export PRODUCTION_DATABASE_URL="postgres://prod-db:5432/myapp"
export MY_API_KEY="your-api-key-here"
export APP_SECRET="your-secret-here"
haloy deploy
```

**Tip:** You have the option to define environment variables in files which the `haloy` CLI tool will automatically load. See [Environment Files](#environment-files) for more details.

## From Secret Providers

Use external secret management services like 1Password:

```yaml
name: "my-app"
secret_providers:
  onepassword:
    production-db:
      vault: "Production"
      item: "Database Credentials"
    api-keys:
      vault: "API Services"
      item: "Third-party APIs"
env:
  - name: "DATABASE_PASSWORD"
    from:
      secret: "onepassword:production-db.password"
  - name: "API_SECRET"
    from:
      secret: "onepassword:api-keys.secret-key"
  - name: "STRIPE_KEY"
    from:
      secret: "onepassword:api-keys.stripe-key"
```

See [Secret Providers](/docs/secret-providers) for more details.

## Environment Files

Haloy automatically loads environment variables from these files (in order):

1. `.env` in the current directory
2. `.env.local` in the current directory (overrides `.env`)
3. `.env.{target}` for target-specific variables
4. `.env` in the Haloy config directory (`~/.config/haloy/`)

### Example .env File

```bash
DATABASE_URL=postgres://localhost:5432/myapp
API_KEY=your-secret-api-key
DEBUG=true
MAX_CONNECTIONS=100
```

### Local Overrides with .env.local

The `.env.local` file is loaded after `.env` and overrides any duplicate variables. This follows a common convention where:

- `.env` contains committed defaults and safe-to-share values
- `.env.local` contains local or secret overrides that are gitignored

**.env (committed to repository):**

```bash
DATABASE_URL=postgres://localhost:5432/myapp
API_KEY=placeholder
DEBUG=true
```

**.env.local (gitignored, local overrides):**

```bash
API_KEY=your-actual-secret-key
DEBUG=false
```

In this example, `API_KEY` and `DEBUG` from `.env.local` override the values in `.env`, while `DATABASE_URL` remains unchanged.

### Target-Specific .env Files

For multi-target deployments:

**.env.production:**

```bash
DATABASE_URL=postgres://prod-db:5432/myapp
DEBUG=false
NODE_ENV=production
```

**.env.staging:**

```bash
DATABASE_URL=postgres://staging-db:5432/myapp
DEBUG=true
NODE_ENV=staging
```

## Mixed Approaches

Combine different methods in a single configuration:

```yaml
name: "my-app"
env:
  # Plain text for non-sensitive values
  - name: "PORT"
    value: "8080"
  - name: "LOG_LEVEL"
    value: "info"

  # From environment variables
  - name: "DATABASE_URL"
    from:
      env: "PRODUCTION_DATABASE_URL"

  # From secret providers
  - name: "API_SECRET"
    from:
      secret: "onepassword:api-keys.secret"
```

## Build Arguments from Environment Variables
When building Docker images locally, you often need the same variable both as a runtime environment variable and as a build argument. Instead of duplicating the definition, use the `build_arg` option:

```yaml
name: "my-app"
env:
  - name: "NODE_ENV"
    value: "production"
    build_arg: true  # Also pass as build argument
  - name: "API_URL"
    from:
      env: "API_URL"
    build_arg: true
image:
  repository: "my-app"
  build_config:
    context: "."
```

This is equivalent to the more verbose:

```yaml
env:
  - name: "NODE_ENV"
    value: "production"
  - name: "API_URL"
    from:
      env: "API_URL"
image:
  repository: "my-app"
  build_config:
    context: "."
    args:
      - name: "NODE_ENV"
        value: "production"
      - name: "API_URL"
        from:
          env: "API_URL"
```

**Notes:**
- The `build_arg` option only takes effect when the image has a `build_config` (i.e., the image will be built locally)
- If the same variable name is explicitly defined in `build_config.args`, the explicit definition takes precedence
- All value sources work with `build_arg`: plain `value`, `from.env`, and `from.secret`

## Multi-Target Environment Variables

Merge environment variables per target:

```yaml
name: "my-app"
# Base environment variables
env:
  - name: "LOG_LEVEL"
    value: "info"
  - name: "FEATURE_FLAG"
    value: "false"
targets:
  production:
    env:  # Merges with base env
      - name: "NODE_ENV"
        value: "production"
      - name: "LOG_LEVEL"
        value: "warn"  # Overrides base LOG_LEVEL
      - name: "DATABASE_URL"
        from:
          secret: "onepassword:prod-db.url"
    # Result: NODE_ENV=production, LOG_LEVEL=warn, FEATURE_FLAG=false, DATABASE_URL=<from secret>
  staging:
    env:  # Merges with base env
      - name: "NODE_ENV"
        value: "staging"
      - name: "LOG_LEVEL"
        value: "debug"  # Overrides base LOG_LEVEL
      - name: "DATABASE_URL"
        from:
          env: "STAGING_DATABASE_URL"
    # Result: NODE_ENV=staging, LOG_LEVEL=debug, FEATURE_FLAG=false, DATABASE_URL=<from env>
```

**Note:** Environment variables defined in targets are merged with base environment variables. Target-specific values override base values with the same name, while other base values are preserved.

## Best Practices

1. **Never commit secrets**: Use `.env` files or secret providers for sensitive data
2. **Add .env files to .gitignore**: Prevent accidental commits

```bash
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.*" >> .gitignore
```

3. **Use secret providers for production**: More secure than plain text or environment variables
4. **Document required variables**: Keep a `.env.example` file:

```bash
DATABASE_URL=postgres://localhost:5432/myapp
API_KEY=your-api-key-here
SECRET_KEY=your-secret-here
```

5. **Validate configuration**: Use `haloy validate-config` to check your setup

## Viewing Resolved Configuration

To see the final configuration with all secrets resolved (use with caution):

```bash
haloy validate-config --show-resolved-config
```

> **Warning:** This will display all secrets in plain text. Only use in secure environments.

## Next Steps

- [Configure Secret Providers](/docs/secret-providers)
- [Set up Volume Mounts](/docs/volumes)
- [Learn about Multi-Server Deployments](/docs/multi-server-deployments)
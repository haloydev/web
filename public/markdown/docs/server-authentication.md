Haloy supports managing multiple servers, each with their own API tokens. Learn how to configure and manage authentication.

## Token Resolution Order

Haloy checks for API tokens in this order:

1. **App config**: `api_token` field in your `haloy.yaml`
2. **Client config**: Tokens stored via `haloy server add`

## Managing Multiple Servers

### Add Servers

Get API tokens from each server and add them to your local client:

```bash
# Get token on the server
sudo haloyd config get api-token

# Add server on your local machine
haloy server add production.haloy.com <production-token>
haloy server add staging.haloy.com <staging-token>
haloy server add dev.haloy.com <dev-token>
```

### List Servers

```bash
haloy server list
```

### Remove Server

```bash
haloy server delete staging.haloy.com
```

## How It Works

When you run `haloy server add`, Haloy creates two files:

### Client Configuration

**`~/.config/haloy/client.yaml`** - Server references:

```yaml
servers:
  "production.haloy.com":
    token_env: "HALOY_API_TOKEN_PRODUCTION_HALOY_COM"
  "staging.haloy.com":
    token_env: "HALOY_API_TOKEN_STAGING_HALOY_COM"
```

### Environment Variables

**`~/.config/haloy/.env`** - Actual tokens:

```bash
HALOY_API_TOKEN_PRODUCTION_HALOY_COM=abc123token456
HALOY_API_TOKEN_STAGING_HALOY_COM=def789token012
```

### Deployment Flow

When you deploy, Haloy:

1. Loads `.env` files from current directory and config directory
2. Gets server URL from your config
3. Resolves the API token from configuration
4. Makes authenticated API calls to the specified server

## Server Selection Priority

Haloy determines which server to deploy to using this priority:

1. **Explicit server in config**: `server: production.haloy.com` in `haloy.yaml`
2. **Single server auto-selection**: If only one server configured, uses it automatically
3. **Error for multiple servers**: If multiple servers but none specified in config, prompts you

## Setting Token in App Configuration

Alternative to `haloy server add` - set tokens directly in your app config.

### Environment Variable Reference

```yaml
name: "my-app"
server: "api.haloy.dev"
api_token:
  from:
    env: "PRODUCTION_DEPLOY_TOKEN"
image:
  repository: "my-app"
  tag: "latest"
```

Set the token in your environment:

```bash
export PRODUCTION_DEPLOY_TOKEN="your_token_here"
haloy deploy
```

You can also use [environment files](/docs/environment-variables#environment-files) to export variables.

### From Secret Provider

```yaml
 name: "my-app"
 server: "api.haloy.dev"
 api_token:
   from:
     secret: "onepassword:api-tokens.production"

 secret_providers:
   onepassword:
     api-tokens:
       vault: "Infrastructure"
       item: "Haloy API Tokens"
image:
   repository: "my-app"
   tag: "latest"
```

### Direct Value (Not Recommended)

```yaml
name: "my-app"
server: "api.haloy.dev"
api_token:
  value: "your_token_here"  # Avoid in production!
image:
  repository: "my-app"
  tag: "latest"
```

**Warning**: Never commit tokens directly in config files. Use environment variables or secret providers.

## Use Cases

### Multiple Environments with Different Servers

```yaml
# production.haloy.yaml
server: production.haloy.com
api_token:
  from:
    env: "PROD_TOKEN"

# staging.haloy.yaml
server: staging.haloy.com
api_token:
  from:
    env: "STAGING_TOKEN"
```

Deploy to different environments:

```bash
export PROD_TOKEN="production_token_here"
export STAGING_TOKEN="staging_token_here"

haloy deploy --config production.haloy.yaml
haloy deploy --config staging.haloy.yaml
```

### CI/CD with Multiple Projects

```yaml
# Set tokens in CI environment variables
export PROJECT_A_PROD_TOKEN="token_a_prod"
export PROJECT_A_STAGING_TOKEN="token_a_staging"
export PROJECT_B_TOKEN="token_b"

# project-a/production.haloy.yaml
server: project-a-prod.haloy.com
api_token:
  from:
    env: "PROJECT_A_PROD_TOKEN"

# project-a/staging.haloy.yaml
server: project-a-staging.haloy.com
api_token:
  from:
    env: "PROJECT_A_STAGING_TOKEN"

# project-b/haloy.yaml
server: project-b.haloy.com
api_token:
  from:
    env: "PROJECT_B_TOKEN"
```

### Single Server, Multiple Projects

```yaml
# All projects deploy to the same server
# Each has a unique app name

# app1.haloy.yaml
name: "app1"
server: shared.haloy.com

# app2.haloy.yaml
name: "app2"
server: shared.haloy.com

# Both use the same token (from haloy server add)
# Or specify different tokens if needed
```

### Multi-Target with Different Tokens

```yaml
name: "my-app"
image:
  repository: "my-org/my-app"
  tag: "latest"

secret_providers:
  onepassword:
    prod-tokens:
      vault: "Production"
      item: "API Tokens"

targets:
  production:
    server: prod.haloy.com
    api_token:
      from:
        secret: "onepassword:prod-tokens.haloy-api"
    domains:
      - domain: "my-app.com"

  staging:
    server: staging.haloy.com
    api_token:
      from:
        env: "STAGING_API_TOKEN"
    domains:
      - domain: "staging.my-app.com"
```

## Security

### File Permissions

- `.env` files have `0600` permissions (owner read/write only)
- Config files should not contain secrets
- Token files stored in user config directory

### Best Practices

1. **Never commit tokens**: Add `.env*` to `.gitignore`
2. **Use environment variables or secret providers**: Avoid hardcoding tokens
3. **Rotate tokens regularly**: Generate new tokens periodically
4. **Use different tokens per environment**: Separate production and staging
5. **Limit token access**: Only give tokens to authorized users
6. **Revoke unused tokens**: Clean up old tokens on the server

### Add to .gitignore

```bash
# .gitignore
.env
.env.*
!.env.example
```

### Example .env.example

Create a template for required tokens:

```bash
# .env.example
PRODUCTION_API_TOKEN=your_production_token_here
STAGING_API_TOKEN=your_staging_token_here
GITHUB_TOKEN=your_github_token_here
```

## Server Domain Format

When adding servers:
- Use just the domain name (e.g., `haloy.example.com`)
- You don't need to include `https://` - Haloy adds it automatically
- For local development: `localhost` or `127.0.0.1`

**Valid:**

```bash
haloy server add haloy.example.com <token>
haloy server add 192.168.1.100 <token>
haloy server add localhost <token>
```

**Invalid:**

```bash
haloy server add https://haloy.example.com <token>  # Remove https://
haloy server add haloy.example.com:443 <token>        # Remove port
```

## Troubleshooting

### Authentication Failed

**Cause**: Invalid or expired token

**Solution**:

```bash
# Get the current token on server (or generate new one via haloyd init)
sudo haloyd config get api-token

# Update local config
haloy server add <server-domain> <new-token> --force
```

### Server Not Found

**Cause**: Server not added to local config

**Solution**:

```bash
# List configured servers
haloy server list

# Add missing server
haloy server add <server-domain> <token>
```

### Environment Variable Not Found

**Cause**: Token environment variable not set

**Solution**:

```bash
# Check if variable is set
echo $PRODUCTION_API_TOKEN

# Set the variable
export PRODUCTION_API_TOKEN="your_token"

# Or add to .env file
echo "PRODUCTION_API_TOKEN=your_token" >> .env
```

### Multiple Servers, No Server Specified

**Cause**: Multiple servers configured but no `server` in config

**Solution**:

```yaml
# Add server to your haloy.yaml
server: production.haloy.com
```

## Next Steps

- View [haloyd Command Reference](/docs/haloyd) for server-side commands
- [Configure Secret Providers](/docs/secret-providers)
- [Set up Multi-Server Deployments](/docs/multi-server-deployments)
- [Learn about Environment Variables](/docs/environment-variables)
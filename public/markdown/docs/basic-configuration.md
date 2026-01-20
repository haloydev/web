Learn how to create a basic Haloy configuration file to deploy your application.

## Minimal Configuration

The simplest `haloy.yaml` configuration:

```yaml
name: "my-app"
server: haloy.yourserver.com
domains:
  - domain: "my-app.com"
    aliases:
      - "www.my-app.com"
```

This configuration:

- Looks for a Dockerfile in the same directory
- Builds the image locally
- Uploads it to your server
- Deploys with SSL/TLS enabled
- Redirects www to the main domain

## Format Support

Haloy supports YAML, JSON, and TOML for configuration files.

### YAML (`*.yml` or `*.yaml`)
```yaml
name: "my-app"
server: haloy.yourserver.com
domains:
  - domain: "my-app.com"
    aliases:
      - "www.my-app.com"
acme_email: "you@example.com"
health_check_path: "/health"
```

### JSON (`*.json`)
```json
{
  "name": "my-app",
  "server": "haloy.yourserver.com",
  "domains": [
    {
      "domain": "my-app.com",
      "aliases": ["www.my-app.com"]
    }
  ],
  "acme_email": "you@example.com",
  "health_check_path": "/health"
}
```

### TOML (`*.toml`)

```toml
name = "my-app"
server = "haloy.yourserver.com"
acme_email = "you@example.com"
health_check_path = "/health"

[[domains]]
domain = "my-app.com"
aliases = ["www.my-app.com"]
```

**Naming Convention:**

- YAML/TOML: Use `snake_case` (e.g., `acme_email`)
- JSON: Use `camelCase` (e.g., `acmeEmail`)

## Adding a Domain

To make your app accessible via a domain:

```yaml
name: "my-app"
server: haloy.yourserver.com
domains:
  - domain: "my-app.com"
acme_email: "you@email.com"  # If not added haloy will use email configured when setting up the api domain
```

## Multiple Domains and Aliases

```yaml
domains:
  - domain: "my-app.com"
    aliases:
      - "www.my-app.com"
      - "app.my-app.com"
  - domain: "another-domain.com"
acme_email: "you@email.com"
```

## Custom Port

If your application listens on a port other than 8080:

```yaml
name: "my-app"
server: haloy.yourserver.com
port: "3000"  # Your app's internal port
```

The proxy will route traffic from ports 80/443 to this container port.

## Health Checks

Configure a custom health check endpoint:

```yaml
name: "my-app"
server: haloy.yourserver.com
health_check_path: "/api/health"
```

Default: `"/"`

## Configuration File Location

By default, `haloy` looks for configuration in the current directory:

- `haloy.yaml`
- `haloy.yml`
- `haloy.json`
- `haloy.toml`

Specify a custom config file:

```bash
haloy deploy --config /path/to/config.yaml
```

## Next Steps

- [All Configuration Options](/docs/configuration-reference)
- [Set up Environment Variables](/docs/environment-variables)
- [Configure Volumes](/docs/volumes)
- [Image Configuration](/docs/image-configuration)
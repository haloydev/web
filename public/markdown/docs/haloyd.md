Complete reference for haloyd server commands.

These commands run on the server to manage the Haloy daemon.

## Commands

### serve

Start the haloyd daemon. This is typically run by systemd or another init system.

```bash
# Start the daemon (foreground)
haloyd serve

# Start with debug logging
haloyd serve --debug
```

**Options:**

<div class="list-unstyled">
- `--debug` - Enable debug mode with verbose logging
</div>

**Note:** In production, this command is run by the init system (systemd, OpenRC, etc.) rather than manually.

### init

Initialize haloyd configuration and directories. Run this during first-time setup.

```bash
# Initialize with API domain and TLS
sudo haloyd init --api-domain haloy.example.com --acme-email you@example.com

# Initialize without API domain (localhost only)
sudo haloyd init

# Initialize with custom directories
sudo haloyd init --data-dir /custom/data --config-dir /custom/config
```

**Options:**

<div class="list-unstyled">
- `--api-domain <domain>` - Domain for Haloy API with TLS
- `--acme-email <email>` - Email for Let's Encrypt certificates
- `--data-dir <path>` - Custom data directory (default: `/var/lib/haloy`)
- `--config-dir <path>` - Custom config directory (default: `/etc/haloy`)
</div>

**What init creates:**

- `/etc/haloy/haloyd.yaml` - Daemon configuration
- `/etc/haloy/.env` - API token
- `/var/lib/haloy/` - Data directory
- `haloy` Docker network

### config

Get or set configuration values.

```bash
# Get a configuration value
sudo haloyd config get api-domain
sudo haloyd config get api-token
sudo haloyd config get acme-email

# Set a configuration value
sudo haloyd config set api-domain haloy.newdomain.com
sudo haloyd config set acme-email newemail@example.com
```

**Subcommands:**

<div class="list-unstyled">
- `get <key>` - Get a configuration value
- `set <key> <value>` - Set a configuration value
</div>

**Available keys:**

<div class="list-unstyled">
- `api-domain` - The domain for the Haloy API
- `api-token` - The API authentication token
- `acme-email` - Email address for Let's Encrypt
</div>

### upgrade

Self-update haloyd to the latest version.

```bash
# Upgrade to latest version
sudo haloyd upgrade

# Upgrade to specific version
sudo haloyd upgrade --version 1.2.0
```

**Options:**

<div class="list-unstyled">
- `--version <version>` - Upgrade to a specific version instead of latest
</div>

The upgrade command will:
1. Download the new binary
2. Verify the download
3. Replace the current binary
4. Signal the service to restart (if running under systemd)

### verify

Verify the haloyd installation and check system health.

```bash
sudo haloyd verify
```

**Checks performed:**

<div class="list-unstyled">
- Configuration directory exists and is readable
- Data directory exists and is writable
- Configuration files are valid
- Docker daemon is accessible
- Docker network exists
- API is responding (if running)
</div>

**Example output:**

```text
✓ Config directory: /etc/haloy
✓ Data directory: /var/lib/haloy
✓ Config file: /etc/haloy/haloyd.yaml
✓ Docker connectivity
✓ Docker network: haloy
✓ API health check
```

### version

Display the haloyd version.

```bash
haloyd version
```

Outputs only the version number in plaintext (e.g., `1.0.0`).

## Configuration File

The haloyd configuration file is located at `/etc/haloy/haloyd.yaml`:

```yaml
api_domain: haloy.example.com
acme_email: you@example.com
health_monitor:
  enabled: true
  interval: "15s"
  fall: 3
  rise: 2
  timeout: "5s"
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `api_domain` | Domain for the haloyd API | (none) |
| `acme_email` | Email for Let's Encrypt certificates | (none) |
| `health_monitor.enabled` | Enable background health monitoring | `true` |
| `health_monitor.interval` | Time between health checks | `15s` |
| `health_monitor.fall` | Failures before marking unhealthy | `3` |
| `health_monitor.rise` | Successes before marking healthy | `2` |
| `health_monitor.timeout` | Timeout for each health check | `5s` |

## Service Management

haloyd runs as a system service. Use your init system to manage it:

### Systemd

```bash
# Start
sudo systemctl start haloyd

# Stop
sudo systemctl stop haloyd

# Restart
sudo systemctl restart haloyd

# Status
sudo systemctl status haloyd

# View logs
sudo journalctl -u haloyd -f
```

### OpenRC

```bash
# Start
sudo rc-service haloyd start

# Stop
sudo rc-service haloyd stop

# Restart
sudo rc-service haloyd restart

# Status
sudo rc-service haloyd status
```

## Exit Codes

The `haloyd` CLI uses consistent exit codes:

<div class="list-unstyled">
- `0` - Success
- `1` - Any error
</div>

## Next Steps

- [Server Installation](/docs/server-installation)
- [Understand the Architecture](/docs/architecture)
- [Configure Authentication](/docs/server-authentication)
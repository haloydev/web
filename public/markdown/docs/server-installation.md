The Haloy daemon (`haloyd`) runs on your server and manages container deployments, service discovery, and traffic routing.

After running the installation script, you'll need to configure your server with a domain for remote access.

## Prerequisites

- Linux server (Debian/Ubuntu, RHEL/CentOS, Alpine, or other distributions)
- Docker installed and running
- Root or sudo access
- A domain or subdomain pointing to your server (for HTTPS API access)

## Quick Install (with configuration)

If you already have a domain pointing to your server:

```bash
API_DOMAIN=api.example.com ACME_EMAIL=admin@example.com \\
  curl -fsSL https://sh.haloy.dev/install-haloyd.sh | sudo sh
```

## Standard Install (configure after)

```bash
curl -fsSL https://sh.haloy.dev/install-haloyd.sh | sudo sh
```

After installation, the script will display your server's public IP address. You'll need to:

### 1. Point your domain to the server

Create a DNS A record pointing your chosen domain to the server's IP address.

### 2. Configure haloy

```bash
sudo haloyd config set api-domain YOUR_DOMAIN
sudo haloyd config set acme-email YOUR_EMAIL
sudo systemctl restart haloyd
```

### 3. Add the server to your local CLI

On your local machine, run the command shown at the end of installation:

```bash
haloy server add YOUR_DOMAIN YOUR_API_TOKEN
```

You can retrieve the API token later by running on the server:

```bash
sudo haloyd config get api-token
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `API_DOMAIN` | Domain for the haloy API (e.g., api.example.com) |
| `ACME_EMAIL` | Email for Let's Encrypt certificate notifications |
| `SKIP_START` | Set to `true` to skip starting the service |

## Manual Installation

If you prefer to install manually or the script doesn't work for your system:

### 1. Install haloyd Binary

Download and install the binary:

```bash
# Download latest release (adjust architecture as needed: amd64, arm64)
curl -fsSL -o /usr/local/bin/haloyd https://releases.haloy.dev/haloyd-linux-amd64
chmod +x /usr/local/bin/haloyd
```

### 2. Create System User

```bash
# Create haloy user and add to docker group
useradd -r -s /bin/false haloy
usermod -aG docker haloy
```

### 3. Initialize haloyd

Run the init command to create configuration and directories:

```bash
sudo haloyd init --api-domain haloy.yourserver.com --acme-email you@example.com
```

This creates:
- `/etc/haloy/haloyd.yaml` - Daemon configuration
- `/etc/haloy/.env` - API token
- `/var/lib/haloy/` - Data directory
- `haloy` Docker network

### 4. Install Service

#### Systemd

```bash
cat > /etc/systemd/system/haloyd.service << 'EOF'
[Unit]
Description=Haloy Daemon
After=network-online.target docker.service
Wants=network-online.target
Requires=docker.service

[Service]
Type=simple
User=haloy
Group=haloy
ExecStart=/usr/local/bin/haloyd serve
Restart=always
RestartSec=5

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectHome=true
ProtectSystem=strict
ReadWritePaths=/var/lib/haloy /etc/haloy
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now haloyd
```

#### OpenRC

```bash
cat > /etc/init.d/haloyd << 'EOF'
#!/sbin/openrc-run

name="haloyd"
description="Haloy Daemon"
command="/usr/local/bin/haloyd"
command_args="serve"
command_user="haloy:haloy"
pidfile="/run/haloyd.pid"
command_background=true

depend() {
    need net docker
    after firewall
}
EOF

chmod +x /etc/init.d/haloyd
rc-update add haloyd default
rc-service haloyd start
```

## Service Management

### Systemd

```bash
# Start the service
sudo systemctl start haloyd

# Stop the service
sudo systemctl stop haloyd

# Restart the service
sudo systemctl restart haloyd

# Check service status
sudo systemctl status haloyd

# View logs
sudo journalctl -u haloyd -f
```

### OpenRC

```bash
# Start the service
sudo rc-service haloyd start

# Stop the service
sudo rc-service haloyd stop

# Restart the service
sudo rc-service haloyd restart

# Check service status
sudo rc-service haloyd status
```

## Configuration

The haloyd configuration file is located at `/etc/haloy/haloyd.yaml`:

```yaml
api_domain: haloy.yourserver.com
acme_email: you@example.com
health_monitor:
  enabled: true
  interval: "15s"
  fall: 3
  rise: 2
  timeout: "5s"
```

### View or Update Configuration

```bash
# View a configuration value
sudo haloyd config get api-domain

# Set a configuration value
sudo haloyd config set api-domain haloy.newdomain.com

# Get the API token
sudo haloyd config get api-token
```

## Directory Structure

```bash
/etc/haloy/              # Configuration
├── haloyd.yaml          # Daemon settings
└── .env                 # API token

/var/lib/haloy/          # Data
├── certs/               # SSL certificates
└── db/                  # Deployment database
```

## Verify Installation

Run the verify command to check that everything is working:

```bash
sudo haloyd verify
```

This checks:
- Configuration directory and files
- Data directory
- Docker connectivity
- Docker network
- API health

## Same-Server Deployment

If you want to run the `haloy` CLI directly on the server (instead of from your local machine), you can add the server using localhost:

```bash
haloy server add localhost <api-token>
```

This is useful for:
- Single-server setups
- CI/CD pipelines running on the server
- Situations where external API access isn't available

## Troubleshooting

### Service Won't Start

Check the logs:

```bash
sudo journalctl -u haloyd -n 50
```

Common issues:
- Docker not running: `sudo systemctl start docker`
- Port 80/443 in use: Check with `sudo ss -tlnp | grep -E ':80|:443'`
- Permission issues: Ensure the `haloy` user is in the `docker` group

### Cannot Connect to API

Verify the service is running and listening:

```bash
# Check service status
sudo systemctl status haloyd

# Check if ports are open
sudo ss -tlnp | grep haloyd

# Test API locally
curl -k https://localhost/health
```

### Verify Docker Access

```bash
# Test that haloy user can access Docker
sudo -u haloy docker ps
```

## Uninstalling

To completely remove Haloy from your server:

```bash
curl -sL https://sh.haloy.dev/uninstall-server.sh | sudo sh
```

This will:
- Stop and remove the haloyd service
- Optionally back up your data
- Remove configuration and data directories
- Remove the haloyd binary
- Optionally remove the haloy user

See [Uninstalling](/docs/uninstalling) for more details.

## Next Steps

- [Add the server to your local machine](/docs/server-authentication)
- [View haloyd command reference](/docs/haloyd)
- [Deploy your first application](/docs/quickstart#3-create-haloyyaml)
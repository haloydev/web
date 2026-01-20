Haloy supports both Docker named volumes and filesystem bind mounts for persistent data storage.

## Named Volumes (Recommended)

Named volumes are managed by Docker and work consistently across environments:

```yaml
name: "my-app"
volumes:
  - "app-data:/app/data"
  - "app-logs:/var/log/app"
  - "postgres-data:/var/lib/postgresql/data"
```

### Benefits

- Managed by Docker
- Portable across environments
- Better performance on some systems
- Automatic cleanup with `docker volume prune`

## Filesystem Bind Mounts

Mount directories from the host filesystem into containers:

```yaml
name: "my-app"
volumes:
  - "/var/app/data:/app/data"
  - "/home/user/logs:/app/logs:ro"
  - "/etc/ssl/certs:/app/certs:ro"
```

### Mount Options

Add options after the second colon:

- `ro` - Read-only mount
- `rw` - Read-write mount (default)
- `z` - SELinux label (shared content)
- `Z` - SELinux label (private content)

## Volume Format

```yaml
# Named volume
volume-name:/container/path

# Bind mount (requires absolute path)
/absolute/host/path:/container/path[:options]
```

## Important Restrictions

### Absolute Paths Required

Filesystem bind mounts must use absolute paths starting with `/`:

**Valid:**

```yaml
volumes:
  - "/var/log/myapp:/app/logs"
  - "/etc/ssl/private:/app/ssl:ro"
```

**Invalid (will be rejected):**

```yaml
volumes:
  - "./data:/app/data"        # Relative path
  - "../config:/app/config"   # Relative path
```

### Why No Relative Paths?

Since `haloyd` runs inside a Docker container, relative paths would be resolved relative to the daemon container's filesystem, not your local machine. This causes:

- Unexpected directory creation inside the daemon container
- Data appearing lost or inaccessible
- Inconsistent behavior across deployments

Using absolute paths or named volumes ensures predictable, consistent behavior.

## Multi-Target Volumes

Override volumes for different deployment targets:

```yaml
name: "my-app"
# Base volumes
volumes:
  - "app-data:/app/data"
targets:
  production:
    volumes:
      - "prod-app-data:/app/data"
      - "/var/log/prod-app:/app/logs"
  staging:
    volumes:
      - "staging-app-data:/app/data"
      - "/var/log/staging-app:/app/logs"
```

## Best Practices

1. **Use named volumes for data persistence**: More portable and easier to manage
2. **Use bind mounts for configuration**: When you need to edit files on the host
3. **Always use absolute paths for bind mounts**: Prevents unexpected behavior
4. **Mount sensitive files as read-only**: Add `:ro` to prevent accidental modification
5. **Regular backups**: Especially for named volumes containing critical data
6. **Document volume requirements**: Keep a list of required volumes in your README

## Next Steps

- [Configure Environment Variables](/docs/environment-variables)
- [Set up Secret Providers](/docs/secret-providers)
- [Learn about Image Configuration](/docs/image-configuration)
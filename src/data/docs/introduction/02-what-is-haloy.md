---
title: What is Haloy
slug: what-is-haloy
section: introduction
---

**Haloy** is a lightweight deployment and orchestration system designed for developers who want a simple, reliable way to deploy Docker‑based applications to their own servers. It removes the complexity of traditional DevOps stacks while providing the core features needed for modern deployments.

**Haloy is open source, MIT licensed, and completely free.**

Haloy consists of two main parts:

1. **haloy:** CLI tool that runs on your local machine and handles deployments, build workflows, logs, rollbacks, and multi‑server targeting.
2. **haloyd:** A lightweight daemon that runs on your server and handles container orchestration, service discovery, SSL certificates, reverse proxy routing, and deployment logic.

## How Haloy Works

- You write a **haloy.yaml** (or whatever you want to call it) file describing how your app should be built and deployed.
- The Haloy CLI builds your image (if configured), uploads or pushes it, and triggers deployment on the server.
- haloyd launches and monitors your application containers, updates routing automatically, and manages SSL with Let's Encrypt.
- The built‑in reverse proxy handles load balancing and HTTPS termination.

## Key Features

- **Simple deployments**: One command deploys your app with zero infrastructure setup beyond the initial install.
- **Built‑in HTTPS**: Automatic TLS certificates via ACME/Let’s Encrypt.
- **Automatic routing**: Domains and aliase redirects are managed for you.
- **Multi‑server support**: Deploy to staging, production, and regional servers from one config.
- **Build locally or use registries**: Build Docker images on your machine and either upload them or push to registries.
- **Rollbacks**: Roll back instantly using local images or registry tags.
- **Horizontal scaling**: Define replicas to run multiple instances of your app.
- **Secret management**: Integrates with environment variables and secret providers like 1Password.
- **Zero vendor lock‑in**: Everything runs on your own Linux servers using Docker.

## When to Use Haloy

Haloy is built for developers who want:

- A simple deployment workflow without Kubernetes complexity
- A self‑hosted, Docker‑based deployment platform
- Clean separation between dev, staging, and production environments
- A fast “build → ship → run” loop
- Predictable, stable deployments on their own machines

It’s ideal for:

- Indie developers
- Small teams
- Self‑hosted SaaS
- API services
- Internal tools
- Multi‑environment deployments
- Lightweight multi‑region setups

## When Not to Use Haloy

Haloy is intentionally simple. You probably don’t want it if you need:

- Full Kubernetes‑style auto‑scaling rules
- Service mesh or network policy layers
- Multi‑node clustering with auto‑failover
- Deep container‑orchestration features (jobs, cron workloads, etc.)

## Why Haloy Exists

Infrastructure has become complicated. Many developers don’t need Kubernetes, cloud vendor services, or complex CI/CD pipelines for everyday apps. Haloy gives you a deploy system that is:

- Understandable
- Self‑contained
- Reliable
- Easy to operate
- Easy to reason about

All while still being powerful enough for production workloads.

## Next Steps
- [Install Haloy](/docs/quickstart)
- [Learn about the Architecture](/docs/architecture)
- [haloy CLI Command Reference](/docs/haloy)
- [haloyd Server Commands](/docs/haloyd)

---
title: What is Haloy
slug: what-is-haloy
category: introduction
---

__Haloy__ is a lightweight deployment and orchestration system designed for developers who want a simple, reliable way to deploy Docker‑based applications to their own servers. It removes the complexity of traditional DevOps stacks while providing the core features needed for modern deployments.

Haloy consists of three main parts:
1. __haloy:__ CLI tool that runs on your local machine and handles deployments, build workflows, logs, rollbacks, and multi‑server targeting.
1. __haloyadm:__ Admin CLI tool that installs and manages the Haloy daemon and HAProxy on your server.
1. __haloyd__: A small service (daemon) that handles container orchestration, service discovery, SSL certificates and proxy configration (routing), and deployment logic.

## How Haloy Works

- You write a __haloy.yaml__ (or whatever you want to call it) file describing how your app should be built and deployed.
- The Haloy CLI builds your image (if configured), uploads or pushes it, and triggers deployment on the server.
- haloyd launches and monitors your application containers, updates routing automatically, and manages SSL with Let's Encrypt.
- HAProxy (managed by haloyd ) handles load balancing and HTTPS termination.

##  Key Features

- __Simple deployments__: One command deploys your app with zero infrastructure setup beyond the initial install.
- __Built‑in HTTPS__: Automatic TLS certificates via ACME/Let’s Encrypt.
- __Automatic routing__: Domains and aliase redirects are managed for you.
- __Multi‑server support__: Deploy to staging, production, and regional servers from one config.
- __Build locally or use registries__: Build Docker images on your machine and either upload them or push to registries.
- __Rollbacks__: Roll back instantly using local images or registry tags.
- __Horizontal scaling__: Define replicas to run multiple instances of your app.
- __Secret management__: Integrates with environment variables and secret providers like 1Password.
- __Zero vendor lock‑in__: Everything runs on your own Linux servers using Docker.

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

When Not to Use Haloy

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

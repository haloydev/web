---
title: Why Haloy
slug: why-haloy
section: introduction
description: 'Why Haloy exists, who it is for, and how it differs from dashboard-first self-hosted platforms.'
---

I built Haloy because I wanted a simple way to deploy to a server with zero-downtime deploys and easy TLS handling. I also wanted to own the infrastructure, or at least rent it and still control it.

Coolify and Dokploy are great if you want a full control plane with a web UI. For a lot of developers that is the right choice. For others, it is extra surface area to run and maintain.

Kamal also makes many smart design choices. But if your stack is not Ruby-centric, adding a Ruby-based toolchain can feel like unnecessary friction. I also thought we could get away with one config file and avoid relying on Git integration.

Haloy is for a narrower use case: production-grade deploys on your own servers, with a lightweight daemon and a CLI-first workflow.

## What Haloy Optimizes For

### Lightweight by design

- No heavy control plane
- No dashboard maze
- A small daemon focused on deploy orchestration, reverse proxying, and TLS

### CLI-first workflow

- Deploys are commands, not clicks
- Easy to script in CI/CD
- Straightforward to use with AI coding agents and automation tools

### Production essentials built in

You get the features teams usually end up rebuilding anyway:

- Zero-downtime deploys
- Automatic HTTPS
- Instant rollbacks
- Health checks and safe traffic cutover
- Secret management

### Infrastructure ownership

- Your servers, containers, and data
- No platform lock-in
- No forced pricing model
- No migration tax later

## Who Haloy Is For

Haloy is a strong fit if you:

- Want Docker deployments without Kubernetes-level complexity
- Prefer configuration and automation over dashboard operations
- Want to keep operational overhead low while staying production-ready
- Run apps on your own VPS, dedicated servers, or cloud VMs

## Who Haloy Is Not For

Haloy is probably not the right choice if you want:

- A full web control panel as your primary workflow
- A broad internal platform with many built-in managed services
- Kubernetes-style scheduling and orchestration primitives

## A Focused Alternative

Haloy is not trying to replace every PaaS pattern.

It is a focused deployment engine for teams that want reliable, automation-friendly Docker deploys on infrastructure they control.

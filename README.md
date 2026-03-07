# log0

**log0 — an intelligent incident copilot that turns raw logs into actionable incidents.**

> From logs to incidents, automatically.

---

## Overview

**log0** is a backend-first, multi-tenant log intelligence and incident management platform.

It ingests high-volume logs from distributed services, normalizes and clusters similar errors, and automatically creates incidents when recurring failures are detected. Using an event-driven architecture built on **Kafka**, **ClickHouse**, and **PostgreSQL**, log0 provides reliable log ingestion, real-time incident detection, and ownership-driven workflows.

Incidents are summarized and routed directly to **Slack** or **WhatsApp**, enabling fast assignment and resolution without leaving existing tools. The platform is designed as a scalable **SaaS**, with clear service boundaries, strong tenant isolation, and an extensible foundation for future AI-assisted debugging and code-level recommendations.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

---
layout: home

hero:
  name: "Wanaku"
  text: "The Open-Source Governed Action Proxy for AI Agents"
  tagline: Wanaku sits between AI agents and the systems they act on, intercepting tool calls, agent-to-agent messages, and inference traffic. Policy, identity, data controls, and audit happen in the proxy — agents never touch backend systems directly.
  image:
    src: /images/wanaku.png
    alt: Wanaku
  actions:
    - theme: brand
      text: Get Started
      link: /docs/version/wanaku-main/docs/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/wanaku-ai/wanaku

features:
  - title: Governed by Design
    details: Policy, identity, audit, and data controls are enforced in the proxy layer. Agents can't skip or ignore governance because they never reach the backend directly.
    icon: "🔒"
  - title: Action Proxy, Not a Gateway
    details: Wanaku doesn't just pass traffic through — it runs the work itself. Integration developers build Apache Camel routes and publish them as tools; agents call those tools with parameters, but Wanaku executes the actual work.
    icon: "⚡"
  - title: Built for AI Agents
    details: Not a general-purpose proxy. Wanaku intercepts tool calls, agent-to-agent delegations, and inference traffic — the specific problem of agents acting on enterprise systems.
    icon: "🤖"
  - title: Open Source
    details: Developed by the community, for the community.
    icon: "🌐"
---

<script setup>
import HomeContent from './.vitepress/theme/components/HomeContent.vue'
</script>

<HomeContent />

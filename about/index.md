---
layout: home
description: "Learn about Wanaku — the open-source governed action proxy for AI agents."

hero:
  name: "About Wanaku"
  text: ""
  tagline: The open-source governed action proxy that transforms how AI agents integrate with enterprise systems.
  image:
    src: /images/wanaku.png
    alt: Wanaku
  actions:
    - theme: brand
      text: Get Started
      link: /docs/
    - theme: alt
      text: View on GitHub
      link: https://github.com/wanaku-ai/wanaku

features:
  - title: The Challenge
    details: AI agents are advancing quickly, but letting them act on enterprise systems is risky. Early agentic applications suffer from duplicated integration code, inconsistent access control, and no audit trail. Enterprises need governance — but the autonomous, stochastic nature of LLMs makes it hard to enforce at the agent level.
    icon: "⚡"
  - title: Our Solution
    details: "Wanaku is a governed action proxy that sits between agents and backends. Integration developers build Apache Camel routes and publish them as tools; agents call those tools with parameters, but Wanaku runs the actual work. Policy, identity, data controls, and audit happen in the proxy — the agent never touches backend systems directly. Originally an MCP Router, Wanaku has expanded its scope to govern all agent actions: tool calls, delegations, and inference traffic."
    icon: "🎯"
  - title: The Name
    details: "The project name comes from the origins of the word Guanaco, a camelid native to South America — a nod to our Apache Camel heritage."
    icon: "🦙"
---

<script setup>
import AboutContent from '../.vitepress/theme/components/AboutContent.vue'
</script>

<AboutContent />

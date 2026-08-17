---
layout: home
description: "Learn about Wanaku — the open-source MCP Router connecting AI agents to enterprise systems securely."

hero:
  name: "About Wanaku"
  text: ""
  tagline: The open-source MCP Router that transforms how agentic applications integrate with enterprise systems.
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
    details: While AI agents and LLMs are advancing quickly, connecting them to enterprise data remains difficult. Early agentic applications suffer from duplicated integration code and configurations, making them hard to maintain and scale. Enterprises require strict access control, auditing, and error handling — all of which are difficult given the autonomous, stochastic nature of LLMs.
    icon: "⚡"
  - title: Our Solution
    details: Wanaku acts like a friendly, efficient receptionist for your digital office. It greets AI agents, checks their access, and routes them to the appropriate enterprise resources. The Rust-based Wanaku engine provides a high-performance filter pipeline, while Wanaku Barn offers a mature Java/Quarkus-based platform with Apache Camel integrations.
    icon: "🎯"
  - title: The Name
    details: "The project name comes from the origins of the word Guanaco, a camelid native to South America — a nod to our Apache Camel heritage."
    icon: "🦙"
---

<script setup>
import AboutContent from '../.vitepress/theme/components/AboutContent.vue'
</script>

<AboutContent />

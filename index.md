---
layout: home

hero:
  name: "Wanaku"
  text: "The Open-Source MCP Router"
  tagline: Meet Wanaku, the open-source MCP Router that acts like a friendly, efficient receptionist for your digital office.
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
  - title: Eliminate Repetitive Configurations
    details: Automates agentic integrations spanning HTTP, Kafka, FTP, and additional protocols.
    icon: "⚙️"
  - title: Strengthen Security & Compliance
    details: Provides straightforward enforcement of access control, auditing, and error handling.
    icon: "🔒"
  - title: Scale Without Stress
    details: High-performance Rust-based routing engine built on the Praxis proxy framework.
    icon: "🦀"
  - title: Open Source
    details: Developed by the community, for the community.
    icon: "🌐"
---

<script setup>
import HomeContent from './.vitepress/theme/components/HomeContent.vue'
</script>

<HomeContent />

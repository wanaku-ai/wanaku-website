<template>
  <div class="home-content">
    <section class="architecture-section">
      <div class="container">
        <h2>The Wanaku MCP Router positions itself between autonomous AI agents and enterprise systems</h2>
        <img src="/images/wanaku-architecture.jpg" alt="Wanaku Architecture" class="architecture-img" />
      </div>
    </section>

    <section class="power-section">
      <div class="container">
        <h2>Wanaku: unlocking the power of AI</h2>
        <p>
          Wanaku offers a high-performance MCP routing engine built on Rust and the Praxis proxy framework,
          with a composable filter pipeline and pluggable feature system.
          Wanaku Barn extends the ecosystem with Apache Camel integrations and a Quarkus-based platform.
        </p>
        <div class="tech-logos">
          <div class="tech-logo">
            <img src="/images/mcp.png" alt="Model Context Protocol" />
            <span>MCP</span>
          </div>
          <div class="tech-logo">
            <img src="/images/rust.png" alt="Rust" />
            <span>Rust</span>
          </div>
          <div class="tech-logo">
            <img src="/images/camel.png" alt="Apache Camel" />
            <span>Apache Camel</span>
          </div>
          <div class="tech-logo">
            <img src="/images/quarkus.png" alt="Quarkus" />
            <span>Quarkus</span>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <h2>Ready to streamline your agentic applications?</h2>
        <p>Join the Wanaku community to unlock frictionless, secure integrations today!</p>
        <a href="https://github.com/wanaku-ai/wanaku" class="cta-button">Learn More</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-content {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px;
}

.container {
  text-align: center;
  padding: 48px 0;
}

.architecture-section h2,
.power-section h2,
.cta-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--vp-c-text-1);
}

.architecture-img {
  max-width: 100%;
  border-radius: 12px;
  margin-top: 16px;
}

.power-section p {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  max-width: 720px;
  margin: 0 auto 32px;
  line-height: 1.7;
}

.tech-logos {
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
}

.tech-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.tech-logo img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.tech-logo span {
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.cta-section {
  border-top: 1px solid var(--vp-c-divider);
}

.cta-section p {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 24px;
}

.cta-button {
  display: inline-block;
  padding: 12px 32px;
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  border-radius: 20px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.25s;
}

.cta-button:hover {
  background-color: var(--vp-c-brand-2);
}
</style>

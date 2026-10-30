<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { page } = useData()

// The two Wanaku docs trees are different codebases, so the banner links the other tree's start page.
const banner = computed(() => {
  const path = page.value.relativePath
  if (path.startsWith('docs/next/')) {
    return {
      text: 'You are reading the docs for Wanaku next, the Rust-based server (early access of 0.3.0).',
      linkText: 'Read the Classic docs for the Java-based Wanaku 0.2.',
      link: withBase('/docs/classic/usage'),
    }
  }
  if (path.startsWith('docs/classic/')) {
    return {
      text: 'You are reading the docs for Wanaku Classic, the deprecated Java-based Wanaku 0.2.',
      linkText: 'Read the docs for Wanaku next, the Rust-based server.',
      link: withBase('/docs/next/'),
    }
  }
  return null
})
</script>

<template>
  <div v-if="banner" class="version-banner">
    {{ banner.text }} <a :href="banner.link">{{ banner.linkText }}</a>
  </div>
</template>

<style scoped>
.version-banner {
  margin-bottom: 24px;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: var(--vp-c-default-soft);
  font-size: 14px;
  line-height: 24px;
}
</style>

<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { treeOf } from '../../docsTrees'

const { page } = useData()

// A next tree is the unreleased main branch, so its banner links the latest release of the same repository.
// The classic tree is the Java-based Wanaku 0.2, a different codebase, so its banner links the latest start page.
const banner = computed(() => {
  const path = page.value.relativePath
  const tree = treeOf(path)
  if (tree && tree.dir.endsWith('next')) {
    return {
      text: `You are reading the docs for ${tree.site}, the unreleased development version.`,
      linkText: 'Read the docs for the latest release.',
      link: withBase(`/docs/${tree.dir.replace(/next$/, 'latest')}/`),
    }
  }
  if (path.startsWith('docs/classic/')) {
    return {
      text: 'You are reading the docs for Wanaku Classic, the deprecated Java-based Wanaku 0.2.',
      linkText: 'Read the docs for the latest release of Wanaku, the Governed Action Proxy.',
      link: withBase('/docs/latest/'),
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

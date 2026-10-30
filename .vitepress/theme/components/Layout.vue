<script setup>
import DefaultTheme from 'vitepress/theme'
import NotFound from './NotFound.vue'
import VersionBanner from './VersionBanner.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <VersionBanner />
    </template>
    <template #not-found>
      <NotFound />
    </template>
  </Layout>
</template>

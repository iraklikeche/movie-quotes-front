<template>
  <ErrorView :header="$t('texts.whoops')" :text="$t('texts.error_text')" :component="NotFound" />
</template>

<script setup>
import ErrorView from '@/views/errors/ErrorView.vue'
import NotFound from '@/components/icons/NotFound.vue'
</script>

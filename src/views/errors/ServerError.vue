<template>
  <ErrorView
    :header="$t('texts.server_error')"
    :text="$t('texts.server_error_text')"
    :component="ServerError"
  />
</template>

<script setup>
import ErrorView from '@/views/errors/ErrorView.vue'
import ServerError from '@/components/icons/ServerError.vue'
</script>

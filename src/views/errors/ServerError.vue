<template>
  <ErrorView
    header="You shall not pass!"
    text="Sorry, but  you don’t have permission to access this page"
    :component="ServerError"
  />
</template>

<script setup>
import ErrorView from '@/views/errors/ErrorView.vue'
import ServerError from '@/components/icons/ServerError.vue'
</script>

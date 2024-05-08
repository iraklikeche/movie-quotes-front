<template>
  <ErrorView
    header="Whooops!"
    text="We can't not see the page you are looking for!"
    :component="NotFound"
  />
</template>

<script setup>
import ErrorView from '@/views/errors/ErrorView.vue'
import NotFound from '@/components/icons/NotFound.vue'
</script>

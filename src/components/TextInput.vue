<template>
  <div class="relative">
    <Field
      :name="name"
      class="bg-transparent border border-custom-light-gray px-4 py-3 rounded-md w-full text-white placeholder:text-white pr-5"
      type="text"
      :placeholder="placeholder"
    />
    <span class="absolute right-0 -translate-x-1/2 translate-y-1/2 text-custom-light-gray">{{
      label
    }}</span>
    <ErrorMessage :name="name" class="text-red-500" />
  </div>
</template>

<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate'

defineProps<{
  name: string
  placeholder: string
  label: string
}>()
</script>

<template>
  <div class="p-2 bg-transparent border border-border-gray border-opacity-60 rounded-md flex gap-1">
    <label class="text-custom-gray whitespace-nowrap">{{ label }}</label>
    <Field
      :name="name"
      :as="'textarea'"
      class="bg-transparent border-none outline-none text-white w-full"
    />
  </div>
  <ErrorMessage :name class="text-red-500" />
</template>

<script setup>
import { Field, ErrorMessage } from 'vee-validate'
import { defineProps } from 'vue'

defineProps({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="p-2 bg-transparent border border-border-gray border-opacity-60 rounded-md flex gap-1">
    <label class="text-custom-gray">{{ label }}:</label>
    <Field
      :name="name"
      :as="'textarea'"
      class="bg-transparent border-none outline-none text-white"
    />
  </div>
</template>

<script setup>
import { Field } from 'vee-validate'
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

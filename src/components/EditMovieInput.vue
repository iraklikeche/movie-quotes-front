<template>
  <div
    class="inline-block p-2 bg-transparent border border-border-gray border-opacity-60 rounded-md text-custom-gray text-opacity-60"
  >
    <label class="text-custom-gray">{{ label }}</label>
    <Field :name="name" :type="type" class="bg-transparent border-none outline-none text-white" />
  </div>
</template>

<script setup>
import { Field } from 'vee-validate'
import { defineProps } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  }
})
</script>

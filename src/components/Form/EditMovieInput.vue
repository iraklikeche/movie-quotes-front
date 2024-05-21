<template>
  <div>
    <div
      class="inline-block p-2 bg-transparent border border-border-gray border-opacity-60 rounded-md text-custom-gray text-opacity-60 w-full"
    >
      <label class="text-custom-gray">{{ label }}</label>
      <Field
        :name="name"
        :type="type"
        class="bg-transparent border-none outline-none text-white"
        rules="required"
      />
    </div>
    <ErrorMessage :name class="text-red-500" />
  </div>
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
  },
  type: {
    type: String,
    default: 'text'
  }
})
</script>

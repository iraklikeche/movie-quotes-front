<template>
  <div class="flex items-center flex-col pt-20 min-h-screen bg-gray-900 fixed">
    <h2 class="text-white text-2xl font-semibold mb-3">{{ props.header }}</h2>
    <p class="text-sm mb-4 text-[#6c757d] text-center w-[70%]">{{ props.paragraph }}</p>
    <div class="text-white rounded-lg w-full max-w-sm p-6">
      <slot />

      <p class="mt-4 text-center text-sm">
        {{ props.secondaryParagraph }}
        <button class="text-[#0d6efd] underline">
          {{ sessionButton }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  header: {
    type: String,
    required: true
  },
  paragraph: {
    type: String,
    required: true
  },
  secondaryParagraph: {
    type: String
  },
  sessionButton: {
    type: String
  }
})
</script>

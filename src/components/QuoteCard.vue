<template>
  <div class="bg-[#09101c] px-8 py-4 rounded-xl">
    <div class="flex items-center gap-4">
      <ProfileImage :imageClass="'w-10 h-10 rounded-full'" />

      <span class="text-white">{{ quote.user.username }}</span>
    </div>
    <div class="flex flex-col gap-2 mt-2 border-b border-border-gray border-opacity-30 pb-4">
      <p class="text-white">
        {{ quote.content.en }}, movie - {{ quote.movie.name.en }}. ({{ quote.movie.year }})
      </p>
      <img :src="quote.image_url" class="rounded-xl w-full max-h-52 sm:max-h-[31rem]" alt="" />

      <QuoteStats :quote="quote" />
    </div>

    <QuoteComments :quoteId="quote.id" />
  </div>
</template>

<script setup lang="ts">
import ProfileImage from './../components/ProfileImage.vue'

import type { Quote } from '@/types'
import QuoteStats from './QuoteStats.vue'
import QuoteComments from './QuoteComments.vue'

defineProps<{
  quote: Quote
}>()
const emit = defineEmits(['quote-selected'])

const selectQuote = () => {
  emit('quote-selected', quote.id)
}
</script>

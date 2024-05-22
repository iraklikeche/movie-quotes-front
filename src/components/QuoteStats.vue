<template>
  <div class="flex gap-6 mt-2">
    <div class="flex gap-2 items-center">
      <span class="text-white">{{ quote.comments.length === 0 ? 0 : quote.comments.length }}</span>
      <MessageIcon />
    </div>
    <div class="flex gap-2 items-center">
      <span class="text-white">{{ quote.likes_count }}</span>
      <button @click="like(quote.id)">
        <LikeIcon :liked="quote.liked_by_user" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageIcon from '@/components/icons/MessageIcon.vue'
import LikeIcon from '@/components/icons/LikeIcon.vue'
import type { Quote } from '@/types'
import { useQuoteStore } from '@/stores/QuoteStore'

const quoteStore = useQuoteStore()
defineProps<{
  quote: Quote
}>()
const like = (quoteId: number) => {
  quoteStore.toggleQuoteLike(quoteId)
}
</script>

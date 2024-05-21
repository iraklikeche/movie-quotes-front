<template>
  <div class="flex gap-6 mt-2">
    <div class="flex gap-2 items-center">
      <!-- <span class="text-white">{{ quote.comments.length === 0 ? 0 : quote.comments.length }}</span> -->
      <span class="text-white">{{ quoteStore.getQuoteCommentsLength(quote.id) }}</span>

      <MessageIcon />
    </div>
    <div class="flex gap-2 items-center">
      <!-- <span class="text-white">{{ quote.likes_count }}</span> -->
      <span class="text-white">{{ quoteStore.getQuoteLikesCount(quote.id) }}</span>

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
const props = defineProps<{
  quote: Quote
}>()
const like = (quoteId: number) => {
  quoteStore.toggleQuoteLike(quoteId)
}
</script>

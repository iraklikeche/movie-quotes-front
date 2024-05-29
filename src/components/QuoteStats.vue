<template>
  <div class="flex gap-6 mt-2">
    <div class="flex gap-2 items-center">
      <span class="text-white">{{ quote.comments_count }}</span>
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
import type { Quote, QuoteLikedEvent, QuoteUnlikedEvent, QuoteCommentedEvent } from '@/types'
import { useQuoteStore } from '@/stores/QuoteStore'
import { onMounted } from 'vue'
const quoteStore = useQuoteStore()
const props = defineProps<{
  quote: Quote
}>()

console.log(props.quote)
const like = (quoteId: number) => {
  quoteStore.toggleQuoteLike(quoteId)
}

onMounted(() => {
  const channel = window.Echo.channel('quote.' + props.quote.id)
  channel.listen('QuoteLiked', (event: QuoteLikedEvent) => {
    console.log(event)
    quoteStore.updateLikeCount(event.quote.id, event.likeCount)
  })
  channel.listen('QuoteUnliked', (event: QuoteUnlikedEvent) => {
    quoteStore.updateLikeCount(event.quote.id, event.likeCount)
  })
  channel.listen('QuoteCommented', (event: QuoteCommentedEvent) => {
    console.log('event', event)
    quoteStore.updateCommentCount(event.quote.id, event.commentCount)
    quoteStore.updateQuoteComments(event.quote.id, event.comment)
  })
})
</script>

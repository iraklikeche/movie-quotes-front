<template>
  <div class="flex gap-6 mt-2">
    <div class="flex gap-2 items-center">
      <span class="text-white">{{ commentCount }}</span>
      <MessageIcon />
    </div>
    <div class="flex gap-2 items-center">
      <span class="text-white">{{ likeCount }}</span>
      <button @click="toggleQuoteLike(quote.id)">
        <LikeIcon :liked="likedByUser" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageIcon from '@/components/icons/MessageIcon.vue'
import LikeIcon from '@/components/icons/LikeIcon.vue'
import type {
  Quote,
  QuoteLikedEvent,
  QuoteUnlikedEvent,
  QuoteCommentedEvent,
  PartialQuote
} from '@/types'
import { useQuoteStore } from '@/stores/QuoteStore'
import { onMounted, ref } from 'vue'
import { toggleLike } from '@/service/movieService'
const quoteStore = useQuoteStore()
const props = defineProps<{
  quote: Quote
}>()

const likeCount = ref<number>(0)
const likedByUser = ref<boolean>(false)
const commentCount = ref<number>(0)

const toggleQuoteLike = async (quoteId: number) => {
  try {
    const response = await toggleLike(quoteId)
    likeCount.value = response.data.like_count
    likedByUser.value = response.data.liked_by_user
  } catch (error) {
    console.error('Failed to toggle like:', error)
  }
}

const updateLikeCount = (quote: PartialQuote) => {
  if (quote.likes_count !== undefined) {
    likeCount.value = quote.likes_count
  }
}
onMounted(() => {
  likeCount.value = props.quote.likes_count
  likedByUser.value = props.quote.liked_by_user
  commentCount.value = props.quote.comments_count
  const channel = window.Echo.channel('quote.' + props.quote.id)
  channel.listen('QuoteLiked', (event: QuoteLikedEvent) => {
    updateLikeCount(event.quote)
  })
  channel.listen('QuoteUnliked', (event: QuoteUnlikedEvent) => {
    updateLikeCount(event.quote)
  })
  channel.listen('QuoteCommented', (event: QuoteCommentedEvent) => {
    if (event.quote.comments_count !== undefined) {
      commentCount.value = event.quote.comments_count
    }
    quoteStore.updateCommentCount(event.quote.id, event.commentCount)
    quoteStore.updateQuoteComments(event.quote.id, event.comment)
  })
})
</script>

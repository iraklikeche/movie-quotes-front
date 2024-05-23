<template>
  <div>
    <h3>Notifications</h3>
    <ul class="text-white">
      <li>Hello World!</li>
      <li v-for="notification in notifications" :key="notification.id">
        {{ notification.message }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useQuoteStore } from '@/stores/QuoteStore'
import { ref, onMounted, watch } from 'vue'

const quoteStore = useQuoteStore()
const notifications = ref<{ id: number; message: string }[]>([])
watch(
  () => quoteStore.likeId,
  (newLikeId) => {
    // console.log('likeId changed:', newLikeId)
    if (newLikeId !== null) {
      // console.log('Listening to quote channel')
      window.Echo.channel('quote.' + newLikeId).listen('QuoteLiked', (event: any) => {
        console.log('Received QuoteLiked event', event)
        notifications.value.push({
          id: event.quote.id,
          message: event.message
        })
        console.log('Updated notifications:', notifications.value)
      })
    }
  }
)
onMounted(() => {
  console.log('Listening to quote channel')
  window.Echo.channel('quote.' + quoteStore.likeId).listen('QuoteLiked', (event: any) => {
    console.log('Received QuoteLiked event', event)
    notifications.value.push({
      id: event.quote.id,
      message: event.message
    })
    console.log('Updated notifications:', notifications.value)
  })
})
</script>

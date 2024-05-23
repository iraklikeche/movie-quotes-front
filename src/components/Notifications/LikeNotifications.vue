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
import { ref, onMounted } from 'vue'

const quoteId = 29

const notifications = ref<{ id: number; message: string }[]>([])

onMounted(() => {
  console.log('Listening to quote channel')

  window.Echo.channel('quote.' + quoteId).listen('QuoteLiked', (event: any) => {
    console.log('Received QuoteLiked event', event)
    notifications.value.push({
      id: event.quote.id,
      message: event.message
    })
    console.log('Updated notifications:', notifications.value)
  })
})

</script>

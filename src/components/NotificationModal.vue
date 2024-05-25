<!-- THIS IS MODAL TEMPLATE, SO FAR IT IS JUST FOR TESTING, I WILL KEEP IT LIKE THIS IF IT IS OKAY -->

<!-- <div
    class="absolute inset-0 flex items-start justify-center z-50"
    @click.self="closeNotification"
  >
    <div
      class="relative mt-2 bg-black text-white rounded-lg shadow-lg w-10 sm:w-80 p-8 min-w-[60rem] top-20 -right-[22%] z-50 h-full sm:h-auto"
    > -->
<!-- <div class="absolute -top-3 right-[23.5rem] sm:right-[7.8rem] w-8 h-12 bg-black rotate-45"></div> -->

<!-- </div>
</div> -->

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold">Notifications</h3>
      <button class="text-sm text-gray-400 hover:underline">Mark all as read</button>
    </div>
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="flex items-center mb-3 p-4 border border-border-gray gap-4 border-opacity-30 rounded-md"
    >
      <img
        :src="notification.data.user.profile_image_url"
        alt="avatar"
        class="w-20 h-20 rounded-full mr-3"
      />
      <div class="flex-grow text-white">
        <div class="font-semibold">{{ notification.data.user.username }}</div>
        <div class="text-sm">{{ notification.data.message }}</div>
      </div>
      <div class="text-right text-gray-400 text-sm">
        <div>2 min ago</div>
        <div class="text-[#198754]" v-if="!notification.read_at">New</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuoteStore } from '@/stores/QuoteStore'
import { getNotifications } from '@/service/movieService'
import { getUser } from '@/service/authService'
type Notification = {
  id: number
  data: {
    user: {
      username: string
      profile_image_url: string
    }
    message: string
  }
  read_at: string | null
  time: string
}
const quoteStore = useQuoteStore()

const notifications = ref<Notification[]>([])

onMounted(async () => {
  const userId = await getUser()
  const id = userId.data.data.id
  console.log(id)
  const res = await getNotifications()
  notifications.value = res.data
  console.log('notification coming from DB', notifications.value)

  window.Echo.channel('App.Models.User.' + id).listen('QuoteLiked', (event: any) => {
    console.log('event', event)
    notifications.value.push({
      id: event.quote.id,
      data: {
        message: event.message,
        user: {
          username: event.user.username,
          profile_image_url: event.user.profile_image_url
        }
      },
      read_at: event.read_at,
      time: event.time
    })
    quoteStore.updateLikeCount(event.quote.id, event.likeCount)
  })

  window.Echo.channel('App.Models.User.' + id).listen('QuoteCommented', (event: any) => {
    notifications.value.push({
      id: event.comment.id,
      data: {
        message: event.message,
        user: {
          username: event.user.username,
          profile_image_url: event.user.profile_image_url
        }
      },
      read_at: null,
      time: event.time
    })
    quoteStore.updateCommentCount(event.comment.quote_id, event.commentCount)
  })
})
</script>

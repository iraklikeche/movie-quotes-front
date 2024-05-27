<template>
  <div
    class="absolute inset-0 flex items-start justify-center z-50"
    @click.self="closeNotification"
  >
    <div
      class="relative mt-2 bg-black text-white rounded-lg shadow-lg sm:w-80 p-8 w-full sm:min-w-[60rem] top-20 -right-[22%] z-50 h-full sm:h-auto"
    >
      <div
        class="absolute -top-3 right-[23.5rem] sm:right-[7.8rem] w-8 h-12 bg-black rotate-45"
      ></div>
      <div v-if="notifications.length > 0" class="max-h-[40rem] overflow-y-scroll">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">Notifications</h3>
          <button class="text-sm text-gray-400 hover:underline" @click="markAllAsRead">
            Mark all as read
          </button>
        </div>
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="flex items-center mb-3 p-4 border border-border-gray gap-4 border-opacity-30 rounded-md cursor-pointer"
          @click="markAsRead(notification.id)"
        >
          <img
            :src="notification.data.user.profile_image_url"
            alt="avatar"
            class="w-20 h-20 rounded-full mr-3"
          />
          <div class="flex-grow text-white">
            <div class="font-semibold">{{ notification.data.user.username }}</div>
            <div class="flex gap-2 mt-2">
              <div v-if="notification.data.reacted">
                <ReactIcon />
              </div>
              <div v-if="notification.data.commented">
                <QuotesIcon />
              </div>

              {{ notification.data.message }}
            </div>
          </div>
          <div class="text-right text-gray-400 text-sm">
            <div>{{ formatTime(notification.created_at) }}</div>
            <div class="text-[#198754]" v-if="!notification.read_at">New</div>
          </div>
        </div>
      </div>
      <div v-else class="text-white flex text-xl font-bold items-center justify-center">
        No notifications
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ReactIcon from './icons/ReactIcon.vue'
import QuotesIcon from './icons/QuotesIcon.vue'
import { useNotificationStore } from '@/stores/NotificationStore'
import { storeToRefs } from 'pinia'
import { markAllNotificationsAsRead, markNotificationAsRead } from '@/service/movieService'
import { useTimeFormat } from '@/composables/useTimeFormat'

const emit = defineEmits(['closeNotification'])
const closeNotification = () => emit('closeNotification')
defineProps<{ showNotifications: boolean }>()

const { formatTime } = useTimeFormat()

const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)

onMounted(async () => {
  await notificationStore.fetchNotifications()
  console.log(notifications.value)
})

const markAllAsRead = async () => {
  await markAllNotificationsAsRead()
  notifications.value.forEach((notification) => {
    notification.read_at = new Date().toISOString()
  })
}

const markAsRead = async (id: number) => {
  await markNotificationAsRead(id)
  const notification = notifications.value.find((notification) => notification.id === id)
  if (notification) {
    notification.read_at = new Date().toISOString()
  }
}
</script>

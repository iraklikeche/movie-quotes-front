<template>
  <div class="fixed inset-0 flex items-start justify-center" @click.self="closeNotification">
    <div
      class="relative mt-2 bg-black text-white rounded-lg shadow-lg sm:w-80 p-8 w-full sm:min-w-[60rem] z-50 min-h-screen sm:min-h-0 sm:h-auto top-20 sm:-right-[22%]"
    >
      <div class="absolute -top-3 right-4 sm:right-[7.8rem] w-8 h-12 bg-black rotate-45"></div>
      <div v-if="notifications.length > 0" class="max-h-[40rem] overflow-y-scroll">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">{{ $t('texts.notifications') }}</h3>
          <button class="text-sm text-gray-400 underline" @click="markAllAsRead">
            {{ $t('texts.mark-all') }}
          </button>
        </div>
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="flex items-center mb-3 p-4 border border-border-gray gap-4 border-opacity-30 rounded-md cursor-pointer"
          @click="handleNotificationClick(notification)"
        >
          <div class="flex flex-col items-center">
            <img
              :src="notification.data.user.profile_image_url"
              alt="avatar"
              class="w-20 h-14 rounded-full sm:mr-3"
            />
            <div class="text-[#198754] sm:hidden" v-if="!notification.read_at">
              {{ $t('texts.new') }}
            </div>
          </div>
          <div class="flex-grow text-white">
            <div class="font-semibold">{{ notification.data.user.username }}</div>
            <div class="flex gap-2 mt-2">
              <div v-if="notification.data.reacted">
                <ReactIcon />
              </div>
              <div v-if="notification.data.commented">
                <QuotesIcon />
              </div>
              {{ notification.data.message[typedLocale as any] }}
            </div>
            <div class="sm:hidden">{{ formatTime(notification.time) }}</div>
          </div>
          <div class="text-right text-gray-400 text-sm hidden sm:block">
            <div>{{ formatTime(notification.created_at) }}</div>
            <div class="text-[#198754]" v-if="!notification.read_at">{{ $t('texts.new') }}</div>
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
import ReactIcon from './icons/ReactIcon.vue'
import QuotesIcon from './icons/QuotesIcon.vue'
import {
  getSingleQuote,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from '@/service/movieService'
import { useTimeFormat } from '@/composables/useTimeFormat'
import type { Notification } from '@/types'
import { useI18n } from 'vue-i18n'
type Locale = 'en' | 'ka'

const { locale } = useI18n()
const typedLocale = locale.value as Locale

const emit = defineEmits(['closeNotification', 'openModal', 'updateCount'])
const closeNotification = () => emit('closeNotification')
const props = defineProps<{ showNotifications: boolean; notifications: Notification[] }>()

const { formatTime } = useTimeFormat()

const markAllAsRead = async () => {
  await markAllNotificationsAsRead()
  props.notifications.forEach((notification) => {
    notification.read_at = new Date().toISOString()
  })
}

const markAsRead = async (id: number) => {
  await markNotificationAsRead(id)
  const notification = props.notifications.find((notification) => notification.id === id)
  if (notification) {
    notification.read_at = new Date().toISOString()
  }
}

const handleNotificationClick = async (notification: any) => {
  console.log(notification)
  const res = await getSingleQuote(notification.data.quote.id)

  notification.value = res.data
  emit('openModal', notification.value)

  await markAsRead(notification.id)
}
</script>

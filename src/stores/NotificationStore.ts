import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getNotifications } from '@/service/movieService'
import { getUser } from '@/service/authService'
import type { Notification } from '@/types'

export const useNotificationStore = defineStore('notificationStore', () => {
  const notifications = ref<Notification[]>([])

  const fetchedNotifications = ref(false)

  const handleNotificationEvent = (event: any) => {
    const additionalData: any = {}

    if (event.reacted) {
      additionalData.reacted = event.reacted
    }

    if (event.commented) {
      additionalData.commented = event.commented
    }

    notifications.value.unshift({
      id: event.id,
      data: {
        message: event.message,
        user: {
          id: event.user.id,
          username: event.user.username,
          profile_image_url: event.user.profile_image_url
        },
        quote: {
          id: event.quote.id
        },
        ...additionalData
      },
      created_at: event.created_at,
      read_at: event.read_at ?? null,
      time: event.time
    })
  }

  const fetchNotifications = async () => {
    if (!fetchedNotifications.value) {
      const userId = await getUser()
      const id = userId.data.data.id
      const res = await getNotifications()
      notifications.value = res.data

      window.Echo.channel('App.Models.User.' + id).listen(
        '.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated',
        (event: any) => {
          handleNotificationEvent(event)
        }
      )

      fetchedNotifications.value = true
    }
  }

  return {
    notifications,
    fetchedNotifications,
    fetchNotifications
  }
})

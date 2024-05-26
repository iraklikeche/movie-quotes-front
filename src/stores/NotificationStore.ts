import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getNotifications } from '@/service/movieService'
import { getUser } from '@/service/authService'

export const useNotificationStore = defineStore('notificationStore', () => {
  type Notification = {
    id: number
    data: {
      user: {
        username: string
        profile_image_url: string
      }
      message: string
      reacted?: boolean
      commented?: boolean
    }
    read_at: string | null
    time: string
  }
  const notifications = ref<Notification[]>([])
  const fetchedNotifications = ref(false)

  const fetchNotifications = async () => {
    if (!fetchedNotifications.value) {
      const userId = await getUser()
      const id = userId.data.data.id
      const res = await getNotifications()
      notifications.value = res.data

      window.Echo.channel('App.Models.User.' + id).listen('QuoteLiked', (event: any) => {
        console.log(event)
        notifications.value.unshift({
          id: event.quote.id,

          data: {
            message: event.message,
            user: {
              username: event.user.username,
              profile_image_url: event.user.profile_image_url
            },
            reacted: event.reacted
          },
          read_at: event.read_at,
          time: event.time
        })
        console.log(notifications.value)
      })

      window.Echo.channel('App.Models.User.' + id).listen('QuoteCommented', (event: any) => {
        console.log(event)
        notifications.value.unshift({
          id: event.comment.id,
          data: {
            message: event.message,
            user: {
              username: event.user.username,
              profile_image_url: event.user.profile_image_url
            },
            commented: event.commented
          },
          read_at: null,
          time: event.time
        })
      })
      console.log(notifications.value)
      fetchedNotifications.value = true
    }
  }

  return {
    notifications,
    fetchedNotifications,
    fetchNotifications
  }
})

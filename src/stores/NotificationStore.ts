import { getNotifications } from '@/service/movieService'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notificationStore', () => {
  const notifications = ref([])

  const fetchNotifications = async () => {
    const res = await getNotifications()
    notifications.value = res.data

    console.log(notifications.value)
  }
  return { notifications, fetchNotifications }
})

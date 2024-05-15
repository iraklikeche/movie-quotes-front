<template>
  <div>
    <h1 v-if="userSession.loading" class="animate-pulse text-red-500">LOADING</h1>

    <img
      v-else-if="userSession.userData.profile_image"
      :src="userSession.userData.profile_image"
      :class="`${imageClass} ${$route.path === '/profile' ? 'border-red-600' : 'border-none'}`"
    />
    <img
      v-else
      src="https://picsum.photos/200"
      :class="`${imageClass} ${$route.path === '/profile' ? 'border-red-600' : 'border-none'}`"
    />
  </div>
</template>

<script setup>
import { useUserSessionStore } from '@/stores/UserSessionStore'

const userSession = useUserSessionStore()
const props = defineProps({
  loadingClass: {
    type: String,
    default: 'text-red-500 text-3xl'
  },
  imageClass: {
    type: String,
    default: 'w-14 h-14 rounded-full border-2'
  }
})
</script>

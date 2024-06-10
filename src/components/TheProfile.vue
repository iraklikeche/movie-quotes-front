<template>
  <div>
    <h1 v-if="userSession.loading" class="animate-pulse text-red-500">LOADING</h1>
    <div v-else>
      <ProfileImage :imageClass="imageClass" />
    </div>
  </div>
</template>

<script setup>
import ProfileImage from './ProfileImage.vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'

const userSession = useUserSessionStore()
defineProps({
  loadingClass: {
    type: String,
    default: 'text-red-500 text-3xl'
  },
  imageClass: {
    type: String,
    default: 'w-16 h-16 rounded-full border-2'
  }
})
</script>

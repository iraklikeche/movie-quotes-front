<template>
  <div>
    <img
      v-if="userSession.userData.profile_image"
      :src="userSession.userData.profile_image"
      :class="computedImageClass"
    />
    <img v-else src="https://picsum.photos/200" :class="computedImageClass" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserSessionStore } from '@/stores/UserSessionStore'

const userSession = useUserSessionStore()
const route = useRoute()

const props = defineProps({
  imageClass: {
    type: String,
    default: 'w-14 h-14 rounded-full border-2'
  }
})

const computedImageClass = computed(() => {
  return `${props.imageClass} ${route.path === '/profile' ? 'border-red-600' : 'border-none'}`
})
</script>

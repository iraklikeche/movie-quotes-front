<template>
  <div class="flex items-center flex-col pt-16 min-h-screen bg-gray-900 fixed">
    <div @click="userSession.closeModal">CLOSE</div>
    <h2 class="text-white text-2xl font-semibold mb-3">{{ props.header }}</h2>
    <p class="text-sm mb-4 text-[#6c757d] text-center w-[70%]">{{ props.paragraph }}</p>
    <div class="text-white rounded-lg w-full max-w-sm p-6">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'

const userSession = useUserSessionStore()
interface Props {
  header: string
  paragraph: string
  secondaryParagraph?: string
  sessionButton?: string
}

const props = defineProps<Props>()
</script>

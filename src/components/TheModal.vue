<template>
  <div
    class="fixed inset-0 overflow-hidden h-full w-full backdrop-blur-sm flex overflow-y-auto z-50 sm:pt-32"
    id="my-modal"
  >
    <div
      class="relative mx-auto sm:px-24 bg-[#222030] flex flex-col w-full h-full sm:max-w-[37rem] sm:max-h-[45rem]"
    >
      <div @click="userSession.closeModal" class="text-center pt-12">CLOSE</div>
      <div class="">
        <div class="flex flex-col gap-2 items-center mt-4">
          <h2 class="text-white text-2xl font-semibold">{{ props.header }}</h2>
          <p class="text-sm mb-4 text-[#6c757d] text-center">{{ props.paragraph }}</p>
        </div>
        <div class="px-7">
          <slot />
        </div>
      </div>
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

<template>
  <div
    id="popup-modal"
    tabindex="-1"
    class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen sm:h-[calc(100%-1rem)] max-h-full flex backdrop-blur-sm"
  >
    <div class="relative w-full max-w-xl h-full sm:h-auto sm:max-h-full bg-[#222030] sm:rounded-lg">
      <div class="relative bg-[#222030] sm:rounded-lg">
        <div class="sm:p-4 md:p-5 flex flex-col items-center gap-3 justify-center">
          <button @click="userSession.closeModal" class="text-center">
            <CloseBtn />
          </button>
          <div class="w-full px-12">
            <div class="flex flex-col gap-2 items-center">
              <h2 class="text-white text-2xl font-semibold">{{ props.header }}</h2>
              <p class="text-sm mb-4 text-custom-light-gray text-center">{{ props.paragraph }}</p>
            </div>
            <div class="sm:px-7">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import CloseBtn from '@/components/icons/CloseBtn.vue'

const userSession = useUserSessionStore()
type Props = {
  header: string
  paragraph: string
  secondaryParagraph?: string
  sessionButton?: string
}

const props = defineProps<Props>()
</script>

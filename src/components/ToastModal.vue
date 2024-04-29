<template>
  <div
    id="popup-modal"
    tabindex="-1"
    class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex backdrop-blur-sm"
  >
    <div class="relative p-4 w-full max-w-xl max-h-full">
      <div class="relative bg-[#222030] rounded-lg shadow px-12 py-12">
        <div class="p-4 md:p-5 flex flex-col items-center gap-3 justify-center">
          <component :is="dynamicIcon" />
          <h2 class="text-3xl text-white">
            {{ props.mainMessage }}
          </h2>
          <h3 class="mb-5 text-lg font-normal text-white text-center">
            {{ props.subMessage }}
          </h3>
          <div class="w-full flex items-center justify-center px-6">
            <button
              data-modal-hide="popup-modal"
              type="button"
              @click="props.buttonAction"
              class="text-white w-full bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {{ props.buttonText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { resolveComponent, computed } from 'vue'

const props = defineProps({
  icon: String,
  mainMessage: String,
  subMessage: String,
  buttonText: String,
  buttonAction: Function
})

const dynamicIcon = computed(() => {
  return resolveComponent(props.icon)
})
</script>

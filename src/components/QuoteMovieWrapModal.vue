<template>
  <div
    id="popup-modal"
    v-if="showModal"
    tabindex="-1"
    @click="handleCloseModal"
    class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen sm:h-[calc(100%-1rem)] max-h-full flex backdrop-blur-sm"
  >
    <div
      ref="modalContent"
      class="relative w-full max-w-xl h-full sm:h-auto sm:max-h-full bg-[#222030] sm:bg-[#11101A] sm:rounded-lg sm:min-w-[60rem] sm:pb-12"
    >
      <div
        class="flex items-center justify-between gap-24 py-4 sm:py-6 pt-6 border-b px-8 border-border-gray border-opacity-40"
      >
        <div></div>
        <div>
          <p class="text-white">{{ title }}</p>
        </div>
        <div @click="closeModal">
          <CloseBtn />
        </div>
      </div>
      <div class="px-8 pt-12 sm:pt-6 bg-[#222030] sm:bg-[#11101A]">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import CloseBtn from '@/components/icons/CloseBtn.vue'

defineProps<{
  showModal: boolean
  title: string
}>()

const emit = defineEmits(['update:showModal'])
const modalContent = ref<HTMLElement | null>(null)

const handleCloseModal = (event: MouseEvent) => {
  if (!modalContent.value?.contains(event.target as Node)) {
    emit('update:showModal', false)
  }
}

const closeModal = () => {
  emit('update:showModal', false)
}
</script>

<template>
  <div>
    <div
      class="mt-4"
      v-if="!localFile"
      @dragover.prevent="onDragOver"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop"
    >
      <input type="file" id="file-upload" style="display: none" @change="handleFileChange" />
      <label
        for="file-upload"
        class="flex justify-between sm:justify-normal sm:gap-2 items-center border border-border-gray border-opacity-60 px-4 py-5 cursor-pointer"
      >
        <div class="flex items-center gap-4">
          <ImageIcon />
          <span class="text-white sm:hidden">{{ $t('texts.upload') }}</span>
          <span class="text-white hidden sm:block">{{ $t('texts.drag_drop') }}</span>
        </div>
        <div class="bg-[#9747FF] bg-opacity-40 py-2 px-2 rounded-sm">
          <p class="text-white">{{ $t('texts.choose_file') }}</p>
        </div>
      </label>
    </div>
    <div
      v-else
      class="border border-border-gray border-opacity-60 p-4 flex items-center justify-between sm:justify-normal"
    >
      <img v-if="imageUrl" :src="imageUrl" class="w-48 sm:w-1/2 h-28" />
      <input type="file" id="file-upload" style="display: none" @change="handleFileChange" />
      <label
        for="file-upload"
        class="flex flex-col justify-between sm:justify-normal sm:items-center sm:gap-2 px-4 py-5 gap-6 sm:w-1/2"
      >
        <span class="text-white hidden sm:block whitespace-nowrap">{{
          $t('texts.replace_photo')
        }}</span>
        <div class="flex gap-12 sm:gap-4 flex-col sm:flex-row">
          <ImageIcon class="hidden sm:block" />
          <span class="text-white hidden sm:block">{{ $t('texts.drag_drop') }}</span>
        </div>
        <div class="bg-[#9747FF] bg-opacity-40 py-2 px-2 rounded-sm whitespace-nowrap">
          <p class="text-white text-sm">{{ $t('texts.choose_file') }}</p>
        </div>
      </label>
    </div>
    <ErrorMessage name="image" class="text-red-500" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ImageIcon from '@/components/icons/ImageIcon.vue'
import { ErrorMessage } from 'vee-validate'

// Props
const props = defineProps<{
  file: File | null
  imageUrl: string | null
}>()

// Emits
const emit = defineEmits(['file-change'])
const localFile = ref(props.file)
const localImageUrl = ref<string | null>(props.imageUrl)
const isDragging = ref(false)

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    handleFileChange({ target: { files: event.dataTransfer.files } })
  }
}

watch(
  () => props.file,
  (newFile) => {
    localFile.value = newFile
    if (newFile) {
      localImageUrl.value = URL.createObjectURL(newFile)
    } else {
      localImageUrl.value = ''
    }
  }
)

watch(
  () => props.imageUrl,
  (newUrl) => {
    localImageUrl.value = newUrl
  }
)

// Methods
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    const reader = new FileReader()

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target && typeof e.target.result === 'string') {
        localImageUrl.value = e.target.result
      }
    }

    reader.readAsDataURL(file)

    localFile.value = file
    emit('file-change', file)
  }
}
</script>

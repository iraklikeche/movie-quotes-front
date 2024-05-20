<template>
  <div
    class="fixed bg-[#11101A] sm:bg-transparent w-full h-full z-50 sm:flex items-center justify-center overflow-y-scroll pb-10 sm:backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div class="bg-[#11101A] sm:min-w-[60rem]">
      <div
        class="flex justify-between items-center p-8 pb-6 border-b border-border-gray border-opacity-60"
      >
        <div class="flex gap-4 items-center">
          <div v-if="!isEditMode">
            <EditIcon /> <span class="text-custom-gray text-xl font-extralight">|</span>
          </div>
          <button @click="$emit('remove', selectedQuote.id)">
            <DeleteIcon />
          </button>
        </div>
        <h4 class="hidden sm:block text-white">header</h4>
        <button @click="$emit('close')">
          <CloseBtn />
        </button>
      </div>
      <div class="p-8 flex items-center gap-2">
        <img :src="selectedQuote.user.profile_image_url" class="w-12 h-12 rounded-full" />
        <span class="text-white text-xl">{{ selectedQuote.user.username }}</span>
      </div>
      <div class="px-8 py-2">
        <form v-if="isEditMode" @submit.prevent="onSubmit">
          <textarea
            v-model="quoteData.content.en"
            rows="3"
            cols="5"
            class="text-white bg-transparent w-full border border-border-gray border-opacity-10 placeholder:custom-gray italic pl-2 pt-2"
          />
          <textarea
            v-model="quoteData.content.ka"
            rows="3"
            cols="5"
            class="text-white bg-transparent w-full border border-border-gray border-opacity-10 mt-2 placeholder:custom-gray italic pl-2 pt-2"
          />

          <div v-if="isEditMode" class="relative">
            <label for="file-upload" class="flex items-center flex-col">
              <img :src="selectedQuote.image_url" class="w-full rounded-xl sm:h-[32rem]" />
              <input type="file" class="hidden" id="file-upload" @change="handleFileChange" />
              <div
                class="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#191725] bg-opacity-75 z-50 p-5 rounded-md"
              >
                <ImageIcon />
                <span class="text-white">{{ $t('texts.replace_photo') }}</span>
              </div>
            </label>
          </div>
          <div class="mt-2" v-else>
            <img :src="selectedQuote.image_url" class="w-full h-72 rounded-xl" />
          </div>
          <div
            class="flex gap-6 mt-4 border-b border-border-gray opacity-60 pb-4"
            v-if="!isEditMode"
          >
            <div class="flex gap-2 items-center">
              <span class="text-white">
                {{ selectedQuote.comments.length === 0 ? 0 : selectedQuote.comments.length }}
              </span>

              <MessageIcon />
            </div>
            <div class="flex gap-2 items-center">
              <span class="text-white">{{ selectedQuote.like_count }}</span>
              <LikeIcon />
            </div>
          </div>

          <div v-if="isEditMode" class="mt-4 flex justify-end w-full">
            <button class="bg-custom-red px-4 py-2 text-white rounded w-full">Save Changes</button>
          </div>
        </form>
        <div v-else>
          <textarea
            rows="3"
            cols="5"
            class="bg-transparent w-full border border-border-gray border-opacity-10 placeholder:custom-gray italic pl-2 pt-2"
            :placeholder="selectedQuote.content.en"
            disabled
          />

          <textarea
            rows="3"
            cols="5"
            class="bg-transparent w-full border border-border-gray border-opacity-10 mt-2 placeholder:custom-gray italic pl-2 pt-2"
            :placeholder="selectedQuote.content.ka"
            disabled
          />
        </div>

        <div v-if="!isEditMode">COMMENTS!</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageIcon from './icons/ImageIcon.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import CloseBtn from './../components/icons/CloseBtn.vue'
import MessageIcon from '@/components/icons/MessageIcon.vue'
import DeleteIcon from './icons/DeleteIcon.vue'
import LikeIcon from '@/components/icons/LikeIcon.vue'
import { ref } from 'vue'
import { updateQuote } from '@/service/movieService'
import { useForm } from 'vee-validate'
import type { Quote } from '@/types'

const props = defineProps<{
  selectedQuote: Quote
  isEditMode: boolean
}>()
const emit = defineEmits(['close', 'remove', 'quote-updated'])

const quoteData = ref({
  content: {
    en: props.selectedQuote.content.en,
    ka: props.selectedQuote.content.ka || ''
  },
  image: null as File | null
})

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0] || null
  quoteData.value.image = file
}

const { handleSubmit } = useForm()

const onSubmit = handleSubmit(async () => {
  console.log(quoteData.value)
  try {
    const formData = new FormData()
    formData.append('content[en]', quoteData.value.content.en)
    formData.append('content[ka]', quoteData.value.content.ka)
    formData.append('movie_id', props.selectedQuote.movie_id)
    if (quoteData.value.image) {
      formData.append('image', quoteData.value.image)
    }

    await updateQuote(props.selectedQuote.id, formData)
    emit('quote-updated')
    emit('close')
  } catch (error) {
    console.error('Failed to update quote:', error)
  }
})
</script>

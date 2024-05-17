<template>
  <QuoteMovieWrapModal
    :showModal="showModal"
    :title="$t('texts.new_quote')"
    @update:showModal="updateShowModal"
  >
    <div class="px-8 pt-12 bg-[#222030] sm:bg-[#11101A]">
      <div class="flex items-center gap-4 text-white">
        <img
          :src="userSession.userData.profile_image"
          class="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2"
        />
        <p class="text-xl">{{ userSession.userData.username }}</p>
      </div>

      <form @submit.prevent="onSubmit" class="mt-8">
        <div class="relative">
          <textarea
            v-model="formData.content.en"
            class="bg-transparent border border-border-gray border-opacity-60 w-full py-2 px-4 placeholder:text-[#6C757D] italic text-white outline-none"
            cols="5"
            rows="3"
            placeholder="Start create new quote"
            @input="clearError('content.en')"
          />
          <span class="absolute right-0 -translate-x-[50%] translate-y-[50%] text-white">Eng</span>
          <ErrorMessage name="content.en" class="text-red-500" />
        </div>

        <div class="relative mt-4">
          <textarea
            v-model="formData.content.ka"
            class="bg-transparent text-white border border-border-gray border-opacity-60 w-full py-2 px-4 placeholder:text-[#6C757D] italic outline-none"
            cols="5"
            rows="3"
            placeholder="ახალი ციტატა"
            @input="clearError('content.ka')"
          />
          <span class="absolute right-0 -translate-x-[50%] translate-y-[100%] text-white">ქარ</span>
          <ErrorMessage name="content.ka" class="text-red-500" />
        </div>
        <ImageUpload :file="file" :imageUrl="imageUrl" @file-change="onFileChange" />

        <TheDropdown
          :items="movies"
          :selectedItems="selectedMovie ? [selectedMovie] : []"
          placeholder="აირჩიეთ ფილმი"
          :error="dropDownError"
          @update:selectedItems="updateSelectedMovie"
          @clearError="clearError('movie_id')"
          displayKey="movie_name"
        />

        <div class="bg-[#E31221] flex items-center justify-center mt-8 py-3 rounded-md">
          <button type="submit" class="text-xl text-white w-full">{{ $t('texts.post') }}</button>
        </div>
      </form>
    </div>
  </QuoteMovieWrapModal>
</template>

<script setup lang="ts">
import ImageUpload from './ImageUpload.vue'

import { useUserSessionStore } from '@/stores/UserSessionStore'
import { ref, watch, onMounted, reactive } from 'vue'
import { useModal } from '@/composables/useModal'
import type { Ref } from 'vue'
import { createQuote, getMovies } from '@/service/movieService'
import { useForm, ErrorMessage } from 'vee-validate'
import QuoteMovieWrapModal from './QuoteMovieWrapModal.vue'
import TheDropdown from './TheDropdown.vue'

const props = defineProps<{
  showModal: boolean
}>()

type Movie = {
  id: number
  movie_name: string
}

const errors = reactive<Record<string, string>>({})

const { handleSubmit, setFieldError } = useForm()
const userSession = useUserSessionStore()
const { showModal: internalShowModal, closeModal, openModal } = useModal()

const emit = defineEmits(['update:showModal', 'quote-added'])
const isMovies: Ref<boolean> = ref(false)
const selectedMovie: Ref<Movie | null> = ref(null)
const movies = ref<Movie[]>([])
const file: Ref<File | null> = ref(null)
const imageUrl: Ref<string | null> = ref(null)
const dropDownError = ref(null)

const formData = ref({
  content: {
    en: '',
    ka: ''
  },
  movie_id: null as number | null,
  image: null as File | null
})

const clearError = (field: string) => {
  if (field === 'content.en' || field === 'content.ka') {
    setFieldError(field, undefined)
  }
  if (field === 'image') {
    setFieldError(field, undefined)
  }
  if (field === 'movie_id') {
    dropDownError.value = null
  }
}

const onFileChange = (newFile: File) => {
  file.value = newFile
  if (newFile) {
    imageUrl.value = URL.createObjectURL(newFile)
    formData.value.image = newFile
  } else {
    imageUrl.value = ''
    formData.value.image = null
  }
  clearError('image')
}

const updateSelectedMovie = (newMovie: Movie[]) => {
  console.log(newMovie)
  selectedMovie.value = newMovie[0] || null
  formData.value.movie_id = newMovie[0]?.id || null
}

const resetFields = () => {
  formData.value = {
    content: {
      en: '',
      ka: ''
    },
    movie_id: null,
    image: null
  }
  file.value = null
  imageUrl.value = null
  selectedMovie.value = null
  isMovies.value = false
}

const updateShowModal = (value: boolean) => {
  emit('update:showModal', value)
  internalShowModal.value = value
}

// LIFECYCLES/WATCHERS
onMounted(async () => {
  const res = await getMovies()
  movies.value = res.data.data
  console.log(movies.value)
})

watch(
  () => props.showModal,
  (newValue) => {
    if (newValue !== internalShowModal.value) {
      newValue ? openModal() : closeModal()
    }
  }
)

// AJAX
const onSubmit = handleSubmit(async () => {
  try {
    const data = new FormData()
    data.append('content[en]', formData.value.content.en)
    data.append('content[ka]', formData.value.content.ka)
    data.append('movie_id', formData.value.movie_id as any)
    data.append('image', formData.value.image as any)

    const response = await createQuote(data)
    console.log('Quote creation successful:', response)
    resetFields()
    emit('quote-added')
    emit('update:showModal', false)
  } catch (error: any) {
    console.error('Quote creation failed:', error)
    if (error.response && error.response.data && error.response.data.errors) {
      const serverErrors = error.response.data.errors
      const hasOwnProperty = Object.prototype.hasOwnProperty.bind(serverErrors)
      dropDownError.value = serverErrors.movie_id[0]

      for (const key in serverErrors) {
        if (hasOwnProperty(key)) {
          setFieldError(key, serverErrors[key][0])
          errors[key] = serverErrors[key][0]
        }
      }
    }
  }
})
</script>

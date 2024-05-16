<template>
  <div
    id="popup-modal"
    v-if="internalShowModal"
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
          <p class="text-white">{{ $t('texts.new_quote') }}</p>
        </div>
        <div @click="$emit('update:showModal', false)">
          <CloseBtn />
        </div>
      </div>

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
            />
            <span class="absolute right-0 -translate-x-[50%] translate-y-[50%] text-white"
              >Eng</span
            >
            <ErrorMessage name="content.en" class="text-red-500" />
          </div>

          <div class="relative mt-4">
            <textarea
              v-model="formData.content.ka"
              class="bg-transparent text-white border border-border-gray border-opacity-60 w-full py-2 px-4 placeholder:text-[#6C757D] italic outline-none"
              cols="5"
              rows="3"
              placeholder="ახალი ციტატა"
            />
            <span class="absolute right-0 -translate-x-[50%] translate-y-[100%] text-white"
              >ქარ</span
            >
            <ErrorMessage name="content.ka" class="text-red-500" />
          </div>
          <ImageUpload :file="file" :imageUrl="imageUrl" @file-change="onFileChange" />
          <div class="relative">
            <div
              class="bg-black py-6 px-4 flex items-center justify-between gap-4 mt-6 rounded-md"
              @click="toggleDropdown"
              v-if="!isMovies"
            >
              <div class="flex items-center gap-2">
                <ListOfMovies />
                <p class="text-white">{{ $t('texts.choose_movie') }}</p>
              </div>
              <div class="pr-4 sm:pr-0">
                <ArrowDown />
              </div>
            </div>
            <div v-else class="py-6 px-4 border border-border-gray border-opacity-60 mt-6">
              <p class="text-white">{{ selectedMovie?.movie_name }}</p>
            </div>

            <div
              v-if="isDropdownOpen"
              class="absolute w-full z-10 overflow-y-scroll flex flex-col gap-4 rounded-xl gap-y-2 shadow-2xl shadow-black h-32 mt-2 py-2 px-4 bg-white"
            >
              <div
                v-for="movie in movies"
                :key="movie.id"
                @click.stop="selectMovie(movie)"
                class="text-xs tracking-wider py-2 px-4 cursor-pointer text-black hover:bg-slate-700 transition-all rounded-xl"
              >
                {{ movie.movie_name }}
              </div>
            </div>
            <p v-if="dropDownError" class="text-red-500 mt-2">{{ dropDownError }}</p>
          </div>
          <div class="bg-[#E31221] flex items-center justify-center mt-8 py-3 rounded-md">
            <button type="submit" class="text-xl text-white w-full">{{ $t('texts.post') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageUpload from './ImageUpload.vue'
import CloseBtn from '@/components/icons/CloseBtn.vue'
import ListOfMovies from '@/components/icons/ListOfMovies.vue'
import ArrowDown from '@/components/icons/ArrowDown.vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import { ref, watch, onMounted } from 'vue'
import { useModal } from '@/composables/useModal'
import type { Ref } from 'vue'
import { createQuote, getMovies } from '@/service/movieService'
import { useForm, ErrorMessage } from 'vee-validate'

const props = defineProps<{
  showModal: boolean
}>()

type Movie = {
  id: number
  movie_name: string
}
const { handleSubmit, setFieldError } = useForm()
const userSession = useUserSessionStore()
const { showModal: internalShowModal, closeModal, openModal } = useModal()

const modalContent = ref<HTMLElement | null>(null)
const emit = defineEmits(['update:showModal', 'quote-added'])
const isDropdownOpen = ref(false)
const isFocused = ref(false)
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

const handleCloseModal = (event: MouseEvent) => {
  if (!modalContent.value?.contains(event.target as Node)) {
    closeModal()
    emit('update:showModal', false)
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
  isDropdownOpen.value = false
  isMovies.value = false
}

const toggleDropdown = () => {
  isFocused.value = true
  isDropdownOpen.value = !isDropdownOpen.value
}
const selectMovie = (movie: Movie) => {
  formData.value.movie_id = movie.id
  isDropdownOpen.value = false
  isMovies.value = true
  selectedMovie.value = movie
}

// LIFECYCLES/WATCHERS
onMounted(async () => {
  const res = await getMovies()
  movies.value = res.data.data
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
      console.log(serverErrors)
      dropDownError.value = serverErrors.movie_id[0]

      for (const key in serverErrors) {
        if (hasOwnProperty(key)) {
          setFieldError(key, serverErrors[key][0])
        }
      }
    }
  }
})
</script>

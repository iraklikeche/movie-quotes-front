<template>
  <QuoteMovieWrapModal
    :showModal="showModal"
    :title="$t('texts.new_quote')"
    @update:showModal="updateShowModal"
  >
    <div class="sm:px-8 bg-[#222030] sm:bg-[#11101A]">
      <div class="flex items-center gap-4 text-white">
        <ProfileImage />
        <p class="text-xl">{{ userSession.userData.username }}</p>
      </div>
      <div
        v-if="route.params.id && movie"
        class="bg-black sm:bg-transparent px-2 py-4 flex gap-4 sm:gap-6 items-center rounded-md mt-4"
      >
        <img :src="movie.image_url" class="w-28 sm:w-72 sm:h-40 rounded-xl" />
        <div class="text-white flex flex-col gap-1 sm:gap-4">
          <p class="font-medium sm:text-2xl">
            {{ movie.movie_name[typedLocale] }} <span>{{ movie.year }}</span>
          </p>
          <div v-for="genre in movie.genres" :key="genre.id" class="hidden sm:block">
            <span
              class="bg-custom-gray py-1 px-2 sm:py-1.5 sm:px-4 text-xs font-bold rounded-md sm:text-[18px]"
              >{{ genre.name }}</span
            >
          </div>
          <p class="sm:text-[18px]">
            {{ $t('texts.director') }}: {{ movie.director[typedLocale] }}
          </p>
          <div v-for="genre in movie.genres" :key="genre.id" class="sm:hidden">
            <span class="bg-custom-gray py-1 px-2 text-xs font-bold rounded-md">{{
              genre.name
            }}</span>
          </div>
        </div>
      </div>

      <form @submit.prevent="onSubmit" class="mt-4 sm:mt-8">
        <div class="mb-4">
          <ImageUpload
            :file="file"
            :imageUrl="imageUrl"
            @file-change="onFileChange"
            v-if="route.params.id && movie"
          />
        </div>
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
        <ImageUpload
          :file="file"
          :imageUrl="imageUrl"
          @file-change="onFileChange"
          v-if="!route.params.id && !movie"
        />

        <TheDropdown
          v-if="!route.params.id"
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
import ProfileImage from './ProfileImage.vue'
import ImageUpload from './ImageUpload.vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import { ref, watch, onMounted, reactive } from 'vue'
import { useModal } from '@/composables/useModal'
import type { Ref } from 'vue'
import { createQuote, getMovies } from '@/service/movieService'
import { useForm, ErrorMessage } from 'vee-validate'
import QuoteMovieWrapModal from './QuoteMovieWrapModal.vue'
import TheDropdown from './TheDropdown.vue'
import { useRoute } from 'vue-router'
import type { Movie } from '@/types'
import { useI18n } from 'vue-i18n'
type Locale = 'en' | 'ka'

const { locale } = useI18n()
const typedLocale = locale as unknown as Locale

const props = defineProps<{
  showModal: boolean
  movie?: Movie
}>()

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
const route = useRoute()

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
})

watch(
  () => props.showModal,
  (newValue) => {
    if (newValue !== internalShowModal.value) {
      newValue ? openModal() : closeModal()
    }
  }
)

//
const onSubmit = handleSubmit(async () => {
  try {
    const data = new FormData()
    data.append('content[en]', formData.value.content.en)
    data.append('content[ka]', formData.value.content.ka)
    data.append('movie_id', (formData.value.movie_id as any) || route.params.id)
    data.append('image', formData.value.image as any)

    await createQuote(data)
    resetFields()
    emit('quote-added')
    emit('update:showModal', false)
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.errors) {
      const serverErrors = error.response.data.errors

      if (serverErrors.movie_id) {
        dropDownError.value = serverErrors.movie_id[0]
      }

      for (const key in serverErrors) {
        setFieldError(key, serverErrors[key][0])
        errors[key] = serverErrors[key][0]
      }
    }
  }
})
</script>

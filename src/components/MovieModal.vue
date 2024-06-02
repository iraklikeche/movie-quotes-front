<template>
  <QuoteMovieWrapModal
    :showModal="showModal"
    :title="$t('texts.new_quote')"
    @update:showModal="updateShowModal"
  >
    <div class="px-8 py-10 bg-[#222030] sm:bg-[#11101A]">
      <div class="flex items-center gap-4 text-white">
        <TheProfile />
        <p class="text-xl">{{ userSession.userData.username }}</p>
      </div>

      <form @submit.prevent="onSubmit" class="mt-6 flex flex-col gap-6">
        <TextInput name="name.en" placeholder="Movie name" label="Eng" />
        <TextInput name="name.ka" placeholder="ფილმის სახელი" label="ქარ" />

        <TheDropdown
          :items="allGenres"
          :selectedItems="genres"
          placeholder="აირჩიეთ კატეგორია"
          :error="dropDownError"
          @update:selectedItems="updateGenres"
          @clearError="clearError('genres')"
          displayKey="name"
        />

        <!-- YEAR -->
        <div>
          <Field
            name="year"
            class="bg-transparent border border-custom-light-gray px-4 py-3 rounded-md w-full placeholder:text-white text-white"
            type="number"
            placeholder="Year/წელი"
          />
          <ErrorMessage name="year" class="text-red-500" />
        </div>

        <TextInput name="director.en" placeholder="Director" label="Eng" />

        <TextInput name="director.ka" placeholder="რეჟისორი" label="ქარ" />

        <!-- Description -->
        <div class="relative">
          <textarea
            v-model="description.en.value"
            class="bg-transparent border border-[#efefef] border-opacity-60 w-full py-2 px-4 placeholder:text-white italic text-white outline-none pr-5"
            cols="5"
            rows="3"
            placeholder="Description"
            @input="clearError('description.en')"
          />
          <span class="absolute right-0 -translate-x-1/2 translate-y-1/2 text-custom-light-gray"
            >Eng</span
          >
          <ErrorMessage name="description.en" class="text-red-500" />
        </div>

        <div class="relative">
          <textarea
            v-model="description.ka.value"
            class="mt-4 bg-transparent text-white border border-[#efefef] border-opacity-60 w-full py-2 px-4 placeholder:text-white italic outline-none pr-5"
            cols="5"
            rows="3"
            placeholder="აღწერა"
            @input="clearError('description.ka')"
          />
          <span class="absolute right-0 -translate-x-1/2 translate-y-[100%] text-custom-light-gray"
            >ქარ</span
          >
          <ErrorMessage name="description.ka" class="text-red-500" />
        </div>
        <ImageUpload :file="file" :imageUrl="imageUrl" @file-change="onFileChange" />

        <button class="bg-custom-red py-2 text-white">{{ $t('texts.post') }}</button>
      </form>
    </div>
  </QuoteMovieWrapModal>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import { ref, watch, onMounted } from 'vue'
import { useModal } from '@/composables/useModal'
import { Field, useForm, ErrorMessage } from 'vee-validate'
import { getGenres, createMovie } from '@/service/movieService'
import type { Ref } from 'vue'
import ImageUpload from './ImageUpload.vue'
import TextInput from './TextInput.vue'
import QuoteMovieWrapModal from './QuoteMovieWrapModal.vue'
import TheDropdown from './TheDropdown.vue'
import TheProfile from './TheProfile.vue'

type Category = {
  id: number
  name: string
}

const { handleSubmit, setFieldError, resetForm } = useForm({
  initialValues: {
    name: {
      en: '',
      ka: ''
    },
    director: {
      en: '',
      ka: ''
    },
    description: {
      en: '',
      ka: ''
    },
    year: '',
    image: null,
    genres: []
  }
})

const description = {
  en: ref(''),
  ka: ref('')
}

const props = defineProps<{
  showModal: boolean
}>()
const userSession = useUserSessionStore()

const emit = defineEmits(['update:showModal', 'movie-added'])
const { showModal: internalShowModal, closeModal, openModal } = useModal()

const allGenres = ref<Category[]>([])
const genres = ref<Category[]>([])
const dropDownError = ref(null)
const errors: { [key: string]: string } = {}

const file: Ref<File | null> = ref(null)
const imageUrl: Ref<string | null> = ref(null)

const clearError = (field: string) => {
  if (field === 'genres') {
    dropDownError.value = null
  }
  if (field === 'description.en' || field === 'description.ka') {
    setFieldError(field, undefined)
  }
  if (field === 'image') {
    setFieldError(field, undefined)
  }
}

const clearAllErrors = () => {
  clearError('genres')
  clearError('description.en')
  clearError('description.ka')
  clearError('image')
}

const updateGenres = (newGenres: Category[]) => {
  genres.value = newGenres
}

const resetFields = () => {
  genres.value = []
  description.en.value = ''
  description.ka.value = ''
  file.value = null
  imageUrl.value = null
}

const onFileChange = (newFile: File) => {
  file.value = newFile

  if (newFile) {
    imageUrl.value = URL.createObjectURL(newFile)
  } else {
    imageUrl.value = ''
  }
  clearError('image')
}

const updateShowModal = (value: boolean) => {
  emit('update:showModal', value)
  internalShowModal.value = value
  clearAllErrors()
}

const onSubmit = handleSubmit(async (values) => {
  let formData = new FormData()

  formData.append('name[en]', values.name.en)
  formData.append('name[ka]', values.name.ka)
  formData.append('director[en]', values.director.en)
  formData.append('director[ka]', values.director.ka)
  formData.append('description[en]', description.en.value)
  formData.append('description[ka]', description.ka.value)
  formData.append('year', values.year)

  if (genres.value.length) {
    genres.value.forEach((genre) => formData.append('genres[]', genre.id.toString()))
  } else {
    setFieldError('genres', 'Please select at least one category.')
  }
  if (file.value) {
    formData.append('image', file.value)
  }

  try {
    const response = await createMovie(formData)
    console.log('Success:', response)
    emit('update:showModal', false)
    emit('movie-added')
    resetForm()
    resetFields()
  } catch (error: any) {
    if (error) {
      const serverErrors = error.response.data.errors
      if (serverErrors.genres) {
        dropDownError.value = serverErrors.genres[0]
      }

      for (const key in serverErrors) {
        setFieldError(key as any, serverErrors[key][0])
        errors[key] = serverErrors[key][0]
      }
    }
  }
})

watch(
  () => props.showModal,
  (newValue) => {
    if (newValue !== internalShowModal.value) {
      newValue ? openModal() : closeModal()
    }
  }
)

onMounted(async () => {
  const res = await getGenres()
  allGenres.value = res.data.data
})
</script>

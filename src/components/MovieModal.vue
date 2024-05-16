<template>
  <QuoteMovieWrapModal
    :showModal="showModal"
    :title="$t('texts.new_quote')"
    @update:showModal="updateShowModal"
  >
    <div class="px-8 py-10 bg-[#222030] sm:bg-[#11101A]">
      <div class="flex items-center gap-4 text-white">
        <UserProfileImage />
        <p class="text-xl">{{ userSession.userData.username }}</p>
      </div>

      <form @submit.prevent="onSubmit" class="mt-6 flex flex-col gap-6">
        <TextInput name="name.en" placeholder="Movie name" label="Eng" />
        <TextInput name="name.ka" placeholder="ფილმის სახელი" label="ქარ" />

        <!-- DROPDOWN -->

        <div class="relative" @click="toggleDropdown" tabindex="0" @blur="handleBlur">
          <div
            class="bg-transparent px-4 py-3 rounded-md w-full mt-1 border border-custom-light-gray cursor-pointer text-[#85858d] whitespace-nowrap overflow-hidden"
          >
            <span v-if="genres.length === 0"> აირჩიეთ კატეგორია </span>

            <span
              v-for="(selectedCat, index) in genres"
              class="text-xs rounded-sm tracking-wider py-1 px-2 mr-2 font-medium cursor-pointer last:mr-0 relative z-10 bg-custom-light-gray text-white"
              :key="index"
            >
              {{ selectedCat.name }}
              <span class="inline-block" @click.stop="removeSelectedCategory($event, selectedCat)">
                <RemoveGenre />
              </span>
            </span>
          </div>
          <p v-if="dropDownError" class="text-red-500 mt-2">{{ dropDownError }}</p>

          <div
            v-if="isDropdownOpen"
            class="absolute w-full z-10 overflow-y-scroll flex flex-col gap-4 rounded-xl gap-y-2 shadow-2xl shadow-black h-32 mt-2 py-2 px-4 bg-white"
          >
            <div
              v-for="category in allGenres"
              :key="category.id"
              @click.stop="selectCategory(category)"
              class="text-xs tracking-wider py-2 px-4 cursor-pointer text-black hover:bg-slate-700 transition-all rounded-xl"
            >
              {{ category.name }}
            </div>
          </div>
        </div>

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
import UserProfileImage from './UserProfileImage.vue'
import RemoveGenre from '@/components/icons/RemoveGenre.vue'
import { defineProps } from 'vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import { ref, watch, onMounted, reactive } from 'vue'
import { useModal } from '@/composables/useModal'
import { Field, useForm, ErrorMessage } from 'vee-validate'
import { getGenres, createMovie } from '@/service/movieService'
import type { Ref } from 'vue'
import ImageUpload from './ImageUpload.vue'
import TextInput from './TextInput.vue'
import QuoteMovieWrapModal from './QuoteMovieWrapModal.vue'

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
const isFocused = ref(false)
const isDropdownOpen = ref(false)
const allGenres = ref<Category[]>([])
const genres = ref<Category[]>([])
const dropDownError = ref(null)
const errors = reactive({})
console.log(errors)

const file: Ref<File | null> = ref(null)
const imageUrl: Ref<string | null> = ref(null)

const clearError = (field) => {
  if (field === 'genres') {
    dropDownError.value = null
  }
  if (field === 'description.en' || field === 'description.ka') {
    setFieldError(field, null)
  }
  if (field === 'image') {
    setFieldError(field, null)
  }
}

const resetFields = () => {
  genres.value = []
  description.en.value = ''
  description.ka.value = ''
  file.value = null
  imageUrl.value = null
}

const toggleDropdown = () => {
  isFocused.value = true
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectCategory = (category: Category) => {
  if (!genres.value.some((selectedCat) => selectedCat.id === category.id)) {
    genres.value.push(category)
  }
  isDropdownOpen.value = false
  clearError('genres')
}

const removeSelectedCategory = (event: MouseEvent, selectedCat: Category) => {
  event.stopPropagation()
  genres.value = genres.value.filter((cat) => cat.id !== selectedCat.id)
}

const handleBlur = () => {
  isFocused.value = false
  isDropdownOpen.value = false
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
    console.error('Error:', error)
    if (error.response && error.response.data && error.response.data.errors) {
      const serverErrors = error.response.data.errors
      const hasOwnProperty = Object.prototype.hasOwnProperty.bind(serverErrors)
      dropDownError.value = serverErrors.genres[0]
      for (const key in serverErrors) {
        if (hasOwnProperty(key)) {
          setFieldError(key as any, serverErrors[key][0])
          errors[key] = serverErrors[key][0]
        }
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

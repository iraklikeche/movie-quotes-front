<template>
  <div
    id="popup-modal"
    v-show="internalShowModal"
    tabindex="-1"
    @click="handleCloseModal"
    class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen sm:h-[calc(100%-1rem)] max-h-full flex backdrop-blur-sm"
  >
    <div
      ref="modalContent"
      @click.stop
      class="relative w-full max-w-xl h-full sm:h-auto sm:max-h-full bg-[#222030] sm:bg-[#11101A] sm:rounded-lg sm:min-w-[60rem] sm:pb-12"
    >
      <div
        class="flex items-center justify-between gap-24 py-4 sm:py-6 pt-6 border-b px-8 border-border-gray border-opacity-40"
      >
        <div></div>
        <div>
          <p class="text-white">{{ $t('texts.add_movie') }}</p>
        </div>
        <div>
          <CloseBtn @click="$emit('update:showModal', false)" />
        </div>
      </div>

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
                <span
                  class="inline-block"
                  @click.stop="removeSelectedCategory($event, selectedCat)"
                >
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
            />
            <span
              class="absolute right-0 -translate-x-1/2 translate-y-[100%] text-custom-light-gray"
              >ქარ</span
            >
            <ErrorMessage name="description.ka" class="text-red-500" />
          </div>
          <ImageUpload :file="file" :imageUrl="imageUrl" @file-change="onFileChange" />

          <button class="bg-custom-red py-2 text-white">{{ $t('texts.post') }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserProfileImage from './UserProfileImage.vue'
import CloseBtn from '@/components/icons/CloseBtn.vue'
import RemoveGenre from '@/components/icons/RemoveGenre.vue'
import { defineProps } from 'vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import { ref, watch, onMounted } from 'vue'
import { useModal } from '@/composables/useModal'
import { Field, useForm, ErrorMessage } from 'vee-validate'
import { getGenres, createMovie } from '@/service/movieService'
import type { Ref } from 'vue'
import ImageUpload from './ImageUpload.vue'
import TextInput from './TextInput.vue'

type Category = {
  id: number
  name: string
}

const { handleSubmit, setFieldError } = useForm({
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
const modalContent = ref<HTMLElement | null>(null)
const { showModal: internalShowModal, closeModal, openModal } = useModal()
const isFocused = ref(false)
const isDropdownOpen = ref(false)
const allGenres = ref<Category[]>([])
const genres = ref<Category[]>([])
const dropDownError = ref(null)

const file: Ref<File | null> = ref(null)
const imageUrl: Ref<string | null> = ref(null)

const handleCloseModal = (event: MouseEvent) => {
  if (!modalContent.value?.contains(event.target as Node)) {
    closeModal()
    emit('update:showModal', false)
  }
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
    emit('movie-added')
    closeModal()
  } catch (error: any) {
    console.error('Error:', error)
    if (error.response && error.response.data && error.response.data.errors) {
      const serverErrors = error.response.data.errors
      const hasOwnProperty = Object.prototype.hasOwnProperty.bind(serverErrors)
      dropDownError.value = serverErrors.genres[0]
      for (const key in serverErrors) {
        if (hasOwnProperty(key)) {
          setFieldError(key as any, serverErrors[key][0])
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

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
          <h1 v-if="userSession.loading" class="animate-pulse text-red-500">LOADING</h1>

          <img
            v-else-if="userSession.userData.profile_image"
            :src="userSession.userData.profile_image"
            class="w-14 h-14 rounded-full border-2"
            :class="$route.path === '/profile' ? 'border-red-600' : 'border-none'"
          />
          <img
            v-else
            src="https://picsum.photos/200"
            class="w-14 h-14 rounded-full border-2"
            :class="$route.path === '/profile' ? 'border-red-600' : 'border-none'"
          />
          <p class="text-xl">{{ userSession.userData.username }}</p>
        </div>

        <form @submit.prevent="onSubmit" class="mt-6 flex flex-col gap-6">
          <div class="relative">
            <Field
              name="name.en"
              class="bg-transparent border border-custom-light-gray px-4 py-3 rounded-md w-full text-white placeholder:text-white pr-5"
              type="text"
              placeholder="Movie name"
            />
            <span
              class="absolute right-0 -translate-x-[50%] translate-y-[50%] text-custom-light-gray"
              >Eng</span
            >
          </div>
          <div class="relative">
            <Field
              name="name.ka"
              class="bg-transparent border border-custom-light-gray px-4 py-3 rounded-md w-full text-white placeholder:text-white pr-5"
              type="text"
              placeholder="ფილმის სახელი"
            />
            <span
              class="absolute right-0 -translate-x-[50%] translate-y-[50%] text-custom-light-gray"
              >ქარ</span
            >
          </div>

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
          </div>

          <div class="relative">
            <Field
              name="director.en"
              class="bg-transparent border border-custom-light-gray px-4 py-3 rounded-md w-full placeholder:text-white text-white"
              type="text"
              placeholder="Director"
            />
            <span
              class="absolute right-0 -translate-x-[50%] translate-y-[50%] text-custom-light-gray"
              >ქარ</span
            >
          </div>

          <div class="relative">
            <Field
              name="director.ka"
              class="bg-transparent border border-custom-light-gray px-4 py-3 rounded-md w-full placeholder:text-white text-white"
              type="text"
              placeholder="რეჟისორი"
            />
            <span
              class="absolute right-0 -translate-x-[50%] translate-y-[50%] text-custom-light-gray"
              >Eng</span
            >
          </div>
          <!-- Description -->
          <div class="relative">
            <textarea
              v-model="description.en.value"
              class="bg-transparent border border-[#efefef] border-opacity-60 w-full py-2 px-4 placeholder:text-white italic text-white outline-none pr-5"
              cols="5"
              rows="3"
              placeholder="Description"
            />
            <span
              class="absolute right-0 -translate-x-[50%] translate-y-[50%] text-custom-light-gray"
              >Eng</span
            >
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
              class="absolute right-0 -translate-x-[50%] translate-y-[100%] text-custom-light-gray"
              >ქარ</span
            >
          </div>
          <!-- IMAGE -->
          <div class="mt-4" v-if="!file">
            <input type="file" id="file-upload" style="display: none" @change="onFileChange" />
            <label
              for="file-upload"
              class="flex justify-between sm:justify-normal sm:gap-2 items-center border border-border-gray border-opacity-60 px-4 py-5"
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
            <input type="file" id="file-upload" style="display: none" @change="onFileChange" />
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

          <button class="bg-custom-red py-2 text-white">{{ $t('texts.post') }}</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CloseBtn from '@/components/icons/CloseBtn.vue'
import ImageIcon from '@/components/icons/ImageIcon.vue'
import RemoveGenre from '@/components/icons/RemoveGenre.vue'
import { defineProps } from 'vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import { ref, watch, onMounted } from 'vue'
import { useModal } from '@/composables/useModal'
import { Field, useForm } from 'vee-validate'
import { getGenres, createMovie } from '@/service/movieService'
import type { Ref } from 'vue'

type Category = {
  id: number
  name: string
}

const { handleSubmit } = useForm({
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

const emit = defineEmits(['update:showModal'])
const modalContent = ref<HTMLElement | null>(null)
const { showModal: internalShowModal, closeModal, openModal } = useModal()
const isFocused = ref(false)
const isDropdownOpen = ref(false)
const allGenres = ref<Category[]>([])
const genres = ref<Category[]>([])

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

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files

  if (files && files.length > 0) {
    file.value = files[0]
    const reader = new FileReader()

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (typeof e.target?.result === 'string') {
        imageUrl.value = e.target.result
      }
    }

    if (file.value) {
      reader.readAsDataURL(file.value)
    }
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
  }
  if (file.value) {
    formData.append('image', file.value)
  }

  try {
    const response = await createMovie(formData)
    console.log('Success:', response)
    emit('movie-added')
    closeModal()
  } catch (error) {
    console.error('Error:', error)
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

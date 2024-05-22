<template>
  <QuoteMovieWrapModal
    :showModal="showModal"
    :title="$t('texts.edit_movie')"
    @update:showModal="updateShowModal"
  >
    <div class="sm:px-8 sm:py-10 bg-[#222030] sm:bg-[#11101A]">
      <div class="flex items-center gap-4 text-white">
        <TheProfile />
        <p class="text-xl">{{ userSession.userData.username }}</p>
      </div>

      <form @submit.prevent="onSubmit" class="mt-6 flex flex-col gap-6">
        <EditMovieInput name="name.en" label="Movie name:" />
        <EditMovieInput name="name.ka" label="Movie name: " />

        <TheDropdown
          :items="allGenres"
          :selectedItems="genres"
          placeholder="Select Category"
          :error="dropDownError"
          @update:selectedItems="updateGenres"
          @clearError="clearError('genres')"
          displayKey="name"
        />

        <EditMovieInput name="year" label="Year: " type="number" />

        <EditMovieInput name="director.en" label="Director: " />

        <EditMovieInput name="director.ka" label="Director: " />

        <EditMovieTextarea name="description.en" label="Description: " />
        <EditMovieTextarea name="description.ka" label="Description: " />
        <EditImageUpload :imageUrl="imageUrl" @file-change="handleFileChange" />

        <button class="bg-custom-red py-2 text-white">{{ $t('texts.save_changes') }}</button>
      </form>
    </div>
  </QuoteMovieWrapModal>
</template>
<script setup lang="ts">
import EditImageUpload from './Form/EditImageUpload.vue'
import EditMovieInput from './Form/EditMovieInput.vue'
import EditMovieTextarea from './Form/EditMovieTextarea.vue'
import { defineProps, ref, watch, onMounted } from 'vue'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import { useModal } from '@/composables/useModal'
import { useForm } from 'vee-validate'
import { getGenres, updateMovie } from '@/service/movieService'
import type { Ref } from 'vue'
import QuoteMovieWrapModal from './QuoteMovieWrapModal.vue'
import TheDropdown from './TheDropdown.vue'
import TheProfile from './TheProfile.vue'
import type { Genre } from '@/types'

const props = defineProps<{
  showModal: boolean
  movie?: any
}>()

const userSession = useUserSessionStore()

const emit = defineEmits(['update:showModal', 'movie-updated'])
const { showModal: internalShowModal, closeModal, openModal } = useModal()

const { handleSubmit, setFieldError, resetForm, setValues } = useForm({})

const formData = ref({
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
})

const allGenres = ref<Genre[]>([])
const genres = ref<Genre[]>([])
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
const handleFileChange = (newFile: File) => {
  file.value = newFile
  imageUrl.value = URL.createObjectURL(newFile)
}

const updateGenres = (newGenres: Genre[]) => {
  genres.value = newGenres
}

const resetFields = () => {
  genres.value = []
  formData.value.description.en = ''
  formData.value.description.ka = ''
  file.value = null
  imageUrl.value = null
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
  formData.append('description[en]', values.description.en)
  formData.append('description[ka]', values.description.ka)
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
    const response = await updateMovie(props.movie.id, formData)
    console.log('Success:', response)
    emit('update:showModal', false)
    emit('movie-updated')
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
        console.log(errors)
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
    if (newValue && props.movie) {
      setValues({
        name: {
          en: props.movie?.movie_name?.en || '',
          ka: props.movie?.movie_name?.ka || ''
        },
        director: {
          en: props.movie?.director?.en || '',
          ka: props.movie?.director?.ka || ''
        },
        description: {
          en: props.movie?.description?.en || '',
          ka: props.movie?.description?.ka || ''
        },
        year: props.movie?.year || '',
        genres: props.movie?.genres?.map((genre: Genre) => genre.id) || []
      })
      genres.value = props.movie?.genres || []
      imageUrl.value = props.movie?.image_url || ''
    }
  }
)

onMounted(async () => {
  const res = await getGenres()
  allGenres.value = res.data.data
})
</script>

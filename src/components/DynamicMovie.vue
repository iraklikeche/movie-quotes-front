<template>
  <EditMovieModal
    :showModal="showModal"
    @update:showModal="(value) => (showModal = value)"
    :movie="movie"
    @movie-updated="emitMovieUpdated"
  />
  <div class="flex flex-col gap-6 sm:w-full" v-if="movie">
    <div class="flex justify-between items-center">
      <h2 class="text-white">
        {{ movie.movie_name[typedLocale] }} <span> ({{ movie.year }})</span>
      </h2>
      <div class="flex bg-[rgb(36,34,47)] gap-6 py-2 px-8 rounded-xl items-center">
        <button @click="openModal">
          <EditIcon />
        </button>
        <div class="text-custom-light-gray text-xl">|</div>
        <button @click="deleteCurrentMovie">
          <DeleteIcon />
        </button>
      </div>
    </div>
    <div class="flex gap-2">
      <span
        v-for="genre in movie.genres"
        :key="genre.id"
        class="bg-custom-light-gray py-1 px-3 rounded-md text-white font-bold"
      >
        {{ genre.name }}
      </span>
    </div>
    <p class="text-white font-bold">Director: {{ movie.director[typedLocale] }}</p>
    <p class="text-white mt-4 sm:mt-1">{{ movie.description[typedLocale] }}</p>
  </div>
</template>

<script setup lang="ts">
import EditMovieModal from './EditMovieModal.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import EditIcon from './icons/EditIcon.vue'
import DeleteIcon from './icons/DeleteIcon.vue'
import { deleteMovie } from '@/service/movieService'
import { useI18n } from 'vue-i18n'

type Locale = 'en' | 'ka'

const emit = defineEmits(['movie-updated'])

const { locale } = useI18n()
const typedLocale = locale as unknown as Locale
const router = useRouter()
const showModal = ref(false)

const props = defineProps(['movie'])

const openModal = () => {
  showModal.value = true
}

const emitMovieUpdated = () => {
  emit('movie-updated')
}

const deleteCurrentMovie = async () => {
  if (!props.movie) return

  if (!confirm('Are you sure you want to delete this movie?')) return
  try {
    await deleteMovie(props.movie.id)
    router.push('/movies')
  } catch (error) {
    console.error('Error deleting movie:', error)
    alert('Failed to delete movie')
  }
}
</script>

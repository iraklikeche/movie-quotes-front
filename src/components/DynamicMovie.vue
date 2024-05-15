<template>
  <MovieModal :showModal="showModal" @update:showModal="(value) => (showModal = value)" />
  <div class="flex flex-col gap-6 sm:w-full" v-if="movie">
    <div class="flex justify-between items-center">
      <h2 class="text-white">
        {{ movie.movie_name }} <span> ({{ movie.year }})</span>
      </h2>
      <div class="hidden sm:flex bg-[rgb(36,34,47)] gap-6 py-2 px-8 rounded-xl items-center">
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
    <p class="text-white font-bold">Director: {{ movie.director }}</p>
    <p class="text-white mt-4 sm:mt-1">{{ movie.description }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getSingleMovie } from '@/service/movieService'
import { useRoute, useRouter } from 'vue-router'
import EditIcon from './icons/EditIcon.vue'
import DeleteIcon from './icons/DeleteIcon.vue'
import { deleteMovie } from '@/service/movieService'
import MovieModal from './MovieModal.vue'
type Genre = {
  id: number
  name: string
}

type Movie = {
  id: number
  movie_name: string
  year: number
  genres: Genre[]
  director: string
  description: string
}

const movie = ref<Movie | null>(null)
const route = useRoute()
const router = useRouter()
const showModal = ref(false)

onMounted(async () => {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id

  const res = await getSingleMovie(id)
  movie.value = res.data.data
})

const openModal = () => {
  showModal.value = true
}

const deleteCurrentMovie = async () => {
  if (!movie.value) return

  if (!confirm('Are you sure you want to delete this movie?')) return

  try {
    await deleteMovie(movie.value.id)
    router.push('/movies')
  } catch (error) {
    console.error('Error deleting movie:', error)
    alert('Failed to delete movie')
  }
}
</script>

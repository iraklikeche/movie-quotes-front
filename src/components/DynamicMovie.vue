<template>
  <div class="flex flex-col gap-6 sm:w-full" v-if="movie">
    <div class="flex justify-between items-center">
      <h2 class="text-white">
        {{ movie.movie_name }} <span>{{ movie.year }}</span>
      </h2>
      <div class="hidden sm:flex bg-[#24222F] gap-6 py-2 px-8 rounded-xl items-center">
        <EditIcon />
        <div class="text-custom-light-gray text-xl">|</div>
        <DeleteIcon />
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
    <p class="text-white mt-4">{{ movie.description }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getSingleMovie } from '@/service/movieService'
import { useRoute } from 'vue-router'
import EditIcon from './icons/EditIcon.vue'
import DeleteIcon from './icons/DeleteIcon.vue'

type Genre = {
  id: number
  name: string
}

type Movie = {
  movie_name: string
  year: number
  genres: Genre[]
  director: string
  description: string
}

const movie = ref<Movie | null>(null)
const route = useRoute()

onMounted(async () => {
  const res = await getSingleMovie(route.params.id)
  movie.value = res.data.data
})
</script>

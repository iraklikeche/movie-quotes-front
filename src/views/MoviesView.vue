<template>
  <TheLayout :customHeight="'min-h-screen'">
    <MovieModal
      :showModal="showModal"
      @movie-added="fetchMovies"
      @update:showModal="handleModalUpdate"
    />

    <!-- *************** -->
    <main class="px-8 sm:px-0 pt-4 sm:pt-0 sm:w-full">
      <div class="flex items-center justify-between">
        <h2 class="text-white flex flex-col sm:flex-row gap-2">
          {{ $t('texts.my_list') }} <span> ({{ $t('texts.total') }} {{ movies.length }}) </span>
        </h2>
        <div class="flex gap-4 items-center">
          <input
            class="outline-none w-24 text-white pl-4 py-2 bg-transparent transition-all duration-300 focus:w-[18rem] hidden sm:block"
            :placeholder="$t('texts.search_my_movies')"
            v-model="search"
          />
          <button
            @click="openModal"
            class="flex items-center text-white gap-2 bg-custom-red px-3 py-1.5 sm:py-2 rounded-md"
          >
            <AddQuote />
            {{ $t('texts.add_movie') }}
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 mt-6 sm:w-full gap-12">
        <RouterLink
          :to="{ name: 'movie', params: { id: movie.id } }"
          class="flex flex-col gap-4 mb-12"
          v-for="movie in filteredMovies"
          :key="movie.id"
        >
          <img :src="movie.image_url" class="w-full rounded-xl max-h-[19rem] h-96" />

          <span class="text-white font-medium text-2xl"
            >{{ movie.movie_name }} ({{ movie.year }})</span
          >
          <span class="flex items-center gap-2 text-xl text-white font-medium"
            >{{ movie.quotes.length }} <QuotesIcon
          /></span>
        </RouterLink>
      </div>
    </main>
  </TheLayout>
</template>

<script setup lang="ts">
import TheLayout from '@/components/TheLayout.vue'
import QuotesIcon from '@/components/icons/QuotesIcon.vue'
import AddQuote from '@/components/icons/AddQuote.vue'
import { ref, onMounted, computed } from 'vue'
import MovieModal from '@/components/MovieModal.vue'
import { getMovies } from '@/service/movieService'
import { RouterLink } from 'vue-router'
import type { Quote } from '@/types'

type Movie = {
  id: number
  image_url: string
  movie_name: string
  year: number
  quotes: Quote[]
}

const showModal = ref(false)
const movies = ref<Movie[]>([])
const openModal = () => {
  showModal.value = true
}
const search = ref('')

const handleModalUpdate = (value: boolean) => {
  showModal.value = value
}

const filteredMovies = computed(() => {
  return movies.value.filter((movie) =>
    movie.movie_name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const fetchMovies = async () => {
  const res = await getMovies()
  movies.value = res.data.data
  console.log(movies.value)
}

onMounted(() => {
  fetchMovies()
})
</script>

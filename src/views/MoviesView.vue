<template>
  <TheLayout :customHeight="'min-h-screen'">
    <MovieModal :showModal="showModal" @update:showModal="(value) => (showModal = value)" />

    <!-- *************** -->
    <main class="px-8 pt-4 sm:w-full">
      <div class="flex items-center justify-between">
        <h2 class="text-white flex flex-col">
          {{ $t('texts.my_list') }} <span> ({{ $t('texts.total') }} 25) </span>
        </h2>
        <div class="flex gap-4 items-center">
          <input
            class="outline-none w-24 text-white pl-4 py-2 bg-transparent transition-all duration-300 focus:w-[18rem] hidden sm:block"
            :placeholder="$t('texts.search_my_movies')"
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
        <div class="flex flex-col gap-4 mb-12" v-for="movie in movies" :key="movie.id">
          <img :src="movie.image_url" class="w-full rounded-xl max-h-[19rem] sm:max-h-[23rem]" />

          <span class="text-white font-medium text-2xl"
            >{{ movie.movie_name }} ({{ movie.year }})</span
          >
          <span class="flex items-center gap-2 text-xl text-white font-medium"
            >10 <QuotesIcon
          /></span>
        </div>
      </div>
    </main>
  </TheLayout>
</template>

<script setup lang="ts">
import TheLayout from '@/components/TheLayout.vue'
import QuotesIcon from '@/components/icons/QuotesIcon.vue'
import AddQuote from '@/components/icons/AddQuote.vue'
import { ref, onMounted } from 'vue'
import MovieModal from '@/components/MovieModal.vue'
import { getMovies } from '@/service/movieService'

const showModal = ref(false)
const movies = ref([])
const openModal = () => {
  showModal.value = true
}

onMounted(async () => {
  const res = await getMovies()
  movies.value = res.data.data
  console.log(movies.value)
})
</script>

<template>
  <QuoteModal
    :showModal="showModal"
    @update:showModal="(value) => (showModal = value)"
    @quote-added="fetchQuotes"
    :movie="computedMovie"
  />

  <DetailedQuoteModal
    v-if="isView && selectedQuote"
    :selectedQuote="selectedQuote"
    @close="isView = false"
    @remove="removeQuote"
    :isEditMode="isEditMode"
    @quote-updated="fetchQuotes"
  />
  <TheLayout :customHeight="'min-h-screen'">
    <div>
      <div class="px-8 sm:px-0 pt-8 flex sm:grid grid-cols-[60fr_40fr] sm:gap-x-12">
        <div
          class="flex flex-col gap-6 border-b border-border-gray pb-8 border-opacity-60 sm:border-none w-full sm:min-w-[50rem]"
        >
          <div class="sm:w-full" v-if="movie">
            <img :src="movie.image_url" class="rounded-xl w-full max-h-80" />
          </div>
          <div class="sm:hidden">
            <DynamicMovie :movie="movie" @movie-updated="fetchMovies" />
          </div>
          <div class="sm:hidden">
            <button @click="openModal" class="bg-custom-red px-4 py-2 text-white">
              {{ $t('texts.add_quote') }}
            </button>
          </div>
          <!-- ***********DESKTOP********** -->
          <div class="hidden sm:block">
            <QuotesHeader :quotesCount="quotesCount" @openModal="openModal" />

            <div class="mt-6 w-full">
              <div
                class="flex flex-col gap-4 bg-[#11101A] px-8 py-8 sm:relative"
                v-for="quote in quotes"
                :key="quote.id"
              >
                <div class="flex flex-col sm:flex-row gap-8 sm:items-center">
                  <img :src="quote.image_url" class="w-full max-h-36 sm:w-56" />

                  <p class="text-custom-light-gray italic text-2xl">
                    {{ quote.content[typedLocale] }}
                  </p>
                </div>
                <div
                  class="flex gap-6 mt-2 border-t pt-6 border-border-gray border-opacity-60 justify-between"
                >
                  <div class="flex gap-6 mt-2">
                    <div class="flex gap-2 items-center">
                      <span class="text-white">{{
                        quote.comments.length === 0 ? 0 : quote.comments.length
                      }}</span>
                      <MessageIcon />
                    </div>
                    <div class="flex gap-2 items-center">
                      <span class="text-white">{{ quote.likes_count }}</span>
                      <button>
                        <LikeIcon :liked="quote.liked_by_user" />
                      </button>
                    </div>
                  </div>

                  <div class="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                    <MoreOptions @click="toggleMenu(quote.id)" />
                    <div
                      v-show="isVisible === quote.id"
                      class="bg-[#24222F] absolute min-w-64 rounded-xl p-8 right-0 bottom-0 sm:bottom-auto -translate-y-[15%] sm:-translate-y-0"
                    >
                      <ul class="flex flex-col gap-8">
                        <li class="flex gap-6 items-center text-white" @click="openView(quote)">
                          <ViewIcon /> {{ $t('texts.view_quote') }}
                        </li>
                        <li class="flex gap-6 items-center text-white" @click="openEdit(quote)">
                          <EditIcon /> {{ $t('texts.edit') }}
                        </li>
                        <li
                          class="flex gap-6 items-center text-white"
                          @click="removeQuote(quote.id)"
                        >
                          <DeleteIcon /> {{ $t('texts.delete') }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="hidden sm:block sm:w-full" v-if="movie">
          <DynamicMovie :movie="movie" />
        </div>
      </div>

      <!-- ***********MOBILE********** -->

      <div class="sm:hidden">
        <QuotesHeader :quotesCount="quotesCount" />

        <div class="mt-6 sm:w-1/2">
          <div
            class="flex flex-col gap-4 bg-[#11101A] px-8 py-8"
            v-for="quote in quotes"
            :key="quote.id"
          >
            <img :src="quote.image_url" class="w-full max-h-36" />
            <p class="text-custom-light-gray italic text-2xl">{{ quote.content.en }}</p>
            <div
              class="flex gap-6 mt-2 border-t pt-6 border-border-gray border-opacity-60 justify-between"
            >
              <div class="flex gap-6 mt-2">
                <div class="flex gap-2 items-center">
                  <span class="text-white">{{
                    quote.comments.length === 0 ? 0 : quote.comments.length
                  }}</span>
                  <MessageIcon />
                </div>
                <div class="flex gap-2 items-center">
                  <span class="text-white">{{ quote.likes_count }}</span>
                  <button>
                    <LikeIcon :liked="quote.liked_by_user" />
                  </button>
                </div>
              </div>
              <div class="relative">
                <MoreOptions @click="toggleMenu(quote.id)" />
                <div
                  v-show="isVisible === quote.id"
                  class="bg-[#24222F] absolute min-w-64 rounded-xl p-8 right-0 bottom-0 -translate-y-[15%]"
                >
                  <ul class="flex flex-col gap-8">
                    <li class="flex gap-6 items-center text-white" @click="openView(quote)">
                      <ViewIcon /> {{ $t('texts.view_quote') }}
                    </li>
                    <li class="flex gap-6 items-center text-white" @click="openEdit(quote)">
                      <EditIcon /> {{ $t('texts.edit') }}
                    </li>
                    <li class="flex gap-6 items-center text-white" @click="removeQuote(quote.id)">
                      <DeleteIcon /> {{ $t('texts.delete') }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TheLayout>
</template>

<script setup lang="ts">
import QuoteModal from './../components/QuoteModal.vue'
import LikeIcon from '@/components/icons/LikeIcon.vue'
import MessageIcon from '@/components/icons/MessageIcon.vue'
import DetailedQuoteModal from './../components/DetailedQuoteModal.vue'
import QuotesHeader from '@/components/QuotesHeader.vue'
import TheLayout from '@/components/TheLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { deleteQuote, getQuotesByMovie, getSingleMovie } from '@/service/movieService'
import { useRoute } from 'vue-router'
import MoreOptions from '@/components/icons/MoreOptions.vue'
import ViewIcon from '@/components/icons/ViewIcon.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import DeleteIcon from '@/components/icons/DeleteIcon.vue'
import DynamicMovie from '@/components/DynamicMovie.vue'
import type { Quote, Movie } from '@/types'
import { useI18n } from 'vue-i18n'

type Locale = 'en' | 'ka'

const { locale } = useI18n()
const typedLocale = locale as unknown as Locale

const route = useRoute()
const isVisible = ref<number | null>(null)
const quotes = ref<Quote[]>([])
const selectedQuote = ref<Quote | null>(null)

const quotesCount = ref()
const isView = ref(false)
const movie = ref<Movie | null>(null)
const computedMovie = computed(() => movie.value || undefined)

const isEditMode = ref(false)

const showModal = ref(false)

const openModal = () => {
  showModal.value = true
}

const openView = (quote: Quote) => {
  console.log(quote)
  selectedQuote.value = quote
  isEditMode.value = false
  isView.value = true
  isVisible.value = null
}

const openEdit = (quote: Quote) => {
  selectedQuote.value = quote
  isEditMode.value = true
  isView.value = true
  isVisible.value = null
}

function toggleMenu(quoteId: number) {
  isVisible.value = isVisible.value === quoteId ? null : quoteId
}

const fetchQuotes = async () => {
  console.log(1)
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  const res = await getQuotesByMovie(id)
  quotes.value = res.data
  quotesCount.value = quotes.value.length
  showModal.value = false
}

const fetchMovies = async () => {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  const res = await getSingleMovie(id)
  movie.value = res.data.data
}

onMounted(async () => {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id

  const res = await getSingleMovie(id)
  movie.value = res.data.data
  const quotesResponse = await getQuotesByMovie(id)
  quotes.value = quotesResponse.data
  console.log(quotes.value)
  quotesCount.value = quotes.value.length
})

const removeQuote = async (quoteId: number) => {
  try {
    await deleteQuote(quoteId)
    isView.value = false
    quotes.value = quotes.value.filter((quote) => quote.id !== quoteId)
  } catch (error) {
    console.error('Failed to delete quote:', error)
  }
}
</script>

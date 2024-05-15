<template>
  <TheLayout :customHeight="'min-h-screen'">
    <div>
      <div class="px-8 sm:px-0 pt-8 flex sm:grid grid-cols-[60fr_40fr] sm:gap-x-12">
        <div
          class="flex flex-col gap-6 border-b border-border-gray pb-8 border-opacity-60 sm:border-none w-full"
        >
          <div class="sm:w-full" v-if="movie">
            <img :src="movie.image_url" class="rounded-xl w-full max-h-80" />
          </div>
          <div class="sm:hidden">
            <DynamicMovie />
          </div>
          <div class="sm:hidden">
            <button class="bg-custom-red px-4 py-2 text-white">
              {{ $t('texts.add_quote') }}
            </button>
          </div>
          <!-- ********************* -->
          <div class="hidden sm:block">
            <QuotesHeader />
            <div class="mt-6 w-full">
              <div class="flex flex-col gap-4 bg-[#11101A] px-8 py-8 sm:relative">
                <div class="flex flex-col sm:flex-row gap-8 sm:items-center">
                  <img src="https://picsum.photos/200" class="w-full max-h-36" />
                  <p class="text-custom-light-gray italic text-2xl">
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, repellendus
                    quisquam magnam porro dolores. "
                  </p>
                </div>
                <div
                  class="flex gap-6 mt-2 border-t pt-6 border-border-gray border-opacity-60 justify-between"
                >
                  <div class="flex gap-6">
                    <div class="flex gap-2 items-center">
                      <span class="text-white">3</span>
                      <MessageIcon />
                    </div>
                    <div class="flex gap-2 items-center">
                      <span class="text-white">2</span>
                      <LikeIcon />
                    </div>
                  </div>
                  <div class="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                    <MoreOptions @click="toggleMenu" />
                    <div
                      @click.self="isVisible = false"
                      v-show="isVisible"
                      class="bg-[#24222F] absolute min-w-64 rounded-xl p-8 right-0 bottom-0 sm:bottom-auto -translate-y-[15%] sm:-translate-y-0"
                    >
                      <ul class="flex flex-col gap-8">
                        <li class="flex gap-6 items-center text-white">
                          <ViewIcon /> {{ $t('texts.view_quote') }}
                        </li>
                        <li class="flex gap-6 items-center text-white">
                          <EditIcon /> {{ $t('texts.edit') }}
                        </li>
                        <li class="flex gap-6 items-center text-white">
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
        <div class="hidden sm:block sm:w-full">
          <DynamicMovie />
        </div>
      </div>

      <div class="sm:hidden">
        <QuotesHeader />
        <div class="mt-6 sm:w-1/2">
          <div class="flex flex-col gap-4 bg-[#11101A] px-8 py-8">
            <img src="https://picsum.photos/200" class="w-full max-h-36" />
            <p class="text-custom-light-gray italic text-2xl">
              "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, repellendus
              quisquam magnam porro dolores. "
            </p>
            <div
              class="flex gap-6 mt-2 border-t pt-6 border-border-gray border-opacity-60 justify-between"
            >
              <div class="flex gap-6">
                <div class="flex gap-2 items-center">
                  <span class="text-white">3</span>
                  <MessageIcon />
                </div>
                <div class="flex gap-2 items-center">
                  <span class="text-white">2</span>
                  <LikeIcon />
                </div>
              </div>
              <div class="relative">
                <MoreOptions @click="toggleMenu" />
                <div
                  @click.self="isVisible = false"
                  v-show="isVisible"
                  class="bg-[#24222F] absolute min-w-64 rounded-xl p-8 right-0 bottom-0 -translate-y-[15%]"
                >
                  <ul class="flex flex-col gap-8">
                    <li class="flex gap-6 items-center text-white">
                      <ViewIcon /> {{ $t('texts.view_quote') }}
                    </li>
                    <li class="flex gap-6 items-center text-white">
                      <EditIcon /> {{ $t('texts.edit') }}
                    </li>
                    <li class="flex gap-6 items-center text-white">
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
import QuotesHeader from '@/components/QuotesHeader.vue'
import TheLayout from '@/components/TheLayout.vue'
import { ref, onMounted } from 'vue'
import { getSingleMovie } from '@/service/movieService'
import { useRoute } from 'vue-router'
import MessageIcon from '@/components/icons/MessageIcon.vue'
import LikeIcon from '@/components/icons/LikeIcon.vue'
import MoreOptions from '@/components/icons/MoreOptions.vue'
import ViewIcon from '@/components/icons/ViewIcon.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import DeleteIcon from '@/components/icons/DeleteIcon.vue'
import DynamicMovie from '@/components/DynamicMovie.vue'

type Movie = {
  image_url: string
}
const route = useRoute()
const isVisible = ref(false)

const movie = ref<Movie | null>(null)

function toggleMenu() {
  isVisible.value = !isVisible.value
}

onMounted(async () => {
  const res = await getSingleMovie(route.params.id)
  movie.value = res.data.data
})
</script>

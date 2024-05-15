<template>
  <TheLayout :customHeight="'min-h-screen'">
    <QuoteModal :showModal="showModal" @update:showModal="(value) => (showModal = value)" />

    <div>
      <div class="flex items-center gap-6">
        <button
          @click="openModal"
          class="flex justify-between px-8 sm:px-0 bg-[#181624] py-6 sm:gap-4 w-full"
        >
          <div class="flex gap-4 items-center sm:bg-[#24222F] sm:w-full sm:py-4 sm:px-4">
            <WriteQuote />
            <span class="text-white">{{ $t('texts.new_quote') }}</span>
          </div>
        </button>
        <div class="hidden sm:flex items-center">
          <SearchIcon />
          <input
            v-model="search"
            @focus="handleFocused"
            @blur="isFocused = false"
            class="outline-none text-white pl-4 py-2 bg-transparent w-16 transition-all duration-300 focus:w-[21rem] sm:focus:w-[42rem]"
            :class="isFocused ? 'border-b border-border-gray border-opacity-30' : ''"
            :placeholder="isFocused ? $t('texts.search_by') : $t('texts.search')"
          />
        </div>
      </div>

      <div class="bg-[#181624] flex flex-col gap-10">
        <div class="bg-[#09101c] px-8 py-4 rounded-xl">
          <div class="flex items-center gap-4">
            <img src="https://picsum.photos/200" class="w-10 rounded-full" />
            <span class="text-white">Your Name</span>
          </div>
          <div class="flex flex-col gap-2 mt-2 border-b border-border-gray border-opacity-30 pb-4">
            <p class="text-white">Quote</p>
            <img
              src="https://picsum.photos/200"
              class="rounded-xl w-full max-h-52 sm:max-h-[31rem]"
            />
            <div class="flex gap-6 mt-2">
              <div class="flex gap-2 items-center">
                <span class="text-white">3</span>
                <MessageIcon />
              </div>
              <div class="flex gap-2 items-center">
                <span class="text-white">2</span>
                <LikeIcon />
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div class="max-h-72 overflow-scroll">
              <div class="mb-4 sm:flex gap-4">
                <div class="flex items-center sm:items-start gap-4">
                  <img src="https://picsum.photos/200" class="w-10 rounded-full" />
                  <span class="text-white sm:hidden">Your Name</span>
                </div>
                <div class="sm:flex flex-col">
                  <span class="text-white hidden sm:block">Your Name</span>
                  <p class="text-white mt-2 border-b border-opacity-30 border-border-gray pb-4">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit quisquam ad
                    dolorum quo quod repellat est voluptatibus?
                  </p>
                </div>
              </div>
              <div>
                <div class="flex items-center gap-4">
                  <img src="https://picsum.photos/200" class="w-10 rounded-full" />
                  <span class="text-white">Your Name</span>
                </div>
                <p class="text-white mt-2 border-b border-opacity-30 border-border-gray pb-4">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit quisquam ad
                  dolorum quo quod repellat est voluptatibus?
                </p>
              </div>
              <div>
                <div class="flex items-center gap-4">
                  <img src="https://picsum.photos/200" class="w-10 rounded-full" />
                  <span class="text-white">Your Name</span>
                </div>
                <p class="text-white mt-2 border-b border-opacity-30 border-border-gray pb-4">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit quisquam ad
                  dolorum quo quod repellat est voluptatibus?
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4 mt-4">
              <img src="https://picsum.photos/200" class="w-10 rounded-full" />
              <input
                type="text"
                :placeholder="$t('texts.write_comment')"
                class="bg-custom-light-gray px-2 rounded-lg py-1.5 sm:pl-4 outline-none text-white bg-transparent w-auto transition-all duration-300 focus:w-[21rem] sm:w-full"
              />
            </div>
          </div>
        </div>

        <!-- Second Card -->
        <div class="bg-[#09101c] px-8 py-4">
          <div class="flex items-center gap-4">
            <img src="https://picsum.photos/200" class="w-10 rounded-full" />
            <span class="text-white">Your Name</span>
          </div>
          <div class="flex flex-col gap-2 mt-2 border-b border-border-gray border-opacity-30 pb-4">
            <p class="text-white">Quote</p>
            <img src="https://picsum.photos/200" class="rounded-xl w-full max-h-52" />
            <div class="flex gap-6 mt-2">
              <div class="flex gap-2 items-center">
                <span class="text-white">3</span>
                <MessageIcon />
              </div>
              <div class="flex gap-2 items-center">
                <span class="text-white">2</span>
                <LikeIcon />
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div class="mb-4">
              <div class="flex items-center gap-4">
                <img src="https://picsum.photos/200" class="w-10 rounded-full" />
                <span class="text-white">Your Name</span>
              </div>
              <p class="text-white mt-2 border-b border-opacity-30 border-border-gray pb-4">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit quisquam ad dolorum
                quo quod repellat est voluptatibus?
              </p>
            </div>
            <div>
              <div class="flex items-center gap-4">
                <img src="https://picsum.photos/200" class="w-10 rounded-full" />
                <span class="text-white">Your Name</span>
              </div>
              <p class="text-white mt-2 border-b border-opacity-30 border-[#] pb-4">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit quisquam ad dolorum
                quo quod repellat est voluptatibus?
              </p>
            </div>
            <div class="flex items-center gap-4 mt-4">
              <img src="https://picsum.photos/200" class="w-10 rounded-full" />
              <input
                type="text"
                placeholder="write a comment"
                class="bg-[#181624] px-2 rounded-lg py-1.5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </TheLayout>
</template>

<script setup lang="ts">
import QuoteModal from './../components/QuoteModal.vue'
import TheLayout from '@/components/TheLayout.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import WriteQuote from '@/components/icons/WriteQuote.vue'
import MessageIcon from '@/components/icons/MessageIcon.vue'
import LikeIcon from '@/components/icons/LikeIcon.vue'
import { ref } from 'vue'

const search = ref('')
const isFocused = ref(false)

const handleFocused = () => {
  isFocused.value = true
}
const showModal = ref(false)

const openModal = () => {
  showModal.value = true
}
</script>

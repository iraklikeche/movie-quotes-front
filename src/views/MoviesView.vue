<template>
  <TheLayout :customHeight="'h-full'">
    <main class="px-8 pt-4 sm:w-full">
      <div class="flex items-center justify-between">
        <h2 class="text-white flex flex-col">My list of all movies <span> (total 25) </span></h2>
        <div class="flex gap-4 items-center">
          <input
            class="outline-none w-24 text-white pl-4 py-2 bg-transparent transition-all duration-300 focus:w-[18rem] hidden sm:block"
            placeholder="Search"
          />
          <button class="flex items-center text-white gap-2 bg-[#E31221] px-3 py-1.5 rounded-md">
            <AddQuote />
            Add movie
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 mt-6 sm:w-full gap-12">
        <div class="flex flex-col gap-4 mb-12">
          <img
            src="https://picsum.photos/200"
            class="w-full rounded-xl max-h-[19rem] sm:max-h-[23rem]"
          />
          <span class="text-white font-medium text-2xl">Movie Title (1997)</span>
          <span class="flex items-center gap-2 text-xl text-white font-medium"
            >10 <QuotesIcon
          /></span>
        </div>
        <div class="flex flex-col gap-4 mb-12">
          <img
            src="https://picsum.photos/200"
            class="w-full rounded-xl max-h-[19rem] sm:max-h-[23rem]"
          />
          <span class="text-white font-medium text-2xl">Movie Title (1997)</span>
          <span class="flex items-center gap-2 text-xl text-white font-medium"
            >10 <QuotesIcon
          /></span>
        </div>
        <div class="flex flex-col gap-4 mb-12">
          <img
            src="https://picsum.photos/200"
            class="w-full rounded-xl max-h-[19rem] sm:max-h-[23rem]"
          />
          <span class="text-white font-medium text-2xl">Movie Title (1997)</span>
          <span class="flex items-center gap-2 text-xl text-white font-medium"
            >10 <QuotesIcon
          /></span>
        </div>
        <div class="flex flex-col gap-4 mb-12">
          <img
            src="https://picsum.photos/200"
            class="w-full rounded-xl max-h-[19rem] sm:max-h-[23rem]"
          />
          <span class="text-white font-medium text-2xl">Movie Title (1997)</span>
          <span class="flex items-center gap-2 text-xl text-white font-medium"
            >10 <QuotesIcon
          /></span>
        </div>
        <div class="flex flex-col gap-4 mb-12">
          <img
            src="https://picsum.photos/200"
            class="w-full rounded-xl max-h-[19rem] sm:max-h-[23rem]"
          />
          <span class="text-white font-medium text-2xl">Movie Title (1997)</span>
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
</script>

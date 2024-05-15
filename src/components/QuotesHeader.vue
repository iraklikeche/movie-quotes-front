<template>
  <div class="sm:flex items-center sm:gap-4">
    <div class="flex flex-col sm:flex-row gap-2 my-6 px-8 sm:px-0 sm:items-center">
      <h2 class="text-white text-2xl">{{ $t('texts.all_quotes') }}</h2>
      <span class="text-white text-2xl">({{ $t('texts.total') }} 4)</span>
    </div>
    <div class="text-custom-light-gray text-xl hidden sm:block">|</div>
    <div class="hidden sm:block">
      <button class="bg-custom-red px-4 py-2 text-white">
        {{ $t('texts.add_quote') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

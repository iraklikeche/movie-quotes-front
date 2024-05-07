<template>
  <div class="w-full h-screen bg-[#181623] flex items-center justify-center flex-col gap-8">
    <NotFound />
    <component :is="props.component"></component>
    <h2 class="text-white font-bold text-5xl">{{ props.header }}</h2>
    <p class="text-white text-2xl font-medium">{{ props.text }}</p>
    <RouterLink :to="{ name: 'home' }" class="bg-[#E31221] py-3 px-5 rounded-md text-white text-xl">
      Return home
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  header: String,
  text: String,
  component: Object
})
</script>

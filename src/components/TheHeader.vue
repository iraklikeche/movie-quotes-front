<template>
  <div class="flex justify-between items-center px-4 py-6 sm:px-12">
    <div>
      <h2 class="text-[#ddCCAA] uppercase">movie quotes</h2>
    </div>
    <div>
      <button
        @click="$emit('toggleLogin')"
        class="border border-white bg-transparent text-sm px-5 py-2 rounded-lg text-white mr-4"
      >
        Log in
      </button>
      <button
        class="bg-[#e31221] text-white px-4 py-2 text-sm rounded-lg"
        @click="$emit('toggleSignup')"
      >
        Sign up
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

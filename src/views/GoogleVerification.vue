<template>
  <div class="w-full h-screen flex items-center justify-center bg-[#12101A]">
    <h1 class="text-red-500 font-semibold text-7xl animate-pulse">Redirecting...</h1>
  </div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { callBack } from '@/service/authService'
import { onMounted } from 'vue'
const route = useRoute()
const router = useRouter()

const getToken = async () => {
  const code = route.query.code
  if (!code) {
    console.error('No code provided in the query parameters.')
    return
  }

  const codeValue = Array.isArray(code) ? code[0] : code
  if (typeof codeValue !== 'string') {
    console.error('Code is not a string:', codeValue)
    return
  }
  try {
    await callBack(codeValue)
    localStorage.setItem('isLoggedIn', 'true')

    router.push('/dashboard')
  } catch (err) {
    console.error('Authentication error:', err)
  }
}

onMounted(() => {
  getToken()
})
</script>

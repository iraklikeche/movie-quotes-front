<template>
  <h1>HELLO WORLD</h1>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { callBack } from '@/service/authService.js'
import { onMounted } from 'vue'
const route = useRoute()
const router = useRouter()

const getToken = async () => {
  try {
    await callBack({
      code: route.query.code
    })
    localStorage.setItem('isLoggedIn', true)

    router.push('/dashboard')
  } catch (err) {
    console.error('Authentication error:', err)
  }
}

onMounted(() => {
  getToken()
})
</script>

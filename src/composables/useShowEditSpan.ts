import { ref, onMounted, onUnmounted } from 'vue'

export function useShowEditSpan() {
  const isSpanHidden = ref(true)

  const showEditSpan = () => {
    isSpanHidden.value = true
  }

  onMounted(() => {
    window.addEventListener('showEditSpan', showEditSpan)
  })

  onUnmounted(() => {
    window.removeEventListener('showEditSpan', showEditSpan)
  })

  return {
    isSpanHidden,
    hideSpan: () => {
      isSpanHidden.value = false
    }
  }
}

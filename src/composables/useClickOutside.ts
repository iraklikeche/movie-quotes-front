import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
export default function useClickOutside(
  elementRef: Ref<Element | undefined>,
  isVisible: Ref<boolean>
) {
  const handleClickOutside = (event: MouseEvent) => {
    if (elementRef.value && !elementRef.value.contains(event.target as Node)) {
      isVisible.value = false
    }
  }

  onMounted(() => {
    window.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside)
  })
}

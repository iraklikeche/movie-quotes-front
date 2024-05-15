import { ref } from 'vue'

export function useModal(initialVisible = false) {
  const showModal = ref(initialVisible)

  const toggleModal = () => {
    showModal.value = !showModal.value
  }

  const closeModal = () => {
    showModal.value = false
  }

  const openModal = () => {
    showModal.value = true
  }

  return { showModal, toggleModal, closeModal, openModal }
}

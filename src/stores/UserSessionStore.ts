import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

type ModalContent = {
  icon: string
  mainMessage: string
  subMessage: string
  buttonText: string
  buttonAction?: null | (() => void)
}

export const useUserSessionStore = defineStore('UserSessionStore', () => {
  const showRegister = ref(false)
  const showLogin = ref(false)
  const showForgotPassword = ref(false)
  const showResetPassword = ref(false)
  const successModal = ref(false)
  // const modalContent = ref({
  //   icon: '',
  //   mainMessage: '',
  //   subMessage: '',
  //   buttonText: '',
  //   buttonAction: null
  // })
  const modalContent: Ref<ModalContent> = ref({
    icon: '',
    mainMessage: '',
    subMessage: '',
    buttonText: '',
    buttonAction: null
  })

  function toggleModal(modal: Ref<boolean>) {
    modal.value = !modal.value
  }

  function closeModal() {
    showRegister.value = false
    showLogin.value = false
    showForgotPassword.value = false
    showResetPassword.value = false
  }
  function backToLogIn() {
    closeModal()
    successModal.value = false
    showLogin.value = true
  }

  function redirectToEmailProvider(email: string) {
    const emailDomain = email.split('@')[1]
    let url = ''

    switch (emailDomain) {
      case 'gmail.com':
        url = 'https://mail.google.com'
        break
      case 'yahoo.com':
        url = 'https://mail.yahoo.com'
        break
      case 'outlook.com':
      case 'hotmail.com':
        url = 'https://outlook.live.com'
        break
      default:
        url = 'https://mail.google.com'
        break
    }

    window.location.href = url
  }

  function setModalContent(content: ModalContent, action: (() => void) | null = null) {
    modalContent.value.icon = content.icon
    modalContent.value.mainMessage = content.mainMessage
    modalContent.value.subMessage = content.subMessage
    modalContent.value.buttonText = content.buttonText
    modalContent.value.buttonAction = action ?? content.buttonAction ?? null
    successModal.value = true
  }

  return {
    showRegister,
    showLogin,
    showForgotPassword,
    showResetPassword,
    toggleRegister: () => {
      toggleModal(showRegister), (showLogin.value = false)
    },
    toggleLogin: () => {
      toggleModal(showLogin), (showRegister.value = false)
    },
    toggleForgotPassword: () => {
      toggleModal(showForgotPassword)
      showLogin.value = false
    },
    toggleResetPassword: () => toggleModal(showResetPassword),
    closeModal,
    backToLogIn,
    toggleModal,
    successModal,
    modalContent,
    setModalContent,
    redirectToEmailProvider
  }
})

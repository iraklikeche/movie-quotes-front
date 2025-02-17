<template>
  <transition name="fade">
    <div
      v-if="showModal"
      :class="[
        'fixed top-32 right-3 z-10 text-white py-3 px-4 sm:py-4 sm:px-8 rounded-lg shadow-md transition-all flex gap-20 items-center',
        modalType === 'success' ? 'bg-green-600' : 'bg-red-500'
      ]"
    >
      <p>{{ modalMessage }}</p>
      <span class="sm:hidden" @click="showModal = false">
        <CloseBtn />
      </span>
    </div>
  </transition>

  <TheLayout :customHeight="'min-h-screen'">
    <div class="pt-12 px-8 fixed inset-0 z-10 bg-[#24222f] top-[10%]" v-if="finalCheck">
      <div class="bg-[#24222f] rounded-xl">
        <div class="py-12 flex items-center justify-center border-b border-custom-gray">
          <p class="text-white">{{ $t('texts.sure') }}?</p>
        </div>
        <div class="flex justify-between py-4 px-5">
          <button class="text-custom-gray" @click="closeEditForm">{{ $t('texts.cancel') }}</button>
          <button class="bg-custom-red text-white px-2 py-1.5 rounded-md" @click="onSubmit">
            {{ $t('texts.confirm') }}
          </button>
        </div>
      </div>
    </div>

    <div class="sm:hidden py-6 bg-[#11101A]" v-if="currentMode !== Mode.FINAL_CHECK">
      <div class="px-8">
        <GoBackBtn class="cursor-pointer" @click="goBack" />
      </div>
    </div>

    <!-- Username -->
    <div v-if="currentMode === Mode.EDIT">
      <form class="bg-[#24222F] py-20 flex flex-col px-8">
        <CustomInput
          :label="$t('sessions.username')"
          name="new_username"
          :placeholder="$t('sessions.username_placeholder')"
          rules="required|min:3|max:15|lowercase"
          type="text"
        />
      </form>
      <div class="px-8 flex justify-between mt-6">
        <button class="text-custom-gray" @click="closeEditForm">{{ $t('texts.cancel') }}</button>
        <button class="bg-custom-red text-white px-5 py-1.5 rounded-md" @click="confirmReset">
          {{ $t('texts.edit') }}
        </button>
      </div>
    </div>

    <!-- Reset -->
    <div v-if="currentMode === Mode.RESET">
      <div class="bg-[#24222F] py-20 px-8">
        <form class="flex flex-col gap-5">
          <CustomInput
            :label="$t('sessions.password')"
            name="new_password"
            rules="required|min:8|max:15|lowercase"
            :placeholder="$t('sessions.password_placeholder')"
            isPasswordField
          />

          <CustomInput
            type="password"
            :label="$t('sessions.conf_password')"
            name="new_password_confirmation"
            :placeholder="$t('sessions.conf_password_placeholder')"
            isPasswordField
            rules="required|confirmed:@new_password"
          />
        </form>
      </div>

      <div class="px-8 flex justify-between mt-6">
        <button class="text-custom-gray" @click="closeEditForm">{{ $t('texts.cancel') }}</button>
        <button class="bg-custom-red text-white px-5 py-1.5 rounded-md" @click="confirmReset">
          {{ $t('texts.edit') }}
        </button>
      </div>
    </div>

    <!-- Main -->
    <div v-if="currentMode === Mode.MAIN" class="bg-[#222030] sm:bg-transparent">
      <span class="hidden sm:block text-white text-2xl font-medium mb-28 pl-10">{{
        $t('texts.my_profile')
      }}</span>
      <div class="bg-[#222030] py-8 sm:min-w-[62rem] relative sm:pb-24 sm:rounded-md">
        <!-- MOBILE -->
        <div
          class="flex flex-col justify-center items-center sm:absolute sm:right-1/2 sm:translate-x-1/2 sm:top-0 sm:-translate-y-1/2 gap-2 sm:hidden"
        >
          <input type="file" id="file-upload" @change="handleFileUpload" style="display: none" />

          <label for="file-upload" class="flex flex-col items-center gap-2">
            <TheProfile
              loadingClass="text-red-500 text-3xl"
              imageClass="rounded-full max-h-48 min-w-48 max-w-48"
            />
            <p class="text-white text-xl cursor-pointer">{{ $t('texts.upload_photo') }}</p>
          </label>
        </div>
        <!-- DESKTOP-IMAGE-UPLOAD -->
        <div
          class="sm:flex flex-col justify-center items-center sm:absolute sm:right-1/2 sm:translate-x-1/2 sm:top-0 sm:-translate-y-1/2 gap-2 hidden"
        >
          <input
            type="file"
            id="file-upload-desktop"
            @change="handleFileUploadDesktop"
            style="display: none"
          />

          <label for="file-upload-desktop" class="flex flex-col items-center gap-2">
            <TheProfile
              loadingClass="text-red-500 text-3xl"
              imageClass="rounded-full max-h-48 min-w-48 max-w-48"
            />
            <p class="text-white text-xl cursor-pointer">{{ $t('texts.upload_photo') }}</p>
          </label>
        </div>
        <div class="px-8 mt-16">
          <div class="flex flex-col sm:mt-32 sm:px-48 gap-8">
            <div class="flex flex-col">
              <UsernameStatic
                :disabled="!updateUsername"
                @openMode="openMode(Mode.EDIT)"
                @addNewUser="addNewUserInput"
              />

              <!-- Additional -->
              <div class="relative sm:flex sm:items-center gap-8 mt-8" v-if="updateUsername">
                <div class="sm:w-full">
                  <label class="text-white mb-1">{{ $t('sessions.new_username') }}</label>
                  <Field
                    name="new_username"
                    type="text"
                    class="bg-transparent sm:bg-custom-gray pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-black outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px] sm:max-w-[28.5rem]"
                    :validateOnInput="true"
                    rules="required|min:3|max:15|lowercase"
                  />
                </div>
              </div>
              <ErrorMessage name="new_username" class="text-red-500" />
            </div>

            <EmailStatic />

            <div class="flex flex-col" v-if="showPass">
              <PasswordStatic
                :disabled="!updatePassword"
                @openMode="openMode(Mode.RESET)"
                @addNewPassword="addNewPasswordInput"
              />
              <PasswordResetField v-if="updatePassword" />
            </div>
            <div
              class="justify-end mt-6 gap-8 hidden sm:flex relative sm:max-w-[28.5rem]"
              v-if="updateUsername || updatePassword || updateImage"
            >
              <button class="text-custom-gray" @click="cancelChanges">
                {{ $t('texts.cancel') }}
              </button>
              <button class="bg-custom-red text-white px-5 py-1.5 rounded-md" @click="onSubmit">
                {{ $t('texts.save_changes') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TheLayout>
</template>

<script setup lang="ts">
import PasswordResetField from './../components/PasswordResetField.vue'
import GoBackBtn from '@/components/icons/GoBackBtn.vue'
import TheLayout from '@/components/TheLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { useForm, Field, ErrorMessage } from 'vee-validate'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import CustomInput from '@/components/Form/CustomInput.vue'
import { useRouter } from 'vue-router'
import EmailStatic from '@/components/EmailStatic.vue'
import PasswordStatic from '@/components/PasswordStatic.vue'
import UsernameStatic from '@/components/UsernameStatic.vue'
import { updateUserProfile } from '@/service/authService'
import type { Ref } from 'vue'
import CloseBtn from '@/components/icons/CloseBtn.vue'
import { useI18n } from 'vue-i18n'
import TheProfile from '@/components/TheProfile.vue'

// States

const { t } = useI18n()
const userSession = useUserSessionStore()
const router = useRouter()
const username = computed(() => userSession.userData.username)
const email = ref('')
const updateUsername = ref(false)
const updatePassword = ref(false)
const updateImage = ref(false)
const finalCheck = ref(false)
const showModal = ref(false)
const showPass = ref(false)
const modalType = ref('success')
const modalMessage = ref('')

const profileUploaded: Ref<string | null> = ref(null)
const profileFile: Ref<File | null> = ref(null)

const Mode = {
  MAIN: 'main',
  EDIT: 'edit',
  RESET: 'reset',
  FINAL_CHECK: 'finalCheck'
}

const initialValues = ref({ username: '', email: '', password: '**********' })
const currentMode = ref(Mode.MAIN)
const { setValues, handleSubmit } = useForm()

// Functions
function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) {
    profileUploaded.value = URL.createObjectURL(input.files[0])
    profileFile.value = input.files[0]
    onSubmit()
  }
}
function handleFileUploadDesktop(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) {
    profileUploaded.value = URL.createObjectURL(input.files[0])
    profileFile.value = input.files[0]
    updateImage.value = true
  }
}

const addNewUserInput = () => {
  updateUsername.value = true
}

const addNewPasswordInput = () => {
  updatePassword.value = true
}

const cancelChanges = () => {
  updatePassword.value = false
  updateUsername.value = false
  window.dispatchEvent(new Event('showEditSpan'))
}

const goBack = () => {
  router.go(-1)
}

const openMode = (mode: string) => {
  currentMode.value = mode
}

const closeEditForm = () => {
  currentMode.value = Mode.MAIN
  finalCheck.value = false

  setValues({
    username: username.value,
    email: email.value,
    password: initialValues.value.password
  })
}

const confirmReset = () => {
  finalCheck.value = true
}

// Life-cycles
onMounted(async () => {
  if (localStorage.getItem('isLoggedIn')) {
    await userSession.getUserData()
    email.value = userSession.userData.email
    showPass.value = userSession.userData.google_id ? false : true
  }

  initialValues.value = {
    username: username.value,
    email: email.value,
    password: '**********'
  }
  setValues({
    username: username.value,
    email: email.value,
    password: initialValues.value.password
  })
})

// AJAX

const onSubmit = handleSubmit(async (values) => {
  try {
    const updateData: {
      new_username: string
      new_password: string
      new_password_confirmation: string
      [key: string]: string
    } = {
      new_username: values.new_username,
      new_password: values.new_password,
      new_password_confirmation: values.new_password_confirmation
    }

    Object.keys(updateData).forEach((key) => {
      if (!updateData[key]) {
        delete updateData[key]
      }
    })
    await updateUserProfile(updateData, profileFile.value || undefined)
    await userSession.getUserData()

    closeEditForm()
    window.dispatchEvent(new Event('showEditSpan'))

    updateUsername.value = false
    updatePassword.value = false
    showModal.value = true

    modalType.value = 'success'
    modalMessage.value = t('texts.success')
    showModal.value = true
    setTimeout(() => {
      showModal.value = false
    }, 3000)
  } catch (error) {
    modalType.value = 'error'
    modalMessage.value = t('texts.failed')
    showModal.value = true
    setTimeout(() => {
      showModal.value = false
    }, 3000)
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

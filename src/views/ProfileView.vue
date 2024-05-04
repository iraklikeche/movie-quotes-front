<template>
  <TheLayout :customHeight="'h-screen'">
    <div class="pt-12 px-8" v-if="currentMode === Mode.FINAL_CHECK">
      <div class="bg-[#24222f] rounded-xl">
        <div class="py-12 flex items-center justify-center border-b border-[#CED4DA]">
          <p class="text-white">Are you sure to make changes?</p>
        </div>
        <div class="flex justify-between py-4 px-5">
          <button class="text-[#ced4da]" @click="closeEditForm">Cancel</button>
          <button class="bg-[#E31221] text-white px-2 py-1.5 rounded-md" @click="foo">
            Confirm
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
          name="username"
          :placeholder="$t('sessions.username_placeholder')"
          rules="required|min:3"
          type="text"
        />
      </form>
      <div class="px-8 flex justify-between mt-6">
        <button class="text-[#CED4DA]" @click="closeEditForm">Cancel</button>
        <button class="bg-[#E31221] text-white px-5 py-1.5 rounded-md" @click="confirmEdit">
          Edit
        </button>
      </div>
    </div>

    <!-- Reset -->
    <div v-if="currentMode === Mode.RESET">
      <div class="bg-[#24222F] py-20 px-8">
        <form @submit="onSubmit" class="flex flex-col gap-5">
          <CustomInput
            :label="$t('sessions.password')"
            name="password"
            rules="required|min:3"
            :placeholder="$t('sessions.password_placeholder')"
            isPasswordField
          />

          <CustomInput
            type="password"
            :label="$t('sessions.conf_password')"
            name="password_confirmation"
            :placeholder="$t('sessions.conf_password_placeholder')"
            isPasswordField
            rules="confirmed:@password_confirmation"
          />
        </form>
      </div>

      <div class="px-8 flex justify-between mt-6">
        <button class="text-[#CED4DA]" @click="closeEditForm">Cancel</button>
        <button class="bg-[#E31221] text-white px-5 py-1.5 rounded-md" @click="confirmReset">
          Edit
        </button>
      </div>
    </div>

    <!-- Main -->
    <div v-if="currentMode === Mode.MAIN">
      <span class="hidden sm:block text-white text-2xl font-medium mb-28 pl-10">{{
        $t('texts.my_profile')
      }}</span>
      <div class="bg-[#222030] py-8 sm:min-w-[62rem] relative sm:pb-24 sm:rounded-md">
        <div
          class="flex flex-col justify-center items-center sm:absolute sm:right-1/2 sm:translate-x-1/2 sm:top-0 sm:-translate-y-1/2"
        >
          <img :src="profile" class="rounded-full max-h-48 min-w-48 max-w-48" />
          <p class="text-white text-xl">{{ $t('texts.upload_photo') }}</p>
        </div>
        <div class="px-8 mt-16">
          <div class="flex flex-col sm:mt-32 sm:px-48 gap-8">
            <div class="flex flex-col">
              <label class="text-white mb-1">{{ $t('sessions.username') }}</label>
              <div class="relative sm:flex sm:items-center gap-8">
                <div class="sm:w-full">
                  <Field
                    name="username"
                    type="text"
                    class="bg-transparent sm:bg-red-500 pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-white outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px]"
                    disabled
                  />
                </div>
                <span
                  @click="() => openMode(Mode.EDIT)"
                  class="text-[#CED4DA] absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 cursor-pointer sm:hidden"
                  >{{ $t('texts.edit') }}</span
                >
                <span
                  @click="addNewUserInput"
                  class="text-[#CED4DA] absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 cursor-pointer hidden sm:block"
                  >{{ $t('texts.edit') }}</span
                >
              </div>

              <!-- Additional -->
              <div class="relative sm:flex sm:items-center gap-8 mt-8" v-if="updateUsername">
                <div class="sm:w-full">
                  <label class="text-white mb-1">{{ $t('sessions.new_username') }}</label>
                  <Field
                    name="new_username"
                    type="text"
                    class="bg-transparent sm:bg-red-500 pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-white outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px]"
                  />
                </div>
                <span
                  class="text-[#CED4DA] absolute opacity-0 sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 cursor-pointer"
                  >{{ $t('texts.edit') }}</span
                >
              </div>
            </div>

            <div class="flex flex-col">
              <label class="text-white mb-1">{{ $t('sessions.email') }}</label>
              <div class="relative sm:flex sm:items-center gap-8">
                <Field
                  name="email"
                  type="email"
                  class="bg-transparent sm:bg-red-500 pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-white outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px]"
                  disabled
                />
                <div
                  class="text-red-500 opacity-0 absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0"
                >
                  {{ $t('texts.edit') }}
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <label class="text-white">{{ $t('sessions.password') }}</label>
              <div class="relative sm:flex sm:items-center gap-8">
                <Field
                  name="password"
                  type="password"
                  class="bg-transparent sm:bg-red-500 pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-[#CED4DA] outline-none w-full sm:px-3 sm:rounded-[4px]"
                  disabled
                />
                <span
                  @click="() => openMode(Mode.RESET)"
                  class="text-[#CED4DA] absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 sm:py-1 sm:hidden"
                  >{{ $t('texts.edit') }}</span
                >
                <span
                  @click="addNewPasswordInput"
                  class="text-[#CED4DA] absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 sm:py-1 hidden sm:block"
                  >{{ $t('texts.edit') }}</span
                >
              </div>
              <div v-if="updatePassword" class="relative sm:flex sm:items-center gap-8">
                <div
                  class="border border-[#ced4da] border-opacity-20 hidden sm:block mt-8 px-8 py-5 rounded-md w-full"
                >
                  <p class="text-white">{{ $t('texts.password_contain') }}:</p>
                  <ul class="mt-4">
                    <li class="text-[#9C9A9A]">* 8 {{ $t('texts.password_validation_length') }}</li>
                    <li class="text-[#9C9A9A]">* 15 {{ $t('texts.password_validation_case') }}</li>
                  </ul>
                </div>
                <span
                  class="text-[#CED4DA] absolute opacity-0 sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 cursor-pointer hidden sm:block"
                  >{{ $t('texts.edit') }}</span
                >
              </div>

              <!-- New Password -->
              <div class="mt-8 hidden sm:block" v-if="updatePassword">
                <div class="flex flex-col">
                  <label class="text-white mb-1">{{ $t('sessions.new_password') }}</label>
                  <div class="relative sm:flex sm:items-center gap-8">
                    <div class="sm:w-full">
                      <Field
                        name="new_password"
                        type="password"
                        class="bg-transparent sm:bg-red-500 pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-white outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px]"
                      />
                    </div>
                    <span
                      class="text-[#CED4DA] opacity-0 absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 cursor-pointer hidden sm:block"
                      >{{ $t('texts.edit') }}</span
                    >
                  </div>
                </div>

                <div class="flex flex-col mt-8">
                  <label class="text-white mb-1">{{ $t('sessions.confirm_new_password') }}</label>
                  <div class="relative sm:flex sm:items-center gap-8">
                    <div class="sm:w-full">
                      <Field
                        name="confirm_new_password"
                        type="password"
                        class="bg-transparent sm:bg-red-500 pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-white outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px]"
                      />
                    </div>
                    <span
                      class="text-[#CED4DA] opacity-0 absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 cursor-pointer hidden sm:block"
                      >{{ $t('texts.edit') }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="justify-end mt-6 gap-8 hidden sm:flex" v-if="updateUsername">
        <button class="text-[#CED4DA]" @click="cancelChanges">Cancel</button>
        <button class="bg-[#E31221] text-white px-5 py-1.5 rounded-md" @click="confirmReset">
          Save changes
        </button>
      </div>
    </div>
  </TheLayout>
</template>

<script setup lang="ts">
import GoBackBtn from '@/components/icons/GoBackBtn.vue'
import profile from '@/assets/images/profile.png'
import TheLayout from '@/components/TheLayout.vue'
import { ref, onMounted } from 'vue'
import { useForm, Field } from 'vee-validate'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import CustomInput from '@/components/Form/CustomInput.vue'
import { useRouter } from 'vue-router'

// States
const userSession = useUserSessionStore()
const router = useRouter()
const username = ref('')
const email = ref('')
const updateUsername = ref(false)
const updatePassword = ref(false)

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
const openMode = (mode: string) => {
  currentMode.value = mode
}

const closeEditForm = () => {
  currentMode.value = Mode.MAIN

  setValues({
    username: username.value,
    email: email.value,
    password: initialValues.value.password
  })
}

const confirmEdit = () => {
  openMode(Mode.FINAL_CHECK)
}

const confirmReset = () => {
  openMode(Mode.FINAL_CHECK)
}

const onSubmit = handleSubmit((values) => {
  console.log('Form Values:', values)
  console.log('Username:', values.username)
  console.log('Password:', values.password)
  console.log('Password Confirmation:', values.password_confirmation)

  closeEditForm()
})

const foo = () => {
  onSubmit()
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
}

const goBack = () => {
  router.go(-1)
}

// Life-cycles
onMounted(async () => {
  if (localStorage.getItem('isLoggedIn')) {
    await userSession.getUserData()
    username.value = userSession.userData.username
    email.value = userSession.userData.email
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
</script>

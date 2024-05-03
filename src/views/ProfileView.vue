<template>
  <TheLayout :customHeight="'h-screen'">
    <!-- I know it's ugly I will refactor it tomorrow -->
    <div class="pt-12 px-8" v-if="finalCheck">
      <div class="bg-[#24222f] rounded-xl">
        <div class="py-12 flex items-center justify-center border-b border-[#CED4DA]">
          <p class="text-white">Are you sure to make changes?</p>
        </div>
        <div class="flex justify-between py-4 px-5">
          <button class="text-[#ced4da]" @click="closeEditFrom">Cancel</button>
          <button class="bg-[#E31221] text-white px-2 py-1.5 rounded-md" @click="onSubmit">
            Confirm
          </button>
        </div>
      </div>
    </div>

    <div class="sm:hidden py-6 bg-[#11101A]" v-if="!finalCheck">
      <div class="px-8">
        <GoBackBtn />
      </div>
    </div>
    <div v-if="edit">
      <div class="bg-[#24222F] py-20 flex flex-col px-8">
        <label class="text-white mb-1">Enter new username</label>
        <input type="text" class="bg-[#CED4DA] py-2 rounded-md pl-4" v-model="name" />
      </div>
      <div class="px-8 flex justify-between mt-6">
        <button class="text-[#CED4DA]" @click="closeEditFrom">Cancel</button>
        <button class="bg-[#E31221] text-white px-5 py-1.5 rounded-md" @click="handleEdit">
          Edit
        </button>
      </div>
    </div>
    <div v-if="reset">
      <div class="bg-[#24222F] py-20 px-8">
        <Form class="flex flex-col gap-5">
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
        </Form>
      </div>

      <div class="px-8 flex justify-between mt-6">
        <button class="text-[#CED4DA]" @click="closeEditFrom">Cancel</button>
        <button class="bg-[#E31221] text-white px-5 py-1.5 rounded-md" @click="handleEdit">
          Edit
        </button>
      </div>
    </div>

    <div v-if="foo">
      <span class="hidden sm:block text-white text-2xl font-medium mb-28 pl-10">{{
        $t('texts.my_profile')
      }}</span>
      <div class="bg-[#222030] py-8 sm:min-w-[62rem] relative sm:pb-32 sm:rounded-md">
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
                <Field
                  name="username"
                  type="text"
                  class="bg-transparent sm:bg-red-500 pb-2 border-b placeholder:text-white sm:placeholder:text-[#212529] text-white outline-none sm:py-1 sm:px-3 w-full sm:rounded-[4px]"
                  disabled
                />
                <span
                  @click="openEditForm"
                  class="text-[#CED4DA] absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 cursor-pointer"
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
                  @click="openResetPasswordForm"
                  class="text-[#CED4DA] absolute sm:static right-0 top-[40%] -translate-y-1/2 sm:-translate-y-0 sm:py-1"
                  >{{ $t('texts.edit') }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TheLayout>
</template>

<script setup lang="ts">
import GoBackBtn from '@/components/icons/GoBackBtn.vue'
import profile from '@/assets/images/profile.png'
import TheLayout from '@/components/TheLayout.vue'
import { ref, onMounted } from 'vue'
import { useForm, Field, Form } from 'vee-validate'
import { useUserSessionStore } from '@/stores/UserSessionStore'
import CustomInput from '@/components/Form/CustomInput.vue'

const userSession = useUserSessionStore()

const username = ref('')
const email = ref('')
const edit = ref(false)
const name = ref('')
const finalCheck = ref(false)
const foo = ref(true)
const reset = ref(false)
const { setValues } = useForm()

const handleEdit = () => {
  edit.value = false
  finalCheck.value = true
  reset.value = false
}

const openResetPasswordForm = () => {
  reset.value = true
  foo.value = false
}

const openEditForm = () => {
  foo.value = false
  edit.value = true
}

const closeEditFrom = () => {
  foo.value = true
  edit.value = false
  finalCheck.value = false
}

const onSubmit = () => {
  closeEditFrom()
}

onMounted(async () => {
  if (localStorage.getItem('isLoggedIn')) {
    await userSession.getUserData()
    username.value = userSession.userData.username
    email.value = userSession.userData.email
  }
  setValues({
    username: username.value,
    email: email.value,
    password: '**********'
  })
})
</script>

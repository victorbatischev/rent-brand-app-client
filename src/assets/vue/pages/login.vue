<template>
  <div class="page" :style="`background: ${config.PRIMARY_COLOR};`">
    <f7-link
      class="login-back-button"
      v-if="authStage > 0"
      icon-f7="chevron_left"
      @click="authStage = 0"
      color="white"
    ></f7-link>

    <div class="page-padding-appbar" />

    <pre-loader v-if="load" />

    <div v-if="!load" class="loyal-login-header-block">
      <p class="loyal-login-header">
        <img :src="require('../../images/rentbrandapp.svg').default" />
      </p>
    </div>

    <div v-if="!load && authStage === 0" class="loyal-login-block">
      <form @submit="checkForm" class="loyal-login-inputs">
        <base-input
          class="loyal-login-phone-input"
          type="tel"
          pattern="+7 ### ###-##-##"
          name="phone"
          placeholder="Введите номер телефона"
        />
        <primary-button class="primary-button" title="Продолжить" />
        <div class="loyal-login-password" @click="authStage = 2">
          У меня есть логин и пароль
        </div>
      </form>
    </div>

    <div v-if="!load && authStage === 1" class="loyal-login-block">
      <form @submit="getBack" @input="enterCode" class="loyal-login-inputs">
        <base-input
          onlyfocused="true"
          autofocus="true"
          type="tel"
          name="code"
          pattern="####"
          title="Введите код подтверждения из SMS"
          class="loyal-login-code-input"
          placeholder="Код подтверждения из SMS"
        />
        <primary-button class="primary-button" title="Назад" />
      </form>
    </div>

    <div v-if="!load && authStage === 2" class="loyal-login-block">
      <form @submit="getUserToken" class="loyal-login-inputs">
        <base-input
          class="loyal-login-phone-input"
          type="text"
          placeholder="Введите логин"
          name="login"
        />
        <base-input
          class="loyal-login-phone-input"
          type="password"
          placeholder="Введите пароль"
          name="password"
        />
        <primary-button class="primary-button" title="Авторизация" />
      </form>
    </div>
  </div>
</template>

<script>
import CONFIG from '../../../config'
import BaseInput from '../components/input'
import PrimaryButton from '../components/primarybutton'
import PreLoader from '../components/preloader'
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  components: {
    BaseInput,
    PrimaryButton,
    PreLoader
  },

  data() {
    return {
      authStage: 0,
      config: CONFIG,
      load: false,
      codeInput: '',
      sid: '',
      phone: '',
      guestToken: null,
      userId: null,
      listener: null
    }
  },

  methods: {
    enterCode: function(e) {
      this.codeInput = e.target.value

      if (this.codeInput.length === 4) {
        this.attemptAuth()
      }
    },

    checkForm: async function(e) {
      e.preventDefault()

      const phone = this.cleanStr(e.target.phone.value)

      if (!phone.length) {
        FCM.getToken()
          .then((token) => {
            this.$f7.dialog.alert(token, CONFIG.COMPANY_NAME)
          })
          .catch((e) => {
            this.$f7.dialog.alert(e, CONFIG.COMPANY_NAME)
          })
      }

      if (phone.length !== 12) {
        return this.$f7.dialog.alert(
          'Введите правильный номер телефона!',
          CONFIG.COMPANY_NAME
        )
      }

      this.load = true
      this.phone = phone

      await axios
        .post(CONFIG.API_URL.replace('api/', 'auth/') + 'get-code', {
          phone,
          companyId: CONFIG.COMPANY_ID
        })
        .then((res) => {
          if (res.status !== 201) {
            this.load = false
            this.$f7.dialog.alert(
              'Произошла ошибка при отправке SMS сообщения!',
              CONFIG.COMPANY_NAME
            )
          }

          this.sid = res.data.sid
          this.authStage = 1
        })
        .catch((e) => {
          this.$f7.dialog.alert(
            'Достигнут лимит отправки SMS сообщений. Попробуйте позже!',
            CONFIG.COMPANY_NAME
          )
          this.load = false
        })

      this.load = false
    },

    getBack() {
      this.load = true
      this.authStage = 0
      window.location.reload()
    },

    async attemptAuth() {
      await axios
        .post(CONFIG.API_URL.replace('api/', 'auth/') + 'sms-login', {
          sid: this.sid,
          smsCode: Number(this.codeInput),
          phone: this.phone
        })
        .then(async (res) => {
          if (res.status === 201) {
            this.userId = res.data.id

            localStorage.setItem('token', res.data.access_token)
            localStorage.setItem('phone', this.phone)
            localStorage.setItem('userId', this.userId)

            this.userLogged({
              phone: this.phone,
              token: res.data.access_token,
              userId: this.userId
            })

            this.$f7router.navigate('/main', {
              clearPreviousHistory: true
            })
          }
        })
        .catch((e) => {
          console.log(e)
          if (e.response.status === 404) {
            this.registerUser()
          } else {
            this.registerError()
          }
        })
    },

    async addUserData() {
      await axios
        .patch(
          `${CONFIG.API_URL}user/${this.userId}/stuff`,
          {
            companyId: CONFIG.COMPANY_ID,
            roleName: 'user',
            deviceToken: localStorage.getItem('fbToken') || ''
          },
          {
            headers: {
              Authorization: 'Bearer ' + this.guestToken
            }
          }
        )
        .then(async () => {
          await axios
            .post(CONFIG.API_URL.replace('api/', 'auth/') + 'login', {
              username: this.phone,
              password: CONFIG.USERS_PASS
            })
            .then(async (res) => {
              localStorage.setItem('token', res.data.access_token)
              localStorage.setItem('phone', this.phone)
              localStorage.setItem('userId', res.data.id)

              this.userLogged({
                phone: this.phone,
                token: res.data.access_token,
                userId: res.data.id
              })

              this.$f7router.navigate('/main', {
                clearPreviousHistory: true
              })
            })
            .catch((e) => {
              this.authError()
            })
        })
    },

    cleanStr: function(str) {
      let _str = ''
      for (let i = 0; i < str.length; i++) {
        if (str[i] === ' ' || str[i] === '-') {
          continue
        } else {
          _str += str[i]
        }
      }

      return _str
    },

    async registerUser() {
      await axios
        .post(CONFIG.API_URL + 'user/sms', {
          login: this.phone,
          password: CONFIG.USERS_PASS,
          phone: this.phone,
          smsAuthDto: {
            sid: this.sid,
            phone: this.phone,
            smsCode: Number(this.codeInput)
          },
          status: 'active'
        })
        .then(async (res) => {
          this.userId = res.data.id
          await this.getGuestToken()
          await this.addUserData()
        })
        .catch((e) => {
          console.log(e)
        })
    },

    async getGuestToken() {
      await axios
        .post(CONFIG.API_URL.replace('api/', 'auth/') + 'login', {
          username: CONFIG.GUEST_USERNAME,
          password: CONFIG.GUEST_PASSWORD
        })
        .then(async (res) => {
          if (res.status === 201) {
            this.guestToken = res.data.access_token
          }
        })
        .catch((e) => {
          this.registerError()
        })
    },

    getUserToken: async function(e) {
      e.preventDefault()
      const login = this.cleanStr(e.target.login.value)
      const password = this.cleanStr(e.target.password.value)

      if (!login.length || !password.length) {
        return this.$f7.dialog.alert(
          'Введите правильный логин и пароль!',
          CONFIG.COMPANY_NAME
        )
      }

      this.load = true

      await axios
        .post(CONFIG.API_URL.replace('api/', 'auth/') + 'login', {
          username: login,
          password: password
        })
        .then(async (res) => {
          localStorage.setItem('token', res.data.access_token)
          localStorage.setItem('userId', res.data.id)

          this.userLogged({
            login,
            password,
            token: res.data.access_token,
            userId: res.data.id
          })

          this.$f7router.navigate('/main', {
            clearPreviousHistory: true
          })
        })
        .catch((e) => {
          this.authError()
        })

      this.load = false
    },

    authError() {
      this.$f7.dialog.alert(
        'Произошла ошибка при авторизации!',
        CONFIG.COMPANY_NAME
      )
      this.phone = ''
      this.codeInput = ''
      this.sid = ''
      this.authStage = 0
      this.load = false
    },

    registerError() {
      this.$f7.dialog.alert(
        'Произошла ошибка при регистрации!',
        CONFIG.COMPANY_NAME
      )
      this.phone = ''
      this.codeInput = ''
      this.sid = ''
      this.authStage = 0
      this.load = false
    },

    ...mapActions(['userLogged'])
  },

  created() {
    const listener = document.addEventListener(
      'backbutton',
      (e) => {
        e.preventDefault()
        this.authStage = 0
      },
      { once: true }
    )

    this.listener = listener
  }
}
</script>

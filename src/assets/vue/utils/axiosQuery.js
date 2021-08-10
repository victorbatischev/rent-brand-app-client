import axios from 'axios'
import CONFIG from '../../../config'

const query = axios.create()

query.interceptors.request.use(
  (conf) => {
    const token = localStorage.getItem('token')

    if (token) {
      conf.headers.post['Authorization'] = 'Bearer ' + token
      conf.headers.get['Authorization'] = 'Bearer ' + token
      conf.headers.patch['Authorization'] = 'Bearer ' + token
    }

    return conf
  },
  (err) => {
    console.error('Произошла ошибка при отправке запроса!' + err)
    return err
  }
)

query.interceptors.response.use(
  (res) => {
    return res
  },
  async (e) => {
    if (e && e.response && e.response.status) {
      switch (e.response.status) {
        case 401: {
          const phone = localStorage.getItem('phone')

          if (phone) {
            await axios
              .post(CONFIG.API_URL.replace('api/', 'auth/') + 'login', {
                username: phone,
                password: CONFIG.USERS_PASS
              })
              .then((res) => {
                if (res.status === 201) {
                  localStorage.setItem('token', res.data.access_token)
                  return query.request(err.config)
                }
              })
              .catch(() => {
                localStorage.removeItem('token')
                localStorage.removeItem('phone')
                localStorage.removeItem('userId')
              })
          }
          localStorage.removeItem('token')
          localStorage.removeItem('phone')
          localStorage.removeItem('userId')
        }
      }
    }
    return e
  }
)

export default query

import request from '@/utils/request'

const api = {
  saveEmailSetting: 'setting/email/'
}

export default api

export function saveEmailSetting(parameter) {
  return request({
    url: api.saveEmailSetting,
    method: 'post',
    data: parameter
  })
}

import request from '@/utils/request'

const api = {
    receiverTemplateAll: 'http://111.229.44.186:3000/mock/11/manager/template/receiver'
}

export default api

export function receiverTemplateAll (parameter) {
  return request({
    url: api.receiverTemplateAll,
    method: 'get',
    data: parameter
  })
}

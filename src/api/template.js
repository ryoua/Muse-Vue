import request from '@/utils/request'

const api = {
    receiverTemplateAll: 'http://127.0.0.1:8443/manager/template/receiver',
    addReceiverTemplate: 'http://127.0.0.1:8443/manager/template/receiver'
}

export default api

export function receiverTemplateAll (parameter) {
  return request({
    url: api.receiverTemplateAll,
    method: 'get',
    params: parameter
  })
}

export function addReceiverTemplate (parameter) {
  return request({
    url: api.addReceiverTemplate,
    method: 'post',
    data: parameter
  })
}

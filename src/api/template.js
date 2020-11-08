import request from '@/utils/request'

const api = {
    receiverTemplateAll: 'http://127.0.0.1:8443/manager/template/receiver/getAll',
    addReceiverTemplate: 'http://127.0.0.1:8443/manager/template/receiver/add',
    deleteReceiverTemplateById: 'http://127.0.0.1:8443/manager/template/receiver/delete',
    deleteReceiverTemplateByIds: 'http://127.0.0.1:8443/manager/template/receiver/delete/batch',


    messageTemplateAll: 'http://127.0.0.1:8443/manager/template/message/getAll',
    addMessageTemplate: 'http://127.0.0.1:8443/manager/template/message/add',
    deleteMessageTemplateById: 'http://127.0.0.1:8443/manager/template/message/delete',
    deleteMessageTemplateByIds: 'http://127.0.0.1:8443/manager/template/message/delete/batch',
    getMessageTemplateDetail: 'http://127.0.0.1:8443/manager/template/message/detail',
}

export default api

export function receiverTemplateAll (parameter, data) {
  return request({
    url: api.receiverTemplateAll,
    method: 'post',
    params: parameter,
    data: data
  })
}


export function addReceiverTemplate (parameter) {
  return request({
    url: api.addReceiverTemplate,
    method: 'post',
    data: parameter
  })
}

export function deleteReceiverTemplateById (id) {
  return request({
    url: api.deleteReceiverTemplateById + '/' + id,
    method: 'post',
  })
}

export function deleteReceiverTemplateByIds (ids) {
  return request({
    url: api.deleteReceiverTemplateByIds,
    method: 'post',
    data: ids
  })
}




export function messageTemplateAll (parameter, data) {
  return request({
    url: api.messageTemplateAll,
    method: 'post',
    params: parameter,
    data: data
  })
}


export function addMessageTemplate (parameter) {
  return request({
    url: api.addMessageTemplate,
    method: 'post',
    data: parameter
  })
}

export function deleteMessageTemplateById (id) {
  return request({
    url: api.deleteMessageTemplateById + '/' + id,
    method: 'post',
  })
}

export function deleteMessageTemplateByIds (ids) {
  return request({
    url: api.deleteMessageTemplateByIds,
    method: 'post',
    data: ids
  })
}

export function getMessageTemplateDetail (id) {
  return request({
    url: api.getMessageTemplateDetail + '/' + id,
    method: 'get',
  })
}
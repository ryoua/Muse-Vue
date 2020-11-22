import request from '@/utils/request'

const api = {
  getSendNameIsExist: 'manager/message/send/name',
  getAllReceiverTemplateName: 'manager/template/receiver/getAllTemplateName',
  getReceiverTemplateNameLike: 'manager/template/receiver/getTemplateNameLike',
  getAllMessageTemplateName: 'manager/template/message/getAllTemplateName',
  searchMessageTemplateName: 'manager/template/message/search',
  getMessageTemplateNameLike: 'manager/template/message/getTemplateNameLike',
  getAllMessageSendHistory: 'manager/message/send/history/all',
  sendMessage: 'manager/message/send'
}

export default api

export function getAllMessageSendHistory(parameter, data) {
  return request({
    url: api.getAllMessageSendHistory,
    method: 'post',
    params: parameter,
    data: data
  })
}

export function sendMessage(parameter) {
  return request({
    url: api.sendMessage,
    method: 'post',
    data: parameter
  })
}

export function getSendNameIsExist(parameter) {
  return request({
    url: api.getSendNameIsExist + '/' + parameter,
    method: 'get'
  })
}

export function getAllReceiverTemplateName() {
  return request({
    url: api.getAllReceiverTemplateName,
    method: 'get'
  })
}

export function getReceiverTemplateNameLike(parameter) {
  return request({
    url: api.getReceiverTemplateNameLike,
    method: 'get',
    param: parameter
  })
}

export function getAllMessageTemplateName(paramter) {
  return request({
    url: api.getAllMessageTemplateName + '/' + paramter,
    method: 'get'
  })
}

export function searchMessageTemplateName(parameter) {
  return request({
    url: api.searchMessageTemplateName,
    method: 'get',
    params: parameter
  })
}

export function getMessageTemplateNameLike(parameter) {
  return request({
    url: api.getMessageTemplateNameLike,
    method: 'get',
    param: parameter
  })
}
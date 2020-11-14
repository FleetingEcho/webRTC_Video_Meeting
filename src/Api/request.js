import axios from './index'

export const enterRoom = (params) => {
  return axios.request({
    url:  '/room',
    method: 'post',
    data:params
  })
}
// 离开
export const leaveRoom = (params) => {
  return axios.request({
    url:  '/room',
    method: 'delete',
    data:params
  })
}
// 更新
export const updateRoomSocket = (params) => {
  return axios.request({
    url:  '/room',
    method: 'put',
    data:params
  })
}

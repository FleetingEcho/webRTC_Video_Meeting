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


// 查看头像占用情况
export const getIconList = (params) => {
  return axios.request({
    url:  '/list',
    method: 'post',
    data:params
  })
}
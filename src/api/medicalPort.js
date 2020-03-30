import request from '@/utils/request'

// 查询运送类型
export function queryTransportType() {
  return request({
    url: '',
    method: 'get'
  })
};
// 查询目的地(科室)
export function queryAllDestination() {
  return request({
    url: '',
    method: 'get'
  })
};
// 查询转运工具
export function queryTransportTools() {
  return request({
    url: '',
    method: 'get'
  })
};
// 生成调度任务
export function generateDispatchTask() {
  return request({
    url: '',
    method: 'post'
  })
};
// 查询生成的调度任务
export function queryGenerateDispatchTask() {
  return request({
    url: '',
    method: 'post'
  })
};
// 查询历史调度任务(已完成)
export function queryhistoryDispatchTask() {
  return request({
    url: '',
    method: 'get'
  })
};
// 收藏调度任务(经常发起)
export function collectDispatchTask() {
  return request({
    url: '',
    method: 'get'
  })
};
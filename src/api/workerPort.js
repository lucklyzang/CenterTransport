import request from '@/utils/request'

// 获取所有任务数量
export function getAllTaskNumber(proID,workerId) {
  return request({
    url: `worker/taskCount/${proID}/${workerId}`,
    method: 'get'
  })
};

/**
 * 调度任务
*/

// 查询调度任务(分配给本人的)
export function getDispatchTaskMessage(proID,workerId) {
  return request({
    url: `task/allTask/${proID}/${workerId}`,
    method: 'get',
  })
};
// 调度任务的操作(更新、延迟、取消)
export function updateDispatchTask(data) {
  return request({
    url: 'task/update',
    method: 'put',
    data
  })
};
// // 调度任务的延迟
// export function delayDispatchTask(data) {
//   return request({
//     url: 'task/update',
//     method: 'put',
//     data
//   })
// };
// // 调度任务的取消
// export function cancelDispatchTask(data) {
//   return request({
//     url: 'task/update',
//     method: 'post',
//     data
//   })
// };
// 任务取消原因查询
export function queryTaskCancelReason(data) {
  return request({
    url: 'cancel/queryAll',
    method: 'get',
    params: data
  })
};
// 任务延迟原因查询
export function queryTaskDelayReason(data) {
  return request({
    url: 'delay/queryAll',
    method: 'get',
    params: data
  })
};

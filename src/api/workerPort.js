import request from '@/utils/request'

// 查询总量和排序
export function queryAllTaskMessage(proID,workerId) {
  return request({
    url: 'worker/countRank',
    method: 'get'
  })
};

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
// 调度任务批量取消
export function cancelDispatchTaskBatch(data) {
  return request({
    url: 'task/batchCancel',
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

// 调度任务的转移
export function transferDispatchTask(data) {
  return request({
    url: 'task/transfer',
    method: 'put',
    data
  })
};
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
// 调度任务(出发地 目的地)扫码确认
export function dispatchTaskSweepCodeSure(data) {
  return request({
    url: 'delay/checkTransTask',
    method: 'post',
    data
  })
};
/**
 * 循环任务
*/

// 查询循环任务
export function queryCirculationTask(data) {
  return request({
    url: 'circleTask/workerTask',
    method: 'get',
    params: data
  })
};

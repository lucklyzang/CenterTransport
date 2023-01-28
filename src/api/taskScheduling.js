import request from '@/utils/request'
import store from '@/store';
// 调度任务列表查询(单病人)
export function dispathSinglePatientList (state,proId) {
    return request({
      url: `task/index/qtdTask?state=${state}&proId=${proId}`,
      method: 'get'
    })
  };

// 调度任务分配
export function assignDispathTask (data) {
  return request({
    url: 'task/assignTask',
    method: 'put',
    data
  })
};

// 调度任务延迟
export function delayDispathTask (data) {
  return request({
    url: 'task/delay',
    method: 'put',
    data
  })
};

// 调度任务取消
export function cancelDispathTask (data) {
  return request({
    url: 'task/cancel',
    method: 'put',
    data
  })
};

// 预约任务列表查询(单病人)
export function appointList (state,proId) {
    return request({
      url: `bookTask/index/queryTask?state=${state}&proId=${proId}`,
      method: 'get'
    })
  };


// 预约任务创建
export function createAppoint (data) {
  return request({
    url: 'bookTask/save',
    method: 'post',
    data
  })
};

// 预约任务分配
export function assignAppointTask (data) {
  return request({
    url: 'bookTask/assignTask',
    method: 'put',
    data
  })
};

// 预约任务延迟
export function delayAppointTask (data) {
  return request({
    url: 'bookTask/delayTask',
    method: 'put',
    data
  })
};

// 预约任务取消
export function cancelAppointTask (data) {
  return request({
    url: 'bookTask/cancelTask',
    method: 'put',
    data
  })
};

// 预约任务编辑

export function editAppoint (data) {
  return request({
    url: 'bookTask/modify',
    method: 'put',
    data
  })
};

// 调度任务编辑(单病人)
export function editDispathTaskSingle (data) {
  return request({
    url: 'task/updateTrans',
    method: 'post',
    data
  })
};
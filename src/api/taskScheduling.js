import request from '@/utils/request'
import store from '@/store';
// 调度任务列表查询(单病人)
export function dispathSinglePatientList (state,proId) {
    return request({
      url: `task/index/qtdTask?state=${state}&proId=${proId}`,
      method: 'get'
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
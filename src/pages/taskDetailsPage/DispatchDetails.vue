<template>
  <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
    </HeaderTop>
    <div class="basic-message">
      <p class="basic-message-title">基本信息</p>
       <div class="wait-handle-message">
        <div class="handle-message-line-wrapper">
          <P>
            <span class="message-tit">任务类型:</span>
            <span class="message-tit-real">{{dispatchTaskMessage.taskTypeName}}</span>
          </P>
          <p>
            <span class="message-tit">优先级:</span>
            <span class="message-tit-real" style="color:red">{{priorityTransfer(dispatchTaskMessage.priority)}}</span>
          </p>
        </div>
        <div class="handle-message-line-wrapper">
          <p>
            <span class="message-tit">任务状态:</span>
            <span class="message-tit-real">{{stateTransfer(dispatchTaskMessage.state)}}</span>
          </p>
        </div>
        <div class="handle-message-line-wrapper handle-message-line-wrapper-other">
          <p>
            <span class="message-tit">任务时间:</span>
            <span class="message-tit-real">{{dispatchTaskMessage.planStartTime}}</span>
          </p>
        </div>
        <div class="handle-message-line-wrapper">
          <P>
            <span class="message-tit">病人姓名:</span>
            <span class="message-tit-real">{{dispatchTaskMessage.patientName == "" ? '无' : dispatchTaskMessage.patientName}}</span>
          </P>
          <p>
            <span class="message-tit">床号:</span>
            <span class="message-tit-real">{{dispatchTaskMessage.bedNumber == "" ? '无' : dispatchTaskMessage.bedNumber}}</span>
          </p>
        </div>
        <div class="handle-message-line-wrapper">
          <p>
            <span class="message-tit">数量:</span>
            <span class="message-tit-real">{{dispatchTaskMessage.actualCount == '' ? "无" : dispatchTaskMessage.actualCount}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="office-list">
      <div class="basic-message-title">地点轨迹</div>
      <div class="office-list-inner-wrapper">
        <p class="track-name" v-if="dispatchTaskMessage.state !== 7">
          <span>{{dispatchTaskMessage.hasSanOut ? dispatchTaskMessage.hasSanOut.split(';')[0] : ''}}</span>
          <span v-show="dispatchTaskMessage.hasSanOut!=''" class="collect-parcel">(取件)</span>
          <span v-for="(item,index) in dispatchTaskMessage.distName" :key="`we${item}-${index}`">{{item}}
            <span class="send-parcel">(送件)</span>
          </span>
        </p>
        <p class="track-name" v-else>
          <span>{{dispatchTaskMessage.setOutPlaceName}}</span>
          <span class="collect-parcel">(取件)</span>
          <span v-for="(item,index) in dispatchTaskMessage.distName" :key="`we${item}-${index}`">{{item}}
            <span class="send-parcel">(送件)</span>
          </span>
          <span v-show="dispatchTaskMessage.isBack == 1">{{dispatchTaskMessage.setOutPlaceName}}</span>
          <span v-show="dispatchTaskMessage.isBack == 1" class="collect-parcel">(取件)</span>
        </p>
      </div>
    </div>
    <div class="circultion-task-btn">
      <p class="circultion-task-btn-top" v-show="dispatchTaskMessage.state != 7">
        <span @click="joinSweepCode">取件</span>
        <span @click="joinSweepCode">送件</span>
      </p>
      <p class="circultion-task-btn-bottom" v-show="!isSingleDestination && dispatchTaskMessage.state != 7">
        <span @click="endTask">完成任务</span>
      </p>
      <p class="circultion-task-btn-bottom" v-show="dispatchTaskMessage.state == 7">
        <span @click="backTo">返回</span>
      </p>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import FooterBottom from '@/components/FooterBottom'
import {} from '@/api/medicalPort.js'
import {updateDispatchTask} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC, removeBlock, Dictionary, deepClone, repeArray} from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      liIndex: null,
      trackList: []
    }
  },

  components: {
    HeaderTop,
    NoData,
    FooterBottom
  },

  computed: {
    ...mapGetters([
      'navTopTitle',
      'userInfo',
      'completeDeparnmentInfo',
      'isCompleteSweepCodeDestinationList',
      'departmentInfoListNo',
      'dispatchTaskMessage',
      'isSingleDestination',
      'dispatchTaskState',
      'dispatchTaskDepartmentType',
      'isCompleteSweepCode',
      'isBack'
    ]),

    proId () {
      return this.userInfo.extendData.proId
    },
    userName () {
      return this.userInfo.userName
    },
    proName () {
      return this.userInfo.extendData.proName
    },
    workerId () {
      return this.userInfo.extendData.userId
    },
    taskId () {
      return this.dispatchTaskMessage.id
    }
  },

  beforeRouteLeave(to, from, next) {
    if (to.name == 'dispatchTaskSweepCode') {
      // 设置下一个路由的 meta
      to.meta.keepAlive = false;
    } else {
      to.meta.keepAlive = true;
    };
    next()
  },

  mounted () {
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        if (this.dispatchTaskMessage.state == 7) {
          this.changeIsFreshDispatchTaskPage(false)
        } else {
          this.changeIsFreshDispatchTaskPage(true)
        };
        this.$router.push({path:'/dispatchTask'});
        this.changeTitleTxt({tit:'调度任务'});
        setStore('currentTitle','调度任务')
      })
    };
    if (!this.isSingleDestination) {
      this.getDepartmentName()
    }
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeIsCompleteSweepCodeDestinationList',
      'changeisCompleteSweepCode',
      'changeIsFreshDispatchTaskPage'
    ]),

    // 返回上一页
    backTo () {
      if (this.dispatchTaskMessage.state == 7) {
        this.changeIsFreshDispatchTaskPage(false)
      } else {
        this.changeIsFreshDispatchTaskPage(true)
      };
      this.$router.push({path:'/dispatchTask'});
      this.changeTitleTxt({tit:'调度任务'});
      setStore('currentTitle','调度任务')
    },

    // 结束任务
    endTask () {
      if (this.dispatchTaskMessage.distName.length == 0) {
        this.$dialog.alert({
          message: '至少完成一个目的时,才能结束任务',
          showCancelButton: false
        })
        .then(() => {
        });
        return
      };
      if (this.dispatchTaskMessage.state == 4) {
        this.$dialog.alert({
          message: '请再次扫描出发地结束任务',
          showCancelButton: true
        })
        .then(() => {
        })
      } else {
        this.$dialog.alert({
          message: '确定结束任务?',
          showCancelButton: true
        })
        .then(() => {
          this.judgeIsGoDeparture()
        })
        .catch((err) => {
        })
      }
    },

    // 判断是否需要要回到出发地 0不回 1回
    judgeIsGoDeparture () {
      if (this.isBack == 1) {
        // 需要回到出发地时更新任务状态为4未结束
        this.updateTaskState({
          proId: this.proId, //当前项目ID
          id: this.dispatchTaskMessage.id, //当前任务ID
          state: 4//更新后的状态 {0: '未分配', 1: '未查阅', 2: '未开始', 3: '进行中', 4: '未结束', 5: '已延迟', 6: '已取消', 7: '已完成'
        })
      } else {
        this.updateTaskState({
          proId: this.proId, //当前项目ID
          id: this.dispatchTaskMessage.id, //当前任务ID
          state: this.dispatchTaskState//更新后的状态 {0: '未分配', 1: '未查阅', 2: '未开始', 3: '进行中', 4: '未结束', 5: '已延迟', 6: '已取消', 7: '已完成'
        })
      }
    },

     // 更新任务状态
    updateTaskState (data) {
      updateDispatchTask(data).then((res) => {
        if (res && res.data.code == 200) {
          // 为单一类型目的地或第二次扫出发地时结束该任务
          if ((this.dispatchTaskDepartmentType == 1 && this.isSingleDestination && this.dispatchTaskState != 4) || (this.dispatchTaskState == 7)) {
            this.$dialog.alert({
              message: '该条任务已完成',
              closeOnPopstate: true
            }).then(() => {
            });
            // 清空该完成任务存储的已扫过非单一目的地科室信息
            let temporarySweepCodeOficeList = deepClone(this.isCompleteSweepCodeDestinationList);
            temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return item.taskId != this.taskId});
            this.changeIsCompleteSweepCodeDestinationList(temporarySweepCodeOficeList);
            setStore('completeDispatchSweepCodeDestinationInfo', {"sweepCodeInfo": temporarySweepCodeOficeList})
          };
          // 清空完成该任务存储的已扫过出发地和单一目的地科室信息
          let temporarySweepCodeOficeList = deepClone(this.isCompleteSweepCode);
          temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return item.taskId != this.taskId});
          this.changeisCompleteSweepCode(temporarySweepCodeOficeList);
          setStore('completeDispatchSweepCodeInfo', {"sweepCodeInfo": temporarySweepCodeOficeList});
          this.$router.push({path:'/dispatchTask'});
          this.changeTitleTxt({tit:'调度任务'});
          setStore('currentTitle','调度任务')
        } else {
          this.$dialog.alert({
            message: res.data.msg,
            closeOnPopstate: true
          }).then(() => {
          });
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
      })
    },

    // 根据科室id获取科室名称
    getDepartmentName () {
      let temporarySweepCodeDestinationList = [];
      let temporarySweepCodeOficeList = [];
      let echoIndex = this.isCompleteSweepCodeDestinationList.indexOf(this.isCompleteSweepCodeDestinationList.filter((item) => {return item.taskId == this.taskId})[0]);
      if (echoIndex == -1) {return};
      temporarySweepCodeOficeList = this.isCompleteSweepCodeDestinationList.filter((item) => { return item.taskId == this.taskId})[0]['officeList'];
      for (let item of temporarySweepCodeOficeList) {
        temporarySweepCodeDestinationList.push(Dictionary(this.departmentInfoListNo,item.toString()))
      };
      this.trackList = temporarySweepCodeDestinationList;
    },

    // 任务状态转换
    stateTransfer (index) {
      switch(index) {
        case 0 :
          return '未分配'
          break;
        case 1 :
          return '未查阅'
          break;
        case 2 :
          return '未开始'
          break;
        case 3 :
          return '进行中'
          break;
        case 4 :
          return '未结束'
          break;
        case 5 :
          return '已延迟'
          break;
        case 6 :
          return '已取消'
          break;
        case 7 :
          return '已完成'
          break;
      }
    },

    // 任务优先级转换
      priorityTransfer (index) {
        switch(index) {
          case 1 :
            return '正常'
            break;
          case 2 :
            return '重要'
            break;
          case 3 :
            return '紧急'
            break;
          case 4 :
            return '紧急重要'
            break;
        }
      },


    // 进入扫码页
    joinSweepCode () {
      if (this.dispatchTaskMessage.state == 7) { 
        this.$dialog.alert({
          message: '该条调度任务已完成,不能进行扫码',
          closeOnPopstate: true
        }).then(() => {
        })
      } else {
        this.$router.push({'path':'/DispatchTaskSweepCode'});
        this.changeTitleTxt({tit:'扫码'});
        setStore('currentTitle','扫码')
      }
    }
  }
}

</script>
<style lang='less' scoped>
  @import "~@/common/stylus/variable.less";
  @import "~@/common/stylus/mixin.less";
  @import "~@/common/stylus/modifyUi.less";
  .content-wrapper {
    .content-wrapper();
      font-size: 16px;
    .basic-message {
      width: 95%;
      margin: 0 auto;
      margin-top: 6px;
      height: auto;
      background: #f3f3f3;
      position: relative;
      border: 1px solid #d6d6d6;
      .basic-message-title {
        position: absolute;
        top: 0;
        left: 0;
        padding: 4px 6px;
        box-sizing: border-box;
        border-right: 1px solid #d6d6d6;
        border-bottom: 1px solid #d6d6d6;
      }
      .wait-handle-message {
        margin-top: 35px;
        .handle-message-line-wrapper {
          margin-left: 5px;
          p {
            margin-bottom: 12px;
            width: 49%;
            display: inline-block;
            vertical-align: top;
            span:first-child {
              color: black
            };
            .message-tit-real-style {
              color: #2895ea;
            }
            span:last-child {
              line-height: 22px
            }
          }
        }
        .handle-message-line-wrapper-other {
          p {
            width: 100%;
          }
        }
      }
    }
    .office-list {
      flex:1;
      overflow: auto;
      width: 95%;
      margin: 0 auto;
      margin-top: 8px;
      height: auto;
      background: #f3f3f3;
      position: relative;
      border: 1px solid #d6d6d6;
      .basic-message-title {
        position: absolute;
        top: 0;
        left: 0;
        padding: 4px 6px;
        box-sizing: border-box;
        border-right: 1px solid #d6d6d6;
        border-bottom: 1px solid #d6d6d6;
      }
      .office-list-inner-wrapper {
        margin-top: 25px;
        box-sizing: border-box;
        width: 100%;
        height: 90%;
        padding: 10px;
        overflow: auto;
        .track-name {
          span {
            display: inline-block;
            line-height: 24px
          }
          .collect-parcel {
            position: relative;
            margin-right: 16px;
            &:after {
              content: "—";   
              position: absolute;
            }
          }
          .send-parcel {
            position: relative;
            margin-right: 20px;
            &:after {
              content: "—";   
              position: absolute;
            }
          }
        }
      }
    }
    .circultion-task-btn {
      width: 95%;
      margin: 0 auto;
      padding: 10px;
      height: auto;
      span {
        vertical-align: top;
        display: inline-block;
        line-height: 40px;
        height: 40px;
        background: #8d9eda;
        color: #333;
        text-align: center
      }
      .circultion-task-btn-top {
        position: relative;
        height: 40px;
        span {
          width: 47%;
          border-radius: 4px;
          &:first-child {
            position: absolute;
            top: 0;
            left: 0
          } 
          &:last-child {
            position: absolute;
            top: 0;
            right: 0
          } 
        }
      };
       .circultion-task-btn-bottom {
        position: relative;
        height: 40px;
        margin-top: 10px;
        span {
          width: 100%;
          border-radius: 4px
        }
      }
    }
  }
</style>
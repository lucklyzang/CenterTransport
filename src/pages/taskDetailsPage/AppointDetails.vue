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
            <span class="message-tit">病人床号:</span>
            <span class="message-tit-real">{{appointDetailsMessage.badNumber}}</span>
          </P>
          <p>
            <span class="message-tit">优先级:</span>
            <span class="message-tit-real message-tit-real-style" :class="{'natureNormalStyle' : appointDetailsMessage.priority == 1, 'natureImportantStyle': appointDetailsMessage.priority != 1}">{{priorityTransfer(appointDetailsMessage.priority)}}</span>
          </p>
        </div>
        <div class="handle-message-line-wrapper">
          <p class="p-other">
            <span class="message-tit">预计开始时间: {{appointDetailsMessage.planStartTime}}</span>
          </p>
        </div>
        <div class="handle-message-line-wrapper">
          <p>
            <span class="message-tit">任务起点:</span>
            <span class="message-tit-real">{{appointDetailsMessage.setOutPlaceName}}</span>
          </p>
          <p>
            <span class="message-tit">转运工具:</span>
            <span class="message-tit-real">{{appointDetailsMessage.toolName ? appointDetailsMessage.toolName : '无'}}</span>
          </p>
        </div>
        <div class="handle-message-line-wrapper">
          <p>
            <span class="message-tit">任务描述:</span>
            <span class="message-tit-real">{{appointDetailsMessage.taskRemark}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="office-list-item-start-point" :class="{listItemStyle: isPatienVerified == true || isStartPonitVerified == true}">
      <div class="office-list-left">
        <p>{{appointDetailsMessage.planStartTime}}</p>
        <p>{{appointDetailsMessage.setOutPlaceName}}</p>
      </div>
      <div class="office-list-right">
        <p :class="{listRightStyle: isPatienVerified == true}" @click="joinSweepCode(0,appointDetailsMessage)">病人扫码</p>
        <p :class="{listRightStyle: isStartPonitVerified == true}" @click="joinSweepCode(1,appointDetailsMessage)">科室扫码</p>
      </div>
    </div>
    <div class="office-list">
      <div class="office-list-inner-wrapper">
        <div :class="{listItemStyle: item.isChecked == true && item.isCompleted == true}" v-for="(item,index) in appointDetailsMessage.checkItems" :key="`${item}-${index}`" class="office-list-item">
          <div class="office-list-left">
            <p>{{item.bookTime}}</p>
            <p v-show="!item.checkDepName || !item.room">{{item.depName}}</p>
            <p v-show="item.checkDepName != null && item.room != null">{{item.checkDepName}}-{{item.room}}</p>
          </div>
          <div class="office-list-right">
            <p :class="{listRightStyle: item.isChecked == true}" @click="joinSweepCode(2,item)">科室扫码</p>
            <p :class="{listRightStyle: item.isCompleted == true}" @click="checkCompleted(item)">检查完成</p>
          </div>
        </div>
      </div>
    </div>
    <div class="office-list-item-end-point" :class="{listItemStyle: isBackStartPonitVerified == true}">
      <div class="office-list-left">
        <p>{{appointDetailsMessage.setOutPlaceName}}</p>
      </div>
      <div class="office-list-right">
        <p :class="{listRightStyle: isBackStartPonitVerified == true}" @click="joinSweepCode(3,appointDetailsMessage)">科室扫码</p>
      </div>
    </div>
    <div class="circultion-task-btn">
      <p class="circultion-task-btn-bottom" v-show="appointTaskMessage.state != 7">
        <span @click="endTask">完成任务</span>
      </p>
      <p class="circultion-task-btn-bottom" v-show="appointTaskMessage.state == 7">
        <span @click="backTo">返回</span>
      </p>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import FooterBottom from '@/components/FooterBottom'
import {queryAppointTaskDetailsMessage, appointTaskCompleted, checkItemsCompleted} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC, removeBlock, repeArray, deepClone } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  name: 'appointDetails',
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      liIndex: null,
      isPatienVerified: false,
      isStartPonitVerified: false,
      isBackStartPonitVerified: false,
      drawCompleteTaskIdList: [],
      appointDetailsMessage: '',
      taskSweepCodePng: require('@/components/images/task-sweep-code.png')
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
      'appointTaskMessage',
      'completeCheckedItemInfo',
      'completeSweepcodeDepartureInfo',
      'completeSweepcodeDestinationInfo'
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
      return this.appointTaskMessage.id
    }
  },

  mounted () {
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        if (this.appointTaskMessage.state == 7) {
          this.changeIsFreshAppointTaskPage(false)
        } else {
          this.changeIsFreshAppointTaskPage(true)
        };
        this.$router.push({path:'/appointTask'});
        this.changeTitleTxt({tit:'预约任务'});
        setStore('currentTitle','预约任务')
      })
    };
    this.changeDepartureState();
    this.getAppointTaskMessage(this.appointTaskMessage.id)
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeIsFreshAppointTaskPage',
      'changeCompleteCheckedItemInfo',
      'changeCompleteSweepcodeDestinationInfo',
      'changeCompleteSweepcodeDepartureInfo'
    ]),

    // 返回上一页
    backTo () {
      if (this.appointTaskMessage.state == 7) {
        this.changeIsFreshAppointTaskPage(false)
      } else {
        this.changeIsFreshAppointTaskPage(true)
      };
      this.$router.push({path:'/appointTask'});
      this.changeTitleTxt({tit:'预约任务'});
      setStore('currentTitle','预约任务')
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

    // 改变病人和起始科室扫码状态
    changeDepartureState () {
      let temporaryOfficeList = deepClone(this.completeSweepcodeDepartureInfo);
      if (this.completeSweepcodeDepartureInfo.length > 0 ) {
        let temporaryIndex = this.completeSweepcodeDepartureInfo.indexOf(this.completeSweepcodeDepartureInfo.filter((item) => {return item.taskId == this.taskId})[0]);
        if (temporaryIndex != -1) {
          if (temporaryOfficeList[temporaryIndex]['patienVerified'] && temporaryOfficeList[temporaryIndex]['patienVerified'] == true) {
            this.isPatienVerified = true
          };
          if (temporaryOfficeList[temporaryIndex]['startPonitVerified'] && temporaryOfficeList[temporaryIndex]['startPonitVerified'] == true) {
            this.isStartPonitVerified = true
          };
          if (temporaryOfficeList[temporaryIndex]['backStartPonitVerified'] && temporaryOfficeList[temporaryIndex]['backStartPonitVerified'] == true) {
            this.isBackStartPonitVerified = true
          }
        }
      }
    },

    // 查询预约任务详情
    getAppointTaskMessage (taskId) {
      queryAppointTaskDetailsMessage(taskId).then((res) => {
        if (res && res.data.code == 200) {
          this.appointDetailsMessage = res.data.data;
          for (let item in this.appointDetailsMessage) {
            if (item == 'checkItems') {
              for (let innerItem of this.appointDetailsMessage[item]) {
                innerItem['isChecked'] = false;
                innerItem['isCompleted'] = false;
                this.appointDetailsMessage.extendData1 ? innerItem['checkDepName'] = this.appointDetailsMessage.extendData1.checkDepName : innerItem['checkDepName'] = null;
                this.appointDetailsMessage.extendData1 ? innerItem['room'] = this.appointDetailsMessage.extendData1.room : innerItem['room'] = null;
              };
            }
          };
          console.log(this.appointDetailsMessage)
          // 为完成二维码校验的科室增加标价
          if (this.completeSweepcodeDestinationInfo.length > 0) {
            for (let w = 0, wLen = this.completeSweepcodeDestinationInfo.length; w < wLen; w++) {
              if (this.appointDetailsMessage['id'] == this.completeSweepcodeDestinationInfo[w]['taskId']) {
                if (this.completeSweepcodeDestinationInfo[w]['officeList'].length > 0) {
                  for (let i = 0, len1 = this.completeSweepcodeDestinationInfo[w]['officeList'].length; i < len1; i++) {
                    if (this.appointDetailsMessage['checkItems'].length > 0) {
                      for (let j = 0, len2 = this.appointDetailsMessage['checkItems'].length; j < len2; j++) {
                        if (this.appointDetailsMessage['checkItems'][j]['id'] == this.completeSweepcodeDestinationInfo[w]['officeList'][i]) {
                          this.appointDetailsMessage['checkItems'][j]['isChecked'] = true;
                          // 为完成检查的科室增加标记
                          if (this.completeCheckedItemInfo.length > 0) {
                            let temporaryIndex = this.completeCheckedItemInfo.indexOf(this.completeCheckedItemInfo.filter((item) => {return item.taskId == this.taskId})[0]);
                            if (temporaryIndex != -1) {
                              let targetDepartmentList = this.completeCheckedItemInfo[temporaryIndex]['officeList'];
                              if (targetDepartmentList.length > 0) {
                                for (let targetItem of targetDepartmentList) {
                                  if (this.appointDetailsMessage['checkItems'][j]['id'] == targetItem) {
                                    this.appointDetailsMessage['checkItems'][j]['isCompleted'] = true
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          this.$toast(`${res.data.msg}`)
        }
      })
      .catch((err) => {
         this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        })
      })
    },

    // 检查科室完成
    checkCompleted (item) {
       if (this.appointTaskMessage.state == 7 || this.appointTaskMessage.state == 6) {
        this.$toast('该任务已完成或取消，不能执行此操作');
        return
      };
      if (!item.isChecked) {
        this.$toast('请先完成该检查科室二维码校验');
        return
      };
      if (item.isCompleted) {
        this.$toast('该科室已经完成过检查');
        return
      };
      let checkedItemsInfo = {
        proId: this.proId, //项目ID
        workerId: this.workerId, //运送员ID即当前登录人
        itemId: item.id   //检查项ID
      };
      checkItemsCompleted(checkedItemsInfo).then((res) => {
        if (res && res.data.code == 200) {
          this.$toast(`${res.data.msg}`);
          this.storeCheckedDepartment(item.id);
          this.getAppointTaskMessage(this.appointTaskMessage.id)
        } else {
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          })
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        })
      })
    },

    // 存储完成检查的科室
    storeCheckedDepartment (depId) {
      if (depId == null) {return};
      let temporaryOfficeList = [];
      let temporaryDepartmentId = [];
      temporaryOfficeList = deepClone(this.completeCheckedItemInfo);
      if (this.completeCheckedItemInfo.length > 0 ) {
        let temporaryIndex = this.completeCheckedItemInfo.indexOf(this.completeCheckedItemInfo.filter((item) => {return item.taskId == this.taskId})[0]);
        if (temporaryIndex != -1) {
          temporaryDepartmentId = temporaryOfficeList[temporaryIndex]['officeList'];
          temporaryDepartmentId.push(depId);
          temporaryOfficeList[temporaryIndex]['officeList'] = repeArray(temporaryDepartmentId)
        } else {
          temporaryDepartmentId.push(depId);
          temporaryOfficeList.push(
            {
              officeList: repeArray(temporaryDepartmentId),
              taskId: this.taskId
            }
          )
        }
      } else {
        temporaryDepartmentId.push(depId);
        temporaryOfficeList.push(
          {
            officeList: repeArray(temporaryDepartmentId),
            taskId: this.taskId
          }
        )
      };
      this.changeCompleteCheckedItemInfo(temporaryOfficeList);
      setStore('completAppointTaskCheckedItemInfo', {"sweepCodeInfo": temporaryOfficeList});
    },

    // 结束任务
    endTask () {
      if (this.appointTaskMessage.state == 7 || this.appointTaskMessage.state == 6) {
        this.$toast('该任务已完成或取消，不能执行此操作');
        return
      };
      if (this.completeSweepcodeDepartureInfo && this.completeSweepcodeDepartureInfo.length > 0) {
        let echoIndex = this.completeSweepcodeDepartureInfo.indexOf(this.completeSweepcodeDepartureInfo.filter((item) => {return item.taskId == this.taskId})[0]);
        if (echoIndex !== -1) {
          if (!this.completeSweepcodeDepartureInfo[echoIndex]['patienVerified'] && !this.completeSweepcodeDepartureInfo[echoIndex]['startPonitVerified']) {
            this.$toast('请至少完成出发地科室二维码或病人二维码校验才能完成任务')
          } else {
            this.$dialog.alert({
              message: '是否确认完成任务',
              closeOnPopstate: true,
              showCancelButton: true
            }).then(() => {
              this.completeTask()
            }).catch((err) => {})
          }
        } else {
          this.$toast('请至少完成出发地科室二维码或病人二维码校验才能完成任务')
        }
      } else {
        this.$toast('请至少完成出发地科室二维码或病人二维码校验才能完成任务')
      }
    },

    completeTask () {
      let completeInfo = {
        proId: this.proId, //项目ID
        workerId: this.workerId, //运送员ID即当前登录人
        taskId: this.taskId   //任务ID
      };
      appointTaskCompleted(completeInfo).then((res) => {
        if (res && res.data.code == 200) {
          this.$toast(`${res.data.msg}`);
          this.emptyCompleteCheckedItem();
          this.emptyCompleteDestinationDepartment();
          this.emptyCompleteDepartureDepartment();
          this.$router.push({path:'/appointTask'});
          this.changeTitleTxt({tit:'预约任务'});
          setStore('currentTitle','预约任务')
        } else {
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          })
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        })
      })
    },

    // 进入扫码页
    joinSweepCode (type,item) {
      if (this.appointTaskMessage.state == 7 || this.appointTaskMessage.state == 6) {
        this.$toast('该任务已完成或取消，不能执行此操作');
        return
      };
      if (type == 2) {
        if (this.completeSweepcodeDepartureInfo && this.completeSweepcodeDepartureInfo.length > 0) {
          let echoIndex = this.completeSweepcodeDepartureInfo.indexOf(this.completeSweepcodeDepartureInfo.filter((item) => {return item.taskId == this.taskId})[0]);
          if (echoIndex !== -1) {
            if (!this.completeSweepcodeDepartureInfo[echoIndex]['patienVerified'] && !this.completeSweepcodeDepartureInfo[echoIndex]['startPonitVerified']) {
              this.$toast('请先进行出发地科室二维码或病人二维码校验')
            } else {
              if (!item.isChecked) {
                this.$router.push(
                  {
                    'path':'/appointTaskSweepCode',
                    query: {checkType: type, id: item.id}
                  }
                );
                this.changeTitleTxt({tit:'扫码'});
                setStore('currentTitle','扫码')
              } else {
                this.$toast('该检查科室已经校验过')
              }
            }
          } else {
            this.$toast('请先进行出发地科室二维码或病人二维码校验')
          }
        } else {
          this.$toast('请先进行出发地科室二维码或病人二维码校验')
        }
      } else {
        if (type == 0) {
           if (this.completeSweepcodeDepartureInfo && this.completeSweepcodeDepartureInfo.length > 0) {
            let echoIndex = this.completeSweepcodeDepartureInfo.indexOf(this.completeSweepcodeDepartureInfo.filter((item) => {return item.taskId == this.taskId})[0]);
            if (echoIndex !== -1) {
              if (this.completeSweepcodeDepartureInfo[echoIndex]['patienVerified']) {
                this.$toast('该病人二维码已经校验并通过,请进行检查科室二维码的校验')
              } else {
                this.$router.push(
                  {
                    'path':'/appointTaskSweepCode',
                    query: {checkType: type}
                  }
                );
                this.changeTitleTxt({tit:'扫码'});
                setStore('currentTitle','扫码')
              }
            } else {
              this.$router.push(
                {
                  'path':'/appointTaskSweepCode',
                  query: {checkType: type}
                }
              );
              this.changeTitleTxt({tit:'扫码'});
              setStore('currentTitle','扫码')
            }
          } else {
            this.$router.push(
              {
                'path':'/appointTaskSweepCode',
                query: {checkType: type}
              }
            );
            this.changeTitleTxt({tit:'扫码'});
            setStore('currentTitle','扫码')
          }
        };
        if (type == 1) {
          if (this.completeSweepcodeDepartureInfo && this.completeSweepcodeDepartureInfo.length > 0) {
            let echoIndex = this.completeSweepcodeDepartureInfo.indexOf(this.completeSweepcodeDepartureInfo.filter((item) => {return item.taskId == this.taskId})[0]);
            if (echoIndex !== -1) {
              if (this.completeSweepcodeDepartureInfo[echoIndex]['startPonitVerified']) {
                this.$toast('该出发地科室二维码已经校验并通过,请进行检查科室二维码的校验')
              } else {
                this.$router.push(
                  {
                    'path':'/appointTaskSweepCode',
                    query: {checkType: type}
                  }
                );
                this.changeTitleTxt({tit:'扫码'});
                setStore('currentTitle','扫码')
              }
            } else {
              this.$router.push(
                {
                  'path':'/appointTaskSweepCode',
                  query: {checkType: type}
                }
              );
              this.changeTitleTxt({tit:'扫码'});
              setStore('currentTitle','扫码')
            }
          } else {
            this.$router.push(
              {
                'path':'/appointTaskSweepCode',
                query: {checkType: type}
              }
            );
            this.changeTitleTxt({tit:'扫码'});
            setStore('currentTitle','扫码')
          }
        };
        if (type == 3) {
          if (this.completeSweepcodeDepartureInfo && this.completeSweepcodeDepartureInfo.length > 0) {
            let echoIndex = this.completeSweepcodeDepartureInfo.indexOf(this.completeSweepcodeDepartureInfo.filter((item) => {return item.taskId == this.taskId})[0]);
            if (echoIndex !== -1) {
              if (!this.completeSweepcodeDepartureInfo[echoIndex]['patienVerified'] && !this.completeSweepcodeDepartureInfo[echoIndex]['startPonitVerified']) {
                this.$toast('请至少完成出发地科室二维码或病人二维码的校验才能在次扫描出发地科室二维码')
              } else {
                if (!this.completeSweepcodeDepartureInfo[echoIndex]['backStartPonitVerified']) {
                  this.$router.push(
                    {
                      'path':'/appointTaskSweepCode',
                      query: {checkType: type}
                    }
                  );
                  this.changeTitleTxt({tit:'扫码'});
                  setStore('currentTitle','扫码')
                } else {
                  this.$toast('返回科室出发地扫码已经校验过')
                }
              }
            } else {
              this.$toast('请至少完成出发地科室二维码或病人二维码的校验才能在次扫描出发地科室二维码')
            }
          } else {
            this.$toast('请至少完成出发地科室二维码或病人二维码的校验才能在次扫描出发地科室二维码')
          }
        }
      }
    },

    // 清空该完成任务存储的已完成检查的信息
    emptyCompleteCheckedItem () {
      let temporarySweepCodeOficeList = deepClone(this.completeCheckedItemInfo);
      temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return item.taskId != this.taskId});
      this.changeCompleteCheckedItemInfo(temporarySweepCodeOficeList);
      setStore('completAppointTaskCheckedItemInfo', {"sweepCodeInfo": temporarySweepCodeOficeList})
    },

    // 清空该完成任务存储的已扫过目的地科室信息
    emptyCompleteDestinationDepartment () {
      let temporarySweepCodeOficeList = deepClone(this.completeSweepcodeDestinationInfo);
      temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return item.taskId != this.taskId});
      this.changeCompleteSweepcodeDestinationInfo(temporarySweepCodeOficeList);
      setStore('completAppointTaskSweepCodeDestinationInfo', {"sweepCodeInfo": temporarySweepCodeOficeList});
    },

    // 清空该完成任务存储的已扫过起始地科室信息
    emptyCompleteDepartureDepartment () {
      let temporarySweepCodeOficeList = deepClone(this.completeSweepcodeDepartureInfo);
      temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return item.taskId != this.taskId});
      this.changeCompleteSweepcodeDepartureInfo(temporarySweepCodeOficeList);
      setStore('completAppointTaskSweepCodeDepartureInfo', {"sweepCodeInfo": temporarySweepCodeOficeList});
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
            .natureNormalStyle {
              color: #1faaff !important;
            };
            .natureImportantStyle {
              color: red !important;
              font-weight:bold !important;
            };
            .message-tit-real-style {
              color: #2895ea;
            }
            span:last-child {
              line-height: 22px
            }
          };
          .p-other {
            width: 100%;
            span {
              display: inline-block;
              width: 100%
            }
          }
        }
      }
    }
    .office-list-item-start-point {
      width: 95%;
      margin: 0 auto;
      font-size: 16px;
      height: 90px;
      padding: 6px;
      margin-top: 12px;
      box-sizing: border-box;
      border: 1px solid #d6d6d6;
      .office-list-left {
        float: left;
        height: 78px;
        width: 76%;
        p {
          height: 39px;
          width: 76%;
          overflow: auto;
          line-height: 39px
        }
      };
      .office-list-right {
        float: right;
        height: 78px;
        width: 24%;
        p {
          height: 34px;
          text-align: center;
          line-height: 34px;
          background: #2895ea;
          &:last-child {
            margin-top: 8px
          }
        };
        .listRightStyle {
          background: #0ee883
        }
      }
    };
    .listItemStyle {
      background: #a8ccf8;
      border: none
    };
    .office-list {
      flex:1;
      overflow: auto;
      width: 95%;
      margin: 0 auto;
      .office-list-inner-wrapper {
        padding-top: 10px;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        font-size: 0;
        box-sizing: border-box;
        .office-list-item {
          font-size: 16px;
          height: 90px;
          padding: 6px;
          box-sizing: border-box;
          margin-bottom: 12px;
          border: 1px solid #d6d6d6;
          .office-list-left {
            float: left;
            height: 78px;
            width: 76%;
            p {
              height: 39px;
              width: 76%;
              overflow: auto;
              line-height: 39px
            }
          };
          .office-list-right {
            float: right;
            height: 78px;
            width: 24%;
            p {
              height: 34px;
              text-align: center;
              line-height: 34px;
              background: #2895ea;
              &:last-child {
                margin-top: 8px
              }
            }
            .listRightStyle {
              background: #0ee883
            }
          }
        };
        .listItemStyle {
          background: #a8ccf8;
          border: none
        }
      }
    }
    .office-list-item-end-point {
      width: 95%;
      margin: 0 auto;
      font-size: 16px;
      padding: 0 6px;
      box-sizing: border-box;
      height: 45px;
      // margin-top: 12px;
      border: 1px solid #d6d6d6;
      .office-list-left {
        float: left;
        height: 45px;
        width: 76%;
        p {
          height: 45px;
          width: 76%;
          overflow: auto;
          line-height: 45px
        }
      };
      .office-list-right {
        float: right;
        height: 78px;
        width: 24%;
        p {
          height: 34px;
          text-align: center;
          line-height: 34px;
          background: #2895ea;
          margin-top: 4px
        };
        .listRightStyle {
          background: #0ee883
        }
      }
    };
    .listItemStyle {
      background: #a8ccf8;
      border: none
    };
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
        background: #2895ea;
        color: #fff;
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

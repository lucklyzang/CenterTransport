<template>
  <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
    </HeaderTop>
    <div class="content">
      <div class="basic-message">
          <p class="basic-mesage-state">
            <img :src="stateTransferImg(appointDetailsMessage.state)" alt="">
          </p>
          <p class="basic-message-title">
            <span>
              <img :src="taskInfoPng" alt="">
            </span>
            基本信息
          </p>
         <div class="wait-handle-message">
           <div class="wait-handle-message-top">
             <div class="handle-message-line-wrapper">
               <p>
                 <span class="message-tit">优&nbsp;&nbsp;先&nbsp;&nbsp;级 : </span>
                 <span class="message-tit-real message-tit-real-style" :class="{'natureNormalStyle' : appointDetailsMessage.priority == 1, 'natureImportantStyle': appointDetailsMessage.priority != 1}">{{priorityTransfer(appointDetailsMessage.priority)}}</span>
               </p>
             </div>
             <div class="handle-message-line-wrapper">
               <p>
                 <span class="message-tit">任务编号 : </span>
                 <span class="message-tit-real">
                   {{appointDetailsMessage.serial ? appointDetailsMessage.serial : '无'}}
                 </span>
               </p>
             </div>
             <div class="handle-message-line-wrapper handle-message-line-wrapper-other">
               <p>
                 <span class="message-tit">预计开始时间 : </span>
                 <span class="message-tit-real">
                   {{appointDetailsMessage.planStartTime}}
                 </span>
               </p>
             </div>
             <div class="handle-message-line-wrapper">
               <p>
                 <span class="message-tit">床号 : </span>
                 <span class="message-tit-real">{{appointDetailsMessage.badNumber ? appointDetailsMessage.badNumber : '无'}}</span>
               </p>
             </div>
             <div class="handle-message-line-wrapper">
               <p>
                 <span class="message-tit">住院号 : </span>
                 <span class="message-tit-real">{{appointDetailsMessage.hospitalNo  ? appointDetailsMessage.hospitalNo  : '无'}}</span>
               </p>
             </div>
             <div class="handle-message-line-wrapper">
               <p>
                 <span class="message-tit">姓名 : </span>
                 <span class="message-tit-real">{{appointDetailsMessage.patientName ? appointDetailsMessage.patientName : '无'}}</span>
               </p>
             </div>
             <div class="handle-message-line-wrapper">
               <p>
                 <span class="message-tit">任务起点 : </span>
                 <span class="message-tit-real message-tit-real-style">
                   {{appointDetailsMessage.setOutPlaceName}}
                 </span>
               </p>
             </div>
             <div class="handle-message-line-wrapper">
               <p>
                 <span class="message-tit">转运工具 : </span>
                 <span class="message-tit-real message-tit-real-style">
                   {{appointDetailsMessage.toolName ? appointDetailsMessage.toolName : '无'}}
                 </span>
               </p>
             </div>
             <div class="handle-message-line-wrapper">
               <p>
                 <span class="message-tit">预约号 : </span>
                 <span class="message-tit-real message-tit-real-style">
                   {{appointDetailsMessage.bespokeCount ? appointDetailsMessage.bespokeCount : '无'}}
                 </span>
               </p>
             </div>
           </div>
           <div class="wait-handle-message-bottom">
              <div class="handle-message-line-wrapper task-describe">
                <p>
                  <span class="message-tit">任务描述 : </span>
                  <span class="message-tit-real">{{appointDetailsMessage.taskRemark}}</span>
                </p>
              </div>
           </div>
        </div>
      </div>
      <div class="office-list-item-start-point" :class="{listItemStyle: isPatienVerified == true || isStartPonitVerified == true}">
        <div class="office-list-left">
          <p>{{appointDetailsMessage.planStartTime}}</p>
          <p>{{appointDetailsMessage.setOutPlaceName}}</p>
        </div>
        <div class="office-list-right">
          <p :class="{listRightStyle: isPatienVerified == true}" @click="joinSweepCode(0,appointDetailsMessage)">
            <span>病人</span>
            <span>扫码</span>
          </p>
          <p :class="{listRightStyle: isStartPonitVerified == true}" @click="joinSweepCode(1,appointDetailsMessage)">
            <span>科室</span>
            <span>扫码</span>
          </p>
        </div>
      </div>
      <div class="office-list">
        <div class="office-list-inner-wrapper">
          <div :class="{listItemStyle: item.isChecked == true && item.isCompleted == true}" v-for="(item,index) in appointDetailsMessage.checkItems" :key="`${item}-${index}`" class="office-list-item">
            <span class="quadrant">
              {{index + 1}}
            </span>
            <div class="office-list-left">
              <p>{{item.bookTime}}</p>
              <p v-show="!item.checkDepName || !item.room">{{item.depName}}</p>
              <p v-show="item.checkDepName != null && item.room != null">{{item.checkDepName}}-{{item.room}}</p>
            </div>
            <div class="office-list-right">
              <p :class="{listRightStyle: item.isChecked == true}" @click="joinSweepCode(2,item)">
                <span>科室</span>
                <span>扫码</span>
              </p>
              <p :class="{listRightStyle: item.isCompleted == true}" @click="checkCompleted(item)">
                <span>检查</span>
                <span>完成</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="office-list-item-end-point" :class="{listItemStyle: isBackStartPonitVerified == true}">
        <div class="office-list-left">
          <p>{{appointDetailsMessage.setOutPlaceName}}</p>
        </div>
        <div class="office-list-right">
          <p :class="{listRightStyle: isBackStartPonitVerified == true}" @click="joinSweepCode(3,appointDetailsMessage)">
            <span>科室</span>
            <span>扫码</span>
          </p>
        </div>
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
import { setStore, IsPC,  repeArray, deepClone } from '@/common/js/utils'
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
      taskSweepCodePng: require('@/components/images/task-sweep-code.png'),
      taskInfoPng: require('@/common/images/home/basic-message.png'),
      noEndPng: require('@/common/images/home/no-end.png'),
      noReferPng: require('@/common/images/home/no-refer.png'),
      noStartPng: require('@/common/images/home/no-start.png'),
      taskFinshedPng: require('@/common/images/home/task-finshed.png'),
      taskGoingPng: require('@/common/images/home/task-going.png'),
      taskCancelPng: require('@/common/images/home/task-cancel.png'),
      waitSurePng: require('@/common/images/home/wait-sure.png')
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

    // 任务状态转换图片
    stateTransferImg (index) {
      switch(index) {
        case 1 :
          return this.noReferPng
          break;
        case 2 :
          return  this.noStartPng
          break;
        case 3 :
          return  this.taskGoingPng
          break;
        case 4 :
          return  this.noEndPng
          break;
        case 6 :
          return this.taskCancelPng
          break;
        case 7 :
          return  this.taskFinshedPng
          break;
      }
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
          console.log('详情',this.appointDetailsMessage);
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

    // 替换字符串中某个位置的字符为指定字符
    replaceStr (str, index, char) {
      const strAry = str.split('');
      strAry[index] = char;
      return strAry.join('');
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
      background: #f6f6f6;
    .content {
      flex: 1;
      width: 100%;
      overflow: auto;
    };
    .basic-message {
      width: 93%;
      margin: 0 auto;
      margin-top: 14px;
      flex-direction: column;
      position: relative;
      background: #fff;
      padding: 10px;
      box-sizing: border-box;
      .basic-mesage-state {
        width: 80px;
        height: 30px;
        position: absolute;
        text-align: center;
        line-height: 30px;
        top: 8px;
        right: -12px;
        img {
          width: 100%;
          height: 100%
        }
      };
      .basic-message-title {
        font-size: 18px;
        color: #1a89fd;
        height: 40px;
        line-height: 40px;
        span {
          display: inline-block;
          height: 15px;
          width: 15px;
          vertical-align: top;
          margin-top: 1px;
          img {
            width: 100%;
            height: 100%
          }
        }
      }
      .wait-handle-message {
        width: 100%;
        margin-top: 5px;
        .wait-handle-message-middle {
          margin: 10px 0
        };
        .wait-handle-message-bottom {
          margin-top: 10px
        };
        .task-describe {
          p {
            height: auto !important;
            line-height: 20px !important
          }
        }
        .handle-message-line-wrapper {
          p {
            display: flex;
            overflow: auto;
            height: 30px;
            line-height: 30px;
            flex-flow: row nowrap;
            color: #a0a0a0;
            .natureNormalStyle {
              color: #b1d676 !important
            };
            .natureImportantStyle {
              color: #ff5b5a !important
            };
            span {
              display: inline-block;
            };
            span:first-child {
              width: 25%
            };
            .message-tit-real {
              word-break: break-all
            };
            .message-tit-real-style {
              color: #2895ea;
            }
            span:last-child {
              flex: 1;
              color: black
            }
          };
          .describe-line-wrapper {
            width: 100%;
            .message-tit-real-audio {
              margin-left: 4px
            }
          }
        };
        .transport-type-wrapper {
          display: flex;
          flex-flow: row nowrap;
          .transport-type-title {
            color: #a0a0a0;
            width: 25%
          };
          .transport-type-content {
            color: black;
            flex: 1;
            > div:not(:first-child) {
              .transport-type-list-title {
                margin-top: 6px
              }
            };
            .transport-type-list-wrapper {
              .transport-type-list {
                > p {
                };
                .transport-type-list-title {
                  font-weight: bold;
                  color: black
                };
                .transport-type-list-content {
                  line-height: 30px
                }
              }
            }
          }
        };
        .handle-message-line-wrapper-other {
          > p {
            span {
              &:first-child {
                width: 35%
              }
            }
          }
        };
        .handle-message-line-wrapper-other-two {
          display: flex;
          flex-flow: row now;
          height: 35px;
          line-height: 35px;
          overflow: auto;
          >p:first-child {
            width: 25%;
            span {
              color: #a0a0a0;
            }
          };
          > p:last-child {
            flex: 1;
            span {
              color: black
            };
            .message-tit-real-destinationList {
              margin-right: 4px
            }
          }
        }
      }
    }
    .office-list-item-start-point {
      width: 93%;
      margin: 0 auto;
      font-size: 15px;
      background: #fff;
      height: 90px;
      padding: 10px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      margin-top: 14px;
      box-sizing: border-box;
      .office-list-left {
        width: 60%;
        margin-right: 4px;
        p {
          height: 25px;
          width: 76%;
          overflow: auto;
          line-height: 25px;
          &:first-child {
            font-size: 13px
          }
        }
      };
      .office-list-right {
        height: 78px;
        width: 40%;
        display: flex;
        font-size: 14px;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        p {
          height: 55px;
          width: 55px;
          border-radius: 50%;
          text-align: center;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          color: #fff;
          background: #88d354;
          > span {
            &:first-child {
              margin-bottom: 2px
            }
          }
          &:last-child {
            background: #217dfc
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
      width: 93%;
      margin: 0 auto;
      .office-list-inner-wrapper {
        box-sizing: border-box;
        width: 100%;
        font-size: 0;
        box-sizing: border-box;
        .office-list-item {
          font-size: 16px;
          height: 90px;
          padding: 10px;
          display: flex;
          flex-flow: row nowrap;
          background: #fff;
          align-items: center;
          box-sizing: border-box;
          margin-top: 14px;
          position: relative;
          &:last-child {
            margin-bottom: 14px
          }
          .quadrant{
            position: absolute;
            top: 0;
            left: 0;
            width: 22px;
            height: 22px;
            text-align: center;
            line-height: 22px;
            color: #fff;
            font-size: 13px;
            background-color: #bcd8ff;
            -webkit-border-radius: 0 0 20px 0;
          }
          .office-list-left {
            width: 60%;
            margin-right: 4px;
            p {
              height: 25px;
              width: 76%;
              overflow: auto;
              line-height: 25px;
              &:first-child {
                font-size: 13px
              }
            }
          };
          .office-list-right {
            width: 40%;
            height: 78px;
            display: flex;
            font-size: 14px;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            p {
              height: 55px;
              width: 55px;
              border-radius: 50%;
              text-align: center;
              display: flex;
              flex-flow: column;
              justify-content: center;
              align-items: center;
              color: #fff;
              background: #88d354;
              > span {
                &:first-child {
                  margin-bottom: 2px
                }
              }
              &:last-child {
                background: #217dfc
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
        }
      }
    }
    .office-list-item-end-point {
      width: 93%;
      margin: 0 auto;
      font-size: 15px;
      background: #fff;
      height: 90px;
      padding: 10px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      margin-top: 14px;
      box-sizing: border-box;
      .office-list-left {
        width: 60%;
        margin-right: 4px;
        p {
          height: 25px;
          width: 76%;
          overflow: auto;
          line-height: 25px
        }
      };
      .office-list-right {
        height: 78px;
        width: 40%;
        display: flex;
        font-size: 14px;
        flex-flow: row nowrap;
        justify-content: flex-end;
        align-items: center;
        p {
          height: 55px;
          width: 55px;
          border-radius: 50%;
          text-align: center;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          color: #fff;
          background: #88d354;
          > span {
            &:first-child {
              margin-bottom: 2px
            }
          }
          &:last-child {
            background: #217dfc
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
        background-image: linear-gradient(to right, #37d4fd , #429bff);
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

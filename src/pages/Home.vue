<template>
  <div class="content-wrapper">
   <div class="no-data" v-show="noDataShow">
      <NoData></NoData>
    </div>
    <div class="loading">
      <loading :isShow="showLoadingHint" textContent="加载中,请稍候····" textColor="#2895ea"></loading>
    </div>
    <!-- 工作人员操作区域 -->
    <div class="worker-show" v-if="workerShow">
      <!-- 顶部导航栏 -->
      <HeaderTop :title="navTopTitle">
        <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
        <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
      </HeaderTop>
      <!-- 右边下拉框菜单 -->
      <ul class="left-dropDown" v-show="leftDownShow">
        <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
      </ul>
      <!-- 内容部分 -->
      <div class="content-top">
        <div class="content-top-userName">
          <span class="content-top-userName-img">
            <img :src="defaultPersonPng" alt="">
          </span>
          <span class="real-name">{{userName}}</span>
        </div>
        <div class="wait-dask-wrapper">
          <p class="wait-dask-title">待办任务：</p>
          <ul class="wait-dask-list">
            <li v-show="item.number !== 0" :class="{listTaskStyle: index == 0 && isHaveTask != ''}" @click="taskEvent(item)" v-for="(item,index) in taskTypeList" :key="`${item}-${index}`">
              {{item.text}} 
              <span class="dask-list-sign" :class="{daskListSignStyle:index == 0 && isHaveTask != ''}">{{item.number}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="content-middle-task-message">
        <div class="task-message-number-wrapper">
          <div class="task-message-number">
            <p class="task-message-img">
              <img :src="homeBannerPng" alt="">
            </p>
            <p class="transport-day-number">
              <span class="current-day-message-tit">昨日运送量</span>
              <span>{{yesterdayNumber}}</span>
            </p>
            <p class="transport-day-rank">
              <span>昨日排名</span>
              <span>{{yesterdayRank}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="content-bottom">
        <ul class="task-button">
          <li v-for="(item,index) in taskList" :key="index" @click="taskRouterSkip(item.tit, index)">
            <p class="task-button-wrapper">
              <img :src="btnTaskWrapperPng" alt="">
            </p>
            <p class="task-btn-img">
              <img :src="item.imgUrl" alt="">
            </p>
            <p  class="task-btn-tit">{{item.tit}}</p>
          </li>
        </ul>
      </div>
    </div>
    <!-- 医护人员操作区域 -->
    <div class="medical-worker-show" v-else>
      <!-- 顶部导航栏 -->
      <HeaderTop :title="navTopTitle">
        <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
        <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
      </HeaderTop>
       <!-- 右边下拉框菜单 -->
      <ul class="left-dropDown" v-show="leftDownShow">
        <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
      </ul>
      <div class="medical-worker-operate">
        <div class="medical-worker-operate-left">
          <div class="medical-worker-operate-list">
            <div class="medical-worker-operate-list-inner" :class="{'operate-list-inner-style': operateListInnerIndex == index}" v-for="(item,index) in operateList" :key="index" @click="operateListEvent(item,index)">
              <p class="operate-list-img">
                <img :src="operateListInnerIndex == index ? item.imgUrlChecked : item.imgUrl" alt="">
              </p>
              <p class="operate-list-tit">{{item.tit}}</p>
            </div>
          </div>
        </div>
        <div class="medical-worker-operate-right">
          <div class="medical-worker-operate-right-inner">
            <div class="medical-worker-operate-right-message" v-show="operateMessage == 1">
              <p>消息</p>
            </div>
            <div class="medical-worker-operate-right-callOut" v-show="operateCallOut == 2">
              <p class="medical-worker-transport-type">创建调度任务</p>
                 <div class="transport-type-area">
                  <div class="destination-box">
                    <div class="destination-title">目的地</div>
                    <div class="destination-content">
                      <van-dropdown-menu>
                        <van-dropdown-item v-model="destinationAddress" :options="destinationList"/>
                      </van-dropdown-menu>
                    </div>
                  </div>
                  <van-field v-model="bedNumber" label="床号" placeholder="请输入床号"/>
                  <van-field v-model="patientName"  label="病人姓名" placeholder="请输入病人姓名"/>
                  <van-field v-model="patientNumber"  label="病人编号" placeholder="请输入病人编号"/>
                  <div class="destination-box">
                    <div class="destination-title">运送类型</div>
                    <div class="destination-content">
                      <van-dropdown-menu>
                        <van-dropdown-item v-model="transPortType" :options="transPortTypeList"/>
                      </van-dropdown-menu>
                    </div>
                  </div>
                  <div class="destination-box">
                    <div class="destination-title">转运工具</div>
                    <div class="destination-content">
                      <van-dropdown-menu>
                        <van-dropdown-item v-model="vehicleOperation" :options="vehicleOperationList"/>
                      </van-dropdown-menu>
                    </div>
                  </div>
                  <div class="destination-box">
                    <div class="destination-title">优先级</div>
                    <div class="destination-content">
                      <van-dropdown-menu>
                        <van-dropdown-item v-model="priorityOperation" :options="priorityOperationList"/>
                      </van-dropdown-menu>
                    </div>
                  </div>
                  <div class="destination-box">
                    <div class="destination-title">返回出发地</div>
                    <div class="destination-content">
                      <van-dropdown-menu>
                        <van-dropdown-item v-model="returnDepartureOperation" :options="returnDepartureOperationList"/>
                      </van-dropdown-menu>
                    </div>
                  </div>
                  <van-field v-model="taskDescribe"   type="textarea" rows="1"
                    autosize label="任务描述" placeholder="请输入任务描述"/>
                  <van-field v-model="actualData"  type="number" label="实际数量" placeholder="请输入实际数量"/>
                </div>
                <div class="btn-area">
                  <span>
                    <img :src="taskSurePng" alt=""  @click="dispatchTaskSure">
                  </span>
                  <span>
                    <img :src="taskCancelPng" alt="" @click="dispatchTaskCancel">
                  </span>
                </div>
              <!-- </div> -->
            </div>
            <div class="medical-worker-operate-right-taskTrace" v-show="operateTaskTrace == 3">
              <p>任务跟踪</p>
            </div>
            <div class="medical-worker-operate-right-historyTask" v-show="operateHistoryTask == 4">
              <p>历史任务</p>
              <div class="historyTask-list-box">
                <div class="time-search">
                  <span class="time-between">至</span>
                  <div class="content-middle-top-content">
                    <div style="left:0">
                      <van-field v-model="startTime" placeholder="开始日期" readonly="readonly" @click="startTimePop = true" right-icon="newspaper-o"/>
                    </div>
                    <div style="right:0">
                      <van-field v-model="endTime" placeholder="结束日期" readonly="readonly" @click="endTimePop = true" right-icon="newspaper-o"/>
                    </div>
                  </div>
                  <van-popup v-model="startTimePop" label="离开时间" position="bottom" :overlay="true"> 
                    <van-datetime-picker  v-model="currentDateStart"  type="date"  :min-date="minDateStart"
                    @cancel="startTimePop = false"  @confirm="startTimePop = false"  @change="startTimeChange"/>
                  </van-popup>
                  <van-popup v-model="endTimePop" label="离开时间" position="bottom" :overlay="true"> 
                    <van-datetime-picker  v-model="currentDateEnd"  type="date"  :min-date="minDateEnd"
                    @cancel="endTimePop = false"  @confirm="endTimePop = false"  @change="endTimeChange"/>
                  </van-popup>
                </div>
                <p class="middle-top-search">
                  <span>
                    <img :src="taskSearchPng" alt="" @click.stop="searchCompleteTask">
                  </span>
                </p>
                <div class="historyTask-list" v-show="historyTaskListShow">
                  <div class="wait-handle-list" v-for="(item,index) in stateCompleteList" :key="`${item}-${index}`">
                    <p class="wait-handle-message-createTime">
                      创建时间：{{item.createTime}}
                    </p>
                    <p class="wait-handle-message-createTime">
                      计划开始时间：{{item.planStartTime}}
                    </p>
                    <p class="wait-handle-message-planUseTime">
                      计划用时：{{item.planUseTime}}分钟
                    </p>
                    <div class="wait-handle-message">
                      <div class="handle-message-line-wrapper">
                        <p>
                          <span class="message-tit">状态:</span>
                          <span class="message-tit-real" style="color:red">{{stateTransfer(item.state)}}</span>
                        </p>
                        <P>
                          <span class="message-tit">起点:</span>
                          <span class="message-tit-real">{{item.setOutPlaceName}}</span>
                        </P>
                      </div>
                      <div class="handle-message-line-wrapper">
                        <p>
                          <span class="message-tit">终点:</span>
                          <span class="message-tit-real">{{item.destinationName}}</span>
                        </p>
                        <p>
                          <span class="message-tit">转运工具:</span>
                          <span class="message-tit-real">{{item.toolName}}</span>
                        </p>
                      </div>
                      <div class="handle-message-line-wrapper">
                        <p>
                          <span class="message-tit">运送类型:</span>
                          <span class="message-tit-real">{{item.taskTypeName}}</span>
                        </p>
                        <p>
                          <span class="message-tit">优先级:</span>
                          <span class="message-tit-real">{{priorityTransfer(item.priority)}}</span>
                        </p>
                      </div>
                      <div class="handle-message-line-wrapper">
                        <p>
                          <span class="message-tit">出发地拍照:</span>
                          <span class="message-tit-real">{{item.startPhoto == 0 ? '否' : '是'}}</span>
                        </p>
                        <p>
                          <span class="message-tit">目的地拍照:</span>
                          <span class="message-tit-real">{{item.endPhoto == 0 ? '否' : '是'}}</span>
                        </p>
                      </div>
                      <div class="handle-message-line-wrapper">
                        <p>
                          <span class="message-tit">签字:</span>
                          <span class="message-tit-real">{{item.isSign == 0 ? '否' : '是'}}</span>
                        </p>
                        <p>
                          <span class="message-tit">回到出发地:</span>
                          <span class="message-tit-real">{{item.isBack == 0 ? '否' : '是'}}</span>
                        </p>
                      </div>
                      <p class="wait-handle-check" v-show="item.state == 2 ">
                        <van-checkbox v-model="item.taskCheck" @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
                      </p>
                    </div>
                    <p class="get-wait-task">
                      <span v-show="item.state == '1'">
                        <img :src="taskGetPng" alt="" @click.stop="getTask(item.id)">
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="medical-worker-operate-right-taskCollect" v-show="operateTaskCollect == 5">
              <p>收藏</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import HeaderTop from '../components/HeaderTop'
  import FooterBottom from '../components/FooterBottom'
  import NoData from '@/components/NoData'
  import Loading from '@/components/Loading'
  import {getAllTaskNumber, queryAllTaskMessage, userSignOut, getNewWork, getDispatchTaskComplete} from '@/api/workerPort.js'
  import {queryTransportType, queryGenerateDispatchTask, queryhistoryDispatchTask, collectDispatchTask, queryAllDestination, queryTransportTools, generateDispatchTask, quereDeviceMessage} from '@/api/medicalPort.js'
  import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
  import { mapGetters, mapMutations } from 'vuex'
  import { formatTime, setStore, getStore, removeStore, IsPC, changeArrIndex } from '@/common/js/utils'
  import {getDictionaryData} from '@/api/login.js'
  import dispatchTaskPng from '@/common/images/home/dispatch-task.png'
  import circulationTaskPng from '@/common/images/home/circulation-task.png'
  import offWorkSignOutPng from '@/common/images/home/offWork-signOut.png'
  import appointTaskPng from '@/common/images/home/appoint-task.png'
  import medicalMessagePng from '@/common/images/home/medical-message.png'
  import medicalCallPng from '@/common/images/home/medical-call.png'
  import taskTailPng from '@/common/images/home/task-tail.png'
  import historyTaskPng from '@/common/images/home/history-task.png'
  import medicalCollectPng from '@/common/images/home/medical-collect.png'
  import medicalMessageCheckedPng from '@/common/images/home/medical-message-checked.png'
  import medicalCallCheckedPng from '@/common/images/home/medical-call-checked.png'
  import taskTailCheckedPng from '@/common/images/home/task-tail-checked.png'
  import historyTaskCheckedPng from '@/common/images/home/history-task-checked.png'
  import medicalCollectCheckedPng from '@/common/images/home/medical-collect-checked.png'
  let windowTimer
  export default {
    components:{
      HeaderTop,
      NoData,
      Loading,
      FooterBottom,
      VanFieldSelectPicker
    },
    data() {
      return {
        leftDownShow: false,
        workerShow: true,
        liIndex: null,
        showLoadingHint: false,
        noDataShow: false,
        operateListInnerIndex: '',
        yesterdayNumber: '',
        yesterdayRank: '',
        isHaveTask: '',
        leftDropdownDataList: ['退出登录'],
        taskTypeList: [],
        startTime: '',
        endTime: '',
        startTimePop: false,
        endTimePop: false,
        historyTaskListShow: false,
        currentDateStart: new Date(),
        currentDateEnd: new Date(),
        minDateStart: new Date(2020, 0, 1),
        minDateEnd: new Date(2020, 0, 1),
        taskList: [
          {tit:'调度任务',imgUrl: dispatchTaskPng}, 
          {tit:'循环任务',imgUrl: circulationTaskPng}, 
          {tit:'预约任务',imgUrl: appointTaskPng},
          {tit:'下班签退',imgUrl: offWorkSignOutPng}
        ],
        operateList: [
          {tit:'消息', imgUrl: medicalMessagePng, imgUrlChecked:medicalMessageCheckedPng},
          {tit:'呼叫', imgUrl: medicalCallPng, imgUrlChecked:medicalCallCheckedPng},
          {tit:'任务跟踪', imgUrl: taskTailPng, imgUrlChecked:taskTailCheckedPng},
          {tit:'历史任务', imgUrl: historyTaskPng, imgUrlChecked:historyTaskCheckedPng},
          {tit:'收藏', imgUrl: medicalCollectPng, imgUrlChecked:medicalCollectCheckedPng}
        ],
        medicalTransportTypeList: [],
        operateMessage: 1,
        operateCallOut: '',
        operateTaskTrace: '',
        operateHistoryTask: '',
        operateTaskCollect: '',
        stateCompleteList: [],
        destinationAddress: 0,
        destinationList: [],
        vehicleOperation: '',
        vehicleOperationList: [],
        priorityOperation: 1,
        transPortType: '',
        transPortTypeList: [],
        priorityOperationList: [
          { text: '正常', value: 1 },
          { text: '重要', value: 2 },
          { text: '紧急', value: 3 },
          { text: '紧急重要', value: 4 }
        ],
        returnDepartureOperation: 0,
        returnDepartureOperationList: [
          { text: '是', value: 1 },
          { text: '否', value: 0 },
        ],
        bedNumber: '',
        patientName: '',
        patientNumber: '',
        taskDescribe: '',
        actualData: '',
        taskSurePng: require('@/components/images/task-sure.png'),
        taskCancelPng: require('@/components/images/task-cancel.png'),
        defaultPersonPng: require('@/common/images/home/default-person.png'),
        homeBannerPng: require('@/common/images/home/home-banner.png'),
        btnTaskWrapperPng: require('@/common/images/home/btn-background.png'),
        taskSearchPng: require('@/components/images/task-search.png'),
        taskGetPng: require('@/components/images/task-get.png')
      }
    },
    
    mounted() {
      this.changeTitleTxt({tit:'中央运送'});
      setStore('currentTitle','中央运送');
      // 控制设备物理返回按键测试
      if (!IsPC()) {
        pushHistory();
        this.gotoURL(() => { 
        })
      };
      document.addEventListener('click',(e) => {
        if(e.target.className!='van-icon van-icon-manager-o' && e.target.className!='left-dropDown'){
          this.leftDownShow = false;
        }
      });
      // 查询任务数量
      if (this.userTypeId == 0) {
        this.isHaveTask = this.newTaskName;
        this.parallelFunction(this.taskTypeTransfer(this.newTaskName));
        this.judgeTaskComplete();
        // 轮询是否有新任务
        windowTimer = window.setInterval(() => {
          setTimeout(this.queryNewWork(this.proId, this.workerId), 0)
        }, 5000)
      } else {
        this.parallelFunction();
        let me = this;
        window['setDeviceInfo'] = (val) => {
          me.setDeviceInfo(val);
        }
      }
    },

    beforeRouteLeave(to, from, next) {
      // 设置下一个路由的 meta
      to.meta.keepAlive = false;
      next();
    },
    
    watch: {
      userTypeId: {
        handler(newName, oldName) {
          if (newName == 0) {
            this.workerShow = true
          } else {
            this.workerShow = false
          }
        },
        immediate: true,
        deep: true
      }
    },
    activated () {
      this.changeTitleTxt({tit:'中央运送'});
      setStore('currentTitle','中央运送');
      if (this.isHomeJumpOtherPage) {
        if (!this.isRefershHome) {
          window.location.reload()
        }
      } else {
        if (this.userTypeId == 0) {
          // 查询任务数量
          this.leftDownShow = false;
          this.isHaveTask = this.newTaskName;
          this.parallelFunction(this.taskTypeTransfer(this.newTaskName));
          this.judgeTaskComplete() 
        } else {
          this.parallelFunction();
          let me = this;
          window['setDeviceInfo'] = (val) => {
            me.setDeviceInfo(val);
          }
        }
      };
      document.addEventListener('click',(e) => {
        if(e.target.className!='status-name'){
          this.stateListShow = false;
        };
        if(e.target.className!='van-icon van-icon-manager-o' && e.target.className!='left-dropDown'){
          this.leftDownShow = false;
        }
      })  
    },
    
    computed:{
      ...mapGetters([
        'navTopTitle',
        'isRefershHome',
        'isHomeJumpOtherPage',
        'userType',
        'userInfo',
        'newTaskName'
      ]),
      userName () {
       return this.userInfo.extendData.userName
      },
      userTypeId () {
        return this.userInfo.extendData.user_type_id
      },
      proId () {
        return this.userInfo.extendData.proId
      },
      proName () {
        return this.userInfo.extendData.proName
      },
      workerId () {
        return this.userInfo.extendData.userId
      }
    },
    methods:{
      ...mapMutations([
        'changeTitleTxt',
        'changetransportTypeMessage',
        'changeOverDueWay',
        'changeNewTaskList'
      ]),

      juddgeIspc () {
        return IsPC()
      },

      playInfoVoice () {
        let currentAudio = this.$refs.audio;
        currentAudio.play()
      },

      // 并行查询任务数量和排名
      parallelFunction (type) {
        Promise.all([this.queryAllTaskNumber(this.proId, this.workerId,type),this.getAllTaskMessage()])
        .then((res) => {
          if (res && res.length > 0) {
            let [item1,item2] = res;
            if (item2) {
              const {totalCount, rank} = item2;
              this.yesterdayNumber = totalCount;
              this.yesterdayRank = rank
            };
            if (item1) {
              this.taskTypeList = [];
              let innerItem = item1;
              Object.keys(innerItem).forEach((item) => {
                if (item == 'resTask') {
                  this.taskTypeList.push({text: '预约任务',number: innerItem[item]})
                } else if (item == 'transTask') {
                  this.taskTypeList.push({text: '调度任务',number: innerItem[item]})
                } else if (item == 'circleTask') {
                  this.taskTypeList.push({text: '循环任务',number: innerItem[item]})
                }
              });
              if (type == '' || type == undefined) {return};
              this.taskTypeList = changeArrIndex(this.taskTypeList,type)
            }
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err}`,
            closeOnPopstate: true
          }).then(() => {})
        })
      },

      // 任务类型转换文字
      taskTypeTransfer (type) {
        switch(type) {
          case 'book' :
            return '预约任务'
            break;
          case 'trans' :
            return '调度任务'
            break;
          case 'circle' :
            return '循环任务'
            break;
            default:
            ''
        }
      },

      // 任务类型转换字母
      taskTypeTransferLetter (type) {
        switch(type) {
          case '预约任务' :
            return 'book'
            break;
          case '调度任务' :
            return 'trans'
            break;
          case '循环任务' :
            return 'circle'
            break
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

      // 查询是否有新任务
      queryNewWork (proId,workerId) {
        let audio = new Audio();
        audio.preloadc = "auto";
        process.env.NODE_ENV == 'development' ? audio.src = "/static/audios/task-info-voice.wav" : audio.src = "/transWeb/static/audios/task-info-voice.wav";
        getNewWork(proId,workerId).then((res) => {
          // token过期,清除定时器
          if (!res['headers']['token']) {
            if(windowTimer) {window.clearInterval(windowTimer)}
          };
          if (res && res.data.code == 200) {
            let isBreak = false;
            Object.keys(res.data.data).forEach((item) => {
              if (isBreak) {return};
              if (item != "all" && res.data.data[item] == true) {
                isBreak = true;
                // 新任务存入store中
                this.changeNewTaskList(item);
                let playPromiser = audio.play();//进行播放
                audio.onended = () => {
                  // 更新任务数量和排名
                  this.isHaveTask = this.taskTypeTransfer(item);
                  this.parallelFunction(this.taskTypeTransfer(item))
                }
              }
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

      // 返回上一页
      backTo () {
      },

      /**
       * 工作人员代码
      */

      // 用户签退
      userLoginOut (proId,workerId) {
        this.changeOverDueWay(true);
        setStore('storeOverDueWay',true);
        userSignOut(proId,workerId).then((res) => {
          if (res && res.data.code == 200) {
            localStorage.clear();
            this.$router.push({path:'/'})
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
            this.changeOverDueWay(false);
            setStore('storeOverDueWay',false);
          }
        }).
        catch((err) => {
          this.changeOverDueWay(false);
          setStore('storeOverDueWay',false);
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },

      // 查询所有任务数量
      queryAllTaskNumber (proID, workerId, taskType) {
        return new Promise((resolve,reject) => {
          getAllTaskNumber(proID, workerId)
          .then(res => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            }
          })
          .catch((err) => {
            reject(err.message)
          })
        })
      },

      //查询完成任务数量和排名
      getAllTaskMessage () {
        return new Promise((resolve,reject) => {
          queryAllTaskMessage({
            proId: this.proId, // 项目ID 必输
            workerId: this.workerId, //运送员ID   非必输
            date: ''  
          })
          .then((res) => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            }
          })
          .catch((err) => {
            reject(err.message)
          })
        })
      },

      // 路由跳转
      dispatchEvent () {
        this.$router.push({path:'/dispatchTask'});
        this.changeTitleTxt({tit:'调度任务'});
        setStore('currentTitle','调度任务')
      },

      circulationEvent () {
        this.$router.push({path:'/circulationTask'})
        this.changeTitleTxt({tit:'循环任务'});
        setStore('currentTitle','循环任务')
      },

      appointEvent () {
        this.$router.push({path:'/appointTask'});
        this.changeTitleTxt({tit:'预约任务'});
        setStore('currentTitle','预约任务')
      },

      // 顶部任务点击事件
      taskEvent (item) {
        if (item.text == '循环任务') {
          if (this.taskTypeTransferLetter(item.text) == this.newTaskName) {
            this.changeNewTaskList('')
          };
          this.circulationEvent()
        } else if (item.text == '预约任务') {
          if (this.taskTypeTransferLetter(item.text) == this.newTaskName) {
            this.changeNewTaskList('')
          };
          this.appointEvent()
        } else {
          if (this.taskTypeTransferLetter(item.text) == this.newTaskName) {
            this.changeNewTaskList('')
          };
          this.dispatchEvent()
        }
      },

      // 右边下拉框菜单点击
      leftLiCLick (index) {
        this.liIndex = index;
        localStorage.clear();
        this.$router.push({path:'/'})
      },

      // 跳转到我的页
      skipMyInfo () {
        this.leftDownShow = !this.leftDownShow;
      },

      //下面任务按钮路由跳转
      taskRouterSkip (name, index) {
        if (name === '调度任务') {
          this.$router.push({path:'/dispatchTask'});
          this.changeTitleTxt({tit:'调度任务'});
          setStore('currentTitle','调度任务')
        } else if (name === '循环任务') {
          this.$router.push({path:'/circulationTask'})
          this.changeTitleTxt({tit:'循环任务'});
          setStore('currentTitle','循环任务')
        } else if (name === '预约任务') {
          this.$router.push({path:'/appointTask'});
          this.changeTitleTxt({tit:'预约任务'});
          setStore('currentTitle','预约任务')
        } else if (name === '下班签退') {
          this.$dialog.alert({
            message: '确定签退?',
            closeOnPopstate: true,
            showCancelButton: true
          }).then(() => {
            this.userLoginOut(this.proId, this.workerId)
          })
          .catch(() => {

          })
        }
      },

      // 判断每种任务是否收集完成
      judgeTaskComplete () {
        // 重新存入用户信息
        if (getStore('userInfo')) {
          this.$store.commit('storeUserInfo',JSON.parse(getStore('userInfo')));
        };
        if (getStore('userType')) {
          this.$store.commit('changeUserType',getStore('userType'));
        };
        // 重新存入当前标题
        if (getStore('currentTitle')) {
          this.$store.commit('changeTitleTxt', {tit: getStore('currentTitle')});
        };
        // 重新存入请求token
        if (getStore('questToken')) {
          this.$store.commit('changeToken', getStore('questToken'));
        };
        // 重新存入调度任务具体信息
        if (getStore('currentDispatchTaskMessage')) {
          this.$store.commit('changeDispatchTaskMessage', {DtMsg: getStore('currentDispatchTaskMessage')});
        };
        // 重新存入预约任务具体信息
        if (getStore('currentAppointTaskMessage')) {
          this.$store.commit('changeAppointTaskMessage', {DtMsg: getStore('currentAppointTaskMessage')});
        };
        // 重新存入循环任务具体信息
        if (getStore('currentCirculationTaskMessage')) { 
          this.$store.commit('changeCirculationTaskMessage', {DtMsg: JSON.parse(getStore('currentCirculationTaskMessage'))});
        };
        // 重新存入循环任务科室采集信息
        if (getStore('currentCirculationCollectMessage')) {
          this.$store.commit('changeCirculationCollectMessageList', {DtMsg: (JSON.parse(getStore('currentCirculationCollectMessage'))['innerMessage'])})
        };
        // 重新存入循环任务是否第一次扫码
        if (getStore('isCirculationFirstSweepCode')) {
          this.$store.commit('changeIsFirstSweepCode', JSON.parse(getStore('isCirculationFirstSweepCode')));
        };
        // 重新存入循环任务科室交接信息
        if (getStore('currentCirculationConnectMessage')) {
          this.$store.commit('changeCirculationConnectMessageList', {DtMsg: (JSON.parse(getStore('currentCirculationConnectMessage'))['innerMessage'])})
        };
        // 重新存入医护人员生成运送类型信息
        if (getStore('currentTransportTypeMessage')) {
          this.$store.commit('changetransportTypeMessage', {DtMsg: getStore('currentTransportTypeMessage')});
        };
        // 重新存入循环任务完成采集科室信息
        if (getStore('completeDepartmentMessage')) {
          this.$store.commit('changeCompleteDeparnmentInfo', {DtMsg: JSON.parse(getStore('completeDepartmentMessage'))['sureInfo']});
        };
        // 重新存入送达的科室id
        if (getStore('currentDepartmentId')) {
          this.$store.commit('changeStoreArriveDeparnmentId',getStore('currentDepartmentId'));
        };
        // 重新存入过期方式
        if (getStore('storeOverDueWay')) {
          this.$store.commit('changeOverDueWay',JSON.parse(getStore('storeOverDueWay')));
        };
        // 重新存入是否循环采集页面取消按钮回显生效
        if (getStore('isDeleteCancel')) {
          this.$store.commit('changeIsDeleteCancel',JSON.parse(getStore('isDeleteCancel')));
        };
        // 重新存入是否循环采集页面生命周期回显生效
        if (getStore('isDeleteEcho')) {
          this.$store.commit('changeIsDeleteEcho',JSON.parse(getStore('isDeleteEcho')));
        };
        // 重新存入是否循环采集页面弹框确定按钮确定按钮点击状态
        if (getStore('isClickSure')) {
          this.$store.commit('changeIsClickSure',JSON.parse(getStore('isClickSure')));
        };
        // 重新存入调度任务完成扫码的出发地和单一目的地科室信息
        if (getStore('completeDispatchSweepCodeInfo')) {
          this.$store.commit('changeisCompleteSweepCode', JSON.parse(getStore('completeDispatchSweepCodeInfo'))['sweepCodeInfo']);
        };
        // 页面刷新重新存入调度任务完成扫码的非单一目的地科室信息
        if (getStore('completeDispatchSweepCodeDestinationInfo')) {
          this.$store.commit('changeIsCompleteSweepCodeDestinationList', JSON.parse(getStore('completeDispatchSweepCodeDestinationInfo'))['sweepCodeInfo']);
        };
        // 重新存入调度任务是否第一次扫码
        if (getStore('isDispatchFirstSweepCode')) {
          this.$store.commit('changeIsDispatchTaskFirstSweepCode', JSON.parse(getStore('isDispatchFirstSweepCode')));
        };
        // 重新存入循环任务完成扫码的科室信息
        if (getStore('completeCirculationSweepCodeInfo')) {
          this.$store.commit('changeIsDispatchTaskCompleteSweepCodeOfficeList', JSON.parse(getStore('completeCirculationSweepCodeInfo'))['sweepCodeInfo']);
        };
        // 重新存入预约任务完成扫码的出发地科室信息
        if (getStore('completAppointTaskSweepCodeInfo')) {
          this.$store.commit('changeIsCompleteSweepCodeList', JSON.parse(getStore('completAppointTaskSweepCodeInfo'))['sweepCodeInfo']);
        };
        // 页面刷新重新存入预约任务完成扫码的目的地科室信息
        if (getStore('completAppointTaskSweepCodeDestinationInfo')) {
          this.$store.commit('changeCompleteSweepcodeDestinationInfo', JSON.parse(getStore('completAppointTaskSweepCodeDestinationInfo'))['sweepCodeInfo']);
        };
        // 重新存入调度任务完成上传的照片
        if (getStore('completPhotoInfo')) {
          this.$store.commit('changeIsCompletePhotoList', JSON.parse(getStore('completPhotoInfo'))['photoInfo']);
        };
        // 重新存入预约任务是否第一次扫码
        if (getStore('isAppointFirstSweepCode')) {
          this.$store.commit('changeIsAppointTaskFirstSweepCode', JSON.parse(getStore('isAppointFirstSweepCode')));
        };
        // 页面刷新重新存入科室信息id
        if (getStore('departmentInfo')) {
          this.$store.commit('changeDepartmentInfoList', JSON.parse(getStore('departmentInfo')));
        };
        // 页面刷新重新存入科室信息编号
        if (getStore('departmentInfoNo')) {
          this.$store.commit('changeDepartmentInfoListNo', JSON.parse(getStore('departmentInfoNo')));
        }
      },

      /**
       * 医务人员代码
      */

      startTimeChange(e) { 
        let startTimeArr = e.getValues();//["2019", "03", "22", "17", "28"] 
        this.startTime = `${startTimeArr[0]}-${startTimeArr[1]}-${startTimeArr[2]}`
      },

      endTimeChange(e) {
        let endTimeArr = e.getValues();//["2019", "03", "22", "17", "28"] 
        this.endTime = `${endTimeArr[0]}-${endTimeArr[1]}-${endTimeArr[2]}`
      },

      // 初始化时间显示框
      initDate () {
        let currentDateList = formatTime('YYYY-MM-DD').split('-');
        this.startTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`;
        this.endTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`
      },

      // 搜索完成的任务
      searchCompleteTask () {
        this.queryCompleteDispatchTask(
          {
            proId:this.proId, workerId:'',state:7,
            startDate: this.startTime, endDate: this.endTime,
            createId: this.workerId,
            createType: 1 
          }
        )
      },

      // 左边列表点击
      operateListEvent (item,index) {
        this.operateListInnerIndex = index;
        if (index == 0) {
          this.operateMessage = 1;
          this.operateCallOut = '';
          this.operateTaskTrace = '';
          this.operateHistoryTask = '';
          this.operateTaskCollect = ''
        } else if (index == 1) {
          this.operateMessage = '';
          this.operateCallOut = 2;
          this.operateTaskTrace = '';
          this.operateHistoryTask = '';
          this.operateTaskCollect = '';
          // 查询运送类型
          this.parallelFunctionTwo();
        } else if (index == 2) {
          this.operateMessage = '';
          this.operateCallOut = '';
          this.operateTaskTrace = 3;
          this.operateHistoryTask = '';
          this.operateTaskCollect = ''
        } else if (index == 3) {
          this.operateMessage = '';
          this.operateCallOut = '';
          this.operateTaskTrace = '';
          this.operateHistoryTask = 4;
          this.operateTaskCollect = '';
          this.initDate();
          this.queryCompleteDispatchTask(
            {
              proId:this.proId, workerId:'',state:7,
              startDate: this.startTime, endDate: this.endTime,
              createId: this.workerId,
              createType: 1 
            }
          )
        } else if (index == 4) {
          this.operateMessage = '';
          this.operateCallOut = '';
          this.operateTaskTrace = '';
          this.operateHistoryTask = '';
          this.operateTaskCollect = 5
        }
      },

      // 跟踪任务(当天发起的任务)
      tailAfterTask (data) {
        queryGenerateDispatchTask(data).then((res) => {
          if (res && res.data.code == 200) {}
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },

      // 历史任务(已完成状态)
      getHistoryTask (data) {
        queryhistoryDispatchTask(data).then((res) => {
          if (res && res.data.code == 200) {}
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },

      // 收藏任务(经常发起的调度任务)
      getCollectTask (data) {
        collectDispatchTask(data).then((res) => {
          if (res && res.data.code == 200) {}
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },

      // 获取设备信息
      getDeviceMessage () {
        window.android.getDeviceInfo()
      },

      // 获取设备信息回调函数
      setDeviceInfo (val) {
        if (val) {
          try {
            this.searchDeviceMessage({ proId: this.proId, deviceNumber: val['IMEI']})
          } catch (err) {
            this.$dialog.alert({
              message: `${err}`,
              closeOnPopstate: true
            }).then(() => {})
          }
        }
      },

      // 查询设备信息
      searchDeviceMessage (data) {
        quereDeviceMessage(data)
        .then((res) => {
          if (res && res.data.code == 200) {
            if (this.destinationAddress !== '') {
              var destinationName = this.destinationList.filter((item) => { return item.value == this.destinationAddress})[0]['text'];
              if (this.destinationAddress == 0) {
                destinationName = ''
              }
            };
            if (this.vehicleOperation !== '') {
              var toolName = this.vehicleOperationList.filter((item) => { return item.value == this.vehicleOperation})[0]['text']
            } else {
              toolName = ''
            };
            if (this.transPortType !== '') {
              var taskTypeName = this.transPortTypeList.filter((item) => { return item.value == this.transPortType})[0]['text']
            } else {
              taskTypeName = ''
            };
            let taskMessage = {
              setOutPlaceId: res.data.data['spaceId'],  //出发地ID
              setOutPlaceName: res.data.data['spaceName'],  //出发地名称
              destinationId: this.destinationAddress == 0 ? '' : this.destinationAddress,   //目的地ID
              destinationName: destinationName,  //目的地名称
              taskTypeId: this.transPortType,  //运送类型 ID
              taskTypeName: taskTypeName,  //运送类型名称
              priority: this.priorityOperation,   //优先级   1-正常, 2-重要,3-紧急, 4-紧急重要
              toolId: this.vehicleOperation,   //运送工具ID
              toolName: toolName,  //运送工具名称
              actualCount: this.actualData,   //实际数量
              patientName: this.patientName,  //病人姓名
              sex: 0,    //病人性别  0-未指定,1-男, 2-女
              age: "",   //年龄
              number: this.patientNumber,   //住院号
              bedNumber: this.bedNumber,  //床号
              taskRemark: this.taskDescribe,   //备注
              createId: this.workerId,   //创建者ID  当前登录者
              createName: this.userName,   //创建者名称  当前登陆者
              proId: this.proId,   //项目ID
              proName: this.proName,   //项目名称
              isBack: this.returnDepartureOperation,  //是否返回出发地  0-不返回，1-返回
              createType: 1   //创建类型   0-调度员，1-医务人员 固定传 1
            };
            // 创建调度任务
            this.postGenerateDispatchTask(taskMessage)
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {})
        })
      },

      // 并行查询目的地、转运工具、运送类型
      parallelFunctionTwo (type) {
        Promise.all([this.getAllDestination(),this.getTransportTools(),this.getTransportsType()])
        .then((res) => {
          if (res && res.length > 0) {
            this.destinationList = [];
            this.vehicleOperationList = [];
            this.destinationList.push({text: '无', value: 0});
            let [item1,item2,item3] = res;
            if (item1) {
              Object.keys(item1).forEach((item) => {
                this.destinationList.push({
                  text: item1[item],
                  value: item
                })
              })
            };
            if (item2) {
              for (let item of item2) {
                this.vehicleOperationList.push({
                  text: item.toolName,
                  value: item.id
                })
              }
            };
            if (item3) {
              this.transPortTypeList = [];
              for (let item of item3) {
                this.transPortTypeList.push({
                  value: item.id, // 类型ID
                  text: item.typeName, //类型名称    
                  defaultDest: item.defaultDest, //默认目的地ID
                  defaultDestName: item.defaultDestName  //默认目的地 名称
                })
              }
            }
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err}`,
            closeOnPopstate: true
          }).then(() => {})
        })
      },

      // 查询目的地
      getAllDestination () {
        return new Promise((resolve,reject) => {
          queryAllDestination(this.proId).then((res) => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            }
          })
          .catch((err) => {
            reject(err.message)
          })
        })
      },

      // 查询转运工具
      getTransportTools () {
        return new Promise((resolve,reject) => {
          queryTransportTools({proId: this.proId, state: 0})
          .then((res) => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            }
          })
          .catch((err) => {
            reject(err.message)
          })
        })
      },

      // 查询运送类型
      getTransportsType () {
        return new Promise((resolve,reject) => {
          queryTransportType({proId: this.proId, state: 0}).then((res) => {
            if (res && res.data.code == 200) {
              if (res.data.data.length > 0) {
                resolve(res.data.data)
              }
            }
          })
          .catch((err) => {
            reject(err.message)
          })
        })
      },

      // 生成调度任务
      postGenerateDispatchTask (data) {
        generateDispatchTask(data).then((res) => {
          if (res && res.data.code == 200) {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
            this.initData()
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

      // 运送类型信息确认事件
      dispatchTaskSure () {
        try {
          this.getDeviceMessage();
        } catch (err) {
          this.$dialog.alert({
            message: `${err}`,
            closeOnPopstate: true
          }).then(() => {})
        }
      },

      // 运送类型信息取消事件
      dispatchTaskCancel () {
        this.initData()
      },

      // 查询历史调度任务(已完成)
      queryCompleteDispatchTask (data) {
        this.noDataShow = false;
        this.showLoadingHint = true;
        getDispatchTaskComplete(data).then((res) => {
          this.showLoadingHint = false;
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              this.historyTaskListShow = true;
              this.noDataShow = false;
              this.stateCompleteList = [];
              for (let item of res.data.data) {
                this.stateCompleteList.push({
                  createTime: item.createTime,
                  planUseTime: item.planUseTime,
                  planStartTime: item.planStartTime,
                  state: item.state,
                  setOutPlaceName: item.setOutPlaceName,
                  destinationName: item.destinationName,
                  taskTypeName: item.taskTypeName,
                  toolName: item.toolName,
                  priority: item.priority,
                  id: item.id,
                  startPhoto: item.startPhoto,
                  endPhoto: item.endPhoto,
                  isBack: item.isBack,
                  isSign: item.isSign
                })
              }
            } else {
              this.historyTaskListShow = false;
              this.noDataShow = true
            }
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
            this.noDataShow = true;
          });
          this.showLoadingHint = false;
        })
      },

      // 清空数据
      initData () {
        this.destinationAddress = 0;
        this.vehicleOperation = '';
        this.priorityOperation = '';
        this.transPortType = '';
        this.returnDepartureOperation = 0;
        this.bedNumber = '';
        this.patientName = '';
        this.patientNumber = '';
        this.taskDescribe = '';
        this.actualData = ''
      }
    }
  }
</script>
<style lang='less' scoped>
  @import "../common/stylus/variable.less";
  @import "../common/stylus/mixin.less";
  @import "../common/stylus/modifyUi.less";
  .content-wrapper {
    .content-wrapper();
    position: relative;
     .no-data {
      position: absolute;
      top: 200px;
      left: 13%;
      width: 100%;
      text-align: center;
    }
    .loading {
      position: absolute;
      top: 260px;
      left: 13%;
      width: 100%;
      height: 100px;
      text-align: center;
    };
    .play-voive-box {
      position: absolute;
      top: 60px;
      left: 10px
    };
    .worker-show {
      .content-wrapper();
      .content-top {
        padding: 15px 0;
        font-size: 14px;
        color: #fff;
        background-image: linear-gradient(to bottom, #2895ea, #5173f8);
        .content-top-userName {
          padding-left: 10px;
          height: 60px;
          .content-top-userName-img {
            display: inline-block;
            width: 35px;
            height: 35px;
            vertical-align: middle;
            margin-right: 8px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .real-name {
          }
        };
        .wait-dask-wrapper {
          padding-left: 10px;
          .wait-dask-title {
             font-size: 16px;
          }
          .wait-dask-list {
            margin-top : 6px;
            height: 50px;
            line-height: 50px;
            font-size: 18px;
            .listTaskStyle {
              color: #eb0000
            };
            li {
              display: inline-block;
              width: 32%;
              text-align: left;
              position: relative;
              .dask-list-sign {
                .status-sign(50px,50px,-8px,orange)
              }
              .daskListSignStyle {
                .status-sign(50px,50px,-8px, #eb0000)
              }
            }
          }
        };
      };
      .content-middle-task-message {
        height: 100px;
        background: #f2f2f2;
        padding: 8px 0;
        .task-message-number-wrapper {
          height: 100%;
          position: relative;
          box-sizing: border-box;
          .task-message-img {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            img {
              width: 100%;
              height: 100%;
            }
          };
          .task-message-number {
            height: 100%;
            box-sizing: border-box;
            font-size: 13px;
            color: #434343;
            padding: 28px 70px;
            .transport-day-number {
              height: 100%;
              width: 49%;
              display: inline-block;
              position: relative;
              span {
                position: absolute;
                left: 0;
                &:first-child {
                  top: 0
                };
                &:last-child {
                  bottom: 0;
                  font-size: 22px;
                  color: #2499e9
                }
              }
            }
            .transport-day-rank {
              height: 100%;
              width: 49%;
              display: inline-block;
              position: relative;
              span {
                position: absolute;
                right: 0;
                &:first-child {
                  top: 0
                };
                &:last-child {
                  bottom: 0;
                  font-size: 22px;
                  color: #fa8118;
                  right: 26px;
                }
              }
            }
          }
        }
      }
      .content-bottom {
        flex:1;
        overflow: auto;
        margin: 0 auto;
        margin-top: 10px;
        width: 100%;
        .task-button  {
          padding: 0 10px;
          li {
            width:49.5%;
            height: 120px;
            border-radius: 4px;
            display:inline-block;
            text-align: center;
            padding-top: 30px;
            box-sizing: border-box;
            position: relative;
            .task-button-wrapper {
              width: 100%;
              height: 120px;
              position: absolute;
              top: 0;
              left: 0;
              z-index: -1;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .task-btn-img {
              width: 40px;
              height: 40px;
              margin: 0 auto;
              img {
                width: 100%;
                height: 100%;
              }
            };
            .task-btn-tit {
              color: #1d221e;
              font-size: 13px;
              margin-top: 10px;
            }
            &:nth-child(3) {
              margin-top: 4px
            };
            &:nth-child(4) {
              margin-top: 4px
            };
            &:nth-child(odd) {
              margin-right: 1%
            }
          }
        }
      };  
      .left-dropDown {
        .rightDropDown
      }
    }
    .medical-worker-show {
      .content-wrapper();
       .left-dropDown {
        .rightDropDown
      }
      .medical-worker-operate {
        font-size: 14px;
        flex:1;
        display: flex;
        overflow: auto;
        margin: 0 auto;
        width: 100%;
        >div {
          display: inline-block
        }
        .medical-worker-operate-left {
          flex: 24%;
          background: #3a4862;
          .medical-worker-operate-list {
            height: 100%;
            .medical-worker-operate-list-inner {
              height: 90px;
              padding-top: 20px;
              box-sizing: border-box;
              text-align: center;
              border-bottom: 1px solid #fff;
              background: #3a4862;
              .operate-list-img {
                margin: 0 auto;
                width: 30px;
                height: 30px;
                margin-bottom: 10px;
                img {
                  width: 100%;
                  height: 100%
                }
              };
              .operate-list-tit {
                color: #fff;
                font-size: 12px;
              }
            };
            .operate-list-inner-style {
              background: #15c4f9 !important;
            };
          }
        };
        .medical-worker-operate-right {
          flex: 76%;
          padding: 6px 0;
          background: #fff;
          .medical-worker-operate-right-inner {
            width: 100%;
            height: 100%;
            > div {
              display: flex;
              height: 100%;
              flex-direction: column;
              > p {
                height: 30px;
                font-size: 14px;
                line-height: 30px;
                margin-bottom: 8px;
                background: #fff;
                padding-left: 8px;
                color: black;
              }
              .transport-type-area {
                  flex:1;
                  overflow: auto;
                  margin: 0 auto;
                  margin: 10px 0;
                  width: 100%;
                  .destination-box {
                    padding-left: 15px;
                    > div {
                        display: inline-block
                      };
                      .destination-title {
                        width: 24%;
                        color: #323233;
                      }
                    .destination-content {
                      width: 66%;
                      /deep/ .van-dropdown-menu {
                        .van-dropdown-menu__item {
                          .van-dropdown-menu__title {
                              width: 100%;
                              padding: 0;
                              color: #323233;
                              font-size: 14px;
                          }
                        }
                        .van-dropdown-menu__bar {
                          box-shadow: none
                        }
                        .van-dropdown-item {
                          left: 24%
                        }
                      }
                    }
                  }
                  /deep/ .van-cell {
                    .van-field__label {
                      width: 24%;
                      margin-right: 8px
                    }
                  }
                }
                .btn-area {
                  height: 80px;
                  text-align: center;
                  line-height: 80px;
                  span {
                    .bottomButton;
                    display: inline-block;
                    margin-top: 15px;
                    img {
                      width: 100%;
                      height: 100%
                    }
                  }
                }
              .medical-worker-task-list-box {
                flex:1;
                overflow: auto;
                overflow-x: hidden;
                .medical-worker-task-list {
                  height: 40px;
                  position: relative;
                  background: #fff;
                  box-sizing: border-box;
                  .list-content {
                    position: absolute;
                    top: 0;
                    left: 8px;
                    color: black;
                    height: 40px;
                    line-height: 40px;
                    .bottom-border-1px(#dcdcdc);
                  }
                  .list-icon {
                    position: absolute;
                    top: 12px;
                    right: 4px;
                    color: #b4b4b4;
                  }
                }
              }
            }
            .medical-worker-operate-right-callOut {
              .medical-worker-transport-type {
              }
            }
            .medical-worker-operate-right-historyTask {
              .historyTask-list-box {
                display: flex;
                height: 100%;
                flex-direction: column;
                .time-search {
                  background: #fff;
                  height: 44px;
                  position: relative;
                  /deep/ .van-cell {
                    width: 100%;
                    display: inline-block;
                    padding: 10px 10px;
                    border: 1px solid #d8d5d5;
                    border-radius: 4px;
                    line-height: 0;
                  }
                  .time-between {
                    color: black;
                    position: absolute;
                  }
                  .content-middle-top-content {
                    position: relative;
                    height: 100%;
                    width: 100%;
                    margin: 0 auto;
                    > div {
                      width: 44%;
                      position: absolute;
                      top: 14%;
                    }
                  }
                };
                .middle-top-search {
                  width: 100%;
                  margin: 4px 0;
                  text-align: center;
                  span {
                    display: inline-block;
                    width: 70px;
                    height: 30px;
                    img {
                      width: 100%;
                      height: 100%
                    }
                  }
                }
                .historyTask-list {
                  flex:1;
                  overflow: auto;
                  overflow-x: hidden;
                  .wait-handle-list {
                    box-sizing: border-box;
                    position: relative;
                    box-sizing: border-box;
                    .wait-handle-message-createTime {
                      border-top: 1px solid #e3ece9;
                      padding-left: 10px;
                      background: #ececec;
                      height: 24px;
                      line-height: 24px;
                      font-size: 12px;
                      color: #7f7d7d
                    };
                    .wait-handle-message-planUseTime {
                      position: absolute;
                      top: 6px;
                      right: 10px;
                      font-size: 12px;
                      color: #7f7d7d
                    };
                    .wait-handle-message {
                      font-size: 12px;
                      padding-top: 15px;
                      padding-bottom: 15px;
                      box-sizing: border-box;
                      .handle-message-line-wrapper {
                        margin-left: 30px;
                        p {
                          margin-bottom: 10px;
                          width: 47%;
                          display: inline-block;
                          vertical-align: top;
                          .message-tit {
                            color: #7f7d7d
                          };
                          .message-tit-real {
                            color: black
                          }
                        }
                      }
                    };
                    .wait-handle-check {
                      position: absolute;
                      top: 60px;
                      left: 6px
                    };
                    .get-wait-task {
                      width: 100%;
                      text-align: center;
                      span {
                        display: inline-block;
                        width: 90px;
                        height: 40px;
                        img {
                          width: 100%;
                          height: 100%
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
</style>

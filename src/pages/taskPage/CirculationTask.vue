<template>
  <div class="content-wrapper">
    <div class="no-data" v-show="noDataShow">
      <NoData></NoData>
    </div>
    <div class="loading">
      <loading :isShow="showLoadingHint" textContent="加载中,请稍候····" textColor="#2895ea"></loading>
    </div>
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
     <!-- 右边下拉框菜单 -->
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <div class="circultion-task-title">
      <div class="task-line-one-wrapper">
        <ul class="task-line-one">
          <li :class="{'taskLineOneStyle':taskLlineOneIndex == index}" :key="index" v-for="(item,index) in taskOneList" @click="taskLineOneEvent(item, index)">{{item}}</li>
        </ul>
      </div>
      <div class="status-box" v-show="taskQueryShow == false">
        <p class="task-line-two">
          <span class="state-filter-span">
            状态筛选
          </span>
         </p>
         <p class="status-name-box">
          <span class="status-name-title" @click.stop="statusScreenEvent">{{stateScreenVal}}</span>
          <ul class="status-name" v-show="stateListShow">
            <li class="state-li" :class="{stateListStyle:stateIndex == index}" v-for="(item, index) in stateList" :key="index" @click.stop="stateListEvent(index, item)">{{item}}</li>
          </ul>
        </p>
      </div>
    </div>
    <van-pull-refresh class="circulation-task-list-box"  v-model="isRefresh" @refresh="onRefresh" success-text="刷新成功">
      <div class="circulation-task-list" v-show="stateIndex == 0">
        <div class="wait-handle-list" v-for="(item,indexWrapper) in circulationTaskList" :key="indexWrapper">
          <div class="sample-type-check">
            <van-checkbox v-model="item.check" @click="checkBoxEvent"></van-checkbox>
          </div>
          <div class="view-office" @click.stop="viewOfficeHandle(item)">{{item.show == true ? '隐藏科室' : '显示科室'}}</div>
          <p class="wait-handle-message-createTime">
            创建时间：{{item.createTime}}
          </p>
          <p class="wait-handle-message-createTime">
            开始时间：{{item.startTime}}
          </p>
          <div class="wait-handle-message">
            <div class="handle-message-line-wrapper">
              <p>
                <span class="message-tit">医院:</span>
                <span class="message-tit-real">{{item.proName}}</span>
              </p>
              <p>
                <span class="message-tit">优先级:</span>
                <span class="message-tit-real">{{priorityTransfer(item.priority)}}</span>
              </p>
            </div>
            <div class="handle-message-line-wrapper">
              <p>
                <span class="message-tit">任务名称:</span>
                <span class="message-tit-real">{{item.taskTypeName}}</span>
              </p>
              <p>
                <span class="message-tit">工作人员:</span>
                <span class="message-tit-real">{{item.workerName}}</span>
              </p>
            </div>
            <div class="handle-message-line-wrapper">
              <p>
                <span class="message-tit">状态:</span>
                <span class="message-tit-real" style="color:red">{{stateTransfer(item.state)}}</span>
              </p>
            </div>
          </div>
          <div class="wait-handle-office-list" v-show="item.show">
            <ul>
              <li :class="{officeCheckStyle: drawCompleteTaskIdList.indexOf(item.id) != -1 && innerItem.check == true}" v-for="(innerItem, index) in item.spaces" :key="index" @click="officeTaskEvent(item, innerItem.text,innerItem.value, innerItem.check,indexWrapper)">{{innerItem.text}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="circulation-task-list" v-show="stateIndex == 1">
        <div class="wait-handle-list" v-for="(item,indexWrapper) in circulationTaskList" :key="indexWrapper">
          <div class="sample-type-check">
            <van-checkbox v-model="item.check" @click="checkBoxEvent"></van-checkbox>
          </div>
          <div class="view-office" @click.stop="viewOfficeHandle(item)">{{item.show == true ? '隐藏科室' : '显示科室'}}</div>
          <p class="wait-handle-message-createTime">
            创建时间：{{item.createTime}}
          </p>
          <p class="wait-handle-message-createTime">
            开始时间：{{item.startTime}}
          </p>
          <div class="wait-handle-message">
            <div class="handle-message-line-wrapper">
              <p>
                <span class="message-tit">医院:</span>
                <span class="message-tit-real">{{item.proName}}</span>
              </p>
              <p>
                <span class="message-tit">优先级:</span>
                <span class="message-tit-real">{{priorityTransfer(item.priority)}}</span>
              </p>
            </div>
            <div class="handle-message-line-wrapper">
              <p>
                <span class="message-tit">任务名称:</span>
                <span class="message-tit-real">{{item.taskTypeName}}</span>
              </p>
              <p>
                <span class="message-tit">工作人员:</span>
                <span class="message-tit-real">{{item.workerName}}</span>
              </p>
            </div>
            <div class="handle-message-line-wrapper">
              <p>
                <span class="message-tit">状态:</span>
                <span class="message-tit-real" style="color:red">{{stateTransfer(item.state)}}</span>
              </p>
            </div>
          </div>
          <div class="wait-handle-office-list" v-show="item.show">
            <ul>
              <li :class="{officeCheckStyle: drawCompleteTaskIdList.indexOf(item.id) != -1 && innerItem.check == true}" v-for="(innerItem, index) in item.spaces" :key="index" @click="officeTaskEvent(item, innerItem.text,innerItem.value, innerItem.check,indexWrapper)">{{innerItem.text}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="circulation-task-list" v-show="stateIndex == 2">
        <div class="wait-handle-list" v-for="(item,indexWrapper) in circulationTaskList" :key="indexWrapper">
          <div class="sample-type-check">
            <van-checkbox v-model="item.check" @click="checkBoxEvent"></van-checkbox>
          </div>
          <div class="view-office" @click.stop="viewOfficeHandle(item)">{{item.show == true ? '隐藏科室' : '显示科室'}}</div>
          <p class="wait-handle-message-createTime">
            创建时间：{{item.createTime}}
          </p>
          <p class="wait-handle-message-createTime">
            开始时间：{{item.startTime}}
          </p>
          <div class="wait-handle-message">
            <div class="handle-message-line-wrapper">
              <p>
                <span class="message-tit">医院:</span>
                <span class="message-tit-real">{{item.proName}}</span>
              </p>
              <p>
                <span class="message-tit">优先级:</span>
                <span class="message-tit-real">{{priorityTransfer(item.priority)}}</span>
              </p>
            </div>
            <div class="handle-message-line-wrapper">
              <p>
                <span class="message-tit">任务名称:</span>
                <span class="message-tit-real">{{item.taskTypeName}}</span>
              </p>
              <p>
                <span class="message-tit">工作人员:</span>
                <span class="message-tit-real">{{item.workerName}}</span>
              </p>
            </div>
            <div class="handle-message-line-wrapper">
              <p>
                <span class="message-tit">状态:</span>
                <span class="message-tit-real" style="color:red">{{stateTransfer(item.state)}}</span>
              </p>
            </div>
          </div>
          <div class="wait-handle-office-list" v-show="item.show">
            <ul>
              <li :class="{officeCheckStyle: drawCompleteTaskIdList.indexOf(item.id) != -1 && innerItem.check == true}" v-for="(innerItem, index) in item.spaces" :key="index" @click="officeTaskEvent(item, innerItem.text,innerItem.value, innerItem.check,indexWrapper)">{{innerItem.text}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="circulation-task-list-two" v-show="taskQueryShow">
        <div class="wait-handle-list" v-for="(item,indexWrapper) in circulationTaskList" :key="indexWrapper">
          <div class="sample-type-check">
            <van-checkbox v-model="item.check" @click="checkBoxEvent"></van-checkbox>
          </div>
          <div class="view-office" @click.stop="viewOfficeHandle(item)">{{item.show == true ? '隐藏科室' : '显示科室'}}</div>
          <p class="wait-handle-message-createTime">
            创建时间：{{item.createTime}}
          </p>
          <p class="wait-handle-message-createTime">
            开始时间：{{item.startTime}}
          </p>
          <div class="wait-handle-message">
            <div class="handle-message-line-wrapper">
              <p>
                <span class="message-tit">医院:</span>
                <span class="message-tit-real">{{item.proName}}</span>
              </p>
              <p>
                <span class="message-tit">优先级:</span>
                <span class="message-tit-real">{{priorityTransfer(item.priority)}}</span>
              </p>
            </div>
            <div class="handle-message-line-wrapper">
              <p>
                <span class="message-tit">任务名称:</span>
                <span class="message-tit-real">{{item.taskTypeName}}</span>
              </p>
              <p>
                <span class="message-tit">工作人员:</span>
                <span class="message-tit-real">{{item.workerName}}</span>
              </p>
            </div>
            <div class="handle-message-line-wrapper">
              <p>
                <span class="message-tit">状态:</span>
                <span class="message-tit-real" style="color:red">{{stateTransfer(item.state)}}</span>
              </p>
            </div>
          </div>
          <div class="wait-handle-office-list" v-show="item.show">
            <ul>
              <li :class="{officeCheckStyle: drawCompleteTaskIdList.indexOf(item.id) != -1 && innerItem.check == true}" v-for="(innerItem, index) in item.spaces" :key="index" @click="officeTaskEvent(item, innerItem.text,innerItem.value, innerItem.check,indexWrapper)">{{innerItem.text}}</li>
            </ul>
          </div>
        </div>
      </div>
    </van-pull-refresh>
    <div class="circultion-task-btn">
      <span>
        <img :src="taskArrivedPng" alt="" @click="circulationTaskArrived">
      </span>
      <span>
        <img :src="taskConditionPng" alt=""  @click="circulationConditionEvent">
      </span>
    </div>
  </div>
</template>

<script>
  import HeaderTop from '@/components/HeaderTop'
  import FooterBottom from '@/components/FooterBottom'
  import {queryCirculationTask} from '@/api/workerPort.js'
  import NoData from '@/components/NoData'
  import Loading from '@/components/Loading'
  import { mapGetters, mapMutations } from 'vuex'
  import { formatTime, setStore, getStore, removeStore, IsPC, removeBlock, deepClone, repeArray } from '@/common/js/utils'
  import {getDictionaryData} from '@/api/login.js'
  export default {
    data () {
      return {
        showLoadingHint: false,
        stateListShow: false,
        statusScreen: false,
        taskQueryShow: false,
        noDataShow: false,
        stateIndex: 0,
        stateListShow: false,
        taskListBoxShow: true,
        isRefresh: false,
        stateScreenVal: '全部',
        taskLlineOneIndex: '0',
        taskOneList: ['待处理', '任务查询'],
        stateList: ['全部','未开始','进行中'],
        circulationTaskListShow: false,
        leftDropdownDataList: ['退出登录'],
        leftDownShow: false,
        liIndex: null,
        circulationTaskList: [],
        drawCompleteTaskIdList: [],
        currentOfficeName: '',
        taskConditionPng: require('@/components/images/task-condition.png'),
        taskArrivedPng: require('@/components/images/task-arrived.png')
      };
    },

    components: {
      HeaderTop,
      NoData,
      Loading,
      FooterBottom
    },

    computed: {
      ...mapGetters([
        'navTopTitle',
        'completeDeparnmentInfo',
        'isDispatchTaskCompleteSweepCodeOfficeList'
      ]),
      proId () {
        return JSON.parse(getStore('userInfo')).extendData.proId
      },
      workerId () {
        return JSON.parse(getStore('userInfo')).extendData.userId
      }
    },

    mounted () {
      // 控制设备物理返回按键测试
      if (!IsPC()) {
        let that = this;
        pushHistory();
        that.gotoURL(() => {
          pushHistory();
          this.$router.push({path: 'home'});
          this.changeTitleTxt({tit:'中央运送'});
          setStore('currentTitle','中央运送') 
        })
      };
      document.addEventListener('click', (e) => {
        if(e.target.className!='status-name'){
          this.stateListShow = false;
        };
        if(e.target.className!='van-icon van-icon-manager-o' && e.target.className!='left-dropDown'){
          this.leftDownShow = false;
        }
      });
      this.getCirculationTask({
        proId: this.proId,  //医院ID，必输
        workerId: this.workerId,   //运送员ID
        states: [], //查询状态
        startDate: '',  //起始日期  YYYY-MM-dd
        endDate: ''  //终止日期  格式 YYYY-MM-dd
      }, this.stateIndex);
      this.drawTaskId()
    },

    methods: {
      ...mapMutations([
        'changeTitleTxt',
        'changeCirculationTaskMessage',
        'changeIsCollectEnterSweepCodePage',
        'changeCirculationTaskId',
        'changeStipulateOfficeList',
        'changeArriveDepartmentId',
        'changeIsDispatchTaskCompleteSweepCodeOfficeList'
      ]),

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

      // 查看科室事件
      viewOfficeHandle (item) {
        item.show = !item.show;
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
          default:
            return '无'
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

      // 循环任务第一行按钮点击
      taskLineOneEvent (item,index) {
        this.statusScreen = false;
        this.taskLlineOneIndex = index;
        this.noDataShow = false;
        if (index == '0') {
          this.stateIndex = 0;
          this.taskQueryShow = false;
          this.stateScreenVal = '全部';
          this.getCirculationTask({
            proId: this.proId,  //医院ID，必输
            workerId: this.workerId,   //运送员ID
            states: [], //查询状态
            startDate: '',  //起始日期  YYYY-MM-dd
            endDate: ''  //终止日期  格式 YYYY-MM-dd
          }, this.stateIndex);
        } else if (index == '1') {
            this.stateIndex = null;
            this.taskQueryShow = true;
            this.getCirculationTask({
            proId: this.proId,  //医院ID，必输
            workerId: this.workerId,   //运送员ID
            states: [], //查询状态
            startDate: '',  //起始日期  YYYY-MM-dd
            endDate: ''  //终止日期  格式 YYYY-MM-dd
          },7)
        }
      },

      // 状态筛选列表点击
      stateListEvent (index, item) {
        this.stateIndex = index;
        this.stateScreenVal = item;
        this.getCirculationTask ({
          proId: this.proId,  //医院ID，必输
          workerId: this.workerId,   //运送员ID
          states: [], //查询状态
          startDate: '',  //起始日期  YYYY-MM-dd
          endDate: ''  //终止日期  格式 YYYY-MM-dd
        }, index)
      },

      // 状态筛选按钮点击
      statusScreenEvent () {
        this.statusScreen = true;
        this.taskQueryShow = false;
        this.stateListShow = !this.stateListShow;
        if (this.stateScreenVal == '状态筛选') {
          this.queryStateFilterDispatchTask(this.proId, this.workerId, 0);
          this.stateIndex = 0;
        }
      },

      // 提取存储已完成采集任务科室所属任务id
      drawTaskId () {
        this.drawCompleteTaskIdList = [];
        if (this.completeDeparnmentInfo.length > 0) {
          for (let item of this.completeDeparnmentInfo) { 
            for (let innerItem in item) {
              if (innerItem == 'taskId') {
                this.drawCompleteTaskIdList.push(item[innerItem])
              }
            }
          }
        }
      },

      // 查询循环任务
      getCirculationTask (data,index) {
        this.noDataShow = false;
        this.showLoadingHint = true;
        queryCirculationTask(data).then((res) => {
          this.showLoadingHint = false;
          this.circulationTaskList = [];
          let temporaryTaskListFirst = [];
          if (res && res.data.code == 200) {
            this.isRefresh = false;
            if (res.data.data.length > 0) {
              this.circulationTaskListShow = true;
              this.noDataShow = false;
              for (let item of res.data.data) {
                temporaryTaskListFirst.push({
                  createTime: item.createTime,
                  startTime: item.startTime,
                  proName: item.proName,
                  officeName: item.proName,
                  taskTypeName: item.taskTypeName,
                  workerName: item.workerName,
                  state: item.state,
                  priority: item.priority,
                  taskNumber: item.taskNumber,
                  spaces: item.spaces,
                  id: item.id,
                  show: false,
                  check: false
                })
              };
              if (this.stateIndex !== null) {
                if (index == 0) {
                  this.circulationTaskList = temporaryTaskListFirst.filter((item) => { return item.state !== 7});
                  if (this.circulationTaskList.length == 0) {
                    this.noDataShow = true;
                    return
                  };
                } else if (index == 1) {
                  this.circulationTaskList = temporaryTaskListFirst.filter((item) => { return item.state == 2});
                  if (this.circulationTaskList.length == 0) {
                    this.noDataShow = true;
                    return
                  }
                } else if (index == 2) {
                  this.circulationTaskList = temporaryTaskListFirst.filter((item) => { return item.state == 3});
                  if (this.circulationTaskList.length == 0) {
                    this.noDataShow = true;
                    return
                  }
                }
              } else if (this.taskQueryShow) {
                 if (index == 7) {
                  this.circulationTaskList = temporaryTaskListFirst.filter((item) => { return item.state == 7});
                  if (this.circulationTaskList.length == 0) {
                    this.noDataShow = true;
                    return
                  }
                }
              }
              // 改变科室列表数据结构
              for (let item = 0, len = this.circulationTaskList.length; item < len; item++) {
                let temporaryArrayTwo = [];
                for (let innerItem in this.circulationTaskList[item]) {
                  if (innerItem == 'spaces') {
                    let temporaryArrayTwo = [];
                    let temporaryItem = removeBlock(this.circulationTaskList[item][innerItem]).split(",");
                    let temporaryArrayOne = [];
                    for (let kip of temporaryItem) {
                      temporaryArrayOne = [];
                      temporaryArrayOne = kip.replace(/\"/g, "").split(':');
                      temporaryArrayTwo.push({text: temporaryArrayOne[1], value: temporaryArrayOne[0]});
                    }
                    this.circulationTaskList[item]['spaces'] = temporaryArrayTwo;
                  };
                }
              };
              // 科室列表增加字段
              for (let item of this.circulationTaskList) {
                for (let innerItem in item) {
                  if (innerItem == 'spaces') {
                    for (let medicalItem of item[innerItem]) {
                      medicalItem['check'] = false
                    }
                  }
                }
              };
              // 为完成采集的科室增加标记
              if (this.completeDeparnmentInfo.length > 0) {
                for (let w = 0, wLen = this.completeDeparnmentInfo.length; w < wLen; w++) {
                  if (this.circulationTaskList.length > 0) {
                     for (let n = 0, nLen = this.circulationTaskList.length; n < nLen; n++) {
                      if (this.circulationTaskList[n]['id'] == this.completeDeparnmentInfo[w]['taskId']) {
                        if (this.completeDeparnmentInfo[w]['departmentIdList'].length > 0) {
                          for (let i = 0, len1 = this.completeDeparnmentInfo[w]['departmentIdList'].length; i < len1; i++) {
                            if (this.circulationTaskList[n]['spaces'].length > 0) {
                              for (let j = 0, len2 = this.circulationTaskList[n]['spaces'].length; j < len2; j++) {
                                if (this.circulationTaskList[n]['spaces'][j]['value'] == this.completeDeparnmentInfo[w]['departmentIdList'][i]) {
                                  this.circulationTaskList[n]['spaces'][j]['check'] = true
                                }
                              }
                            }
                          }
                        }
                      };
                      // 清空上个任务存储的已完成科室信息
                      if (this.circulationTaskList[n]['spaces'].every((item,index) => { return item.check == true})) {
                        let temporaryTaskId = this.circulationTaskList[n]['id'];
                        let temporarySweepCodeOficeList = deepClone(this.isDispatchTaskCompleteSweepCodeOfficeList);
                        temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return item.taskId != temporaryTaskId});
                        this.changeIsDispatchTaskCompleteSweepCodeOfficeList(temporarySweepCodeOficeList);
                        setStore('completeCirculationSweepCodeInfo', {"sweepCodeInfo": temporarySweepCodeOficeList});
                      }
                    }
                  }
                }
              };
              console.log('任务信息',this.circulationTaskList)
            } else {
              this.circulationTaskListShow = false;
              this.noDataShow = true;
            }
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
              this.circulationTaskListShow = false;
              this.noDataShow = true;
            });
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
            this.circulationTaskListShow = false;
            this.noDataShow = true;
          });
          this.showLoadingHint = false;
        });
      },

      // 下拉刷新
      onRefresh () {
        if (!this.taskQueryShow) {
          this.getCirculationTask({
            proId: this.proId,  //医院ID，必输
            workerId: this.workerId,   //运送员ID
            states: [], //查询状态
            startDate: '',  //起始日期  YYYY-MM-dd
            endDate: ''  //终止日期  格式 YYYY-MM-dd
          }, this.stateIndex)
        } else {
           this.getCirculationTask({
            proId: this.proId,  //医院ID，必输
            workerId: this.workerId,   //运送员ID
            states: [], //查询状态
            startDate: '',  //起始日期  YYYY-MM-dd
            endDate: ''  //终止日期  格式 YYYY-MM-dd
          }, 7)
        }
      },

      // 返回上一页
      backTo () {
        this.$router.push({path: 'home'});
        this.changeTitleTxt({tit:'中央运送'});
        setStore('currentTitle','中央运送')
      },

      checkBoxEvent () {
        console.log('选中',this.circulationTaskList);
      },

      // 科室任务列表点击
      officeTaskEvent (item, val, key, check, index, indexWrapper) {
        if (check == true) {
          this.$dialog.alert({
            message: '该科室已完成标本收集',
            closeOnPopstate: true
          }).then(() => {
          });
          return
        };
        if (item.state == 7) {
          this.$dialog.alert({
            message: '该科室对应的循环任务已完成',
            closeOnPopstate: true
          }).then(() => {
          });
          return
        };
        this.changeArriveDepartmentId(false);
        this.currentOfficeName = indexWrapper;
        this.changeIsCollectEnterSweepCodePage(true);
        this.changeStipulateOfficeList(item.spaces.filter((inx) => { return inx.check == false}));
        this.$router.push({'path':'/circulationTaskSweepCode'});
        this.changeTitleTxt({tit:'扫码'});
        setStore('currentTitle','扫码');
        // 改变循环具体某一任务的信息状态
        this.changeCirculationTaskMessage({DtMsg:{currentMsg: item, wrapperIndex: indexWrapper, officeName: val, officeId: key}});
        setStore('currentCirculationTaskMessage',{currentMsg: item, wrapperIndex: indexWrapper, officeName: val, officeId: key});
      },

      // 循环任务送达
      circulationTaskArrived () {
        // 获取选中任务的id
        let checkTaskId = '';
        let checkList = [];
        checkList = this.circulationTaskList.filter((item) => item.check == true);
        if (checkList.length == 0) {
          this.$dialog.alert({
            message: '请选择要送达的循环任务',
            closeOnPopstate: true
          }).then(() => {
          });
          return;
        };
        if (checkList.length > 1) {
          this.$dialog.alert({
            message: '最多只能同时送达一条循环任务',
            closeOnPopstate: true
          }).then(() => {
          });
          return
        }; 
        if (checkList.length == 1) {
          if (checkList[0].state == 7) { 
            this.$dialog.alert({
              message: '该条循环任务已完成,不能进行送达',
              closeOnPopstate: true
            }).then(() => {
            });
          } else {
            this.changeArriveDepartmentId(true);
            if (checkList[0]['spaces'].filter((item) => item.check == true).length == checkList[0]['spaces'].length) {
              for (let item of checkList) {
                for (let innerItem in item) {
                  if (innerItem == 'id') {
                    checkTaskId = item[innerItem]
                  }
                }
              };
              this.changeCirculationTaskId(checkTaskId);
              this.changeIsCollectEnterSweepCodePage(false);
              this.$router.push({path: 'circulationTaskSweepCode'});
              this.changeTitleTxt({tit:'扫码'});
              setStore('currentTitle','扫码')
            } else {
              this.$dialog.alert({
                message: '请采集完该条循环任务下所有科室',
                closeOnPopstate: true
              }).then(() => {
              });
            }
          }
        }
      },

      // 循环情况事件
      circulationConditionEvent () {
        this.$router.push({path: 'circulationTaskCondition'});
        this.changeTitleTxt({tit:'循环情况'});
        setStore('currentTitle','循环情况')
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
    position: relative;
    font-size: 14px;
    .left-dropDown {
      .rightDropDown
    }
    .no-data {
      position: absolute;
      top: 200px;
      left: 0;
      width: 100%;
      text-align: center;
    }
    .loading {
      position: absolute;
      top: 260px;
      left: 0;
      width: 100%;
      height: 50px;
      text-align: center;
    }
    .circultion-task-title {
      .task-line-one-wrapper {
          height: 36px;
          background-image: linear-gradient(to bottom, #2895ea, #5173f8);
        .task-line-one {
          width: 70%;
          margin: 0 auto;
          .taskLineOneStyle {
            color: #2895ea;
            background: #ffff;
            border-top-left-radius: 2px;
            border-top-right-radius: 2px
          }
          li {
            display: inline-block;
            margin-top: 1px;
            color: #fff;
            width: 46%;
            height: 36px;
            line-height: 36px;
            text-align: center
          }
        };
      }
      .status-box {
        position: relative;
        width: 100%;
        margin-top: 6px;
        height: 40px;
        background: #f6f6f6;
        .task-line-two {
          height: 40px;
          font-size: 0;
          box-sizing: border-box;
          color: #7f7d7d;
          position: absolute;
          top: 0;
          left: 10px;
          .taskLineTwoStyle {
            color: #2895ea
          }
          span {
            font-size: 15px;
            height: 40px;
            display: inline-block;
            text-align: center;
            line-height: 40px;
            border-right: 1px solid #dedada;
            &:last-child {
              border-right: none
            }
          }
        }
        .status-name-box {
          position: absolute;
          width: 100px;
          top: 0;
          right: 10px;
          font-size: 15px;
          .status-name-title {
            width: 100%;
            color: #3996f3;
            background: #fff;
            height: 40px;
            line-height: 40px;
            text-align: center;
            display: inline-block;
          }
          .status-name {
            position: absolute;
            top: 40px;
            left: 0;
            z-index: 1000;
            box-shadow: 0 1px 6px 2px #d1d1d1;
            width: 100%;
            background: #fff;
            li {
              width: 100%;
              line-height: 40px;
              text-align: center
            }
            .stateListStyle {
              color: #fff;
              background: #2895ea
            }
          }
        }
      }
    };
    .circulation-task-list {
      /deep/ .van-tabs {
        .right-sign {
          .status-sign 
        }
      }
    };
    .circulation-task-list-box {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
      .circulation-task-list {
        .wait-handle-list {
          box-sizing: border-box;
          position: relative;
          padding-bottom: 10px;
          box-sizing: border-box;
          .sample-type-check {
            position: absolute;
            top: 10px;
            left: 5px
          };
          .wait-handle-message-createTime {
            border-top: 1px solid #e3ece9;
            padding-left: 30px;
            background: #ececec;
            height: 24px;
            line-height: 24px;
            font-size: 12px;
            color: #7f7d7d
          };
          .wait-handle-message {
            margin-left: 30px;
            font-size: 12px;
            padding-top: 15px;
            padding-bottom: 15px;
            box-sizing: border-box;
            .handle-message-line-wrapper {
              p {
                margin-bottom: 10px;
                width: 47%;
                display: inline-block;
                .message-tit {
                  color: #7f7d7d
                };
                .message-tit-real {
                  color: black
                }
              }
            }
          };
          .view-office {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 8px 6px;
            line-height: 14px;
            background: #2895ea;
            font-size: 14px;
            color: #fff;
            border-radius: 3px;
            box-sizing: border-box
          }
          .wait-handle-office-list {
            position: absolute;
            top: 48px;
            left: 0;
            width: 100%;
            max-height: 160px;
            overflow: auto;
            z-index: 100;
            ul {
              li {
                line-height: 50px;
                font-size: 13px;
                text-align: center;
                background:#fff;
                border-bottom: 1px solid #fff
              }
              .officeCheckStyle {
                color: #fff;
                background: #2895ea
              }
            }
          }
          .wait-handle-check {
            position: absolute;
            top: 40px;
            left: 6px
          };
          .get-wait-task {
            width: 100%;
            text-align: center
          }
        }
      }
    };
    .circulation-task-list-two {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
      .wait-handle-list {
        box-sizing: border-box;
        position: relative;
        padding-bottom: 10px;
        box-sizing: border-box;
        .sample-type-check {
          position: absolute;
          top: 10px;
          left: 5px
        };
        .wait-handle-message-createTime {
          border-top: 1px solid #e3ece9;
          padding-left: 30px;
          background: #ececec;
          height: 24px;
          line-height: 24px;
          font-size: 12px;
          color: #7f7d7d
        };
        .wait-handle-message {
          margin-left: 30px;
          font-size: 12px;
          padding-top: 15px;
          padding-bottom: 15px;
          box-sizing: border-box;
          .handle-message-line-wrapper {
            p {
              margin-bottom: 10px;
              width: 47%;
              display: inline-block;
              .message-tit {
                color: #7f7d7d
              };
              .message-tit-real {
                color: black
              }
            }
          }
        };
        .view-office {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 8px 6px;
          line-height: 14px;
          background: #2895ea;
          font-size: 14px;
          color: #fff;
          border-radius: 3px;
          box-sizing: border-box
        }
        .wait-handle-office-list {
          position: absolute;
          top: 48px;
          left: 0;
          width: 100%;
          max-height: 160px;
          overflow: auto;
          z-index: 100;
          ul {
            li {
              line-height: 50px;
              font-size: 13px;
              text-align: center;
              background:#fff;
              border-bottom: 1px solid #fff
            }
            .officeCheckStyle {
              color: #fff;
              background: #2895ea
            }
          }
        }
        .wait-handle-check {
          position: absolute;
          top: 40px;
          left: 6px
        };
        .get-wait-task {
          width: 100%;
          text-align: center
        }
      }
    };
    .circultion-task-btn {
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
  }
</style>
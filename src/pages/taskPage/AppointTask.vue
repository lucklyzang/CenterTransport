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
    <div class="dispatch-task-title">
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
      <div class="task-operate-box" v-show="cancelTaskBtnShow || transferTaskBtnShow">
        <span v-show="transferTaskBtnShow" @click="transferTaskEvent">转移任务</span>
      </div>
    </div>
    <van-pull-refresh v-model="isRefresh" class="wait-handle-box" @refresh="onRefresh" v-show="waitHandleBox" success-text="刷新成功">
      <div class="state-filter-all wait-handle-one" v-show="stateIndex == 0">
        <div class="task-status-list">
          <div class="wait-handle-list" v-for="(item,index) in stateFilterList" :key="`${item}-${index}`">
            <div class="wait-handle-message">
              <div class="handle-message-line-wrapper">
                <p>
                  <span class="message-tit">开始时间: {{item.createTime}}</span>
                </p>
                <p>
                  <span class="message-tit">任务描述: {{item.taskRemark}}</span>
                </p>
              </div>
              <div class="handle-message-line-wrapper">
                <P>
                  <span class="message-tit">起点: {{item.setOutPlaceName}}</span>
                </P>
                <p>
                  <span class="message-tit">床号: {{item.bedNumber}}</span>
                </p>
              </div>
              <div class="handle-message-line-wrapper">
                <p class="p-other">
                  <span class="message-tit">优先级:</span>
                  <span class="message-tit-real" :class="{'natureNormalStyle' : item.priority == 1, 'natureImportantStyle': item.priority != 1}">{{priorityTransfer(item.priority)}}</span>
                </p>
                <P class="p-other">
                  <span class="message-tit">转运工具: {{item.toolName ? item.toolName : '无'}}</span>
                </P>
              </div>
              <div class="handle-message-line-wrapper">
                <p class="p-other">
                  <span class="message-tit">状态:</span>
                  <span class="message-tit-real" style="color:red">{{ stateTransfer(item.state) }}</span>
                </p>
              </div>
            </div>
            <p class="wait-handle-check" v-show="item.state == 2 || item.state == 3">
              <van-checkbox v-model="item.taskCheck"  @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
            </p>
            <p class="get-wait-task">
              <span v-show="item.state == '1'">
                <img :src="taskGetPng" alt="" @click.stop="getTask(item.id)">
              </span>
              <span v-show="!(item.state == '1')" @click.stop="intoTask(item)">
                进入任务
              </span>
              <span v-show="item.state == '1' || item.state == '2' " @click="cancelTaskEvent(item)">取消</span>
            </p>
          </div>
        </div>
      </div>
      <div class="state-filter-all wait-handle-one" v-show="stateIndex == 1">
        <div class="task-status-list">
          <div class="wait-handle-list" v-for="(item,index) in stateFilterList" :key="`${item}-${index}`">
            <div class="wait-handle-message">
              <div class="handle-message-line-wrapper">
                <p>
                  <span class="message-tit">开始时间: {{item.createTime}}</span>
                </p>
                <p>
                  <span class="message-tit">任务描述: {{item.taskRemark}}</span>
                </p>
              </div>
              <div class="handle-message-line-wrapper">
                <P>
                  <span class="message-tit">起点: {{item.setOutPlaceName}}</span>
                </P>
                <p>
                  <span class="message-tit">床号: {{item.bedNumber}}</span>
                </p>
              </div>
              <div class="handle-message-line-wrapper">
                <p class="p-other">
                  <span class="message-tit">优先级:</span>
                  <span class="message-tit-real" :class="{'natureNormalStyle' : item.priority == 1, 'natureImportantStyle': item.priority != 1}">{{priorityTransfer(item.priority)}}</span>
                </p>
                <P class="p-other">
                  <span class="message-tit">转运工具: {{item.toolName ? item.toolName : '无'}}</span>
                </P>
              </div>
              <div class="handle-message-line-wrapper">
                <p class="p-other">
                  <span class="message-tit">状态:</span>
                  <span class="message-tit-real" style="color:red">{{ stateTransfer(item.state) }}</span>
                </p>
              </div>
            </div>
            <p class="wait-handle-check" v-show="item.state == 2 || item.state == 3">
              <van-checkbox v-model="item.taskCheck"  @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
            </p>
            <p class="get-wait-task">
              <span v-show="item.state == '1'">
                <img :src="taskGetPng" alt="" @click.stop="getTask(item.id)">
              </span>
              <span v-show="!(item.state == '1')" @click.stop="intoTask(item)">
                进入任务
              </span>
              <span v-show="item.state == '1' || item.state == '2' " @click="cancelTaskEvent">取消</span>
            </p>
          </div>
        </div>
      </div>
      <div class="state-filter-all wait-handle-one" v-show="stateIndex == 2">
        <div class="task-status-list">
          <div class="wait-handle-list" v-for="(item,index) in stateFilterList" :key="`${item}-${index}`">
            <div class="wait-handle-message">
              <div class="handle-message-line-wrapper">
                <p>
                  <span class="message-tit">开始时间: {{item.createTime}}</span>
                </p>
                <p>
                  <span class="message-tit">任务描述: {{item.taskRemark}}</span>
                </p>
              </div>
              <div class="handle-message-line-wrapper">
                <P>
                  <span class="message-tit">起点: {{item.setOutPlaceName}}</span>
                </P>
                <p>
                  <span class="message-tit">床号: {{item.bedNumber}}</span>
                </p>
              </div>
              <div class="handle-message-line-wrapper">
                <p class="p-other">
                  <span class="message-tit">优先级:</span>
                  <span class="message-tit-real" :class="{'natureNormalStyle' : item.priority == 1, 'natureImportantStyle': item.priority != 1}">{{priorityTransfer(item.priority)}}</span>
                </p>
                <P class="p-other">
                  <span class="message-tit">转运工具: {{item.toolName ? item.toolName : '无'}}</span>
                </P>
              </div>
              <div class="handle-message-line-wrapper">
                <p class="p-other">
                  <span class="message-tit">状态:</span>
                  <span class="message-tit-real" style="color:red">{{ stateTransfer(item.state) }}</span>
                </p>
              </div>
            </div>
            <p class="wait-handle-check" v-show="item.state == 2 || item.state == 3">
              <van-checkbox v-model="item.taskCheck"  @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
            </p>
            <p class="get-wait-task">
              <span v-show="item.state == '1'">
                <img :src="taskGetPng" alt="" @click.stop="getTask(item.id)">
              </span>
              <span v-show="!(item.state == '1')" @click.stop="intoTask(item)">
                进入任务
              </span>
              <span v-show="item.state == '1' || item.state == '2' " @click="cancelTaskEvent">取消</span>
            </p>
          </div>
        </div>
      </div>
      <div class="state-filter-all wait-handle-one" v-show="stateIndex == 3">
        <div class="task-status-list">
          <div class="wait-handle-list" v-for="(item,index) in stateFilterList" :key="`${item}-${index}`">
            <div class="wait-handle-message">
              <div class="handle-message-line-wrapper">
                <p>
                  <span class="message-tit">开始时间: {{item.createTime}}</span>
                </p>
                <p>
                  <span class="message-tit">任务描述: {{item.taskRemark}}</span>
                </p>
              </div>
              <div class="handle-message-line-wrapper">
                <P>
                  <span class="message-tit">起点: {{item.setOutPlaceName}}</span>
                </P>
                <p>
                  <span class="message-tit">床号: {{item.bedNumber}}</span>
                </p>
              </div>
              <div class="handle-message-line-wrapper">
                <p class="p-other">
                  <span class="message-tit">优先级:</span>
                  <span class="message-tit-real" :class="{'natureNormalStyle' : item.priority == 1, 'natureImportantStyle': item.priority != 1}">{{priorityTransfer(item.priority)}}</span>
                </p>
                <P class="p-other">
                  <span class="message-tit">转运工具: {{item.toolName ? item.toolName : '无'}}</span>
                </P>
              </div>
              <div class="handle-message-line-wrapper">
                <p class="p-other">
                  <span class="message-tit">状态:</span>
                  <span class="message-tit-real" style="color:red">{{ stateTransfer(item.state) }}</span>
                </p>
              </div>
            </div>
            <p class="wait-handle-check" v-show="item.state == 2 || item.state == 3">
              <van-checkbox v-model="item.taskCheck"  @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
            </p>
            <p class="get-wait-task">
              <span v-show="item.state == '1'">
                <img :src="taskGetPng" alt="" @click.stop="getTask(item.id)">
              </span>
              <span v-show="!(item.state == '1')" @click.stop="intoTask(item)">
                进入任务
              </span>
              <span v-show="item.state == '1' || item.state == '2' " @click="cancelTaskEvent">取消</span>
            </p>
          </div>
        </div>
      </div>
      <div class="state-filter-all wait-handle-one" v-show="stateIndex == 4">
        <div class="task-status-list">
          <div class="wait-handle-list" v-for="(item,index) in stateFilterList" :key="`${item}-${index}`">
           <div class="wait-handle-message">
              <div class="handle-message-line-wrapper">
                <p>
                  <span class="message-tit">开始时间: {{item.createTime}}</span>
                </p>
                <p>
                  <span class="message-tit">任务描述: {{item.taskRemark}}</span>
                </p>
              </div>
              <div class="handle-message-line-wrapper">
                <P>
                  <span class="message-tit">起点: {{item.setOutPlaceName}}</span>
                </P>
                <p>
                  <span class="message-tit">床号: {{item.bedNumber}}</span>
                </p>
              </div>
              <div class="handle-message-line-wrapper">
                <p class="p-other">
                  <span class="message-tit">优先级:</span>
                  <span class="message-tit-real" :class="{'natureNormalStyle' : item.priority == 1, 'natureImportantStyle': item.priority != 1}">{{priorityTransfer(item.priority)}}</span>
                </p>
                <P class="p-other">
                  <span class="message-tit">转运工具: {{item.toolName ? item.toolName : '无'}}</span>
                </P>
              </div>
              <div class="handle-message-line-wrapper">
                <p class="p-other">
                  <span class="message-tit">状态:</span>
                  <span class="message-tit-real" style="color:red">{{ stateTransfer(item.state) }}</span>
                </p>
              </div>
            </div>
            <p class="wait-handle-check" v-show="item.state == 2 || item.state == 3">
              <van-checkbox v-model="item.taskCheck"  @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
            </p>
            <p class="get-wait-task">
              <span v-show="item.state == '1'">
                <img :src="taskGetPng" alt="" @click.stop="getTask(item.id)">
              </span>
              <span v-show="!(item.state == '1')" @click.stop="intoTask(item)">
                进入任务
              </span>
              <span v-show="item.state == '1' || item.state == '2' " @click="cancelTaskEvent">取消</span>
            </p>
          </div>
        </div>
      </div>
     </van-pull-refresh>
    <div class="task-query wait-handle task-complete" v-show="taskQueryShow">
      <div class="content-middle-top">
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
      <div class="task-status-list">
        <div class="wait-handle-list" v-for="(item,index) in stateCompleteList" :key="`${item}-${index}`">
         <div class="wait-handle-message">
              <div class="handle-message-line-wrapper">
                <p>
                  <span class="message-tit">开始时间: {{item.createTime}}</span>
                </p>
                <p>
                  <span class="message-tit">任务描述: {{item.taskRemark}}</span>
                </p>
              </div>
              <div class="handle-message-line-wrapper">
                <P>
                  <span class="message-tit">起点: {{item.setOutPlaceName}}</span>
                </P>
                <p>
                  <span class="message-tit">床号: {{item.bedNumber}}</span>
                </p>
              </div>
              <div class="handle-message-line-wrapper">
                <p class="p-other">
                  <span class="message-tit">优先级:</span>
                  <span class="message-tit-real" :class="{'natureNormalStyle' : item.priority == 1, 'natureImportantStyle': item.priority != 1}">{{priorityTransfer(item.priority)}}</span>
                </p>
                <P class="p-other">
                  <span class="message-tit">转运工具: {{item.toolName ? item.toolName : '无'}}</span>
                </P>
              </div>
              <div class="handle-message-line-wrapper">
                <p class="p-other">
                  <span class="message-tit">状态:</span>
                  <span class="message-tit-real" style="color:red">{{ stateTransfer(item.state) }}</span>
                </p>
              </div>
            </div>
          <p class="wait-handle-check" v-show="item.state == 2 || item.state == 3">
            <van-checkbox v-model="item.taskCheck"  @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
          </p>
          <p class="get-wait-task">
            <span v-show="item.state == '1'">
              <img :src="taskGetPng" alt="" @click.stop="getTask(item.id)">
            </span>
            <span v-show="!(item.state == '1')" @click.stop="intoTask(item)">
              进入任务
            </span>
            <span v-show="item.state == '1' || item.state == '2' " @click="cancelTaskEvent">取消</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 退回原因弹窗 -->
    <van-dialog v-model="reasonShow" title="请选择退回原因" show-cancel-button width="92%"
      @confirm="reasonSure" @cancel="reasonCancel"
    >
      <div class="tool-name-list">
        <div class="tool-name-list-title-innner">退回原因:</div>
        <div class="tool-name-list-content">
          <span :class="{spanStyle:reasonIndex === index}" v-for="(item,index) in reasonOperationList" :key="`${item}-${index}`" @click="reasonCheck(item,index)">
            {{item.text}}
          </span>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
  import HeaderTop from '@/components/HeaderTop'
  import FooterBottom from '@/components/FooterBottom'
  import {queryAppointTaskMessage, updateAppointTaskMessage, cancelAppointTask, getAppointTaskComplete, userSignOut, queryDispatchTaskCancelReason} from '@/api/workerPort.js'
  import NoData from '@/components/NoData'
  import store from '@/store'
  import Loading from '@/components/Loading'
  import { mapGetters, mapMutations } from 'vuex'
  import { formatTime, setStore, getStore, removeStore, IsPC, removeBlock, removeAllLocalStorage } from '@/common/js/utils'
  import {getDictionaryData} from '@/api/login.js'
  export default {
    name: 'appointTask',
    data () {
      return {
        showLoadingHint: false,
        noDataShow: false,
        reasonShow: false,
        reasonOperationList: [],
        reasonIndex: '',
        reasonText: '',
        reasonName: '',
        reasonValue: '',
        stateIndex: 0,
        taskQueryShow: false,
        leftDropdownDataList: ['退出登录'],
        stateListShow: false,
        stateScreenVal: '全部',
        leftDownShow: false,
        stateList:['全部','未获取','已获取', '进行中', '未结束'],
        startTime: '',
        endTime: '',
        startTimePop: false,
        endTimePop: false,
        currentDateStart: new Date(),
        currentDateEnd: new Date(),
        minDateStart: new Date(2020, 0, 1),
        minDateEnd: new Date(2020, 0, 1),
        liIndex: null,
        transferWorkerShow: false,
        taskOneList: ['待办任务', '历史任务'],
        taskLlineOneIndex: '0',
        cancelTask: false,
        transferTask: false,
        waitHandleCheck: true,
        cancelTaskBtnShow: false,
        transferTaskBtnShow: false,
        isRefresh: false,
        waitHandleBox: true,
        taskId: '',
        stateFilterList: [],
        stateCompleteList: [],
        waitBaskList: [],
        screenTaskList: [],
        transferTaskIdList: [],
        drawCompleteTaskIdList: [],
        taskGetPng: require('@/components/images/task-get.png'),
        taskSearchPng: require('@/components/images/task-search.png')
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
        'userInfo',
        'completeSweepcodeDestinationInfo',
        'globalTimer',
        'catch_components',
        'isFreshAppointTaskPage'
      ]),
      proId () {
        return JSON.parse(getStore('userInfo')).extendData.proId
      },
      workerId () {
        return JSON.parse(getStore('userInfo')).extendData.userId
      }
    },

    watch : {
      waitBaskList: {
        handler(newName, oldName) {
          if (newName.some(function (item, index) {return item.taskCheck == true})) {
            this.cancelTaskBtnShow = true;
            this.transferTaskBtnShow = true;
          } else {
            this.cancelTaskBtnShow = false;
            this.transferTaskBtnShow = false;
          }
        },
        deep: true,
        immediate: true
      },

      stateFilterList: {
        handler(newName, oldName) {
          if (newName.some(function (item, index) {return item.taskCheck == true})) {
            this.cancelTaskBtnShow = true;
            this.transferTaskBtnShow = true;
          } else {
            this.cancelTaskBtnShow = false;
            this.transferTaskBtnShow = false;
          }
        },
        deep: true,
        immediate: true
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
      document.addEventListener('click',(e) => {
        if(e.target.className!='status-name'){
          this.stateListShow = false;
        };
        if(e.target.className!='van-icon van-icon-manager-o' && e.target.className!='left-dropDown'){
          this.leftDownShow = false;
        }
      });
      // 查询预约任务(分配给自己的)
      this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, state: -1, isMobile: 1,startDate: '',endDate: ''}, this.stateIndex);
      this.drawTaskId()
    },

    activated () {
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
      document.addEventListener('click',(e) => {
        if(e.target.className!='status-name'){
          this.stateListShow = false;
        };
        if(e.target.className!='van-icon van-icon-manager-o' && e.target.className!='left-dropDown'){
          this.leftDownShow = false;
        }
      });
      // 查询预约任务(分配给自己的)
      if (this.isFreshAppointTaskPage) {
        this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, isMobile: 1, state: -1,startDate: '',endDate: ''}, this.stateIndex);
        this.drawTaskId()
      }
    },

     beforeRouteEnter (to, from, next) {
      let catch_components = store.state.catchComponent.catch_components;
      let i = catch_components.indexOf('appointTask');
      i === -1 && catch_components.push('appointTask');
      next();
    },

    beforeRouteLeave(to, from, next) {
      let catch_components = this.catch_components;
      if (to.name !== 'appointDetails'){
        let i = catch_components.indexOf('appointTask');
        i > -1 && this.changeCatchComponent([]);
      }
      next()
    },

    methods: {
      ...mapMutations([
        'changeTitleTxt',
        'changeAppointTaskMessage',
        'changeAppointTaskTransferIdList',
        'changeTaskDetailsMessage',
        'changeTaskType',
        'changeOverDueWay',
        'changeCatchComponent'
      ]),

      // 右边下拉框菜单点击
      leftLiCLick (index) {
        this.liIndex = index;
        this.userLoginOut(this.proId, this.userInfo.userName)
      },

       // 任务退回
      cancelTaskEvent (item) {
        this.taskId = item.id;
        this.reasonShow = true;
        queryDispatchTaskCancelReason({proId:this.proId,state: 0})
        .then((res) => {
          this.reasonOperationList = [];
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              for (let item of res.data.data) {
                this.reasonOperationList.push({
                  text: item.cancelName,
                  value: item.id
                })
              }
            } else {
              this.$toast('没有查到退回原因');
            }
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        });
        this.reasonIndex = ''
      },

      // 退回原因确定
      reasonSure () {
        if (this.reasonIndex === '') {
          this.$toast('请选择退回原因');
          return
        };
        cancelAppointTask({proId:this.proId, taskId:this.taskId,workerId: this.workerId,reason:this.reasonText})
        .then((res) => {
          if (res && res.data.code == 200) {
            this.$toast(`${res.data.msg}`);
            this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, isMobile: 1, state: -1, startDate: '',endDate: ''}, this.stateIndex)
          } else {
            this.$toast(`${res.data.msg}`)
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

      // 退回原因取消
      reasonCancel() {
        this.reasonIndex = '';
        this.reasonName = '';
        this.reasonShow = false
      },
      // 原因选中事件
      reasonCheck (item,index) {
        this.reasonIndex = index;
        this.reasonText = item.text;
        this.reasonName = item.text
        this.reasonValue = item.value
      },


      // 进入任务
      intoTask (item) {
        this.$router.push({'path':'/appointDetails'});
        this.changeTitleTxt({tit:'预约任务详情'});
        setStore('currentTitle','预约任务详情');
        // 改变调度具体某一预约任务的信息状态
        this.changeAppointTaskMessage({DtMsg: item});
        setStore('currentAppointTaskMessage',item);
      },

      // 用户签退
      userLoginOut (proId,workerId) {
        this.changeOverDueWay(true);
        setStore('storeOverDueWay',true);
        userSignOut(proId,workerId).then((res) => {
          if (res && res.data.code == 200) {
            if(this.globalTimer) {window.clearInterval(this.globalTimer)};
            // 退出信标服务器连接
            // try {
            //   window.android.logOut()
            // } catch (err) {
            //   this.$dialog.alert({
            //     message: `${err}`,
            //     closeOnPopstate: true
            //   }).then(() => {
            //   })
            // };
            removeAllLocalStorage();
            this.changeCatchComponent([]);
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

      // 跳转到我的页
      skipMyInfo () {
        this.leftDownShow = !this.leftDownShow;
      },

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
        this.queryCompleteDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, state: -2,startDate: this.startTime,endDate: this.endTime})
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

      // 查询预约任务(状态筛选点击专用)
      queryStateFilterDispatchTask (data, index) {
        this.noDataShow = false;
        this.showLoadingHint = true;
        queryAppointTaskMessage (data)
        .then((res) => {
          this.showLoadingHint = false;
          let temporaryTaskListFirst = [];
          this.stateFilterList = [];
          if (res && res.data.code == 200) {
            this.isRefresh = false;
            if (res.data.data.length > 0) {
              this.noDataShow = false;
              for (let item of res.data.data) {
                temporaryTaskListFirst.push({
                  taskCheck: false,
                  createTime: item.createTime,
                  state: item.state,
                  setOutPlaceId: item.setOutPlaceId,
                  setOutPlaceName: item.setOutPlaceName,
                  destinationName: item.destinationName,
                  destinationId: item.destinationId,
                  taskTypeName: item.taskName,
                  toolName: item.toolName,
                  id: item.id,
                  taskNumber: item.taskNumber,
                  patientName: item.patientName,
                  bedNumber: item.badNumber,
                  sex: item.sex,
                  age: item.age,
                  patientId: item.id,
                  number: item.number,
                  priority: item.priority,
                  taskRemark: item.taskRemark
                })
              };
              if (index == 0) {
                this.stateFilterList = temporaryTaskListFirst;
                if (this.stateFilterList.length == 0) {
                  this.noDataShow = true;
                  return
                }
              } else if (index == 1) {
                this.stateFilterList = temporaryTaskListFirst.filter((item) => { return item.state == 1});
                if (this.stateFilterList.length == 0) {
                  this.noDataShow = true;
                  return
                }
              } else if (index == 2) {
                this.stateFilterList = temporaryTaskListFirst.filter((item) => { return item.state == 2});
                if (this.stateFilterList.length == 0) {
                  this.noDataShow = true;
                  return
                }
              } else if (index == 3) {
                this.stateFilterList = temporaryTaskListFirst.filter((item) => { return item.state == 3});
                if (this.stateFilterList.length == 0) {
                  this.noDataShow = true;
                  return
                }
              } else if (index == 4) {
                this.stateFilterList = temporaryTaskListFirst.filter((item) => { return item.state == 4});
                if (this.stateFilterList.length == 0) {
                  this.noDataShow = true;
                  return
                }
              }
            } else {
              this.noDataShow = true;
            }
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
              this.noDataShow = true;
            });
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

      // 下拉刷新
      onRefresh () {
        this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, isMobile: 1, state: -1,startDate: '',endDate: ''}, this.stateIndex)
      },

      // 提取存储已完成采集任务科室所属任务id
      drawTaskId () {
        this.drawCompleteTaskIdList = [];
        if (this.completeSweepcodeDestinationInfo.length > 0) {
          for (let item of this.completeSweepcodeDestinationInfo) {
            for (let innerItem in item) {
              if (innerItem == 'taskId') {
                this.drawCompleteTaskIdList.push(item[innerItem])
              }
            }
          }
        }
      },

      // 查询预约任务(已完成)
      queryCompleteDispatchTask (data) {
        this.noDataShow = false;
        this.showLoadingHint = true;
        queryAppointTaskMessage(data).then((res) => {
          this.stateCompleteList = [];
          this.showLoadingHint = false;
          this.noDataShow = true
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              this.noDataShow = false;
              for (let item of res.data.data) {
                this.stateCompleteList.push({
                  taskCheck: false,
                  createTime: item.createTime,
                  spaces: item.destinationName,
                  state: item.state,
                  finishTime: item.finishTime,
                  setOutPlaceName: item.setOutPlaceName,
                  destinationName: item.destinationName,
                  taskTypeName: item.taskName,
                  toolName: item.toolName,
                  taskNumber: item.taskNumber,
                  id: item.id,
                  patientName: item.patientName,
                  bedNumber: item.badNumber,
                  sex: item.sex,
                  age: item.age,
                  patientId: item.id,
                  number: item.number,
                  priority: item.priority,
                  taskRemark: item.taskRemark
                })
              }
            } else {
              this.noDataShow = true;
            }
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
              this.noDataShow = true;
            });
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


      // 阻止change事件冒泡
      emptyHandle () {},

      // 返回上一页
      backTo () {
        this.$router.push({path: 'home'});
        this.changeTitleTxt({tit:'中央运送'});
        setStore('currentTitle','中央运送')
      },

      // 调度任务第一行按钮点击
      taskLineOneEvent (item,index) {
        this.taskLlineOneIndex = index;
        this.transferTask = false;
        this.cancelTask = false;
        this.noDataShow = false;
        this.initDate();
        if (index == '0') {
          this.stateIndex = 0;
          this.taskQueryShow = false;
          this.waitHandleBox = true;
          this.stateScreenVal = '全部';
          this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, isMobile: 1, state: -1,startDate: '',endDate: ''}, this.stateIndex);
        } else if (index == '1') {
          this.stateIndex = null;
          this.taskQueryShow = true;
          this.waitHandleBox = false;
          this.cancelTaskBtnShow = false;
          this.transferTaskBtnShow = false;
          this.queryCompleteDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, state: -2,startDate: this.startTime,endDate: this.endTime})
        }
      },

       // 状态筛选列表点击
      stateListEvent (index,item) {
        this.stateIndex = index;
        this.stateScreenVal = item;
        this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, isMobile: 1,state: -1,startDate: '',endDate: ''}, this.stateIndex)
      },

      // 状态筛选按钮点击
      statusScreenEvent () {
        this.statusScreen = true;
        this.taskQueryShow = false;
        this.stateListShow = !this.stateListShow;
        if (this.stateScreenVal == '状态筛选') {
          this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, isMobile: 1,state: -1,startDate: '',endDate: ''}, 0);
          this.stateIndex = 0;
        }
      },

      // 转移任务按钮点击
      transferTaskEvent () {
        this.transferTaskIdList = [];
        let temporaryTransferTaskCheckList = [];
        temporaryTransferTaskCheckList = this.stateFilterList.filter((item) => {return item.taskCheck == true});
        if (temporaryTransferTaskCheckList.length == 1) {
          for (let item of temporaryTransferTaskCheckList)  {
            for (let key in item) {
              if (key == 'id')
              this.transferTaskIdList.push(item['id'])
            }
          };
          this.transferTask = true;
          this.cancelTask = false;
          this.transferWorkerShow = true;
          this.changeAppointTaskTransferIdList({DtMsg: this.transferTaskIdList});
          this.$router.push({path:'/appointTaskForm'});
          this.changeTitleTxt({tit:'转移人员选择'});
          setStore('currentTitle','转移人员选择')
        } else {
          this.$toast('只能同时转移一个任务')
        }
      },

      // 复选框选择事件
      waitTaskChecked (waitHandleCheck) {
      },

      // 获取待处理任务事件
      getTask (taskId) {
        updateAppointTaskMessage({
          proId: this.proId,//当前项目ID
          taskId: taskId, //当前任务ID
          workerId: this.workerId// 运送员ID即当前登录人
        })
        .then(res => {
          if (res && res.data.code == 200) {
            this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, isMobile: 1, state: -1,startDate: '',endDate: ''},0)
          }
        })
        .catch(err => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      }
    }
}

</script>
<style lang='less' scoped>
  @import "~@/common/stylus/variable.less";
  @import "~@/common/stylus/mixin.less";
  @import "~@/common/stylus/modifyUi.less";
   .content-wrapper {
    /deep/ .van-dialog {
      .van-dialog__content {
        margin-bottom: 6px;
        height: 200px;
        margin: 10px 0;
        .tool-name-list {
          width: 94%;
          height: 100%;
          overflow: auto;
          margin: 0 auto;
          padding: 0;
          border: 1px solid #b2b2b2;
          .tool-name-list-title-innner {
            padding: 10px;
          }
          .tool-name-list-content {
            padding: 6px;
            .spanStyle {
              color: #fff;
              background: #2895ea
            }
            span {
              display: inline-block;
              width: 48%;
              height: 40px;
              text-align: center;
              margin-bottom: 8px;
              line-height: 40px;
              background: #f3f3f3;
              margin-right: 4%;
              &:nth-child(even) {
                margin-right: 0
              }
            }
          }
        }
      }
    };
    .content-wrapper();
    font-size: 14px;
    position: relative;
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
    .left-dropDown {
      .rightDropDown
    }
    .dispatch-task-title {
      .task-line-one-wrapper {
          height: 36px;
          font-size: 17px;
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
          color: black;
          position: absolute;
          top: 0;
          left: 10px;
          .taskLineTwoStyle {
            color: #2895ea
          }
          span {
            font-size: 18px;
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
          right: 0;
          font-size: 18px;
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
      .task-operate-box {
        height: 40px;
        line-height: 30px;
        padding-left: 10px;
        span {
          font-size: 13px;
          display: inline-block;
          margin-top: 5px;
          width: 70px;
          height: 30px;
          color: #fff;
          background: #2895ea;
          text-align: center;
          border-radius: 2px
        }
      }
    };
    .wait-handle-box {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
      margin-top: 6px;
      .wait-handle-one {
        .wait-handle-list {
          margin: 0 auto;
          box-sizing: border-box;
          position: relative;
          margin-bottom: 10px;
          box-sizing: border-box;
          border: 1px solid #cecece;
          width: 96%;
          .wait-handle-message {
            font-size: 18px;
            padding: 8px;
            box-sizing: border-box;
            .handle-message-line-wrapper {
              p {
                margin-bottom: 12px;
                span {
                  display: block
                };
                .message-tit {
                  color: black
                };
                .message-tit-real {
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
                  color: #2895ea
                }
                .message-tit-real-bdeNumber {
                  line-height: 24px
                }
                .message-tit-destination-real {
                  padding: 4px;
                  margin-right:2px;
                  line-height: 24px
                }
                .destinationRealStyle {
                  background: #2895ea;
                  color: #fff
                }
              };
              .p-other {
                width: 49%;
                display: inline-block;
                span {
                  display: inline-block
                }
              }
            }
          };
          .wait-handle-check {
            position: absolute;
            top: 6px;
            right: 6px
          };
          .get-wait-task {
            width: 100%;
            text-align: center;
            padding: 6px;
            box-sizing: border-box;
            span {
              display: inline-block;
              width: 90px;
              height: 40px;
              line-height: 40px;
              vertical-align: top;
              img {
                width: 100%;
                height: 100%
              }
              &:nth-child(1) {
                color: #fff;
                font-size: 13px;
                background: #2895ea;
                text-align: center;
                border-radius: 4px
              }
              &:nth-child(2) {
                color: #fff;
                font-size: 13px;
                background: #2895ea;
                text-align: center;
                border-radius: 4px
              }
              &:nth-child(3) {
                color: #fff;
                font-size: 13px;
                background: #b4b4b4;
                text-align: center;
                border-radius: 4px
              }
            }
          }
        }
      };
    };
    .wait-handle, .task-query, .status-handle-screen {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
    };
     .task-complete {
      display: flex;
      flex-direction: column;
      .middle-top-search {
        width: auto;
        margin: 0 auto;
        line-height: 30px;
        height: 40px;
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
      .content-middle-top {
        background: #fff;
        margin-top: 3%;
        height: 52px;
        position: relative;
        box-shadow: 0px 1px 3px 1px #e4e4e4,  /*下边阴影*/
        0px -1px 3px 0px #e4e4e4;   /*上边阴影*/
        /deep/ .van-cell {
          width: 100%;
          display: inline-block;
          padding: 10px 24px;
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
          width: 98%;
          margin: 0 auto;
          > div {
            width: 44%;
            position: absolute;
            top: 14%;
          }
        }
      };
      .task-status-list {
        flex: 1;
        overflow: auto
      }
    }
    .wait-handle {
      .wait-handle-list {
        margin: 0 auto;
        box-sizing: border-box;
        position: relative;
        margin-bottom: 10px;
        box-sizing: border-box;
        border: 1px solid #cecece;
        width: 96%;
        .wait-handle-message {
          font-size: 18px;
          padding: 8px;
          box-sizing: border-box;
          .handle-message-line-wrapper {
            p {
              margin-bottom: 12px;
              span {
                display: block
              };
              .message-tit {
                color: black
              };
              .message-tit-real {
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
                color: #2895ea
              }
              .message-tit-real-bdeNumber {
                line-height: 24px
              }
              .message-tit-destination-real {
                padding: 4px;
                margin-right:2px;
                line-height: 24px
              };
              .destinationRealStyle {
                background: #2895ea;
                color: #fff
              };
            };
            .p-other {
              width: 49%;
              display: inline-block;
              span {
                display: inline-block
              }
            }
          }
        };
        .wait-handle-check {
          position: absolute;
          top: 6px;
          left: 6px
        };
        .get-wait-task {
          width: 100%;
          text-align: center;
          padding: 6px;
          box-sizing: border-box;
          span {
            display: inline-block;
            width: 90px;
            height: 40px;
            line-height: 40px;
            vertical-align: top;
            img {
              width: 100%;
              height: 100%
            };
            &:nth-child(1) {
              color: #fff;
              font-size: 13px;
              background: #2895ea;
              text-align: center;
              border-radius: 4px
            }
            &:nth-child(2) {
              color: #fff;
              font-size: 13px;
              background: #2895ea;
              text-align: center;
              border-radius: 4px
            }
            &:nth-child(3) {
              color: #fff;
              font-size: 13px;
              background: #b4b4b4;
              text-align: center;
              border-radius: 4px
            }
          }
        }
      }
    };
    .status-handle-screen {
      .wait-handle-list {
        margin: 0 auto;
        box-sizing: border-box;
        position: relative;
        margin-bottom: 10px;
        box-sizing: border-box;
        border: 1px solid #cecece;
        width: 96%;
        .wait-handle-message {
          font-size: 18px;
          padding: 8px;
          box-sizing: border-box;
          .handle-message-line-wrapper {
            p {
              margin-bottom: 12px;
              span {
                display: block
              };
              .message-tit {
                color: black
              };
              .message-tit-real {
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
                color: #2895ea
              }
              .message-tit-real-bdeNumber {
                line-height: 24px
              }
              .message-tit-destination-real {
                padding: 4px;
                margin-right:2px;
                line-height: 24px;
              };
              .destinationRealStyle {
                background: #2895ea;
                color: #fff
              }
            };
            .p-other {
              width: 49%;
              display: inline-block;
              span {
                display: inline-block
              }
            }
          }
        };
        .wait-handle-check {
          position: absolute;
          top: 6px;
          left: 6px
        };
        .get-wait-task {
          width: 100%;
          text-align: center;
          padding: 6px;
          box-sizing: border-box;
          span {
            display: inline-block;
            width: 90px;
            height: 40px;
            line-height: 40px;
            vertical-align: top;
            img {
              width: 100%;
              height: 100%
            };
           &:nth-child(1) {
            color: #fff;
            font-size: 13px;
            background: #2895ea;
            text-align: center;
            border-radius: 4px
            }
            &:nth-child(2) {
              color: #fff;
              font-size: 13px;
              background: #2895ea;
              text-align: center;
              border-radius: 4px
            }
            &:nth-child(3) {
              color: #fff;
              font-size: 13px;
              background: #b4b4b4;
              text-align: center;
              border-radius: 4px
            }
          }
        }
      }
    }
    .status-handle-screen {
      /deep/ .van-tabs {
        .right-sign {
          .status-sign
        }
      }
    }
  }
</style>

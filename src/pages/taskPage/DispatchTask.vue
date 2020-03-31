<template>
  <div class="content-wrapper">
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
      <p class="task-line-two">
        <span v-show="stateScreen" :class="{'taskLineTwoStyle':statusScreen == true}" @click="statusScreenEvent">状态筛选</span>
        <span v-show="cancelTaskBtnShow" :class="{'taskLineTwoStyle':cancelTask == true}" @click="cancelTaskEvent">取消任务</span>
        <span v-show="transferTaskBtnShow" :class="{'taskLineTwoStyle':transferTask == true}" @click="transferTaskEvent">转移任务</span>
      </p>
    </div>
    <div class="wait-handle" v-show="waitHandleShow">
      <div class="wait-handle-list" v-for="(item,index) in waitBaskList" :key="`${item}-${index}`" @click="taskClickEvent(item)">
        <p class="wait-handle-message-createTime">
          创建时间：{{item.createTime}}
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
        </div>
        <p class="wait-handle-check" v-show="item.state == 2">
          <van-checkbox  v-model="item.taskCheck" @click.stop="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
        </p>
        <p class="get-wait-task">
          <van-button type="info" v-show="item.state == '1'" @click.stop="getTask(item.id)">获取</van-button>
        </p>
      </div>
    </div>
    <div class="task-query" v-show="taskQueryShow">任务查询</div>
    <div class="status-handle-screen" v-show="statusHandleScreenShow">
      <van-tabs v-model="activeName" @click="onClickTab" color="#2895ea">
        <van-tab name="0">
          <div slot="title">
            <span class="title">全部</span>
            <span class="right-sign" v-show="currentIndex == 0">{{waitBaskList.length}}</span>
          </div>
          <div class="task-status-list">
            <div class="wait-handle-list" v-for="(item,index) in waitBaskList" @click="taskClickEvent(item)" :key="`${item}-${index}` ">
              <p class="wait-handle-message-createTime">
                创建时间：{{item.createTime}}
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
                <p class="wait-handle-check" v-show="item.state == 2 ">
                  <van-checkbox v-model="item.taskCheck" @click.stop="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
                </p>
                <p class="get-wait-task">
                  <van-button type="info" v-show="item.state == '1'" @click.stop="getTask(item.id)">获取</van-button>
                </p>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab name="2">
          <div slot="title">
            <span class="title">已获取</span>
            <span class="right-sign" v-show="currentIndex == 2">{{waitBaskList.length}}</span>
          </div>
          <div class="task-status-list">
            <div class="wait-handle-list" v-for="(item,index) in waitBaskList" @click="taskClickEvent(item)" :key="`${item}-${index}`">
              <p class="wait-handle-message-createTime">
                创建时间：{{item.createTime}}
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
                <p class="wait-handle-check" v-show="item.state == 2">
                  <van-checkbox v-model="item.taskCheck" @click.stop="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
                </p>
                <p class="get-wait-task">
                  <van-button type="info" v-show="item.state == '1'" @click.stop="getTask(item.id)">获取</van-button>
                </p>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab name="3">
          <div slot="title">
            <span class="title">进行中</span>
            <span class="right-sign" v-show="currentIndex == 3">{{waitBaskList.length}}</span>
          </div>
          <div class="task-status-list">
            <div class="wait-handle-list" v-for="(item,index) in waitBaskList" @click="taskClickEvent(item)" :key="`${item}-${index}`">
              <p class="wait-handle-message-createTime">
                创建时间：{{item.createTime}}
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
                <p class="wait-handle-check" v-show="item.state == 2 ">
                  <van-checkbox v-model="item.taskCheck" @click.stop="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
                </p>
                <p class="get-wait-task">
                  <van-button type="info" v-show="item.state == '1'" @click.stop="getTask(item.id)">获取</van-button>
                </p>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab name="7">
          <div slot="title">
            <span class="title">已完成</span>
            <span class="right-sign" v-show="currentIndex == 7">{{waitBaskList.length}}</span>
          </div>
          <div class="task-status-list">
            <div class="wait-handle-list" v-for="(item,index) in waitBaskList" @click="taskClickEvent(item)" :key="`${item}-${index}`">
              <p class="wait-handle-message-createTime">
                创建时间：{{item.createTime}}
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
                <p class="wait-handle-check" v-show="item.state == 2 ">
                  <van-checkbox v-model="item.taskCheck" @click.stop="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
                </p>
                <p class="get-wait-task">
                  <van-button type="info" v-show="item.state == '1'" @click.stop="getTask(item.id)">获取</van-button>
                </p>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <van-dialog
      v-model="taskCancelReasonShow"
      title="任务取消原因"
      show-cancel-button
      confirmButtonText="确定"
      cancelButtonText="取消"
      :close-on-popstate="true"
      :close-on-click-overlay="true"
      @confirm="taskCancelSure"
      @cancel="taskCancel"
      >
      <van-cell-group>
        <van-field
          v-model="taskCancelReason"
          label=取消原因
          type="textarea"
          placeholder="请输入取消原因"
          rows="3"
          autosize
        />
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
  import HeaderTop from '@/components/HeaderTop'
  import FooterBottom from '@/components/FooterBottom'
  import {getDispatchTaskMessage, updateDispatchTask, queryTaskCancelReason, queryTaskDelayReason, cancelDispatchTaskBatch} from '@/api/workerPort.js'
  import NoData from '@/components/NoData'
  import { mapGetters, mapMutations } from 'vuex'
  import { formatTime, setStore, getStore, removeStore, IsPC } from '@/common/js/utils'
  import {getDictionaryData} from '@/api/login.js'
  export default {
    data () {
      return {
        transferWorkerShow: false,
        leftDropdownDataList: ['退出登录'],
        leftDownShow: false,
        liIndex: null,
        taskOneList: ['待处理', '任务查询'],
        taskLlineOneIndex: '0',
        checkPerson: 0,
        cancelTaskIdList : [],
        transferTaskIdList : [],
        statusScreen: false,
        cancelTask: false,
        stateScreen: true,
        transferTask: false,
        waitHandleShow: true,
        taskQueryShow: false,
        statusHandleScreenShow: false,
        waitHandleCheck: true,
        cancelTaskBtnShow: false,
        transferTaskBtnShow: false,
        taskCancelReason: '',
        taskCancelReasonShow: false,
        screenTaskList: [],
        waitBaskList: [],
        activeName: 0,
        currentIndex: ''
      };
    },

    components: {
      HeaderTop,
      NoData,
      FooterBottom
    },

    computed: {
      ...mapGetters([
        'navTopTitle',
        'isRefershDispatchTaskPage'
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
      }
    },

    activated () {
      // 控制设备物理返回按键测试
      if (!IsPC()) {
        pushHistory();
        this.gotoURL(() => {
          this.$router.push({path: 'home'});
          this.changeTitleTxt({tit:'中央运送'});
          setStore('currentTitle','中央运送') 
        })
      };
      // 查询调度任务(分配给自己的)
      if (this.isRefershDispatchTaskPage) {
        this.activeName = 0;
        this.currentIndex = 0;
        this.queryDispatchTask(this.proId, this.workerId)
      }
    },

    mounted () {
      // 控制设备物理返回按键测试
      if (!IsPC()) {
        pushHistory();
        this.gotoURL(() => {
          this.$router.push({path: 'home'});
          this.changeTitleTxt({tit:'中央运送'});
          setStore('currentTitle','中央运送') 
        })
      };
      // 查询调度任务(分配给自己的)
      this.queryDispatchTask(this.proId, this.workerId)
    },

    methods: {
      ...mapMutations([
        'changeTitleTxt',
        'changeDispatchTaskMessage',
        'changedispatchTaskTransferIdList',
        'changeDispatchTaskDepartmentType',
        'changeDispatchTaskState',
        'changeIsCoerceTakePhoto'
      ]),

      // 查询调度任务(分配给自己的)
      queryDispatchTask (proID, workerId) {
        getDispatchTaskMessage (proID, workerId)
        .then(res => {
          let temporaryTaskList = [];
          this.waitBaskList = [];
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              for (let item of res.data.data) {
                temporaryTaskList.push({
                  taskCheck: false,
                  createTime: item.createTime,
                  state: item.state,
                  setOutPlaceName: item.setOutPlaceName,
                  destinationName: item.destinationName,
                  taskTypeName: item.taskTypeName,
                  toolName: item.toolName,
                  priority: item.priority,
                  id: item.id,
                  startPhoto: item.startPhoto,
                  endPhoto: item.endPhoto
                })
              };
              this.waitBaskList = temporaryTaskList.filter((item) => {return item.state == 1});
              if ( this.waitBaskList.length == 0) {
                this.$dialog.alert({
                  message: '当前没有待处理的任务',
                  closeOnPopstate: true
                }).then(() => {
                });
              }
            } else {
              this.$dialog.alert({
                message: '当前没有任何状态的任务',
                closeOnPopstate: true
              }).then(() => {
              });
            }
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

      // 调度任务的取消
      cancelDispatchTask (data) {
        if (this.cancelTaskIdList.lenth == 1) {
          updateDispatchTask(data)
          .then((res) => {
            if (res && res.data.code == 200) {
              this.$dialog.alert({
                message: res.data.msg,
                closeOnPopstate: true
              }).then(() => {
              });
              this.queryDispatchTask(this.proId, this.workerId)
            }
          })
          .catch((err) => {
            this.$dialog.alert({
              message: `${err.message}`,
              closeOnPopstate: true
            }).then(() => {
            });
          })
        } else {
          cancelDispatchTaskBatch(data)
          .then((res) => {
            if (res && res.data.code == 200) {
              this.$dialog.alert({
                message: res.data.msg,
                closeOnPopstate: true
              }).then(() => {
              });
              this.queryDispatchTask(this.proId, this.workerId)
            }
          })
          .catch((err) => {
            this.$dialog.alert({
              message: `${err.message}`,
              closeOnPopstate: true
            }).then(() => {
            });
          })
        }
      },

      // 任务取消原因查询
      getTaskCancelReason (data) {
        queryTaskCancelReason(data)
        .then((res) => {

        })
        .catch((err) => {

        })
      },

      // 任务延迟原因查询
      getTaskDelayReason (data) {
        queryTaskDelayReason(data)
        .then((res) => {

        })
        .catch((err) => {

        })
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
        this.statusScreen = false;
        this.transferTask = false;
        this.cancelTask = false;
        if (index == '0') {
          this.stateScreen = true;
          this.waitHandleShow = true;
          this.taskQueryShow = false;
          this.statusHandleScreenShow = false;
          this.queryDispatchTask(this.proId, this.workerId);
        } else if (index == '1') {
          this.stateScreen = false;
          this.taskQueryShow = true;
          this.waitHandleShow = false;
          this.statusHandleScreenShow = false;
          this.cancelTaskBtnShow = false;
          this.transferTaskBtnShow = false
        }
      },

      // 状态筛选按钮点击
      statusScreenEvent () {
        this.statusScreen = true;
        this.transferTask = false;
        this.cancelTask = false;
        this.taskQueryShow = false;
        this.waitHandleShow = false;
        this.statusHandleScreenShow = true;
        this.activeName = 0;
        this.currentIndex = 0;
        getDispatchTaskMessage (this.proId, this.workerId)
        .then((res) => {
          let temporaryTaskListFirst = [];
          this.screenTaskList = [];
          this.waitBaskList = [];
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              for (let item of res.data.data) {
                temporaryTaskListFirst.push({
                  createTime: item.createTime,
                  state: item.state,
                  setOutPlaceName: item.setOutPlaceName,
                  destinationName: item.destinationName,
                  taskTypeName: item.taskTypeName,
                  toolName: item.toolName,
                  priority: item.priority,
                  id: item.id,
                  startPhoto: item.startPhoto,
                  endPhoto: item.endPhoto
                })
              };
              this.screenTaskList = temporaryTaskListFirst;
              this.waitBaskList = this.screenTaskList;
              if (this.screenTaskList.length == 0) {
                this.$dialog.alert({
                  message: '当前没有未分配的任务',
                  closeOnPopstate: true
                }).then(() => {
                });
              }
            } else {
              this.$dialog.alert({
                message: '当前没有任何状态的任务',
                closeOnPopstate: true
              }).then(() => {
              });
            }
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

      // 取消任务按钮点击
      cancelTaskEvent () {
        this.cancelTask = true;
        this.transferTask = false;
        this.statusScreen = false;
        this.cancelTaskIdList = [];
        this.taskCancelReasonShow = true;
      },

      //任务取消原因确定
      taskCancelSure () {
        this.taskCancelReasonShow = false;
        let temporaryCancelTaskCheckList = [];
        temporaryCancelTaskCheckList = this.waitBaskList.filter((item) => {return item.taskCheck == true});
        for (let item of temporaryCancelTaskCheckList)  {
          for (let key in item) {
            if (key == 'id')
            this.cancelTaskIdList.push(item['id'])
          }
        };
        if (this.cancelTaskIdList.lenth == 1) {
          this.cancelDispatchTask({
            proId: this.proId,	//当前项目ID
            id: this.cancelTaskIdList[0], //当前任务ID
            state: 6, //取消后的状态
            cancelReason: this.taskCancelReason //取消原因
          })
        } else {
            this.cancelDispatchTask({
              proId: this.proId,	//当前项目ID
              ids: this.cancelTaskIdList, //当前任务ID
              cancelReason: this.taskCancelReason //取消原因
          })
        }
      },

      //任务取消原因取消
      taskCancel () {
        this.taskCancelReasonShow = false
      },

      // 转移任务按钮点击
      transferTaskEvent () {
        this.transferTask = true;
        this.cancelTask = false;
        this.statusScreen = false;
        this.transferWorkerShow = true;
        this.$router.push({path:'/dispatchTaskForm'});
        this.changeTitleTxt({tit:'转移人员选择'});
        setStore('currentTitle','转移人员选择');
        this.transferTaskIdList = [];
        let temporaryTransferTaskCheckList = [];
        temporaryTransferTaskCheckList = this.waitBaskList.filter((item) => {return item.taskCheck == true});
        for (let item of temporaryTransferTaskCheckList)  {
          for (let key in item) {
            if (key == 'id')
            this.transferTaskIdList.push(item['id'])
          }
        };
        this.changedispatchTaskTransferIdList({DtMsg: this.transferTaskIdList})
      },

      // 复选框选择事件 
      waitTaskChecked (waitHandleCheck) {
      },

      // 点击具体任务事件
      taskClickEvent (item) {
        if (item.state !== 1 && item.state !== 7) {
          // 传给扫码界面科室类型和任务状态的值
          if (item.state == 2) {
            // 判断出发地是否强制拍照
            this.changeIsCoerceTakePhoto(item.startPhoto);
            this.changeDispatchTaskDepartmentType(0);
            this.changeDispatchTaskState(3)
          } else if (item.state == 3) {
            // 判断目的地地是否强制拍照
            this.changeIsCoerceTakePhoto(item.endPhoto);
            this.changeDispatchTaskDepartmentType(1);
            this.changeDispatchTaskState(7)
          };
          this.$router.push({'path':'/dispatchTaskSweepCode'});
          this.changeTitleTxt({tit:'扫码'});
          setStore('currentTitle','扫码');
          // 改变调度具体某一任务的信息状态
          this.changeDispatchTaskMessage({DtMsg: item});
          setStore('currentDispatchTaskMessage',item);
        }
      },

      // 获取待处理任务事件
      getTask (taskId) {
        updateDispatchTask({
          proId: this.proId,//当前项目ID
          id: taskId, //当前任务ID
          state: 2 //更新后的状态
        })
        .then(res => {
          if (res && res.data.code == 200) {
            this.queryDispatchTask(this.proId, this.workerId)
          }
        })
        .catch(err => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },

      // 状态筛选标签点击切换
      onClickTab (name) {
        this.currentIndex = name;
        getDispatchTaskMessage (this.proId, this.workerId)
        .then((res) => {
          let temporaryScreenTaskList = [];
          this.waitBaskList = [];
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              for (let item of res.data.data) {
                temporaryScreenTaskList.push({
                  createTime: item.createTime,
                  state: item.state,
                  setOutPlaceName: item.setOutPlaceName,
                  destinationName: item.destinationName,
                  taskTypeName: item.taskTypeName,
                  toolName: item.toolName,
                  priority: item.priority,
                  id: item.id,
                  startPhoto: item.startPhoto,
                  endPhoto: item.endPhoto
                })
              };
              if (name == 0) {
                this.waitBaskList = temporaryScreenTaskList
              } else if (name == 2) {
                this.waitBaskList = temporaryScreenTaskList.filter((item) => {return item.state == 2})
              } else if (name == 3) {
                this.waitBaskList = temporaryScreenTaskList.filter((item) => {return item.state == 3})
              } else if (name == 7) {
                this.waitBaskList = temporaryScreenTaskList.filter((item) => {return item.state == 7})
              }
            } else {
              this.$dialog.alert({
                message: '当前没有查询到对应状态的任务',
                closeOnPopstate: true
              }).then(() => {
              });
            }
          }
        })
        .catch((err) => {
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
    .content-wrapper();
    font-size: 14px;
    .left-dropDown {
      .rightDropDown
    }
    .dispatch-task-title {
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
      .task-line-two {
        height: 40px;
        font-size: 0;
        padding-top: 14px;
        box-sizing: border-box;
        color: #7f7d7d;
        .taskLineTwoStyle {
          color: #2895ea
        }
        span {
          font-size: 12px;
          display: inline-block;
          width: 33%;
          text-align: center;
          border-right: 1px solid #dedada;
          &:last-child {
            border-right: none
          }
        }
      }
    };
    .wait-handle, .task-query, .status-handle-screen {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
    };
    .wait-handle {
      .wait-handle-list {
        box-sizing: border-box;
        position: relative;
        padding-bottom: 10px;
        box-sizing: border-box;
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
    .status-handle-screen {
       .wait-handle-list {
        box-sizing: border-box;
        position: relative;
        padding-bottom: 10px;
        box-sizing: border-box;
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
    .status-handle-screen {
      /deep/ .van-tabs {
        .right-sign {
          .status-sign 
        }
      }
    }
  }
</style>
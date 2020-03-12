<template>
  <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="dispatch-task-title">
      <div class="task-line-one-wrapper">
        <ul class="task-line-one">
          <li :class="{'taskLineOneStyle':taskLlineOneIndex == index}" :key="index" v-for="(item,index) in taskOneList" @click="taskLineOneEvent(item, index)">{{item}}</li>
        </ul>
      </div>
      <p class="task-line-two">
        <span :class="{'taskLineTwoStyle':statusScreen == true}" @click="statusScreenEvent">状态筛选</span>
        <span v-show="cancelTaskBtnShow" :class="{'taskLineTwoStyle':cancelTask == true}" @click="cancelTaskEvent">取消任务</span>
        <span v-show="transferTaskBtnShow" :class="{'taskLineTwoStyle':transferTask == true}" @click="transferTaskEvent">转移任务</span>
      </p>
    </div>
    <div class="wait-handle" v-show="waitHandleShow">
      <div class="wait-handle-list" v-for="(item,index) in waitBaskList" :key="`${item}-${index}`" @click="taskClickEvent(item)">
        <p class="wait-handle-message-createTime">
          开始时间：{{item.taskCreateTime}}
        </p>
        <div class="wait-handle-message">
          <div class="handle-message-line-wrapper">
            <p>
              <span class="message-tit">预约名称:</span>
              <span class="message-tit-real">{{item.bedNumber}}</span>
            </p>
            <P>
              <span class="message-tit">起点:</span>
              <span class="message-tit-real">{{item.taskStartPoint}}</span>
            </P>
          </div>
          <div class="handle-message-line-wrapper">
            <p>
              <span class="message-tit">终点:</span>
              <span class="message-tit-real">{{item.taskFinishPoint}}</span>
            </p>
            <P>
              <span class="message-tit">运送类型:</span>
              <span class="message-tit-real">{{item.taskTransportype}}</span>
            </P>
          </div>
          <div class="handle-message-line-wrapper">
            <p>
              <span class="message-tit">转运工具:</span>
              <span class="message-tit-real">{{item.taskTransportTools}}</span>
            </p>
            <P>
              <span class="message-tit">状态:</span>
              <span class="message-tit-real">{{item.taskStatus == 0 ? '待处理' : '未开始' }}</span>
            </P>
          </div>
          <div class="handle-message-line-wrapper">
            <p>
              <span class="message-tit">床号:</span>
              <span class="message-tit-real">{{item.bedNumber}}</span>
            </p>
          </div>
        </div>
        <p class="wait-handle-check" v-show="item.taskStatus !== '0'">
          <van-checkbox v-model="item.taskCheck" @click.stop="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
        </p>
        <p class="get-wait-task">
          <van-button type="info" v-show="item.taskStatus == '0'" @click.stop="getTask">获取</van-button>
        </p>
      </div>
    </div>
    <div class="task-query" v-show="taskQueryShow">任务查询</div>
    <div class="status-handle-screen" v-show="statusHandleScreenShow">
      <van-tabs v-model="activeName" @click="onClickTab">
        <van-tab name="0">
          <div slot="title">
            <span class="title">未开始</span>
            <span class="right-sign" v-show="currentIndex == 0">12</span>
          </div>
          <div class="task-status-list">1</div>
        </van-tab>
        <van-tab name="1">
          <div slot="title">
            <span class="title">派送中</span>
            <span class="right-sign" v-show="currentIndex == 1">23</span>
          </div>
          <div class="task-status-list">2</div>
        </van-tab>
        <van-tab name="2">
          <div slot="title">
            <span class="title">已完成</span>
            <span class="right-sign" v-show="currentIndex == 2">3</span>
          </div>
          <div class="task-status-list">3</div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
  import HeaderTop from '@/components/HeaderTop'
  import FooterBottom from '@/components/FooterBottom'
  import {getBatchNumber} from '@/api/rubbishCollect.js'
  import NoData from '@/components/NoData'
  import { mapGetters, mapMutations } from 'vuex'
  import { formatTime, setStore, getStore, removeStore, IsPC } from '@/common/js/utils'
  import {getDictionaryData} from '@/api/login.js'
  export default {
    data () {
      return {
        taskOneList: ['待处理', '任务查询'],
        taskLlineOneIndex: '0',
        statusScreen: false,
        cancelTask: false,
        transferTask: false,
        waitHandleShow: true,
        taskQueryShow: false,
        statusHandleScreenShow: false,
        waitHandleCheck: true,
        cancelTaskBtnShow: false,
        transferTaskBtnShow: false,
        waitBaskList: [
          {
            taskCheck: false,
            appointName: '预约一',
            taskCreateTime: '2020-3-21:12:21:30',
            taskStatus: '0',
            taskStartPoint: '科室一',
            taskFinishPoint: '科室二',
            taskTransportype: '类型一',
            taskTransportTools: '小车',
            bedNumber: '床号一'
          },
          {
            taskCheck: false,
            appointName: '预约二',
            taskCreateTime: '2020-3-22:12:21:30',
            taskStatus: '1',
            taskStartPoint: '科室三',
            taskFinishPoint: '科室四',
            taskTransportype: '类型二',
            taskTransportTools: '大车',
            bedNumber: '床号二'
          },
          {
            taskCheck: false,
            appointName: '预约三',
            taskCreateTime: '2020-3-23:12:21:30',
            taskStatus: '0',
            taskStartPoint: '科室五',
            taskFinishPoint: '科室六',
            taskTransportype: '类型三',
            taskTransportTools: '推车',
            bedNumber: '床号三'
          }
        ],
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
        'navTopTitle'
      ])
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

    mounted () {
      // 控制设备物理返回按键测试
      if (!IsPC()) {
        pushHistory();
        this.gotoURL(() => {
          this.$router.push({path: 'home'});
          this.changeTitleTxt({tit:'中央运送'});
          setStore('currentTitle','中央运送') 
        })
      }
    },

    methods: {
      ...mapMutations([
        'changeTitleTxt',
        'changeAppointTaskMessage'
      ]),

      // 跳转到我的页
      skipMyInfo () {
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
          this.waitHandleShow = true;
          this.taskQueryShow = false;
          this.statusHandleScreenShow = false
        } else if (index == '1') {
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
        this.statusHandleScreenShow = true
      },

      // 取消任务按钮点击
      cancelTaskEvent () {
        this.cancelTask = true;
        this.transferTask = false;
        this.statusScreen = false;
      },

      // 转移任务按钮点击
      transferTaskEvent () {
        this.transferTask = true;
        this.cancelTask = false;
        this.statusScreen = false;
      },

      // 复选框选择事件 
      waitTaskChecked (waitHandleCheck) {
      },

      // 点击具体任务事件
      taskClickEvent (item) {
        if (item.taskStatus == '1') {
          this.$router.push({'path':'/appointTaskSweepCode'});
          this.changeTitleTxt({tit:'扫码'});
          setStore('currentTitle','扫码');
          // 改变调度具体某一任务的信息状态
          this.changeAppointTaskMessage({DtMsg: item});
          setStore('currentAppointTaskMessage',item);
        }
      },

      // 获取待处理任务事件
      getTask () {

      },

      // 状态筛选标签点击切换
      onClickTab (name, title) {
        this.currentIndex = name;
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
          color: red
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
      /deep/ .van-tabs {
        .right-sign {
          .status-sign 
        }
      }
    }
  }
</style>
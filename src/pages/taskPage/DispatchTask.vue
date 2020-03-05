<template>
  <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="dispatch-task-title">
      <h3>调度任务</h3>
      <p class="task-line-one">
        <span :class="{'taskLineOneStyle':taskLlineOneIndex == index}" :key="index" v-for="(item,index) in taskOneList" @click="taskLineOneEvent(item, index)">{{item}}</span>
      </p>
      <p class="task-line-two">
        <span :class="{'taskLineTwoStyle':statusScreen == true}" @click="statusScreenEvent">状态筛选</span>
        <span :class="{'taskLineTwoStyle':cancelTask == true}" @click="cancelTaskEvent">取消任务</span>
        <span :class="{'taskLineTwoStyle':transferTask == true}" @click="transferTaskEvent">转移任务</span>
      </p>
    </div>
    <div class="wait-handle" v-show="waitHandleShow">
      <div class="wait-handle-list">
        <p class="wait-handle-message">
          <span>创建时间：</span><span>状态：</span>
          <span>起点：</span><span>终点：</span>
          <span>运送类型：</span><span>转运工具：</span>
        </p>
        <p class="wait-handle-check">
          <van-checkbox v-model="waitHandleCheck" @change="waitTaskChecked(waitHandleCheck)"></van-checkbox>
        </p>
        <p class="get-wait-task">
          <van-button type="default" size="mini">获取</van-button>
        </p>
      </div>
    </div>
    <div class="task-query" v-show="taskQueryShow">任务查询</div>
    <div class="status-handle-screen" v-show="statusHandleScreenShow">状态筛选</div>
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
        waitHandleCheck: true
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

    mounted () {
      // 控制设备物理返回按键测试
      if (!IsPC()) {
        pushHistory();
        this.gotoURL(() => {
          this.changeTitleTxt({tit:'首页'});
          setStore('currentTitle','首页') 
        })
      }
    },

    methods: {
      ...mapMutations([
        'changeTitleTxt'
      ]),
      // 跳转到我的页
      skipMyInfo () {
      },

      // 返回上一页
      backTo () {
        this.$router.go(-1);
        this.changeTitleTxt({tit:'首页'});
        setStore('currentTitle','首页')
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
          this.statusHandleScreenShow = false
        }
      },

      // 状态筛选按钮点击
      statusScreenEvent () {
        this.statusScreen = true;
        this.transferTask = false;
        this.cancelTask = false;
        this.taskLlineOneIndex = null;
        this.taskQueryShow = false;
        this.waitHandleShow = false;
        this.statusHandleScreenShow = true
      },

      // 取消任务按钮点击
      cancelTaskEvent () {
        this.cancelTask = true;
        this.transferTask = false;
        this.statusScreen = false;
        this.taskLlineOneIndex = null
      },

      // 转移任务按钮点击
      transferTaskEvent () {
        this.transferTask = true;
        this.cancelTask = false;
        this.statusScreen = false;
        this.taskLlineOneIndex = null
      },

      // 复选框选择事件 
      waitTaskChecked (waitHandleCheck) {
        console.log(waitHandleCheck)
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
      height: 60px;
      padding: 10px;
      .task-line-one {
        height: 12px;
        margin: 10px 0;
        .taskLineOneStyle {
          color: red
        }
        span {
          display: inline-block;
          width: 30%;
          text-align: left;
          border-left: 1px solid #333;
          padding-left: 8px
        }
      };
      .task-line-two {
        height: 12px;
        margin: 10px 0;
        font-size: 0;
        .taskLineTwoStyle {
          color: red
        }
        span {
          font-size: 14px;
          display: inline-block;
          width: 30%;
          text-align: left;
          border-left: 1px solid #333;
          padding-left: 8px
        }
      }
    };
    .wait-handle, .task-query, .status-handle-screen {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      margin-top: 10px;
      width: 100%;
    };
    .wait-handle {
      .wait-handle-list {
        height: 130px;
        padding: 10px;
        box-sizing: border-box;
        position: relative;
        border: 1px solid #e3ece9;
        .wait-handle-message {
         margin-left: 30px;
          span {
            display: inline-block;
            width: 47%;
            &:nth-child(3) {
              margin: 8px 0
            };
            &:nth-child(4) {
              margin: 8px 0
            }
          }
        };
        .wait-handle-check {
          position: absolute;
          top: 10px;
          left: 12px
        };
        .get-wait-task {
          position: absolute;
          bottom: 10px;
          right: 10px
        }
      }
    }
  }
</style>
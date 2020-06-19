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
            <span class="message-tit">任务名称:</span>
            <span class="message-tit-real message-tit-real-style">{{circulationDetails.taskTypeName}}</span>
          </P>
          <p>
            <span class="message-tit">任务状态:</span>
            <span class="message-tit-real" style="color:red">{{stateTransfer(circulationDetails.state)}}</span>
          </p>
        </div>
        <div class="handle-message-line-wrapper">
          <p>
            <span class="message-tit">预计开始时间:</span>
            <span class="message-tit-real">{{circulationDetails.startTime}}</span>
          </p>
          <P>
            <span class="message-tit">实际开始时间:</span>
            <span class="message-tit-real message-tit-real-style">2020-06-13 09:00:34</span>
          </P>
        </div>
      </div>
    </div>
    <div class="office-list">
      <p class="office-list-inner-wrapper">
        <span :class="{officeCheckStyle: drawCompleteTaskIdList.indexOf(circulationDetails.id) != -1 && item.check == true}" v-for="(item,index) in circulationDetails.spaces" :key="`${item}-${index}`">
          {{item.text}}
        </span>
      </p>
    </div>
    <div class="circultion-task-btn">
      <span>
        <img :src="taskSweepCodePng" alt="" @click="joinSweepCode">
      </span>
      <span>
        <img :src="taskArrivedPng" alt="" @click="circulationTaskArrived">
      </span>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import FooterBottom from '@/components/FooterBottom'
import {} from '@/api/medicalPort.js'
import {} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC, removeBlock } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      liIndex: null,
      drawCompleteTaskIdList: [],
      taskArrivedPng: require('@/components/images/task-arrived.png'),
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
      'circulationDetails',
      'completeDeparnmentInfo'
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
    }
  },

  beforeRouteLeave(to, from, next) {
    if (to.name == 'circulationTaskSweepCode') {
      to.meta.keepAlive = false
    } else {
      to.meta.keepAlive = true
    };
    next();
  },

  mounted () {
    console.log('详细信息',this.circulationDetails);
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        if (this.circulationDetails.state == 7) {
          this.changeIsFreshCirculationTaskPage(false)
        } else {
          this.changeIsFreshCirculationTaskPage(true)
        };
        this.$router.push({path:'/circulationTask'});
        this.changeTitleTxt({tit:'循环任务'});
        setStore('currentTitle','循环任务')
      })
    };
    this.drawTaskId()
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeArriveDepartmentId',
      'changeIsCollectEnterSweepCodePage',
      'changeCirculationTaskId',
      'changeIsFreshCirculationTaskPage'
    ]),

    // 返回上一页
    backTo () {
      if (this.circulationDetails.state == 7) {
        this.changeIsFreshCirculationTaskPage(false)
      } else {
        this.changeIsFreshCirculationTaskPage(true)
      };
      this.$router.push({path:'/circulationTask'});
      this.changeTitleTxt({tit:'循环任务'});
      setStore('currentTitle','循环任务')
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

    // 循环任务送达
    circulationTaskArrived () {
      if (this.circulationDetails.state == 7) { 
        this.$dialog.alert({
          message: '该条循环任务已完成,不能进行送达',
          closeOnPopstate: true
        }).then(() => {
        });
      } else {
        this.changeArriveDepartmentId(true);
        if (this.circulationDetails['spaces'].filter((item) => item.check == true).length == this.circulationDetails['spaces'].length) {
          this.changeCirculationTaskId(this.circulationDetails.id);
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
    },

    // 进入扫码页
    joinSweepCode () {
      if (this.circulationDetails.state == 7) { 
        this.$dialog.alert({
          message: '该条循环任务已完成,不能进行扫码',
          closeOnPopstate: true
        }).then(() => {
        })
      } else {
        this.changeArriveDepartmentId(false);
        this.changeIsCollectEnterSweepCodePage(true);
        this.$router.push({'path':'/circulationTaskSweepCode'});
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
      }
    }
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
        span {
          font-size: 16px;
          display: inline-block;
          width: 48%;
          line-height: 50px;
          text-align: center;
          margin-right: 4%;
          margin-bottom: 12px;
          background: #f5f5f5;
          &:nth-child(even) {
            margin-right: 0
          }
        }
        .officeCheckStyle {
          background: #2895ea;
          color: #fff
        }
      }
    }
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
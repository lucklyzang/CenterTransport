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
            <span class="message-tit-real">{{appointTaskMessage.bedNumber}}</span>
          </P>
          <p>
            <span class="message-tit">任务状态:</span>
            <span class="message-tit-real" style="color:red">{{stateTransfer(appointTaskMessage.state)}}</span>
          </p>
        </div>
        <div class="handle-message-line-wrapper">
          <p>
            <span class="message-tit">预计开始时间:</span>
            <span class="message-tit-real">{{appointTaskMessage.createTime}}</span>
          </p>
          <P>
            <span class="message-tit">实际开始时间:</span>
            <span class="message-tit-real">{{appointTaskMessage.createTime}}</span>
          </P>
        </div>
        <div class="handle-message-line-wrapper">
          <p class="p-other">
            <span class="message-tit">任务起点: {{appointTaskMessage.setOutPlaceName}}</span>
          </p>
        </div>
        <div class="handle-message-line-wrapper">
          <p>
            <span class="message-tit">优先级:</span>
            <span class="message-tit-real message-tit-real-style">{{priorityTransfer(appointTaskMessage.priority)}}</span>
          </p>
          <P>
            <span class="message-tit">转运工具:</span>
            <span class="message-tit-real">{{appointTaskMessage.toolName ? appointTaskMessage.toolName : '无'}}</span>
          </P>
        </div>
        <div class="handle-message-line-wrapper">
          <p>
            <span class="message-tit">任务描述:</span>
            <span class="message-tit-real">{{appointTaskMessage.taskRemark}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="office-list">
      <p class="office-list-inner-wrapper">
        <span v-for="(item,index) in appointTaskMessage.spaces" :key="`${item}-${index}`">
          {{item.text}}
        </span>
      </p>
    </div>
    <div class="circultion-task-btn">
     <p class="circultion-task-btn-top" v-show="appointTaskMessage.state != 7">
        <span @click="fetchPiece">取件</span>
        <span @click="sendPiece">送件</span>
      </p>
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
import {} from '@/api/medicalPort.js'
import {} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC, removeBlock } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  name: 'appointDetails',
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      liIndex: null,
      drawCompleteTaskIdList: [],
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
      'appointTaskMessage'
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

  mounted () {
    console.log('详细信息',this.appointTaskMessage);
    // 控制设备物理返回按键测试
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
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeIsFreshAppointTaskPage'
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

    // 取件
    fetchPiece () {
      if (this.appointTaskMessage.state == 3 || this.appointTaskMessage.state == 4) {
        this.$toast('取件已完成，请点击送件')
      } else {
        this.joinSweepCode()
      }
    },

    // 送件
    sendPiece () {
      if (this.appointTaskMessage.state == 2) {
        this.$toast('请先完成出发地取件');
      } else {
        this.joinSweepCode()
      }
    },

    // 结束任务
    endTask () {
      if (!this.appointTaskMessage.spaces.some((item) => {item.check == true})) {
        this.$toast('至少完成一个目的地时,才能结束任务');
        return
      };
      if (this.appointTaskMessage.state == 4) {
        this.$toast('请再次扫描出发地结束任务');
      } else {
        this.$dialog.alert({
          message: '确定结束任务?',
          showCancelButton: true
        })
        .then(() => {
          if (this.appointTaskMessage.state == 7) {
            this.changeIsFreshAppointTaskPage(false)
          } else {
            this.changeIsFreshAppointTaskPage(true)
          }
        })
        .catch((err) => {
        })
      }
    },


    // 进入扫码页
    joinSweepCode () {
      if (this.appointTaskMessage.state == 7) { 
        this.$dialog.alert({
          message: '该条预约任务已完成,不能进行扫码',
          closeOnPopstate: true
        }).then(() => {
        })
      } else {
        this.$router.push({'path':'/appointTaskSweepCode'});
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
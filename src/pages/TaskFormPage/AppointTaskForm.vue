<template>
   <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
      <!-- <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon>  -->
    </HeaderTop>
     <!-- 右边下拉框菜单 -->
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <div class="sweep-code-title">
      <h3>在线的工作人员</h3>
      <van-dropdown-menu>
        <van-dropdown-item v-model="currentPerson" :options="onlinePersonLlist" />
      </van-dropdown-menu>
    </div>
    <div class="btn-area">
      <span>
        <img :src="taskSurePng" alt=""  @click="transferPersonSure">
      </span>
      <span>
        <img :src="taskCancelPng" alt="" @click="transferPersonCancel">
      </span>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import FooterBottom from '@/components/FooterBottom'
import {getWorkerMessage} from '@/api/login.js'
import {transferAppointTask} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { setStore, IsPC, deepClone } from '@/common/js/utils'
export default {
  name: 'appointTaskForm',
  data () {
    return {
       leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      liIndex: null,
      currentPerson: '',
      onlinePersonLlist: [],
      taskSurePng: require('@/components/images/task-sure.png'),
      taskCancelPng: require('@/components/images/task-cancel.png')
    };
  },

  components:{
    HeaderTop,
    NoData,
    FooterBottom
  },

  mounted () {
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        this.$router.push({path:'/appointTask'});
        this.changeTitleTxt({tit:'预约任务'});
        setStore('currentTitle','预约任务')
      })
    };
    this.queryOnlineWorker({proId: this.proId, state:''})
  },

  computed:{
    ...mapGetters([
      'appointTaskTransferIdList',
      'navTopTitle',
      'userInfo',
      'completeCheckedItemInfo',
      'completeSweepcodeDestinationInfo',
      'completeSweepcodeDepartureInfo'
    ]),
    proId () {
      return this.userInfo.extendData.proId
    },
    workerId () {
      return this.userInfo.extendData.userId
    },
    workerName () {
      return this.userInfo.name
    }
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeAppointTaskTransferIdList',
      'changeCatchComponent',
      'changeCompleteCheckedItemInfo',
      'changeCompleteSweepcodeDestinationInfo',
      'changeCompleteSweepcodeDepartureInfo'
    ]),

    // 获取在线工作人员
    queryOnlineWorker (data) {
      getWorkerMessage(data).then((res) => {
        if (res && res.data.code == 200) {
          this.onlinePersonLlist = [{text: '请选择',value: ''}];
          for (let item of res.data.data) {
            let temporaryWorkerMessageArray = [];
            for (let innerItem in item) {
              if (innerItem == 'id') {
                temporaryWorkerMessageArray.push(item[innerItem])
              };
              if (innerItem == 'workerName') {
                temporaryWorkerMessageArray.push(item[innerItem])
              }
            };
            this.onlinePersonLlist.push({text: temporaryWorkerMessageArray[1], value: temporaryWorkerMessageArray[0]})
          };
        }
      })
      .catch((err) => {
        console.log(err)
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

    // 返回上一页
    backTo () {
      this.$router.push({path:'/appointTask'});
      this.changeTitleTxt({tit:'预约任务'});
      setStore('currentTitle','预约任务')
    },

    // 转移任务
    sureTransferDispatchTask (data) {
      transferAppointTask(data)
      .then((res) => {
        if (res && res.data.code == 200) {
          this.$toast(`${ res.data.msg}`);
          this.emptyCompleteCheckedItem();
          this.emptyCompleteDestinationDepartment();
          this.emptyCompleteDepartureDepartment();
          this.$router.push({path:'/appointTask'});
          this.changeTitleTxt({tit:'预约任务'});
          setStore('currentTitle','预约任务');
        } else {
          this.$dialog.alert({
            message: res.data.msg,
            closeOnPopstate: true
          }).then(() => {
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

    // 转移人员确认事件
    transferPersonSure () {
      let taskAcceptName = '';
      let currentCheckWorkerInfo = [];
      currentCheckWorkerInfo = this.onlinePersonLlist.filter((item) => {return item.value == this.currentPerson});
      taskAcceptName = currentCheckWorkerInfo[0]['text'];
      if (taskAcceptName == this.workerName) {
        this.$toast(`任务不能转移给自己`);
        return
      };
      if (taskAcceptName == '请选择') {
        this.$toast(`请选择要转移的人员`);
        return
      };
      this.sureTransferDispatchTask ({
        taskId: this.appointTaskTransferIdList[0],
        afterWorkerId: this.currentPerson,   //任务接受者ID
        beforeWorkerId: this.workerId,      //转移者ID
      })
    },

    // 转移人员取消事件
    transferPersonCancel () {
      this.$router.push({path:'/appointTask'});
      this.changeTitleTxt({tit:'预约任务'});
      setStore('currentTitle','预约任务')
    },

    // 清空该完成任务存储的已完成检查的信息
    emptyCompleteCheckedItem () {
      let temporarySweepCodeOficeList = deepClone(this.completeCheckedItemInfo);
      temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return item.taskId != this.appointTaskTransferIdList[0]});
      this.changeCompleteCheckedItemInfo(temporarySweepCodeOficeList);
      setStore('completAppointTaskCheckedItemInfo', {"sweepCodeInfo": temporarySweepCodeOficeList})
    },

    // 清空该完成任务存储的已扫过目的地科室信息
    emptyCompleteDestinationDepartment () {
      let temporarySweepCodeOficeList = deepClone(this.completeSweepcodeDestinationInfo);
      temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return item.taskId != this.appointTaskTransferIdList[0]});
      this.changeCompleteSweepcodeDestinationInfo(temporarySweepCodeOficeList);
      setStore('completAppointTaskSweepCodeDestinationInfo', {"sweepCodeInfo": temporarySweepCodeOficeList});
    },

    // 清空该完成任务存储的已扫过起始地科室信息
    emptyCompleteDepartureDepartment () {
      let temporarySweepCodeOficeList = deepClone(this.completeSweepcodeDepartureInfo);
      temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return item.taskId != this.appointTaskTransferIdList[0]});
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
      .left-dropDown {
      .rightDropDown
    }
    font-size: 14px;
    .sweep-code-title {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      margin: 10px 0;
      width: 100%;
      h3 {
        height: 30px;
        margin-top: 10px;
        line-height: 30px;
        padding-left: 10px;
        font-size: 14px;
        color: #1699e8
      }
    };
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
  }
</style>

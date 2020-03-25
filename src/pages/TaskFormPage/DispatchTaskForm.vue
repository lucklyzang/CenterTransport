<template>
   <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="sweep-code-title">
      <h3>在线的工作人员</h3>
      <van-dropdown-menu>
        <van-dropdown-item v-model="currentPerson" :options="onlinePersonLlist" />
      </van-dropdown-menu>
    </div>
    <div class="btn-area">
      <van-button type="info" @click="transferPersonSure">确定</van-button>
      <van-button type="default" @click="transferPersonCancel">取消</van-button>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import FooterBottom from '@/components/FooterBottom'
import {getWorkerMessage} from '@/api/login.js'
import {transferDispatchTask} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
      currentPerson: '',
      onlinePersonLlist: []
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
      pushHistory();
      this.gotoURL(() => {
        this.changeIsRefershDispatchTaskPage(false);
        this.$router.push({path:'/dispatchTask'});
        this.changeTitleTxt({tit:'调度任务'});
        setStore('currentTitle','调度任务')
      })
    };
    this.queryOnlineWorker({proId: this.proId, state:''})
  },

  computed:{
    ...mapGetters([
      'dispatchTaskTransferIdList',
      'navTopTitle'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    },
    workerId () {
      return JSON.parse(getStore('userInfo')).extendData.userId
    },
    workerName () {
      return JSON.parse(getStore('userInfo')).extendData.userName
    },
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeIsRefershDispatchTaskPage'
    ]),

    // 获取在线工作人员
    queryOnlineWorker (data) {
      getWorkerMessage().then((res) => {
        if (res && res.data.code == 200) {
          this.onlinePersonLlist = [];
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

    // 我的页面
    skipMyInfo () {

    },

    // 返回上一页
    backTo () {
      this.$router.push({path:'/dispatchTask'});
      this.changeTitleTxt({tit:'调度任务'});
      setStore('currentTitle','调度任务')
    },

    // 转移任务
    sureTransferDispatchTask (data) {
      transferDispatchTask(data)
      .then((res) => {
        if (res && res.data.code == 200) {
          this.$dialog.alert({
            message: res.data.msg,
            closeOnPopstate: true
          }).then(() => {
            this.changeIsRefershDispatchTaskPage(true);
            this.$router.push({path:'/dispatchTask'});
            this.changeTitleTxt({tit:'调度任务'});
            setStore('currentTitle','调度任务')
          });
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
      console.log('sa');
      let taskAcceptName = '';
      let currentCheckWorkerInfo = [];
      currentCheckWorkerInfo = this.onlinePersonLlist.filter((item) => {return item.value == this.currentPerson});
      taskAcceptName = currentCheckWorkerInfo[0]['text'];
      this.sureTransferDispatchTask ({
        // taskId: this.dispatchTaskTransferIdList[0],
        taskIds: this.dispatchTaskTransferIdList,  //任务ID
        afterId: this.currentPerson,   //任务接受者ID
        afterName: taskAcceptName, //任务接受者姓名
        modifyId: this.workerId,      //转移者ID
        modifyName: this.workerName    //转移者姓名
      })
    },

    // 转移人员取消事件
    transferPersonCancel () {
      this.$router.push({path:'/dispatchTask'});
      this.changeTitleTxt({tit:'调度任务'});
      setStore('currentTitle','调度任务')
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
        font-size: 15px
      }
    };
    .btn-area {
      height: 50px;
      text-align: center;
      line-height: 50px;
    }
  }
</style>
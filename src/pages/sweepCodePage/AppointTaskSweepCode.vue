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
    <div class="sweep-code-title">
      <h3>扫描二维码</h3>
    </div>
    <div class="sweep-code-area">{{appointTaskMessage}}</div>
    <div class="btn-area">
      <van-button type="info" @click="sweepCodeSure">扫描二维码</van-button>
      <van-button type="default" @click="cancelSweepCode">取消</van-button>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import FooterBottom from '@/components/FooterBottom'
import {getAlltTaskNumber,judgeAppointTaskDepartment} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
       leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      liIndex: null,
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
        this.$router.push({path:'/appointTask'});
        this.changeTitleTxt({tit:'预约任务'});
        setStore('currentTitle','预约任务')
      })
    };
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    };
    console.log('信息校验',this.appointTaskState,this.appointTaskDepartmentType,this.appointSweepCodeNumber,this.appointSweepCodeIntoPage);
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'appointTaskMessage',
      'appointTaskState',
      'appointTaskDepartmentType',
      'appointSweepCodeNumber',
      'appointSweepCodeIntoPage'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    },
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeIsRefershAppointTaskPage'
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

     // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      if (code) {
        let codeData = code.split('|');
        if (codeData.length > 0) {
          let departmentId = codeData[0];
          this.juddgeCurrentDepartment({
            id: this.appointTaskMessage.id,  //任务ID
            proId: this.proId,  //项目ID
            departmentId: departmentId,  //科室ID
            checkType: this.appointTaskDepartmentType   //校验类型  0-出发地，1-目的地，2-出发地(当任务状态为4时)
          })
        }
      } else {
        this.$dialog.alert({
          message: '当前没有扫描到任何信息,请重新扫描'
        }).then(() => {
          this.sweepAstoffice()
        });
      }
    },

     // 判断扫码科室
    juddgeCurrentDepartment (data) {
      judgeAppointTaskDepartment(data).then((res) => {
        if (res && res.data.code == 200) {
          // 第二次扫码目的时不更新状态
          if (!this.appointSweepCodeNumber) {
            this.updateTaskState({
              proId: this.proId, //当前项目ID
              id: this.appointTaskMessage.id, //当前任务ID
              state: this.appointTaskState//更新后的状态 {0: '未分配', 1: '未查阅', 2: '未开始', 3: '进行中', 4: '未结束', 5: '已延迟', 6: '已取消', 7: '已完成'
            })
          }
        } else {
          this.$dialog.alert({
            message: res.data.msg,
            closeOnPopstate: true,
            showCancelButton: true 
          }).then(() => {
            this.againSweepCode()
          }).catch((err) =>{})
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

    // 更新任务状态
    updateTaskState (data) {
      updateAppointTask(data).then((res) => {
        if (res && res.data.code == 200) {
          this.changeIsRefershAppointTaskPage(true);
          // 第一次扫码出发地后进入客户预约信息确认页面
          if (!this.appointSweepCodeIntoPage) {
            this.$router.push({path:'/appointTask'});
            this.changeTitleTxt({tit:'预约任务'});
            setStore('currentTitle','预约任务')
          } else {
            this.$router.push({path:'/appointTaskCustomerInfo'});
            this.changeTitleTxt({tit:'客户预约信息确认'});
            setStore('currentTitle','客户预约信息确认')
          }
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

    // 返回上一页
    backTo () {
      this.$router.push({path:'/appointTask'});
      this.changeTitleTxt({tit:'预约任务'});
      setStore('currentTitle','预约任务')
    },

    // 重新扫码弹窗
    againSweepCode () {
      this.sweepAstoffice()
    },

    // 扫描二维码方法
    sweepAstoffice () {
      window.android.scanQRcode()
    },

    // 扫码确认事件
    sweepCodeSure () {
      this.$router.push({path:'/appointTaskCustomerInfo'});
      this.changeTitleTxt({tit:'客户预约信息确认'});
      setStore('currentTitle','客户预约信息确认')
    },

    // 取消扫码事件
    cancelSweepCode () {
      this.$router.push({path:'/appointTask'});
      this.changeTitleTxt({tit:'预约任务'});
      setStore('currentTitle','预约任务')
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
    .sweep-code-title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      h3 {
        font-size: 15px
      }
    };
    .sweep-code-area {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
    };
    .btn-area {
      height: 50px;
      text-align: center;
      line-height: 50px;
    }
  }
</style>
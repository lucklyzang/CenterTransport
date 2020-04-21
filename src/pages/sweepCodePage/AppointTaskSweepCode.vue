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
      <h3></h3>
    </div>
    <div class="sweep-code-area">
      <div class="point-area">
        <p class="task-start-point">
          <span>任务起点:</span>
          <span>{{appointTaskMessage.setOutPlaceName}}</span>
        </p>
        <p class="task-end-point">
          <span>任务终点:</span>
          <span>{{appointTaskMessage.destinationName}}</span>
        </p>
      </div>
    </div>
    <div class="btn-area">
      <span>
        <img :src="taskSweepCodePng" alt=""  @click="sweepCodeSure">
      </span>
      <span>
        <img :src="taskCancelPng" alt="" @click="cancelSweepCode">
      </span>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import FooterBottom from '@/components/FooterBottom'
import {getAlltTaskNumber,judgeAppointTaskDepartment,updateAppointTaskMessage} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC, deepClone, repeArray } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      liIndex: null,
      taskCancelPng: require('@/components/images/task-cancel.png'),
      taskSweepCodePng: require('@/components/images/task-sweep-code.png')
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
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    };
    if (this.appointTaskDepartmentType == 0) {
      this.currentSiteId = this.appointTaskMessage.setOutPlaceId
    } else if (this.appointTaskDepartmentType == 1) {
      this.currentSiteId = this.appointTaskMessage.destinationId
    } else if (this.appointTaskDepartmentType == 2) {
      this.currentSiteId = this.appointTaskMessage.setOutPlaceId
    }
    console.log('信息校验',this.appointTaskMessage);
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'appointTaskMessage',
      'appointTaskState',
      'appointTaskDepartmentType',
      'appointSweepCodeNumber',
      'appointSweepCodeIntoPage',
      'isCompleteSweepCodeList'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    },
     taskId () {
      return this.appointTaskMessage.id
    }
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeIsCompleteSweepCodeList'
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
          // 存储已经扫码验证通过的科室id
          let temporaryOfficeList = [];
          let temporaryDepartmentId = [];
          temporaryOfficeList = deepClone(this.isCompleteSweepCodeList);
          if (this.isCompleteSweepCodeList.length > 0 ) {
            let temporaryIndex = this.isCompleteSweepCodeList.indexOf(this.isCompleteSweepCodeList.filter((item) => {return item.taskId == this.taskId})[0]);
            if (temporaryIndex != -1) {
              temporaryDepartmentId = temporaryOfficeList[temporaryIndex]['officeList'];
              temporaryDepartmentId.push(this.currentSiteId);
              temporaryOfficeList[temporaryIndex]['officeList'] = repeArray(temporaryDepartmentId)
            } else {
              temporaryDepartmentId.push(this.currentSiteId);
              temporaryOfficeList.push(
                { 
                  officeList: repeArray(temporaryDepartmentId),
                  taskId: this.taskId
                }
              )
            };
          } else {
            temporaryDepartmentId.push(this.currentSiteId);
            temporaryOfficeList.push(
              { 
                officeList: repeArray(temporaryDepartmentId),
                taskId: this.taskId
              }
            )
          };
          this.changeIsCompleteSweepCodeList(temporaryOfficeList);
          setStore('completAppointTaskSweepCodeInfo', {"sweepCodeInfo": temporaryOfficeList});
          // 第二次扫码目的时不更新状态
          if (this.appointSweepCodeNumber) {
            this.$router.push({path:'/appointTask'});
            this.changeTitleTxt({tit:'预约任务'});
            setStore('currentTitle','预约任务')
            // 第一次扫码出发地后进入客户预约信息确认页面
          } else if (this.appointSweepCodeIntoPage) {
            this.$router.push({path:'/appointTaskCustomerInfo'});
            this.changeTitleTxt({tit:'客户预约信息确认'});
            setStore('currentTitle','客户预约信息确认')
          } else {
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
      updateAppointTaskMessage(data).then((res) => {
        if (res && res.data.code == 200) {
          if (!this.appointSweepCodeIntoPage) {
            if (this.appointTaskState == 7) {
               this.$dialog.alert({
                message: '该任务已完成',
                closeOnPopstate: true
              }).then(() => {
              });
            };
            // 清空该完成任务存储的已扫过科室信息
            let temporarySweepCodeOficeList = deepClone(this.isCompleteSweepCodeList);
            temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return item.taskId != this.taskId});
            this.changeIsCompleteSweepCodeList(temporarySweepCodeOficeList);
            setStore('completAppointTaskSweepCodeInfo', {"sweepCodeInfo": temporaryOfficeList});
            this.$router.push({path:'/appointTask'});
            this.changeTitleTxt({tit:'预约任务'});
            setStore('currentTitle','预约任务')
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
      let isExistTaskId = '',
      isExistOfficeId = '';
      isExistTaskId = this.isCompleteSweepCodeList.indexOf(this.isCompleteSweepCodeList.filter((item) => {return item.taskId == this.taskId})[0]);
      if (isExistTaskId != -1) {
        isExistOfficeId = this.isCompleteSweepCodeList[isExistTaskId]['officeList'].indexOf(this.currentSiteId);
      };
      if (isExistTaskId !== -1 && isExistOfficeId !== -1 && isExistOfficeId !== '') {
        if (this.appointTaskDepartmentType == 0) {
          this.$dialog.alert({
            message: '该科室校验已验证通过,请确认客户预约信息',
            closeOnPopstate: true
          }).then(() => {
          });
          this.$router.push({path:'/appointTaskCustomerInfo'});
          this.changeTitleTxt({tit:'客户预约信息确认'});
          setStore('currentTitle','客户预约信息确认')
        } else {
          this.sweepAstoffice()
        }
      } else {
        this.sweepAstoffice()
      }
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
        font-size: 14px;
        color: #1699e8
      }
    };
    .sweep-code-area {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
      .point-area {
        height: auto;
        width: 80%;
        background: #fff;
        margin-left: 4%;
        margin-top: 140px;
        padding: 20px 10px 20px 20px;
        box-shadow: 0 2.5px 12px 4px #d1d1d1;
        border-radius: 8px;
        color: #313131;
        font-weight: bold;
        letter-spacing: 2px;
        p {
          margin-bottom: 20px;
          padding-left: 10px;
          font-size: 16px;
          span {
            &:first-child {
              color: #585858;
            }
          }
        }
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
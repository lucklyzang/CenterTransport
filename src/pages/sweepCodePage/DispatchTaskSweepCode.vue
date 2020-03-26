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
    <div class="sweep-code-area"></div>
    <div class="btn-area">
      <van-button type="info">扫描二维码</van-button>
      <van-button type="default" @click="cancelSweepCode">取消</van-button>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import FooterBottom from '@/components/FooterBottom'
import {judgeDispatchTaskDepartment,updateDispatchTask} from '@/api/workerPort.js'
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
        this.changeIsRefershDispatchTaskPage(false);
        this.$router.push({path:'/dispatchTask'});
        this.changeTitleTxt({tit:'调度任务'});
        setStore('currentTitle','调度任务')
      })
    };
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    };
    console.log('调度任务状态' ,this.dispatchTaskState, this.dispatchTaskDepartmentType);
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'dispatchTaskMessage',
      'dispatchTaskState',
      'dispatchTaskDepartmentType'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    },
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeIsRefershDispatchTaskPage'
    ]),

    // 扫描二维码方法
    sweepAstoffice () {
      window.android.scanQRcode()
    },

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      let departmentId = '';
      if (code) {
        departmentId = code.id;
        this.juddgeCurrentDepartment({
          id: this.dispatchTaskMessage.id,  //任务ID
			    proId: this.proId,  //项目ID
          departmentId: departmentId,  //科室ID
			    checkType: this.dispatchTaskDepartmentType   //校验类型  出发地-0,目的地-1
        })
      } else {
        this.$dialog.alert({
          message: '当前没有扫描到任何信息,请重新扫描'
        }).then(() => {
          this.sweepAstoffice()
        });
      }
    },

    // 重新扫码弹窗
    againSweepCode () {
       this.$dialog.alert({
        message: '扫描科室与任务要求科室不一致,请重新扫描'
      }).then(() => {
        this.sweepAstoffice()
      });
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

    // 判断扫码科室
    juddgeCurrentDepartment (data) {
      judgeDispatchTaskDepartment(data).then((res) => {
        if (res && res.data.code == 200) {
          this.updateTaskState({
            proId: this.proId, //当前项目ID
            id: this.dispatchTaskMessage.id, //当前任务ID
            state: this.dispatchTaskState//更新后的状态 {0: '未分配', 1: '未查阅', 2: '未开始', 3: '进行中', 4: '未结束', 5: '已延迟', 6: '已取消', 7: '已完成'
          })
        } else {
          this.againSweepCode()
        }
      })
      .catch((err) => {
        this.againSweepCode()
      })
    },

    // 更新任务状态
    updateTaskState (data) {
      updateDispatchTask(data).then((res) => {
        if (res && res.data.code == 200) {
          this.changeIsRefershDispatchTaskPage(true);
          this.$router.push({path:'/dispatchTask'});
          this.changeTitleTxt({tit:'调度任务'});
          setStore('currentTitle','调度任务')
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
      this.changeIsRefershDispatchTaskPage(false);
      this.$router.push({path:'/dispatchTask'});
      this.changeTitleTxt({tit:'调度任务'});
      setStore('currentTitle','调度任务')
    },

    // 取消扫码事件
    cancelSweepCode () {
      this.changeIsRefershDispatchTaskPage(false);
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
      .left-dropDown {
      .rightDropDown
    }
    font-size: 14px;
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
      line-height: 50px
    }
  }
</style>
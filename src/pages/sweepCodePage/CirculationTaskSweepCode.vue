<template>
   <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="sweep-code-title">
      <h3>扫描二维码</h3>
    </div>
    <div class="sweep-code-area">{{circulationTaskMessage}}</div>
    <div class="btn-area">
      <van-button type="info" @click="sweepCodeSure">扫描二维码</van-button>
      <van-button type="default" @click="cancelSweepCode">取消</van-button>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import FooterBottom from '@/components/FooterBottom'
import {judgeDepartment} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
    };
  },

  components:{
    HeaderTop,
    NoData,
    FooterBottom
  },

  mounted () {
    console.log('id',this.circulationTaskId);
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        this.$router.push({path:'/appointTask'});
        this.changeTitleTxt({tit:'循环任务'});
        setStore('currentTitle','循环任务')
      })
    };
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    }
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'circulationTaskMessage',
      'isCollectEnterSweepCodePage',
      'circulationTaskId'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    },
    circulationId () {
      return this.circulationTaskMessage.currentMsg.id
    }
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt'
    ]),

    // 我的页面
    skipMyInfo () {

    },

    // 扫描二维码方法
    sweepAstoffice () {
      window.android.scanQRcode()
    },

     // 重新扫码弹窗
    againSweepCode () {
       this.$dialog.alert({
        message: '扫描科室与任务要求科室不一致,请重新扫描'
      }).then(() => {
        this.sweepAstoffice()
      });
    },

    // 返回上一页
    backTo () {
      this.$router.push({path:'/circulationTask'});
      this.changeTitleTxt({tit:'循环任务'});
      setStore('currentTitle','循环任务')
    },

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      let departmentId = '';
      if (code) {
        departmentId = code.id;
        this.juddgeMedicalCorrect({
          id: this.circulationId,// 循环任务ID 必输
          proId: this.proId, // 项目ID 必输
          departmentId: departmentId //扫描科室ID 必输
        })
      } else {
         this.$dialog.alert({
          message: '当前没有扫描到任何信息,请重新扫描'
        }).then(() => {
          this.sweepAstoffice()
        });
      }
    },

    // 扫码确认事件
    sweepCodeSure () {
      console.log(this.isCollectEnterSweepCodePage);
      if(this.isCollectEnterSweepCodePage) {
        this.$router.push({path:'/circulationTaskCollectMessage'});
        this.changeTitleTxt({tit:'循环信息采集'});
        setStore('currentTitle','循环信息采集')
      } else {
        this.$router.push({path:'/circulationTaskMessageConnect'});
        this.changeTitleTxt({tit:'循环信息交接'});
        setStore('currentTitle','循环信息交接')
      }
    },

    //判断扫码科室是否为当前要收集的科室
    juddgeMedicalCorrect(data) {
      judgeDepartment(data).then((res) => {
        if (res && res.data.code == 200) {
          if(this.isCollectEnterSweepCodePage) {
            this.$router.push({path:'/circulationTaskCollectMessage'});
            this.changeTitleTxt({tit:'循环信息采集'});
            setStore('currentTitle','循环信息采集')
          } else {
            this.$router.push({path:'/circulationTaskMessageConnect'});
            this.changeTitleTxt({tit:'循环信息交接'});
            setStore('currentTitle','循环信息交接')
          }
        } else {
          this.againSweepCode()
        }
      })
      .catch((err) => {
        this.againSweepCode()
      })
    },

    // 取消扫码事件
    cancelSweepCode () {
      this.$router.push({path:'/circulationTask'});
      this.changeTitleTxt({tit:'循环任务'});
      setStore('currentTitle','循环任务')
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
      width: 100%
    };
    .btn-area {
      height: 50px;
      text-align: center;
      line-height: 50px
    }
  }
</style>
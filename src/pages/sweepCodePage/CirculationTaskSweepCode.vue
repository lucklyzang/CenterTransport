<template>
   <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="sweep-code-title">扫描二维码</div>
    <div class="sweep-code-area">{{circulationTaskMessage}}</div>
    <div class="btn-area">
      <van-button type="default" @click="sweepCodeSure">扫描二维码</van-button>
      <van-button type="default" @click="cancelSweepCode">取消</van-button>
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
        this.changeTitleTxt({tit:'循环任务'});
        setStore('currentTitle','循环任务')
      })
    };
    console.log(this.circulationTaskMessage);
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'circulationTaskMessage'
    ])
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt'
    ]),

    // 我的页面
    skipMyInfo () {

    },

    // 返回上一页
    backTo () {
      this.$router.push({path:'/circulationTask'});
      this.changeTitleTxt({tit:'循环任务'});
      setStore('currentTitle','循环任务')
    },

    // 扫码确认事件
    sweepCodeSure () {
      this.$router.push({path:'/circulationTaskCollectMessage'});
      this.changeTitleTxt({tit:'信息采集'});
      setStore('currentTitle','信息采集')
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
    };
    .sweep-code-area {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      margin: 10px 0;
      width: 100%
    };
    .btn-area {
      height: 50px;
      text-align: center;
      line-height: 50px
    }
  }
</style>
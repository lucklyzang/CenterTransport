<template>
   <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="sweep-code-title">交接信息确认</div>
    <div class="sweep-code-area">
      <van-field v-model="bedNumber" label="床号" placeholder="请输入"/>
      <van-field v-model="patientName" type="tel" label="姓名" placeholder="请输入"/>
      <VanFieldSelectPicker
        label="标本类型"
        placeholder="请选择"
        v-model="sampleType"
        :columns="sampleTypeList"
      />
      <van-field v-model="sampleAmount" type="number" label="数量" placeholder="请输入"/>
    </div>
    <div class="btn-area">
      <van-button type="default" @click="connectMessageSure">确认</van-button>
      <van-button type="default" @click="connectMessageCancel">取消</van-button>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import FooterBottom from '@/components/FooterBottom'
//  import {getAlltTaskNumber} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
      bedNumber: '',
      patientName: '',
      sampleType: '',
      sampleAmount: '',
      sampleTypeList: ['1','2','3','4']
    };
  },

  components:{
    VanFieldSelectPicker,
    HeaderTop,
    NoData,
    FooterBottom
  },

  mounted () {
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        this.$router.push({path:'/circulationTaskMessageConnect'});
        this.changeTitleTxt({tit:'信息交接'});
        setStore('currentTitle','信息交接')
      })
    };
  },

  computed:{
    ...mapGetters([
      'navTopTitle'
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
      this.$router.push({path:'/circulationTaskMessageConnect'});
      this.changeTitleTxt({tit:'信息交接'});
      setStore('currentTitle','信息交接')
    },

     // 交接信息确认事件
    collectMessageSure () {
    },

    // 交接信息取消事件
    collectMessageCancel () {
      this.$router.push({path:'/circulationTaskMessageConnect'});
      this.changeTitleTxt({tit:'信息交接'});
      setStore('currentTitle','信息交接')
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
      width: 100%;
    };
    .btn-area {
      height: 50px;
      text-align: center;
      line-height: 50px;
    }
  }
</style>
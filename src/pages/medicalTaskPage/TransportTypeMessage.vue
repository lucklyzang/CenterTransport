<template>
  <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="transport-type-title">
      <h3>运送类型{{transportTypeMessage}}</h3>
    </div>
    <div class="transport-type-area">
      <van-field v-model="destinationAddress" label="目的地" placeholder="请输入目的地"/>
      <van-field v-model="bedNumber" label="床号" placeholder="请输入床号"/>
      <van-field v-model="patientName"  label="病人姓名" placeholder="请输入病人姓名"/>
      <van-field v-model="patientNumber"  label="病人编号" placeholder="请输入病人编号"/>
      <van-field v-model="patientNumber"  label="病人编号" placeholder="请输入病人编号"/>
      <van-field v-model="vehicleOperation"  label="转运工具" placeholder="请输入转运工具"/>
      <van-field v-model="taskDescribe"  label="任务描述" placeholder="请输入任务描述"/>
      <van-field v-model="actualData"  label="实际数据" placeholder="请输入实际数据"/>
    </div>
    <div class="btn-area">
      <van-button type="default" @click="dispatchTaskSure">确认</van-button>
      <van-button type="default" @click="dispatchTaskCancel">取消</van-button>
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
      destinationAddress: '',
      bedNumber: '',
      patientName: '',
      patientNumber: '',
      vehicleOperation: '',
      taskDescribe: '',
      actualData: ''
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
      'transportTypeMessage'
    ])
  },

  mounted () {
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        this.$router.push({path: 'home'});
        this.changeTitleTxt({tit:'首页'});
        setStore('currentTitle','首页') 
      })
    }
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeDispatchTaskMessage'
    ]),
    // 返回上一页
    backTo () {
      this.$router.push({path: 'home'});
      this.changeTitleTxt({tit:'首页'});
      setStore('currentTitle','首页')
    },

    // 跳转我的页面
    skipMyInfo () {},

    // 调度信息确认事件
    dispatchTaskSure () {
      this.$router.push({path:'/home'});
      this.changeTitleTxt({tit:'首页'});
      setStore('currentTitle','首页')
    },

    // 调度信息取消事件
    dispatchTaskCancel () {
      this.$router.push({path:'/home'});
      this.changeTitleTxt({tit:'首页'});
      setStore('currentTitle','首页')
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
    .transport-type-title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
    };
    .transport-type-area {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      margin: 10px 0;
      width: 100%;
    }
    .btn-area {
      height: 50px;
      text-align: center;
      line-height: 50px;
    }
  }  
</style>
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
    <div class="circulation-task-condition-title">
      <h3>循环任务情况</h3>
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
       leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      liIndex: null,
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
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        this.$router.push({path:'/circulationTask'})
        this.changeTitleTxt({tit:'循环任务'});
        setStore('currentTitle','循环任务')
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
      this.$router.push({path:'/circulationTask'})
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
      .left-dropDown {
      .rightDropDown
    }
    .circulation-task-condition-title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      h3 {
        font-size: 14px;
        color: #1699e8
      }
    }
  }
</style>
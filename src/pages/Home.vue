<template>
  <div class="content-wrapper">
    <HeaderTop>
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <!-- <FooterBottom></FooterBottom>-->
  </div>
</template>
<script>
  import HeaderTop from '../components/HeaderTop'
  import FooterBottom from '../components/FooterBottom'
  import {getBatchNumber} from '../api/rubbishCollect.js'
  import NoData from '../components/NoData'
  import { mapGetters, mapMutations } from 'vuex'
  import { formatTime, setStore, getStore, removeStore, IsPC } from '@/common/js/utils'
  import {getDictionaryData} from '@/api/login.js'
  export default {
    components:{
      HeaderTop,
      NoData,
      FooterBottom
    },
    data() {
      return {
        currentActive: 0,
        leftDownShow: false,
        liIndex: null,
        leftDropdownDataList: ['退出登录'],
      }
    },
    
    mounted() {
      // 控制设备物理返回按键
      if (!IsPC()) {
        pushHistory();
        this.gotoURL(() => { 
        })
      }
    },

    beforeRouteLeave(to, from, next) {
    },
    
    computed:{
      ...mapGetters([
      ])
    },
    methods:{
      ...mapMutations([
      ]),

      juddgeIspc () {
        return IsPC()
      },

      // 返回上一页
      backTo () {
      },

    // 右边下拉框菜单点击
    leftLiCLick (index) {
      this.liIndex = index;
      this.$router.replace({name:'login'})
    },

    // 跳转到我的页面
    skipMyInfo () {
      this.leftDownShow = !this.leftDownShow;
    },

    //路由跳转
      routerSkip (name, text) {
      }
    }
  }
</script>
<style lang='less' scoped>
  @import "../common/stylus/variable.less";
  @import "../common/stylus/mixin.less";
  @import "../common/stylus/modifyUi.less";
  .content-wrapper {
    .content-wrapper();
    .content-middle {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      margin-top: 10px;
      padding: 6px
    }
    .content-header {
      height: 150px;
      img {
        width: 100%;
        height: 100%
      }
    }  
    .left-dropDown {
      .rightDropDown
    }
  }
</style>

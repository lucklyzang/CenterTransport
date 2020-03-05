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
    <!-- 内容部分 -->
    <div class="content-top">
      <div class="content-top-userName">
        <span class="user-name">姓名</span>
        <span class="real-name">张三</span>
      </div>
      <div class="wait-dask-wrapper">
        <p class="wait-dask-title">待办任务</p>
        <ul class="wait-dask-list">
          <li @click="dispatchEvent">调度任务 <span>1212</span></li>
          <li @click="circulationEvent">循环任务 <span>212</span></li>
          <li @click="appointEvent">预约任务 <span>22</span></li>
        </ul>
      </div>
      <div class="task-message">
        <span class="task-message-number">今日运送量：</span>
        <span class="task-message-rank">今日排名：</span>
      </div>
    </div>
    <div class="content-bottom">
      <div class="task-button">
        <div v-for="(item,index) in taskList" :key="index" @click="taskRouterSkip(item, index)">
          <van-button  type="default" size="large">{{item}}</van-button>
        </div>
      </div>
    </div>
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
        taskList: ['调度任务', '循环任务', '预约任务', '下班签退']
      }
    },
    
    mounted() {
      // 控制设备物理返回按键测试
      if (!IsPC()) {
        pushHistory();
        this.gotoURL(() => { 
        })
      }
    },

    beforeRouteLeave(to, from, next) {
      next()
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

      juddgeIspc () {
        return IsPC()
      },

      // 返回上一页
      backTo () {
      },
      
      // 路由跳转
      dispatchEvent () {
        this.$router.push({path:'/dispatchTask'});
        this.changeTitleTxt({tit:'调度任务'});
        setStore('currentTitle','调度任务')
      },

      circulationEvent () {
        this.$router.push({path:'/circulationTask'})
        this.changeTitleTxt({tit:'循环任务'});
        setStore('currentTitle','循环任务')
      },

      appointEvent () {
        this.$router.push({path:'/appointTask'});
        this.changeTitleTxt({tit:'预约任务'});
        setStore('currentTitle','预约任务')
      },

      // 右边下拉框菜单点击
      leftLiCLick (index) {
        this.liIndex = index;
        this.$router.replace({name:'login'})
      },

      // 跳转到我的页
      skipMyInfo () {
        this.leftDownShow = !this.leftDownShow;
      },

      //下面任务按钮路由跳转
      taskRouterSkip (name, index) {
        console.log(name,index);
        if (name === '调度任务') {
          this.$router.push({path:'/dispatchTask'});
          this.changeTitleTxt({tit:'调度任务'});
          setStore('currentTitle','调度任务')
        } else if (name === '循环任务') {
          this.$router.push({path:'/circulationTask'})
          this.changeTitleTxt({tit:'循环任务'});
          setStore('currentTitle','循环任务')
        } else if (name === '预约任务') {
          this.$router.push({path:'/appointTask'});
          this.changeTitleTxt({tit:'预约任务'});
          setStore('currentTitle','预约任务')
        } else {
        }
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
    .content-top {
      height: 120px;
      padding: 15px 10px;
      font-size: 14px;
      border: 1px solid #8ccbe8;
      .content-top-userName {
        .user-name {
          margin-right: 15px;
        }
      };
      .wait-dask-wrapper {
        margin: 14px 0;
        .wait-dask-list {
          margin-top : 6px;
          height: 30px;
          line-height: 30px;
          margin-left: -34px;
          li {
            display: inline-block;
            width: 32%;
            text-align: center;
            position: relative;
            border-right: 1px solid #9b9999;
            span {
              .repeat-sign(1px,-14px,45px,45px);
            }
            &:last-child {
              border-right: none
            }
          }
        }
      };
      .task-message {
        span {
          display: inline-block;
          width: 49%;
        }
      }
    };
    .content-bottom {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      margin-top: 10px;
      width: 100%;
      .task-button  {
        padding: 0 10px;
        > div {
          width:49%;
          display:inline-block;
          &:nth-child(3) {
            margin-top: 4px
          };
          &:nth-child(4) {
            margin-top: 4px
          };
          &:nth-child(odd) {
            margin-right: 4px
          }
        }
      }
    };  
    .left-dropDown {
      .rightDropDown
    }
  }
</style>

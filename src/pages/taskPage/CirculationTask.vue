<template>
  <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="circultion-task-title">
      <h3>循环任务</h3>
    </div>
    <div class="circulation-task-list">
      <ul>
        <li :class="{'officeNameStyle':currentOfficeName == index}" v-for="(item, index) in circulationTaskList" :key="`${item.key}-${index}`" @click="officeTaskEvent(item,index)">{{item.officeName}}</li>
      </ul>
    </div>
    <div class="circultion-task-btn">
      <van-button type="default" @click="circulationConditionEvent">循环情况</van-button>
      <van-button type="default">送达</van-button>
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
        circulationTaskList: [
          {key: 1, officeName: '产科'},
          {key: 2, officeName: '儿科'},
          {key: 3, officeName: '内科'},
        ],
        currentOfficeName: ''
      };
    },

    components: {
      HeaderTop,
      NoData,
      FooterBottom
    },

    computed: {
      ...mapGetters([
        'navTopTitle',
      ])
    },

    mounted () {
      // 控制设备物理返回按键测试
      if (!IsPC()) {
        pushHistory();
        this.gotoURL(() => {
          this.changeTitleTxt({tit:'中央运送'});
          setStore('currentTitle','中央运送') 
        })
      }
    },

    methods: {
      ...mapMutations([
        'changeTitleTxt',
        'changeCirculationTaskMessage'
      ]),
      // 跳转到我的页
      skipMyInfo () {
      },

      // 返回上一页
      backTo () {
        this.$router.push({path: 'home'});
        this.changeTitleTxt({tit:'中央运送'});
        setStore('currentTitle','中央运送')
      },

      // 科室任务点击
      officeTaskEvent (item,index) {
        this.currentOfficeName = index;
        this.$router.push({'path':'/circulationTaskSweepCode'});
        this.changeTitleTxt({tit:'扫码'});
        setStore('currentTitle','扫码');
        // 改变调度具体某一任务的信息状态
        this.changeCirculationTaskMessage({DtMsg: item});
        setStore('currentCirculationTaskMessage',item);
      },

      // 循环情况事件
      circulationConditionEvent () {
        this.$router.push({path: 'circulationTaskCondition'});
        this.changeTitleTxt({tit:'循环情况'});
        setStore('currentTitle','循环情况')
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
    .circultion-task-title {
      margin-top: 10px;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      h3 {
        width: 20%;
        text-align: center;
        background: pink
      }
    };
    .circulation-task-list {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      margin-top: 10px;
      width: 100%;
      ul {
        height: 100%;
        padding-left: 10px;
        li {
          line-height: 30px
        };
        .officeNameStyle {
          color: blue
        }
      }
    };
    .circultion-task-btn {
      text-align: center;
      height: 50px;
    }
  }
</style>
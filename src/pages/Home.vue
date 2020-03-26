<template>
  <div class="content-wrapper">
    <!-- 工作人员操作区域 -->
    <div class="worker-show" v-if="workerShow">
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
          <span class="content-top-userName-img">
            <img :src="defaultPersonPng" alt="">
          </span>
          <span class="real-name">{{userName}}</span>
        </div>
        <div class="wait-dask-wrapper">
          <p class="wait-dask-title">待办任务：</p>
          <ul class="wait-dask-list">
            <li v-show="dispatchTaskNumber !== 0" @click="dispatchEvent">调度任务 <span class="dask-list-sign">{{dispatchTaskNumber}}</span></li>
            <li v-show="circulationTaskNumber !== 0" @click="circulationEvent">循环任务 <span class="dask-list-sign">{{circulationTaskNumber}}</span></li>
            <li v-show="appointTaskNumber !== 0" @click="appointEvent">预约任务 <span class="dask-list-sign">{{appointTaskNumber}}</span></li>
          </ul>
        </div>
      </div>
      <div class="content-middle-task-message">
        <div class="task-message-number-wrapper">
          <div class="task-message-number">
            <p class="task-message-img">
              <img :src="homeBannerPng" alt="">
            </p>
            <p class="transport-day-number">
              <span class="current-day-message-tit">昨日运送量</span>
              <span>{{yesterdayNumber}}</span>
            </p>
            <p class="transport-day-rank">
              <span>昨日排名</span>
              <span>{{yesterdayRank}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="content-bottom">
        <ul class="task-button">
          <li v-for="(item,index) in taskList" :key="index" @click="taskRouterSkip(item.tit, index)">
            <p class="task-button-wrapper">
              <img :src="btnTaskWrapperPng" alt="">
            </p>
            <p class="task-btn-img">
              <img :src="item.imgUrl" alt="">
            </p>
            <p  class="task-btn-tit">{{item.tit}}</p>
          </li>
        </ul>
      </div>
    </div>
    <!-- 医护人员操作区域 -->
    <div class="medical-worker-show" v-else>
      <!-- 顶部导航栏 -->
      <HeaderTop :title="navTopTitle">
        <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
        <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
      </HeaderTop>
       <!-- 右边下拉框菜单 -->
      <ul class="left-dropDown" v-show="leftDownShow">
        <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
      </ul>
      <div class="medical-worker-operate">
        <div class="medical-worker-operate-left">
          <div class="medical-worker-operate-list">
            <div class="medical-worker-operate-list-inner" :class="{'operate-list-inner-style': operateListInnerIndex == index}" v-for="(item,index) in operateList" :key="index" @click="operateListEvent(item,index)">
              <p class="operate-list-img">
                <img :src="operateListInnerIndex == index ? item.imgUrlChecked : item.imgUrl" alt="">
              </p>
              <p class="operate-list-tit">{{item.tit}}</p>
            </div>
          </div>
        </div>
        <div class="medical-worker-operate-right">
          <div class="medical-worker-operate-right-message" v-show="operateMessage == 1">
            <p>消息</p>
          </div>
          <div class="medical-worker-operate-right-callOut" v-show="operateCallOut == 2">
            <p class="medical-worker-transport-type">运送类型</p>
            <div class="medical-worker-task-list" v-for="(item,index) in medicalTransportTypeList" :key="index" @click="transportTypeEvent(item,index)">
              {{item}}
            </div>
          </div>
          <div class="medical-worker-operate-right-taskTrace" v-show="operateTaskTrace == 3">
            <p>任务跟踪</p>
          </div>
          <div class="medical-worker-operate-right-historyTask" v-show="operateHistoryTask == 4">
            <p>历史任务</p>
          </div>
          <div class="medical-worker-operate-right-taskCollect" v-show="operateTaskCollect == 5">
            <p>收藏</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import HeaderTop from '../components/HeaderTop'
  import FooterBottom from '../components/FooterBottom'
  import {getAllTaskNumber, queryAllTaskMessage} from '@/api/workerPort.js'
  import NoData from '@/components/NoData'
  import { mapGetters, mapMutations } from 'vuex'
  import { formatTime, setStore, getStore, removeStore, IsPC } from '@/common/js/utils'
  import {getDictionaryData} from '@/api/login.js'
  import dispatchTaskPng from '@/common/images/home/dispatch-task.png'
  import circulationTaskPng from '@/common/images/home/circulation-task.png'
  import offWorkSignOutPng from '@/common/images/home/offWork-signOut.png'
  import appointTaskPng from '@/common/images/home/appoint-task.png'
  import medicalMessagePng from '@/common/images/home/medical-message.png'
  import medicalCallPng from '@/common/images/home/medical-call.png'
  import taskTailPng from '@/common/images/home/task-tail.png'
  import historyTaskPng from '@/common/images/home/history-task.png'
  import medicalCollectPng from '@/common/images/home/medical-collect.png'
  import medicalMessageCheckedPng from '@/common/images/home/medical-message-checked.png'
  import medicalCallCheckedPng from '@/common/images/home/medical-call-checked.png'
  import taskTailCheckedPng from '@/common/images/home/task-tail-checked.png'
  import historyTaskCheckedPng from '@/common/images/home/history-task-checked.png'
  import medicalCollectCheckedPng from '@/common/images/home/medical-collect-checked.png'
  export default {
    components:{
      HeaderTop,
      NoData,
      FooterBottom
    },
    data() {
      return {
        leftDownShow: false,
        dispatchTaskNumber: '',
        circulationTaskNumber: '',
        appointTaskNumber: '',
        workerShow: true,
        liIndex: null,
        operateListInnerIndex: '',
        yesterdayNumber: '',
        yesterdayRank: '',
        leftDropdownDataList: ['退出登录'],
        taskList: [
          {tit:'调度任务',imgUrl: dispatchTaskPng}, 
          {tit:'循环任务',imgUrl: circulationTaskPng}, 
          {tit:'预约任务',imgUrl: appointTaskPng},
          {tit:'下班签退',imgUrl: offWorkSignOutPng}
        ],
        operateList: [
          {tit:'消息', imgUrl: medicalMessagePng, imgUrlChecked:medicalMessageCheckedPng},
          {tit:'呼叫', imgUrl: medicalCallPng, imgUrlChecked:medicalCallCheckedPng},
          {tit:'任务跟踪', imgUrl: taskTailPng, imgUrlChecked:taskTailCheckedPng},
          {tit:'历史任务', imgUrl: historyTaskPng, imgUrlChecked:historyTaskCheckedPng},
          {tit:'收藏', imgUrl: medicalCollectPng, imgUrlChecked:medicalCollectCheckedPng}
        ],
        medicalTransportTypeList: ['药品运送','标本运送','血液采集'],
        operateMessage: 1,
        operateCallOut: '',
        operateTaskTrace: '',
        operateHistoryTask: '',
        operateTaskCollect: '',
        defaultPersonPng: require('@/common/images/home/default-person.png'),
        homeBannerPng: require('@/common/images/home/home-banner.png'),
        btnTaskWrapperPng: require('@/common/images/home/btn-background.png')
      }
    },
    
    mounted() {
      console.log('用户信息',this.userInfo);
      // 控制设备物理返回按键测试
      if (!IsPC()) {
        pushHistory();
        this.gotoURL(() => { 
        })
      };
      // 查询任务数量
      if (this.userTypeId == 0) {
        this.queryAllTaskNumber(this.proId, this.workerId);
        this.getAllTaskMessage();
        this.changeTitleTxt({tit:'中央运送'});
        setStore('currentTitle','中央运送'); 
      };
    },
    
    watch: {
      userTypeId: {
        handler(newName, oldName) {
          if (newName == 0) {
            this.workerShow = true
          } else {
            this.workerShow = false
          }
        },
        immediate: true,
        deep: true
      }
    },
    activated () {
      if (this.isHomeJumpOtherPage) {
        if (!this.isRefershHome) {
          window.location.reload()
        }
      } else {
        if (this.userTypeId == 0) {
          // 查询任务数量
          this.queryAllTaskNumber(this.proId, this.workerId);
          this.getAllTaskMessage();
          this.changeTitleTxt({tit:'中央运送'});
          setStore('currentTitle','中央运送'); 
        }
      }  
    },

    beforeRouteLeave(to, from, next) {
      next()
    },
    
    computed:{
      ...mapGetters([
        'navTopTitle',
        'isRefershHome',
        'isHomeJumpOtherPage',
        'userType',
        'userInfo'
      ]),
      userName () {
       return this.userInfo.extendData.userName
      },
      userTypeId () {
        return this.userInfo.extendData.user_type_id
      },

      proId () {
        return this.userInfo.extendData.proId
      },

      workerId () {
        return this.userInfo.extendData.userId
      }
    
    },
    methods:{
      ...mapMutations([
        'changeTitleTxt',
        'changetransportTypeMessage'
      ]),

      juddgeIspc () {
        return IsPC()
      },

      // 返回上一页
      backTo () {
      },

      /**
       * 工作人员代码
      */

      // 查询所有任务数量
      queryAllTaskNumber (proID, workerId) {
        getAllTaskNumber(proID, workerId)
        .then(res => {
          if (res && res.data.code == 200) {
            if (res.data.data) {
              this.dispatchTaskNumber = res.data.data.transTask,
              this.circulationTaskNumber = res.data.data.circleTask,
              this.appointTaskNumber = res.data.data.resTask
            }
          }
        })
        .catch((err) => {

        })
      },

      //查询完成任务数量和排名
      getAllTaskMessage () {
        queryAllTaskMessage({proId: this.proId, // 项目ID 必输
                            workerId: this.workerId, //运送员ID   非必输
                            date: ''  })
        .then((res) => {
          if (res && res.data.code == 200) {
            if (res.data.data) {
              let needPersonMessage = res.data.data.filter((item) => {return item['workerId'] == this.workerId});
              this.yesterdayNumber = needPersonMessage[0].totalCount;
              this.yesterdayRank = needPersonMessage[0].rank
            }
          }
        })
        .catch((err) => {

        })
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
        localStorage.clear();
        this.$router.push({path:'/'})
      },

      // 跳转到我的页
      skipMyInfo () {
        this.leftDownShow = !this.leftDownShow;
      },

      //下面任务按钮路由跳转
      taskRouterSkip (name, index) {
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
      },

      /**
       * 医务人员代码
      */

      // 左边列表点击
      operateListEvent (item,index) {
        this.operateListInnerIndex = index;
        if (index == 0) {
          this.operateMessage = 1;
          this.operateCallOut = '';
          this.operateTaskTrace = '';
          this.operateHistoryTask = '';
          this.operateTaskCollect = ''
        } else if (index == 1) {
          this.operateMessage = '';
          this.operateCallOut = 2;
          this.operateTaskTrace = '';
          this.operateHistoryTask = '';
          this.operateTaskCollect = ''
        } else if (index == 2) {
          this.operateMessage = '';
          this.operateCallOut = '';
          this.operateTaskTrace = 3;
          this.operateHistoryTask = '';
          this.operateTaskCollect = ''
        } else if (index == 3) {
          this.operateMessage = '';
          this.operateCallOut = '';
          this.operateTaskTrace = '';
          this.operateHistoryTask = 4;
          this.operateTaskCollect = ''
        } else if (index == 4) {
          this.operateMessage = '';
          this.operateCallOut = '';
          this.operateTaskTrace = '';
          this.operateHistoryTask = '';
          this.operateTaskCollect = 5
        }
      },

      // 运送类型点击
      transportTypeEvent (item) {
        this.$router.push({path:'/transportTypeMessage'});
        this.changeTitleTxt({tit:'运送类型详情'});
        setStore('currentTitle','运送类型详情');
        this.changetransportTypeMessage({DtMsg: item});
        setStore('currentTransportTypeMessage',item);
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
    .worker-show {
      .content-wrapper();
      .content-top {
        padding: 15px 0;
        font-size: 14px;
        color: #fff;
        background-image: linear-gradient(to bottom, #2895ea, #5173f8);
        .content-top-userName {
          padding-left: 10px;
          height: 60px;
          .content-top-userName-img {
            display: inline-block;
            width: 35px;
            height: 35px;
            vertical-align: middle;
            margin-right: 8px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .real-name {
          }
        };
        .wait-dask-wrapper {
          padding-left: 10px;
          .wait-dask-title {
             font-size: 16px;
          }
          .wait-dask-list {
            margin-top : 6px;
            height: 50px;
            line-height: 50px;
            font-size: 18px;
            li {
              display: inline-block;
              width: 32%;
              text-align: left;
              position: relative;
              .dask-list-sign {
                .status-sign(50px,50px,orange)
              }
            }
          }
        };
      };
      .content-middle-task-message {
        height: 100px;
        background: #f2f2f2;
        padding: 8px 0;
        .task-message-number-wrapper {
          height: 100%;
          position: relative;
          box-sizing: border-box;
          .task-message-img {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            img {
              width: 100%;
              height: 100%;
            }
          };
          .task-message-number {
            height: 100%;
            box-sizing: border-box;
            font-size: 13px;
            color: #434343;
            padding: 28px 70px;
            .transport-day-number {
              height: 100%;
              width: 49%;
              display: inline-block;
              position: relative;
              span {
                position: absolute;
                left: 0;
                &:first-child {
                  top: 0
                };
                &:last-child {
                  bottom: 0;
                  font-size: 22px;
                  color: #2499e9
                }
              }
            }
            .transport-day-rank {
              height: 100%;
              width: 49%;
              display: inline-block;
              position: relative;
              span {
                position: absolute;
                right: 0;
                &:first-child {
                  top: 0
                };
                &:last-child {
                  bottom: 0;
                  font-size: 22px;
                  color: #fa8118;
                  right: 26px;
                }
              }
            }
          }
        }
      }
      .content-bottom {
        flex:1;
        overflow: auto;
        margin: 0 auto;
        margin-top: 10px;
        width: 100%;
        .task-button  {
          padding: 0 10px;
          li {
            width:49.5%;
            height: 120px;
            border-radius: 4px;
            display:inline-block;
            text-align: center;
            padding-top: 30px;
            box-sizing: border-box;
            position: relative;
            .task-button-wrapper {
              width: 100%;
              height: 120px;
              position: absolute;
              top: 0;
              left: 0;
              z-index: -1;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .task-btn-img {
              width: 40px;
              height: 40px;
              margin: 0 auto;
              img {
                width: 100%;
                height: 100%;
              }
            };
            .task-btn-tit {
              color: #1d221e;
              font-size: 13px;
              margin-top: 10px;
            }
            &:nth-child(3) {
              margin-top: 4px
            };
            &:nth-child(4) {
              margin-top: 4px
            };
            &:nth-child(odd) {
              margin-right: 1%
            }
          }
        }
      };  
      .left-dropDown {
        .rightDropDown
      }
    }
    .medical-worker-show {
      .content-wrapper();
      .medical-worker-operate {
        font-size: 14px;
        flex:1;
        display: flex;
        overflow: auto;
        margin: 0 auto;
        width: 100%;
        >div {
          display: inline-block
        }
        .medical-worker-operate-left {
          flex: 24%;
          background: #3a4862;
          .medical-worker-operate-list {
            height: 100%;
            .medical-worker-operate-list-inner {
              height: 90px;
              padding-top: 20px;
              box-sizing: border-box;
              text-align: center;
              border-bottom: 1px solid #fff;
              background: #3a4862;
              .operate-list-img {
                margin: 0 auto;
                width: 30px;
                height: 30px;
                margin-bottom: 10px;
                img {
                  width: 100%;
                  height: 100%
                }
              };
              .operate-list-tit {
                color: #fff;
                font-size: 12px;
              }
            };
            .operate-list-inner-style {
              background: #15c4f9 !important;
            };
          }
        };
        .medical-worker-operate-right {
          flex: 76%;
          padding: 10px;
          > div {
            > p {
              height: 30px;
              font-size: 15px;
              line-height: 30px;
              margin-bottom: 10px;
            }
            .medical-worker-task-list {
               line-height: 30px;
               background: #15c4f9;
               margin-bottom: 4px;
               color: #fff;
               padding-left: 5px;
               box-sizing: border-box
            }
          }
        }
      }
    }
  }
</style>

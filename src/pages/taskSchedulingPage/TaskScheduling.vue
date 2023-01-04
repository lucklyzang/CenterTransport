<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <!-- 右侧菜单 -->
    <van-popup v-model="rightMenuShow" position="right" :style="{ width: '60%', height: '100%' }">
        <div class="top-icon">
            <img :src="switchHiddenPng" alt="切换隐藏" @click="switchHiddenEvent">
        </div>
        <div class="center-content">
            <div class="function-list" :class="{'functionListStyle': functionListIndex == index}" v-for="(item, index) in taskList" :key="index" @click="taskRouterSkip(item.tit,index)">
                {{ item.tit }}
            </div>
        </div>
        <div class="signout-box" @click="signOutEvent">
            下班签退
        </div>
    </van-popup>
    <div class="nav">
       <van-nav-bar
        title="中央运送任务管理"
        left-text=""
        :left-arrow="true"
        :placeholder="true"
        :border="false"
        :fixed="true"
        z-index="1000"
        :safe-area-inset-top="true"
        @click-left="onClickLeft"
    >
        <template #right>
            <img :src="switchShowPng" alt="切换显示" @click="onClickRight">
        </template>
    </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
			<img :src="statusBackgroundPng" />
		</div>
        <div class="content-box" ref="contentBox">
            <van-tabs v-model="activeName" type="card" color="#fff" title-inactive-color="#9E9E9A" title-active-color="#174E97" @change="vanTabsChangeEvent">
                <van-tab title="调度任务" name="dispatchTask">
                    <van-empty description="暂无数据" v-show="dispatchEmptyShow" />
                    <div class="backlog-task-list-box" ref="scrollDispatchTask" v-show="!dispatchEmptyShow">
                        <div class="backlog-task-list" v-for="(item,index) in dispatchTaskList" :key="index">
                        </div>
                        <div class="no-more-data" v-show="isShowDispatchTaskNoMoreData">没有更多数据了</div>
                    </div>    
                </van-tab>
                <van-tab title="预约任务" name="appointTask">
                    <van-empty description="暂无数据" v-show="appointTaskEmptyShow" />
                    <div class="backlog-task-list-box" ref="scrollAppointTask" v-show="!appointTaskEmptyShow">
                        <div class="backlog-task-list" v-for="(item,index) in appointTaskList" :key="index">
                        </div>
                        <div class="no-more-data" v-show="isShowAppointTaskNoMoreData">没有更多数据了</div>
                    </div>    
                </van-tab>
            </van-tabs>
        </div>
    </div> 
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { userSignOut } from '@/api/workerPort.js'
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
 import { setStore,removeAllLocalStorage } from '@/common/js/utils'
export default {
  name: "TaskScheduling",
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      moveInfo: {
        startX: ''
      },
      functionListIndex: 0,
      overlayShow: false,
      rightMenuShow: false,
      dispatchEmptyShow: false,
      appointTaskEmptyShow: false,
      isShowDispatchTaskNoMoreData: false,
      isShowAppointTaskNoMoreData: false,
      activeName: 'dispatchTask',
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      switchShowPng: require("@/common/images/home/switch-show.png"),
      switchHiddenPng: require("@/common/images/home/switch-hidden.png"),
      taskList: [
        {tit:'调度管理'},
        {tit:'调度任务'},
        {tit:'预约任务'},
        {tit:'循环任务'}
      ],
      dispatchTaskList: [],
      appointTaskList: []
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn('/home');
    this.$nextTick(()=> {
        try {
            this.initScrollChange();
            this.registerSlideEvent()
        } catch (error) {
            this.$toast({
                type: 'fail',
                message: error
            })
        }
    })
  },

  beforeRouteEnter(to, from, next) {
    next(vm=>{
      if (from.path == '/home') {
        // vm.queryTaskList(1)
      } else {
        if (vm.taskType.taskTypeName) {
            vm.activeName = vm.taskType.taskTypeName
        };
        // vm.queryTaskList(vm.taskType.taskTypeName ? vm.taskType.taskTypeName == 'dispatchTask' ? 1 : 4 : 1)
      }
	});
    next() 
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","taskType"]),
    proId () {
        return this.userInfo.extendData.proId
    }
  },

  methods: {
    ...mapMutations(["changeTaskType","changeTitleTxt","changeCatchComponent","changeOverDueWay"]),

     onClickLeft() {
      this.$router.push({ path: "/home"})
    },

    // 注册滑动事件  
    registerSlideEvent () {
        this.$refs.contentBox.addEventListener('touchstart',this.touchstartHandle,false);
        this.$refs.contentBox.addEventListener('touchmove',this.touchmoveHandle,false)
    },

    // 滑动开始
    touchstartHandle() {
        //判断是否在滑动区域内滑动
        let e = e || window.event;
        if (e.targetTouches.length == 1) {
            this.isSlideArea = true;
            this.moveInfo.startX = parseInt(e.targetTouches[0].clientX)
        }    
    },

    // 滑动中
    touchmoveHandle() {
        let e = e || window.event;
        if (e.targetTouches.length == 1) {
        // 滑动距离
        let moveX = parseInt((e.targetTouches[0].clientX - this.moveInfo.startX));
        //左滑(根据左右滑动来控制右侧菜单的显示与隐藏)
        if (moveX < 0) {
            this.rightMenuShow = true
        } else {
            this.rightMenuShow = false
        };
        e.preventDefault();
        }        
    },

    // 切换显示右侧菜单事件
    onClickRight () {
        this.rightMenuShow = true
    },

    // 切换隐藏右侧菜单事件
    switchHiddenEvent () {
        this.rightMenuShow = false
    },

    // 右侧菜单任务列表点击事件
    taskRouterSkip (name, index) {
        this.functionListIndex = index;
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
        } else if (name === '任务调度') {
          this.$router.push({path:'/taskScheduling'});
          this.changeTitleTxt({tit:'中央运送任务管理'});
          setStore('currentTitle','中央运送任务管理')
        }
      },

      // 下班签退事件
      signOutEvent () {
          this.$dialog.alert({
            message: '确定签退?',
            closeOnPopstate: true,
            showCancelButton: true
          }).then(() => {
            this.userLoginOut(this.proId, this.userInfo.userName)
          })
          .catch(() => {
          })
      },

      // 用户签退
      userLoginOut (proId,workerId) {
        this.changeOverDueWay(true);
        setStore('storeOverDueWay',true);
        userSignOut(proId,workerId).then((res) => {
          if (res && res.data.code == 200) {
            removeAllLocalStorage();
            this.changeCatchComponent([]);
            this.$router.push({path:'/'})
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
            this.changeOverDueWay(false);
            setStore('storeOverDueWay',false);
          }
        }).
        catch((err) => {
          this.changeOverDueWay(false);
          setStore('storeOverDueWay',false);
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },


    // 任务状态转换
    taskStatusTransition (num) {
        switch(num) {
            case 1 :
                return '未开始'
                break;
            case 2 :
                return '进行中'
                break;
            case 3 :
                return '待签字'
                break;
            case 4 :
                return '已完成'
                break;
        }
    },

    // 元素滚动事件
    initScrollChange () {
        // 待办任务列表下拉
        if (this.activeName == 'dispatchTask') {
            let boxBackScroll = this.$refs['scrollDispatchTask'];
            boxBackScroll.addEventListener('scroll',(e)=> {
                if (Math.ceil(e.srcElement.scrollTop) + e.srcElement.offsetHeight >= e.srcElement.scrollHeight) {
                    console.log('待办滚动了',e.srcElement.scrollTop, e.srcElement.offsetHeight, e.srcElement.scrollHeight)
                }
            },true)
        }

        // 完成任务列表下拉
        if (this.activeName == 'appointTask') {
            let boxCompleteteScroll = this.$refs['scrollAppointTask'];
            boxCompleteteScroll.addEventListener('scroll',(e)=> {
                if (Math.ceil(e.srcElement.scrollTop) + e.srcElement.offsetHeight >= e.srcElement.scrollHeight) {
                    console.log('完成滚动了',e.srcElement.scrollTop, e.srcElement.offsetHeight, e.srcElement.scrollHeight)
                }
            },true)
        }    
    },

    // 获取任务列表
    queryTaskList (value) {
        console.log(value);
        this.loadingShow = true;
        this.overlayShow = true;
        this.backlogEmptyShow = false;
        this.completedEmptyShow = false;
		getAllTaskList({proId : this.userInfo.proIds[0], workerId: this.userInfo.id})
        .then((res) => {
            this.loadingShow = false;
            this.overlayShow = false;
        if (res && res.data.code == 200) {
            if (value == 1) {
                this.dispatchTaskList = res.data.data.filter((item) => { return item.state == value || item.state == 2 || item.state == 3 });
                if (this.dispatchTaskList.length == 0) {
                    this.backlogEmptyShow = true
                }
            } else if (value == 4) {
                this.completedTaskList = res.data.data.filter((item) => { return item.state == value});
                if (this.completedTaskList.length == 0) {
                    this.completedEmptyShow = true
                }
            }
        } else {
          this.$toast({
            type: 'fail',
            message: res.data.msg
          })
        }
      })
      .catch((err) => {
        this.loadingShow = false;
        this.overlayShow = false;
        this.$toast({
          type: 'fail',
          message: err
        })
      })
    },

    // tab切换值变化事件
    vanTabsChangeEvent (value) {
        console.log(this.activeName);
        let temporaryText;
        if (value == 'dispatchTask') {
            temporaryText = 1;
        } else if (value == 'appointTask') {
            temporaryText = 4
        };
        // this.queryTaskList(temporaryText);
        this.$nextTick(()=> {
            this.initScrollChange()
        })
    }
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  .content-wrapper();
  /deep/ .van-popup--right {
    padding: 20px 0 80px 0;
    box-sizing: border-box;
    .top-icon {
        padding-left: 10px;
        box-sizing: border-box
    };
    .center-content {
        margin-top: 20px;
        .function-list {
            width: 153px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            margin: 0 auto;
            border: 1px solid #3B9DF9;
            box-sizing: border-box;
            font-size: 16px;
            color: #3B9DF9;
            border-radius: 8px;
            margin-bottom: 20px
        };
        .functionListStyle {
            color: #fff !important;
            border: none !important;
            background: #3B9DF9 !important
        }
    };
    .signout-box {
        position: absolute;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        width: 153px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #E86F50;
        font-size: 16px;
        color: #fff;
        border-radius: 8px
    }
  };
  .nav {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 10;
    left: 0;
    /deep/ .van-nav-bar {
        background: transparent;
        .van-nav-bar__left {
            .van-nav-bar__text {
                color: #fff !important;
                margin-left: 8px !important;
            }
        };
        .van-nav-bar__right {
            .van-nav-bar__text {
                font-weight: bold !important
            }
        }
        .van-icon {
            color: #fff !important;
            font-size: 22px !important;
        }
        .van-nav-bar__title {
            color: #fff !important;
            font-size: 16px !important;
        }
    }
  };
  /deep/ .van-loading {
    z-index: 1000000
  };  
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 0;
    .content-top-area {
      width: 100%;
      margin: 0 auto;
      height: 189px;
      position: absolute;
      top: 0;
      left: 0;
      > img {
        width: 100%;
        height: 100%
      }
    };
    .content-box {
        flex: 1;
        margin-top: 50px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        /deep/ .van-tabs {
            flex: 1;
            display: flex;
            flex-direction: column;
            height: 0;
            background: #f7f7f7;
            .van-tabs__wrap {
                height: 0.8rem;
                padding: 10px 0;
                .van-tabs__nav {
                    background: #f7f7f7 !important;
                    .van-tab {
                        border-radius: 4px
                    }
                }
            };
            .van-tabs__content {
                flex: 1;
                padding: 0 4px 0px 4px;
                box-sizing: border-box;
                background: #f7f7f7;
                overflow: scroll;
                .van-tab__pane {
                    height: 100%;
                    position: relative;
                    .van-empty {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%,-50%)
                    };
                    .backlog-task-list-box {
                        overflow: scroll;
                        height: 100%;
                        .backlog-task-list {
                            padding: 0 8px 4px 8px;
                            box-sizing: border-box;
                            height: 100px;
                            border-radius: 6px;
                            background: #fff;
                            box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.23);
                            margin-bottom: 10px;
                        };
                        .no-more-data {
                            font-size: 12px;
                            color: #BEC7D1;
                            width: 100%;
                            text-align: center;
                            line-height: 30px
                        }
                    }
                }        
            }
        }
    }
  }
}
</style>
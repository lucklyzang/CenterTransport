<template>
  <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="circultion-task-title">
      <h3>循环任务列表</h3>
    </div>
    <div class="circulation-task-list">
       <div class="wait-handle-list" v-for="(item,index) in circulationTaskList" :key="index" @click="officeTaskEvent(item)">
         <div class="view-office" @click.stop="viewOfficeHandle(item)">{{item.show == true ? '隐藏科室' : '显示科室'}}</div>
        <p class="wait-handle-message-createTime">
          创建时间：{{item.createTime}}
        </p>
        <p class="wait-handle-message-createTime">
          开始时间：{{item.startTime}}
        </p>
        <div class="wait-handle-message">
          <div class="handle-message-line-wrapper">
            <p>
              <span class="message-tit">医院:</span>
              <span class="message-tit-real">{{item.proName}}</span>
            </p>
            <P>
              <span class="message-tit">科室:</span>
              <span class="message-tit-real">{{item.officeName}}</span>
            </P>
          </div>
          <div class="handle-message-line-wrapper">
            <p>
              <span class="message-tit">任务名称:</span>
              <span class="message-tit-real">{{item.taskTypeName}}</span>
            </p>
            <p>
              <span class="message-tit">工作人员:</span>
              <span class="message-tit-real">{{item.workerName}}</span>
            </p>
          </div>
          <div class="handle-message-line-wrapper">
            <p>
              <span class="message-tit">状态:</span>
              <span class="message-tit-real">{{stateTransfer(item.state)}}</span>
            </p>
            <p>
              <span class="message-tit">优先级:</span>
              <span class="message-tit-real">{{priorityTransfer(item.priority)}}</span>
            </p>
          </div>
        </div>
        <div class="wait-handle-office-list" v-show="item.show">
          <ul>
            <li v-for="(val, key, index) in JSON.parse(item.spaces)" :key="index">{{val}}</li>
          </ul>
      </div>
      </div>
    </div>
    <div class="circultion-task-btn">
      <van-button type="info" @click="circulationConditionEvent">循环情况</van-button>
      <van-button type="default">送达</van-button>
    </div>
  </div>
</template>

<script>
  import HeaderTop from '@/components/HeaderTop'
  import FooterBottom from '@/components/FooterBottom'
  import {queryCirculationTask} from '@/api/workerPort.js'
  import NoData from '@/components/NoData'
  import { mapGetters, mapMutations } from 'vuex'
  import { formatTime, setStore, getStore, removeStore, IsPC } from '@/common/js/utils'
  import {getDictionaryData} from '@/api/login.js'
  export default {
    data () {
      return {
        circulationTaskList: [],
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
      ]),
      proId () {
        return JSON.parse(getStore('userInfo')).extendData.proId
      },
      workerId () {
        return JSON.parse(getStore('userInfo')).extendData.userId
      }
    },

    mounted () {
      // 控制设备物理返回按键测试
      if (!IsPC()) {
        pushHistory();
        this.gotoURL(() => {
          this.$router.push({path: 'home'});
          this.changeTitleTxt({tit:'中央运送'});
          setStore('currentTitle','中央运送') 
        })
      };
      // 查询循环任务
      this.getCirculationTask({
        proId: this.proId,  //医院ID，必输
        workerId: this.workerId,   //运送员ID
        states: [], //查询状态
        startDate: '',  //起始日期  YYYY-MM-dd
        endDate: ''  //终止日期  格式 YYYY-MM-dd
      })
    },

    methods: {
      ...mapMutations([
        'changeTitleTxt',
        'changeCirculationTaskMessage'
      ]),

      // 跳转到我的页
      skipMyInfo () {
      },

      // 查看科室事件
      viewOfficeHandle (item) {
        item.show = !item.show;
      },

      // 任务优先级转换
      priorityTransfer (index) {
        switch(index) {
          case 1 :
            return '正常'
            break;
          case 2 :
            return '重要'
            break;
          case 3 :
            return '紧急'
            break;
          case 4 :
            return '紧急重要'
            break;
          default:
            return '无'
        }
      },

      // 任务状态转换
      stateTransfer (index) {
        switch(index) {
          case 0 :
            return '未分配'
            break;
          case 1 :
            return '未查阅'
            break;
          case 2 :
            return '未开始'
            break;
          case 3 :
            return '进行中'
            break;
          case 4 :
            return '未结束'
            break;
          case 5 :
            return '已延迟'
            break;
          case 6 :
            return '已取消'
            break;
          case 7 :
            return '已完成'
            break;
        }
      },

      // 查询循环任务
      getCirculationTask (data) {
        queryCirculationTask(data).then((res) => {
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              for (let item of res.data.data)
                this.circulationTaskList.push({
                  createTime: item.createTime,
                  startTime: item.startTime,
                  proName: item.proName,
                  officeName: item.proName,
                  taskTypeName: item.taskTypeName,
                  workerName: item.workerName,
                  state: item.state,
                  priority: item.priority,
                  taskNumber: item.taskNumber,
                  spaces: item.spaces,
                  show: false
                })
            } else {
              this.$dialog.alert({
                message: '当前没有要循环的任务',
                closeOnPopstate: true
              }).then(() => {
              });
            }
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },

      // 返回上一页
      backTo () {
        this.$router.push({path: 'home'});
        this.changeTitleTxt({tit:'中央运送'});
        setStore('currentTitle','中央运送')
      },

      // 科室任务列表点击
      officeTaskEvent (item,index) {
        this.currentOfficeName = index;
        this.$router.push({'path':'/circulationTaskSweepCode'});
        this.changeTitleTxt({tit:'扫码'});
        setStore('currentTitle','扫码');
        // 改变循环具体某一任务的信息状态
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
      height: 30px;
      line-height: 30px;
      margin-top: 10px;
      h3 {
        font-size: 15px;
        padding-left: 10px
      }
    };
    .circulation-task-list {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      margin-top: 10px;
      width: 100%;
      .wait-handle-list {
        box-sizing: border-box;
        position: relative;
        padding-bottom: 10px;
        box-sizing: border-box;
        .wait-handle-message-createTime {
          border-top: 1px solid #e3ece9;
          padding-left: 30px;
          background: #ececec;
          height: 24px;
          line-height: 24px;
          font-size: 12px;
          color: #7f7d7d
        };
        .wait-handle-message {
          margin-left: 30px;
          font-size: 12px;
          padding-top: 15px;
          padding-bottom: 15px;
          box-sizing: border-box;
          .handle-message-line-wrapper {
            p {
              margin-bottom: 10px;
              width: 47%;
              display: inline-block;
              .message-tit {
                color: #7f7d7d
              };
              .message-tit-real {
                color: black
              }
            }
          }
        };
        .view-office {
          position: absolute;
          top: 18px;
          right: 10px
        }
        .wait-handle-office-list {
          position: absolute;
          top: 48px;
          left: 0;
          width: 100%;
          max-height: 160px;
          overflow: auto;
          ul {
            li {
              line-height: 30px;
              font-size: 13px;
              text-align: center;
              background:#fff
            }
          }
        }
        .wait-handle-check {
          position: absolute;
          top: 40px;
          left: 6px
        };
        .get-wait-task {
          width: 100%;
          text-align: center
        }
      }
    };
    .circultion-task-btn {
      text-align: center;
      height: 50px;
    }
  }
</style>
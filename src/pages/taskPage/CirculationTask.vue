<template>
  <div class="content-wrapper">
    <div class="no-data" v-show="noDataShow">
      <NoData></NoData>
    </div>
    <div class="loading">
      <loading :isShow="showLoadingHint" textContent="加载中,请稍候····" textColor="#2895ea"></loading>
    </div>
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
     <!-- 右边下拉框菜单 -->
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <div class="circultion-task-title">
      <h3>循环任务列表</h3>
    </div>
    <div class="circulation-task-list" v-show="circulationTaskListShow">
      <div class="wait-handle-list" v-for="(item,indexWrapper) in circulationTaskList" :key="indexWrapper">
        <div class="sample-type-check">
          <van-checkbox v-model="item.check" @click="checkBoxEvent"></van-checkbox>
        </div>
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
            <p>
              <span class="message-tit">优先级:</span>
              <span class="message-tit-real">{{priorityTransfer(item.priority)}}</span>
            </p>
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
              <span class="message-tit-real" style="color:red">{{stateTransfer(item.state)}}</span>
            </p>
          </div>
        </div>
        <div class="wait-handle-office-list" v-show="item.show">
          <ul>
            <li :class="{officeCheckStyle: completeDeparnmentInfo['taskId'] == item.id && innerItem.check == true}" v-for="(innerItem, index) in item.spaces" :key="index" @click="officeTaskEvent(item, innerItem.text,innerItem.value, innerItem.check,indexWrapper)">{{innerItem.text}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="circultion-task-btn">
      <van-button type="info" @click="circulationConditionEvent">循环情况</van-button>
      <van-button type="default" @click="circulationTaskArrived">送达</van-button>
    </div>
  </div>
</template>

<script>
  import HeaderTop from '@/components/HeaderTop'
  import FooterBottom from '@/components/FooterBottom'
  import {queryCirculationTask} from '@/api/workerPort.js'
  import NoData from '@/components/NoData'
  import Loading from '@/components/Loading'
  import { mapGetters, mapMutations } from 'vuex'
  import { formatTime, setStore, getStore, removeStore, IsPC, removeBlock, deepClone, repeArray } from '@/common/js/utils'
  import {getDictionaryData} from '@/api/login.js'
  export default {
    data () {
      return {
        showLoadingHint: false,
        noDataShow: false,
        circulationTaskListShow: false,
        leftDropdownDataList: ['退出登录'],
        leftDownShow: false,
        liIndex: null,
        circulationTaskList: [],
        currentOfficeName: ''
      };
    },

    components: {
      HeaderTop,
      NoData,
      Loading,
      FooterBottom
    },

    computed: {
      ...mapGetters([
        'navTopTitle',
        'isrefreshCirculationTaskPage',
        'completeDeparnmentInfo'
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
        let that = this;
        pushHistory();
        that.gotoURL(() => {
          pushHistory();
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

    activated () {
      console.log('完成科室信息',this.completeDeparnmentInfo);
      // 控制设备物理返回按键测试
      if (!IsPC()) {
        let that = this;
        pushHistory();
        that.gotoURL(() => {
          pushHistory();
          this.$router.push({path: 'home'});
          this.changeTitleTxt({tit:'中央运送'});
          setStore('currentTitle','中央运送') 
        })
      };
      if (this.isrefreshCirculationTaskPage) {
        // 查询循环任务
        this.getCirculationTask({
          proId: this.proId,  //医院ID，必输
          workerId: this.workerId,   //运送员ID
          states: [], //查询状态
          startDate: '',  //起始日期  YYYY-MM-dd
          endDate: ''  //终止日期  格式 YYYY-MM-dd
        })
      }
    },

    methods: {
      ...mapMutations([
        'changeTitleTxt',
        'changeCirculationTaskMessage',
        'changeIsCollectEnterSweepCodePage',
        'changeCirculationTaskId',
        'changeStipulateOfficeList',
        'changeArriveDepartmentId'
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
        this.showLoadingHint = true;
        queryCirculationTask(data).then((res) => {
          this.circulationTaskList = [];
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              this.circulationTaskListShow = true;
              this.noDataShow = false;
              for (let item of res.data.data) {
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
                  id: item.id,
                  show: false,
                  check: false
                })
              };
              // 改变科室列表数据结构
              for (let item = 0, len = this.circulationTaskList.length; item < len; item++) {
                let temporaryArrayTwo = [];
                for (let innerItem in this.circulationTaskList[item]) {
                  if (innerItem == 'spaces') {
                    let temporaryArrayTwo = [];
                    let temporaryItem = removeBlock(this.circulationTaskList[item][innerItem]).split(",");
                    let temporaryArrayOne = [];
                    for (let kip of temporaryItem) {
                      temporaryArrayOne = [];
                      temporaryArrayOne = kip.replace(/\"/g, "").split(':');
                      temporaryArrayTwo.push({text: temporaryArrayOne[1], value: temporaryArrayOne[0]});
                    }
                    this.circulationTaskList[item]['spaces'] = temporaryArrayTwo;
                  };
                }
              };
              // 科室列表增加字段
              for (let item of this.circulationTaskList) {
                for (let innerItem in item) {
                  if (innerItem == 'spaces') {
                    for (let medicalItem of item[innerItem]) {
                      medicalItem['check'] = false
                    }
                  }
                }
              };
              // 为完成采集的科室增加标记this.completeDeparnmentInfo['taskId']
              let completeDepartmentList = repeArray(this.completeDeparnmentInfo['departmentIdList']);
              let completeCurrentTaskId = this.completeDeparnmentInfo['taskId'];
              let taskIndex = this.circulationTaskList.indexOf(this.circulationTaskList.filter((item) => item.id == completeCurrentTaskId)[0]);
              if (taskIndex !== -1) {
                for (let i = 0, len1 = completeDepartmentList.length; i < len1; i++) {
                  for (let j = 0, len2 = this.circulationTaskList[taskIndex]['spaces'].length; j < len2; j++) {
                    if (this.circulationTaskList[taskIndex]['spaces'][j]['value'] == completeDepartmentList[i]) {
                      this.circulationTaskList[taskIndex]['spaces'][j]['check'] = true
                    }
                  }
                }
              };
              console.log('任务信息',this.circulationTaskList)
            } else {
              this.circulationTaskListShow = false;
              this.noDataShow = true;
            }
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
              this.circulationTaskListShow = false;
              this.noDataShow = true;
            });
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
            this.circulationTaskListShow = false;
            this.noDataShow = true;
          });
        });
        this.showLoadingHint = false;
      },

      // 返回上一页
      backTo () {
        this.$router.push({path: 'home'});
        this.changeTitleTxt({tit:'中央运送'});
        setStore('currentTitle','中央运送')
      },

      checkBoxEvent () {
        console.log('选中',this.circulationTaskList);
      },

      // 科室任务列表点击
      officeTaskEvent (item, val, key, check, index, indexWrapper) {
        if (check == true) {
           this.$dialog.alert({
            message: '该科室已完成标本收集',
            closeOnPopstate: true
          }).then(() => {
          });
          return
        };
        if (item.state == 7) {
          this.$dialog.alert({
            message: '该科室对应的循环任务已完成',
            closeOnPopstate: true
          }).then(() => {
          });
          return
        };
        this.changeArriveDepartmentId(false);
        this.currentOfficeName = indexWrapper;
        this.changeIsCollectEnterSweepCodePage(true);
        this.changeStipulateOfficeList(item.spaces.filter((inx) => { return inx.check == false}));
        this.$router.push({'path':'/circulationTaskSweepCode'});
        this.changeTitleTxt({tit:'扫码'});
        setStore('currentTitle','扫码');
        // 改变循环具体某一任务的信息状态
        this.changeCirculationTaskMessage({DtMsg:{currentMsg: item, wrapperIndex: indexWrapper, officeName: val, officeId: key}});
        setStore('currentCirculationTaskMessage',{currentMsg: item, wrapperIndex: indexWrapper, officeName: val, officeId: key});
      },

      // 循环任务送达
      circulationTaskArrived () {
        // 获取选中任务的id
        let checkTaskId = '';
        let checkList = [];
        checkList = this.circulationTaskList.filter((item) => item.check == true);
        if (checkList[0].state == 7) {
          this.$dialog.alert({
            message: '该条循环任务已完成',
            closeOnPopstate: true
          }).then(() => {
          });
          return
        };
        if (checkList.length == 0) {
          this.$dialog.alert({
            message: '请选择要送达的循环任务',
            closeOnPopstate: true
          }).then(() => {
          });
        } else if (checkList.length > 1) {
          this.$dialog.alert({
            message: '最多只能同时送达一条循环任务',
            closeOnPopstate: true
          }).then(() => {
          });
        } else if (checkList.length == 1) {
          this.changeArriveDepartmentId(true);
          if (checkList[0]['spaces'].filter((item) => item.check == true).length == checkList[0]['spaces'].length) {
            for (let item of checkList) {
              for (let innerItem in item) {
                if (innerItem == 'id') {
                  checkTaskId = item[innerItem]
                }
              }
            };
            this.changeCirculationTaskId(checkTaskId);
            this.changeIsCollectEnterSweepCodePage(false);
            this.$router.push({path: 'circulationTaskSweepCode'});
            this.changeTitleTxt({tit:'扫码'});
            setStore('currentTitle','扫码')
          } else {
            this.$dialog.alert({
              message: '请采集完所有科室标本',
              closeOnPopstate: true
            }).then(() => {
            });
          }
        };
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
    position: relative;
    font-size: 14px;
    .left-dropDown {
      .rightDropDown
    }
    .no-data {
      position: absolute;
      top: 200px;
      left: 0;
      width: 100%;
      text-align: center;
    }
    .loading {
      position: absolute;
      top: 260px;
      left: 0;
      width: 100%;
      height: 50px;
      text-align: center;
    }
    .circultion-task-title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      h3 {
        font-size: 14px;
        color: #1699e8
      }
    };
    .circulation-task-list {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
      .wait-handle-list {
        box-sizing: border-box;
        position: relative;
        padding-bottom: 10px;
        box-sizing: border-box;
        .sample-type-check {
          position: absolute;
          top: 10px;
          left: 5px
        };
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
          top: 10px;
          right: 10px;
          padding: 8px 6px;
          line-height: 14px;
          background: #2895ea;
          font-size: 14px;
          color: #fff;
          border-radius: 3px;
          box-sizing: border-box
        }
        .wait-handle-office-list {
          position: absolute;
          top: 48px;
          left: 0;
          width: 100%;
          max-height: 160px;
          overflow: auto;
          z-index: 100;
          ul {
            li {
              line-height: 50px;
              font-size: 13px;
              text-align: center;
              background:#fff;
              border-bottom: 1px solid #fff
            }
            .officeCheckStyle {
              color: #fff;
              background: #2895ea
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
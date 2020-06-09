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
    <div class="transport-type-title">
      <h3>{{transportantTaskMessage.value}}</h3>
    </div>
    <div class="transport-type-area">
      <div class="destination-box">
        <div class="destination-title">目的地</div>
        <div class="destination-content">
          <van-dropdown-menu>
            <van-dropdown-item v-model="destinationAddress" :options="destinationList"/>
          </van-dropdown-menu>
        </div>
      </div>
      <div class="destination-box">
        <div class="destination-title">运送类型</div>
        <div class="destination-content">
          <span class="destination-content-tag">*</span>
          <van-dropdown-menu>
            <van-dropdown-item v-model="typeOperation" :options="typeOperationList"/>
          </van-dropdown-menu>
        </div>
      </div>
      <van-field v-model="bedNumber" label="床号" placeholder="请输入床号"/>
      <van-field v-model="patientName"  label="病人姓名" placeholder="请输入病人姓名"/>
      <van-field v-model="patientNumber"  label="病人编号" placeholder="请输入病人编号"/>
      <van-field v-model="taskDescribe"   type="textarea" rows="1"
        autosize label="任务描述" placeholder="请输入任务描述"/>
      <van-field v-model="actualData"  type="number" label="实际数量" placeholder="请输入实际数量"/>
      <div class="destination-box">
        <div class="destination-title">转运工具</div>
        <div class="destination-content">
          <van-dropdown-menu>
            <van-dropdown-item v-model="vehicleOperation" :options="vehicleOperationList"/>
          </van-dropdown-menu>
        </div>
      </div>
      <div class="destination-box">
        <div class="destination-title">优先级</div>
        <div class="destination-content">
          <!-- <van-dropdown-menu>
            <van-dropdown-item v-model="priorityOperation" :options="priorityOperationList"/>
          </van-dropdown-menu> -->
          <van-radio-group v-model="checkResult" direction="horizontal" checked-color="#2895ea">
            <van-radio name="0">正常</van-radio>
            <van-radio name="1">重要</van-radio>
            <van-radio name="2">紧急</van-radio>
            <van-radio name="3">紧急重要</van-radio>
          </van-radio-group>
        </div>
      </div>
      <div class="destination-box">
        <div class="destination-title">返回出发地</div>
        <div class="destination-content">
          <van-dropdown-menu>
            <van-dropdown-item v-model="returnDepartureOperation" :options="returnDepartureOperationList"/>
          </van-dropdown-menu>
        </div>
      </div>
    </div>
    <div class="btn-area">
      <span>
        <img :src="taskSurePng" alt=""  @click="dispatchTaskSure">
      </span>
      <span>
        <img :src="taskCancelPng" alt="" @click="dispatchTaskCancel">
      </span>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import FooterBottom from '@/components/FooterBottom'
import {queryAllDestination, queryTransportTools, generateDispatchTask, quereDeviceMessage, queryTransportType} from '@/api/medicalPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC, removeBlock } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      liIndex: null,
      checkResult: '',
      destinationAddress: 0,
      destinationList: [],
      vehicleOperation: '',
      vehicleOperationList: [],
      priorityOperation: 0,
      typeOperationList: [],
      typeOperation: '',
      typeList: [],
      priorityOperationList: [
        { text: '正常', value: 0 },
        { text: '重要', value: 1 },
        { text: '紧急', value: 2 },
        { text: '紧急重要', value: 3 }
      ],
      returnDepartureOperation: 0,
      returnDepartureOperationList: [
        { text: '是', value: 1 },
        { text: '否', value: 0 },
      ],
      bedNumber: '',
      patientName: '',
      patientNumber: '',
      taskDescribe: '',
      actualData: '',
      taskSurePng: require('@/components/images/task-sure.png'),
      taskCancelPng: require('@/components/images/task-cancel.png')
    }
  },

  components: {
    HeaderTop,
    NoData,
    FooterBottom,
    VanFieldSelectPicker
  },

  computed: {
    ...mapGetters([
      'navTopTitle',
      'transportantTaskMessage',
      'userInfo'
    ]),
    proId () {
      return this.userInfo.extendData.proId
    },
    userName () {
      return this.userInfo.extendData.userName
    },
    proName () {
      return this.userInfo.extendData.proName
    },
    workerId () {
      return this.userInfo.extendData.userId
    }
  },

  mounted () {
    console.log(this.transportantTaskMessage);
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        this.changeIsRefershHome({DtMsg: false});
        this.$router.push({path: 'home'});
        this.changeTitleTxt({tit:'首页'});
        setStore('currentTitle','首页') 
      })
    };
    this.parallelFunction();
    let me = this;
    window['setDeviceInfo'] = (val) => {
      me.setDeviceInfo(val);
    }
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeDispatchTaskMessage',
      'changeIsRefershHome',
      'changeIsHomeJumpOtherPage'
    ]),

    // 返回上一页
    backTo () {
      this.$router.push({path: 'home'});
      this.changeTitleTxt({tit:'中央运送'});
      setStore('currentTitle','中央运送');
      this.changeIsRefershHome({DtMsg: false});
      this.changeIsHomeJumpOtherPage({DtMsg: true})
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

      // 查询运送类型
      getTransPorttype (data) {
        return new Promise((resolve,reject) => {
          queryTransportType(data)
          .then((res) => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            }
          })
          .catch((err) => {
            reject(err.message)
          })
        })
      },
      
      // 获取设备信息
      getDeviceMessage () {
        window.android.getDeviceInfo()
      },

      // 获取设备信息回调函数
      setDeviceInfo (val) {
        if (val) {
          try {
            this.searchDeviceMessage({ proId: this.proId, deviceNumber: val['IMEI']})
          } catch (err) {
            this.$dialog.alert({
              message: `${err}`,
              closeOnPopstate: true
            }).then(() => {})
          }
        }
      },

      // 查询设备信息
      searchDeviceMessage (data) {
        quereDeviceMessage(data)
        .then((res) => {
          if (res && res.data.code == 200) {
            if (this.destinationAddress !== '') {
              var destinationName = this.destinationList.filter((item) => { return item.value == this.destinationAddress})[0]['text'];
              if (this.destinationAddress == 0) {
                destinationName = ''
              }
            };
            if (this.vehicleOperation !== '') {
              var toolName = this.vehicleOperationList.filter((item) => { return item.value == this.vehicleOperation})[0]['text']
            } else {
              toolName = ''
            };
            if (this.typeOperation !== '') {
              var typeName = this.typeOperationList.filter((item) => { return item.value == this.typeOperation})[0]['text']
            } else {
              typeName = ''
            };
            let taskMessage = {
              setOutPlaceId: res.data.data['spaceId'],  //出发地ID
              setOutPlaceName: res.data.data['spaceName'],  //出发地名称
              destinationId: this.destinationAddress == 0 ? '' : this.destinationAddress,   //目的地ID
              destinationName: destinationName,  //目的地名称
              taskTypeId: this.typeOperation,  //运送类型 ID
              taskTypeName: typeName,  //运送类型 名 称
              priority: this.checkResult,   //优先级   0-正常, 1-重要,2-紧急, 3-紧急重要
              toolId: this.vehicleOperation,   //运送工具ID
              toolName: toolName,  //运送工具名称
              actualCount: this.actualData,   //实际数量
              patientName: this.patientName,  //病人姓名
              sex: 0,    //病人性别  0-未指定,1-男, 2-女
              age: "",   //年龄
              number: this.patientNumber,   //住院号
              bedNumber: this.bedNumber,  //床号
              taskRemark: this.taskDescribe,   //备注
              createId: this.workerId,   //创建者ID  当前登录者
              createName: this.userName,   //创建者名称  当前登陆者
              proId: this.proId,   //项目ID
              proName: this.proName,   //项目名称
              isBack: this.returnDepartureOperation,  //是否返回出发地  0-不返回，1-返回
              createType: 1   //创建类型   0-调度员，1-医务人员 固定传 1
            };
            // 创建调度任务
            this.postGenerateDispatchTask(taskMessage)
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {})
        })
      },

      // 并行查询目的地、转运工具、运送类型
      parallelFunction (type) {
        Promise.all([this.getAllDestination(),this.getTransportTools(), this.getTransPorttype({
          proId: this.proId,
          state: 0,
          parentId: this.transportantTaskMessage.id
        })])
        .then((res) => {
          if (res && res.length > 0) {
            this.destinationList = [];
            this.vehicleOperationList = [];
            this.typeOperationList = [];
            this.destinationList.push({text: '无', value: 0});
            let [item1,item2,item3] = res;
            if (item1) {
              Object.keys(item1).forEach((item) => {
                this.destinationList.push({
                  text: item1[item],
                  value: item
                })
              })
            };
            if (item2) {
              for (let item of item2) {
                this.vehicleOperationList.push({
                  text: item.toolName,
                  value: item.id
                })
              }
            };
            if (item3) {
              for(let item of item3) {
                this.typeOperationList.push({
                  text: item.typeName, 
                  value: item.id
                })
              }
            }
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err}`,
            closeOnPopstate: true
          }).then(() => {})
        })
      },

      // 查询目的地
      getAllDestination () {
        return new Promise((resolve,reject) => {
          queryAllDestination(this.proId).then((res) => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            }
          })
          .catch((err) => {
            reject(err.message)
          })
        })
      },

      // 查询转运工具
      getTransportTools () {
        return new Promise((resolve,reject) => {
          queryTransportTools({proId: '', state: 0})
          .then((res) => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            }
          })
          .catch((err) => {
            reject(err.message)
          })
        })
      },

      // 生成调度任务
      postGenerateDispatchTask (data) {
        generateDispatchTask(data).then((res) => {
          if (res && res.data.code == 200) {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
            this.$router.push({path:'/home'});
            this.changeTitleTxt({tit:'中央运送'});
            setStore('currentTitle','中央运送');
            this.changeIsRefershHome({DtMsg: true});
            this.changeIsHomeJumpOtherPage({DtMsg: true})
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

      // 运送类型信息确认事件
      dispatchTaskSure () {
        try {
          this.getDeviceMessage();
        } catch (err) {
          this.$dialog.alert({
            message: `${err}`,
            closeOnPopstate: true
          }).then(() => {})
        }
      },

      // 运送类型信息取消事件
      dispatchTaskCancel () {
        this.$router.push({path:'/home'});
        this.changeTitleTxt({tit:'中央运送'});
        setStore('currentTitle','中央运送');
        this.changeIsRefershHome({DtMsg: false});
        this.changeIsHomeJumpOtherPage({DtMsg: true})
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
    .transport-type-title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      background: #e2e2e2;
      h3 {
        font-size: 14px;
        color: #1699e8
      }
    };
    .transport-type-area {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      margin: 10px 0;
      width: 100%;
      .destination-box {
        padding-left: 15px;
        > div {
            display: inline-block
          };
          .destination-title {
            width: 24%;
            color: #323233;
          }
        .destination-content {
          width: 74%;
          position: relative;
          .destination-content-tag {
            position: absolute;
            top: 16px;
            color: red;
            right: 16px;
            display: inline-block;
            width: 5px;
            height: 5px;
            z-index: 100;
          }
          /deep/ .van-dropdown-menu {
            .van-dropdown-menu__item {
              .van-dropdown-menu__title {
                  width: 100%;
                  padding: 0;
                  color: #323233;
                  font-size: 14px;
              }
            }
            .van-dropdown-menu__bar {
              box-shadow: none
            }
          }
          /deep/ .van-radio-group {
            .van-radio--horizontal {
              margin-right: 5%;
              &:last-child {
                margin-right: 0
              };
              &:nth-child(1) {
                .van-radio__label {
                  color: #0ac30a
                }
              }
              &:nth-child(2) {
                .van-radio__label {
                  color: #fdc050
                }
              }
              &:nth-child(3) {
                .van-radio__label {
                  color: #ff4141
                }
              }
              &:nth-child(4) {
                .van-radio__label {
                  color: #cc0000
                }
              }
            }
          } 
        }
      }
      /deep/ .van-cell {
        .van-field__label {
          width: 24%;
          margin-right: 8px
        }
      }
    }
    .btn-area {
      height: 80px;
      text-align: center;
      line-height: 80px;
      span {
        .bottomButton;
        display: inline-block;
        margin-top: 15px;
        img {
          width: 100%;
          height: 100%
        }
      }
    }
  }  
</style>
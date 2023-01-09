<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <!-- 右侧菜单 -->
    <van-popup v-model="rightMenuShow" position="right" ref="vanPopup" :style="{ width: '60%', height: '100%' }">
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
    <!-- 运送大类 -->
    <div class="transport-rice-box" v-if="showTransportRice">
      <ScrollSelection :columns="transportRiceList" title="运送大类" @sure="transportRiceSureEvent" @cancel="transportRiceCancelEvent" @close="transportRiceCloseEvent" :isShowSearch="true" />
    </div>
    <!-- 起点科室 -->
    <div class="transport-rice-box" v-if="showStartDepartment">
      <ScrollSelection :columns="startDepartmentList" title="起点科室" @sure="startDepartmentSureEvent" @cancel="startDepartmentCancelEvent" @close="startDepartmentCloseEvent" />
    </div>
    <!-- 终点科室 -->
    <div class="transport-rice-box" v-if="showEndDepartment">
      <ScrollSelection :columns="endDepartmentList" title="终点科室" @sure="endDepartmentSureEvent" @cancel="endDepartmentCancelEvent" @close="endDepartmentCloseEvent" />
    </div>
    <!-- 运送员 -->
    <div class="transport-rice-box" v-if="showTransporter">
      <ScrollSelection :columns="transporterList" title="运送员" @sure="transporterSureEvent" @cancel="transporterCancelEvent" @close="transporterCloseEvent" />
    </div>
    <!-- 转运工具 -->
    <div class="transport-rice-box" v-if="showTransportTool">
      <ScrollSelection :columns="transportToolList" title="转运工具" @sure="transportToolSureEvent" @cancel="transportToolCancelEvent" @close="transportToolCloseEvent" />
    </div>
     <!-- 性别 -->
    <div class="transport-rice-box" v-if="showGender">
      <ScrollSelection :columns="genderList" title="性别" @sure="genderSureEvent" @cancel="genderCancelEvent" @close="genderCloseEvent" />
    </div>
    <div class="nav">
       <van-nav-bar
        title="创建调度任务"
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
      <div class="content-box">
        <div class="message-box">
          <div class="message-one">
            <div class="message-one-left">
              优先级
            </div>
            <div class="message-one-right">
              <van-radio-group v-model="priorityRadioValue" direction="horizontal">
                <van-radio name="1" checked-color="#289E8E">正常</van-radio>
                <van-radio name="2" checked-color="#E8CB51">紧急</van-radio>
                <van-radio name="3" checked-color="#F2A15F">重要</van-radio>
                <van-radio name="4" checked-color="#E86F50">紧急重要</van-radio>
              </van-radio-group>
            </div>
          </div>
          <div class="select-box">
            <div class="select-box-left">
              <span>*</span>
              <span>运送大类</span>
            </div>
            <div class="select-box-right" @click="showTransportRice = true">
              <span>{{ currentTransportRice }}</span>
              <van-icon name="arrow" color="#989999" size="20" />
            </div>
          </div>
          <div class="transport-type">
            <div class="transport-type-left">
              <span>运送类型</span>
            </div>
            <div class="transport-type-right">
              <span class="transport-type-list" :class="{'transportTypeListStyle': transportTypeIndex == index}" 
                v-for="(item,index) in transportTypeList"
                @click="transportTypeEvent(item,index)" 
                :key="index"
                >
                {{ item }}
              </span>
            </div>
          </div>
          <div class="select-box">
            <div class="select-box-left">
              <span>*</span>
              <span>起点科室</span>
            </div>
            <div class="select-box-right" @click="showStartDepartment = true">
              <span>{{ currentStartDepartment }}</span>
              <van-icon name="arrow" color="#989999" size="20" />
            </div>
          </div>
          <div class="select-box end-select-box">
            <div class="select-box-left">
              <span>终点科室</span>
            </div>
            <div class="select-box-right" @click="showEndDepartment = true">
              <span>{{ currentEndDepartment }}</span>
              <van-icon name="arrow" color="#989999" size="20" />
            </div>
          </div>
          <div class="select-box end-select-box">
            <div class="select-box-left">
              <span>运送员</span>
            </div>
            <div class="select-box-right" @click="showTransporter = true">
              <span>{{ currentTransporter }}</span>
              <van-icon name="arrow" color="#989999" size="20" />
            </div>
          </div>
          <div class="select-box end-select-box">
            <div class="select-box-left">
              <span>转运工具</span>
            </div>
            <div class="select-box-right" @click="showTransportTool = true">
              <span>{{ currentTransportTool }}</span>
              <van-icon name="arrow" color="#989999" size="20" />
            </div>
          </div>
          <div class="patient-message-box">
            <div class="patient-message-top">
              <div class="patient-message-top-left">
                <van-field v-model="patientNumberValue" label="床号" placeholder="请输入" />
              </div>
              <div class="patient-message-top-right">
                <van-field v-model="patientNameValue" label="姓名" placeholder="请输入" />
              </div>
            </div>
            <div class="patient-message-bottom">
              <div class="patient-message-bottom-left">
                <van-field v-model="admissionNumberValue" label="住院号" placeholder="请输入" />
              </div>
              <div class="patient-message-bottom-right">
                <van-field v-model="transportNumberValue" label="运送数量" type="digit" placeholder="请输入" />
              </div>
            </div>
          </div>
          <div class="select-box end-select-box">
            <div class="select-box-left">
              <span>性别</span>
            </div>
            <div class="select-box-right" @click="showGender = true">
              <span>{{ currentGender }}</span>
              <van-icon name="arrow" color="#989999" size="20" />
            </div>
          </div>
          <div class="message-one is-back">
            <div class="message-one-left">
              运送员是否返回
            </div>
            <div class="message-one-right">
              <van-radio-group v-model="isBackRadioValue" direction="horizontal" checked-color="#3B9DF9">
                <van-radio name="1">否</van-radio>
                <van-radio name="2">是</van-radio>
              </van-radio-group>
            </div>
          </div>
          <div class="task-describe transport-type">
            <div class="transport-type-left">
              <span>任务描述</span>
            </div>
            <div class="transport-type-right">
              <van-field
                v-model="taskDescribe"
                rows="3"
                autosize
                type="textarea"
                placeholder="请输入任务描述"
              />
            </div>
          </div>
        </div>
        <div class="btn-box">
          <span class="operate-one" @click="sureEvent">确认</span>
          <span class="operate-two" @click="temporaryStorageEvent">暂存</span>
          <span class="operate-three" @click="cancelEvent">取消</span>
        </div>
      </div>
    </div> 
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { userSignOut } from '@/api/workerPort.js'
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
import { setStore,removeAllLocalStorage } from '@/common/js/utils'
import ScrollSelection from "@/components/ScrollSelection";
export default {
  name: "CreateDispathTask",
  components: {
    ScrollSelection
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      taskDescribe: '',
      patientNumberValue: '',
      patientNameValue: '',
      admissionNumberValue: '',
      transportNumberValue: '',
      showStartDepartment: false,
      currentStartDepartment: '请选择',
      startDepartmentList: [
        { 
          id: '0',
          text: '体检科'
        },
        { 
          id: '1',
          text: '妇科'
        },
        { 
          id: '2',
          text: '儿科'
        },
        { 
          id: '3',
          text: '内科'
        },
        { 
          id: '4',
          text: '外科'
        }
      ],
      showEndDepartment: false,
      currentEndDepartment: '请选择',
      endDepartmentList: [
        { 
          id: '0',
          text: '体检科'
        },
        { 
          id: '1',
          text: '妇科'
        },
        { 
          id: '2',
          text: '儿科'
        },
        { 
          id: '3',
          text: '内科'
        },
        { 
          id: '4',
          text: '外科'
        }
      ],
      showTransporter: false,
      currentTransporter: '请选择',
      transporterList: [
        { 
          id: '0',
          text: '站萨'
        },
        { 
          id: '1',
          text: '好像就这些'
        },
        { 
          id: '2',
          text: '导航是'
        },
        { 
          id: '3',
          text: '精彩时刻'
        },
        { 
          id: '4',
          text: '到杉德'
        }
      ],
      showTransportTool: false,
      currentTransportTool: '请选择',
      transportToolList: [
        { 
          id: '0',
          text: '小推车'
        },
        { 
          id: '1',
          text: '轮椅'
        },
        { 
          id: '2',
          text: '平推车'
        }
      ],
      showGender: false,
      currentGender: '请选择',
      genderList: [
        { 
          id: '0',
          text: '女'
        },
        { 
          id: '1',
          text: '男'
        }
      ],
      showTransportRice: false,
      currentTransportRice: '请选择',
      transportRiceList: [
        { 
          id: '0',
          text: '法国'
        },
        { 
          id: '1',
          text: '英国'
        },
        { 
          id: '2',
          text: '德国'
        },
        { 
          id: '3',
          text: '中国'
        },
        { 
          id: '4',
          text: '中踢人'
        }
      ],
      transportTypeIndex: null,
      currentTransportType: '',
      transportTypeList: ['核酸标本','领是资管','领培养被','急查标本','标本'],
      moveInfo: {
        startX: ''
      },
      priorityRadioValue: '1',
      isBackRadioValue: '1',
      functionListIndex: 0,
      overlayShow: false,
      rightMenuShow: false,
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      switchShowPng: require("@/common/images/home/switch-show.png"),
      switchHiddenPng: require("@/common/images/home/switch-hidden.png"),
      anxiousSignPng: require("@/common/images/home/anxious-sign.png"),
      taskList: [
        {tit:'调度管理'},
        {tit:'调度任务'},
        {tit:'预约任务'},
        {tit:'循环任务'}
      ]
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn('/taskScheduling');
    this.registerSlideEvent()
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","schedulingTaskDetails","operateBtnClickRecord"]),
    proId () {
        return this.userInfo.extendData.proId
    }
  },

  methods: {
    ...mapMutations(["changeTitleTxt","changeCatchComponent","changeOverDueWay","changeOperateBtnClickRecord"]),

     onClickLeft() {
      this.$router.push({ path: "/taskScheduling"})
    },

    // 注册滑动事件  
    registerSlideEvent () {
      this.$refs.wrapper.addEventListener('touchstart',this.touchstartHandle,false);
      this.$refs.wrapper.addEventListener('touchmove',this.touchmoveHandle,false)
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
        //左滑(根据左右滑动来控制右侧菜单的显示与隐藏,滑动距离大于10才判定为滑动)
        if (moveX < -10) {
            this.rightMenuShow = true
        } else {
            this.rightMenuShow = false
        };
        e.preventDefault();
        }        
    },

    // 运送大类下拉选择框确认事件
    transportRiceSureEvent (val) {
      if (val) {
        this.currentTransportRice = val
      } else {
        this.currentTransportRice = '请选择'
      };
      this.showTransportRice = false
    },

    // 运送大类下拉选择框取消事件
    transportRiceCancelEvent () {
      this.showTransportRice = false
    },

    // 运送大类下拉选择框关闭事件
    transportRiceCloseEvent () {
      this.showTransportRice = false
    },

    // 起点科室下拉选择框确认事件
    startDepartmentSureEvent (val) {
      if (val) {
        this.currentStartDepartment =  val
      } else {
        this.currentStartDepartment = '请选择'
      };
      this.showStartDepartment = false
    },

    // 起点科室下拉选择框取消事件
    startDepartmentCancelEvent () {
      this.showStartDepartment = false
    },

    // 起点科室下拉选择框关闭事件
    startDepartmentCloseEvent () {
      this.showStartDepartment = false
    },

    // 终点科室下拉选择框确认事件
    endDepartmentSureEvent (val) {
      if (val) {
        this.currentEndDepartment =  val
      } else {
        this.currentEndDepartment = '请选择'
      };
      this.showEndDepartment = false
    },

    // 终点科室下拉选择框取消事件
    endDepartmentCancelEvent () {
      this.showEndDepartment = false
    },

    // 终点科室下拉选择框关闭事件
    endDepartmentCloseEvent () {
      this.showEndDepartment = false
    },

    // 运送员下拉选择框确认事件
    transporterSureEvent (val) {
      if (val) {
        this.currentTransporter =  val
      } else {
        this.currentTransporter = '请选择'
      };
      this.showTransporter = false
    },

    // 运送员下拉选择框取消事件
    transporterCancelEvent () {
      this.showTransporter = false
    },

    // 运送员下拉选择框关闭事件
    transporterCloseEvent () {
      this.showTransporter = false
    },

    // 转运工具下拉选择框确认事件
    transportToolSureEvent (val) {
      if (val) {
        this.currentTransportTool =  val
      } else {
        this.currentTransportTool = '请选择'
      };
      this.showTransportTool = false
    },

    // 转运工具下拉选择框取消事件
    transportToolCancelEvent () {
      this.showTransportTool = false
    },

    // 转运工具下拉选择框关闭事件
    transportToolCloseEvent () {
      this.showTransportTool = false
    },

    // 性别下拉选择框确认事件
    genderSureEvent (val) {
      if (val) {
        this.currentGender =  val
      } else {
        this.currentGender = '请选择'
      };
      this.showGender = false
    },

    // 性别下拉选择框取消事件
    genderCancelEvent () {
      this.showGender = false
    },

    // 性别下拉选择框关闭事件
    genderCloseEvent () {
      this.showGender = false
    },

    // 运送类型点击事件
    transportTypeEvent (item,index) {
      this.transportTypeIndex = index;
      this.currentTransportType = item
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
        } else if (name === '调度管理') {
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

    // 确认事件
    sureEvent () {},

    // 暂存事件
    temporaryStorageEvent () {},

    // 取消事件
    cancelEvent () {}
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
        height: 0;
        background: #f7f7f7;
        z-index: 10;
        .message-box {
          flex: 1;
          width: 100%;
          overflow: auto;
          .message-one {
            width: 100%;
            padding: 10px 6px 10px 16px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 6px;
            .message-one-left {
              width: 20%;
              color: #101010
            };
            .message-one-right {
              flex: 1;
              /deep/ .van-radio-group {
                justify-content: space-between;
                .van-radio--horizontal {
                  margin-right: 0 !important;
                  &:nth-child(1) {
                    .van-radio__label {
                      color: #289E8E !important
                    }
                  };
                  &:nth-child(2) {
                    .van-radio__label {
                      color: #E8CB51 !important
                    }
                  };
                  &:nth-child(3) {
                    .van-radio__label {
                      color: #F2A15F !important
                    }
                  };
                  &:nth-child(4) {
                    .van-radio__label {
                      color: #E86F50 !important
                    }
                  }
                }
              }
            }
          };
          .select-box {
            width: 100%;
            padding: 8px 6px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 6px;
            .select-box-left {
              padding-right: 10px;
              box-sizing: border-box;
              >span {
                &:nth-child(1) {
                  color: red
                };
                &:nth-child(2) {
                  color: #9E9E9A;
                  padding-right: 6px;
                  box-sizing: border-box
                };
              }
            };
            .select-box-right {
              flex: 1;
              justify-content: flex-end;
              align-items: center;
              display: flex;
              width: 0;
              >span {
                color: #101010;
                text-align: right;
                flex: 1;
                .no-wrap()
              }
            }
          };
          .end-select-box {
            .select-box-left {
              padding: 0 10px;
              box-sizing: border-box;
              >span {
                &:nth-child(1) {
                  color: #9E9E9A;
                  padding-right: 6px;
                  box-sizing: border-box
                };
              }
            };
          };
          .transport-type {
            width: 100%;
            padding: 10px 6px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 6px;
            .transport-type-left {
              padding: 0 10px;
              box-sizing: border-box;
              >span {
                &:nth-child(1) {
                  color: #9E9E9A
                }
              }
            };
            .transport-type-right {
              flex: 1;
              width: 0;
              display: flex;
              flex-wrap: wrap;
              .transport-type-list {
                display: inline-block;
                font-size: 13px;
                color: #9E9E9A;
                background: #F9F9F9;
                height: 23px;
                line-height: 23px;
                text-align: center;
                border-radius: 10px;
                margin-right: 10px;
                margin-bottom: 10px;
                padding: 0 10px;
                box-sizing: border-box
              };
              .transportTypeListStyle {
                color: #fff !important;
                background: #3B9DF9 !important
              }
            }
          };
          .patient-message-box {
            width: 100%;
            padding: 10px 6px;
            box-sizing: border-box;
            background: #fff;
            font-size: 14px;
            margin-top: 6px;
            .patient-message-top {
              display: flex;
              .patient-message-top-left {
                flex: 1;
                /deep/ .van-cell {
                  padding: 10px !important;
                  .van-field__label {
                    width: 60px !important;
                    color: #9E9E9A !important
                  };
                  .van-cell__value {
                    background: #F9F9F9 !important;
                    color: #101010 !important;
                    font-size: 14px !important;
                    padding-left: 4px !important
                  }
                }
              };
              .patient-message-top-right {
                flex: 1;
                /deep/ .van-cell {
                  padding: 10px !important;
                  .van-field__label {
                    width: 60px !important;
                    color: #9E9E9A !important
                  };
                  .van-cell__value {
                    background: #F9F9F9 !important;
                    color: #101010 !important;
                    font-size: 14px !important;
                    padding-left: 4px !important
                  }
                }
              }
            };
            .patient-message-bottom {
              display: flex;
              .patient-message-bottom-left {
                flex: 1;
                /deep/ .van-cell {
                  padding: 10px !important;
                  .van-field__label {
                    width: 60px !important;
                    color: #9E9E9A !important
                  };
                  .van-cell__value {
                    background: #F9F9F9 !important;
                    color: #101010 !important;
                    font-size: 14px !important;
                    padding-left: 4px !important
                  }
                }
              };
              .patient-message-bottom-right {
                flex: 1;
                /deep/ .van-cell {
                  padding: 10px !important;
                  .van-field__label {
                    width: 60px !important;
                    color: #9E9E9A !important
                  };
                  .van-cell__value {
                    background: #F9F9F9 !important;
                    color: #101010 !important;
                    font-size: 14px !important;
                    padding-left: 4px !important
                  }
                }
              }
            }
          };
          .is-back {
            .message-one-left {
              width: 30% !important;
              color: #9E9E9A !important
            };
            .message-one-right {
              /deep/ .van-radio-group {
                justify-content: flex-end !important;
                .van-radio--horizontal {
                  margin-right: 10px !important;
                  &:last-child {
                    margin-right: 0 !important
                  }; 
                  &:nth-child(1) {
                    .van-radio__label {
                      color: #101010 !important
                    }
                  };
                  &:nth-child(2) {
                    .van-radio__label {
                      color: #101010 !important
                    }
                  }
                }
              }
            }
          };
          .transport-type {
            .transport-type-right {
              /deep/ .van-cell {
                padding: 4px 6px !important;
                background: #F9F9F9
              }
            }
          }
        };
        .btn-box {
          width: 90%;
          margin: 0 auto;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          >span {
            width: 40%;
            display: inline-block;
            height: 45px;
            font-size: 18px;
            line-height: 45px;
            background: #fff;
            text-align: center;
            border-radius: 30px;
            &:nth-child(1) {
              color: #fff;
              background: linear-gradient(to right, #6cd2f8, #2390fe);
              box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
              margin-right: 30px
            };
            &:nth-child(2) {
              color: #1864FF;
              box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
              margin-right: 30px
            };
            &:last-child {
              color: #1864FF;
              box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1)
            }
          }
        }
    }
  }
}
</style>
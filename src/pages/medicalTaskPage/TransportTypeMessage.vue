<template>
  <div class="content-wrapper">
    <van-overlay :show="overlayShow"/>
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
      <!-- <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon>  -->
    </HeaderTop>
     <!-- 右边下拉框菜单 -->
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <div class="loading">
      <loading :isShow="showLoadingHint" textContent="创建中,请稍候····" textColor="#2895ea"></loading>
    </div>
    <div class="templateOne">
      <div class="transport-type-title">
        <h3>{{transportantTaskMessage.value}}</h3>
      </div>
      <div class="transport-type-area">
        <div class="destination-box">
          <div class="destination-title">优先级</div>
            <div class="destination-content">
              <van-radio-group v-model="checkResult" direction="horizontal" checked-color="#afe897">
                <van-radio name="1">正常</van-radio>
                <van-radio name="2">重要</van-radio>
                <van-radio name="3">紧急</van-radio>
                <van-radio name="4">紧急重要</van-radio>
              </van-radio-group>
            </div>
          </div>
        <!-- <div class="destination-box">
          <div class="destination-title">目的地</div>
          <div class="destination-content">
            <van-dropdown-menu>
              <van-dropdown-item v-model="destinationAddress" :options="destinationList"/>
            </van-dropdown-menu>
          </div>
        </div> -->
        <div class="transport-type-box">
          <div class="transport-type-title-innner">运送类型:</div>
          <div class="transport-type-list">
            <span :class="{spanStyle:typeIndex === index}" v-for="(item,index) in typeOperationList" :key="`${item}-${index}`" @click="typeEvent(item,index)">
              {{item.text}}
            </span>
          </div>
        </div>
        <div class="field-box">
          <p>
            <van-field v-model="bedNumber" label="床号" placeholder=""/>
          </p>
          <p>
            <van-field v-model="patientName"  label="姓名" placeholder=""/>
          </p>
          <p>
            <van-field v-model="patientNumber"  label="住院号" placeholder=""/>
          </p>
          <p>
            <van-field v-model="actualData"  type="number" label="运送数量" placeholder=""/>
          </p>
        </div>
        <div class="tool-box" @click="toolEvent">
          <div class="tool-title">
            转运工具
            <span>{{toolName}}</span>
            </div>
          <div class="tool-sign">
            <van-icon name="arrow"/>
          </div>
          <!-- 运送工具弹框 -->
        </div>
        <div class="destination-box">
          <div class="destination-title destination-title-inner">运送员是否返回</div>
          <div class="destination-content destination-content-inner">
            <van-radio-group v-model="judgeResult" direction="horizontal" checked-color="#afe897">
              <van-radio name="0">否</van-radio>
              <van-radio name="1">是</van-radio>
            </van-radio-group>
          </div>
        </div>
        <div class="describle-box">
          <van-field v-model="taskDescribe"   type="textarea" rows="1"
          autosize label="任务描述:" placeholder="请输入任务描述"/>
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
<!--    <div class="templateTwo">-->
<!--      <div class="transport-type-area">-->
<!--        <div class="destination-box">-->
<!--          <div class="destination-title">优先级</div>-->
<!--          <div class="destination-content">-->
<!--            <van-radio-group v-model="checkResult" direction="horizontal" checked-color="#afe897">-->
<!--              <van-radio name="1">正常</van-radio>-->
<!--              <van-radio name="2">重要</van-radio>-->
<!--              <van-radio name="3">紧急</van-radio>-->
<!--              <van-radio name="4">紧急重要</van-radio>-->
<!--            </van-radio-group>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="tool-box" @click="toolEvent">-->
<!--          <div class="tool-title">-->
<!--            转运工具-->
<!--            <span>{{toolName}}</span>-->
<!--          </div>-->
<!--          <div class="tool-sign">-->
<!--            <van-icon name="arrow"/>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="destination-box">-->
<!--          <div class="destination-title destination-title-inner">运送员是否返回</div>-->
<!--          <div class="destination-content destination-content-inner">-->
<!--            <van-radio-group v-model="judgeResult" direction="horizontal" checked-color="#afe897">-->
<!--              <van-radio name="0">否</van-radio>-->
<!--              <van-radio name="1">是</van-radio>-->
<!--            </van-radio-group>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="destination-box destination-box-taskTotal">-->
<!--          <div class="destination-title destination-title-inner">该任务运送总数</div>-->
<!--          <div class="destination-content destination-content-inner">-->
<!--            <van-field v-model="totalNumber" placeholder="" disabled />-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="field-box-wrapper">-->
<!--            <div class="field-box" v-for="(item,index) in templatelistTwo">-->
<!--              <div class="field-title">-->
<!--                病人{{index+1}}-->
<!--                <van-icon v-show="index > 0" name="delete"  @click="deletetMessage(index)" />-->
<!--              </div>-->
<!--              <div class="field-one">-->
<!--                <p>-->
<!--                  <van-field v-model="item.bedNumber" label="床号" placeholder="请输入病人床号"/>-->
<!--                </p>-->
<!--                <p>-->
<!--                  <van-field v-model="item.patientName"  label="姓名" placeholder="请输入病人姓名"/>-->
<!--                </p>-->
<!--              </div>-->
<!--              <div class="field-two">-->
<!--                <p class="admission-number">-->
<!--                  <van-field v-model="item.patientNumber"  label="住院号" placeholder="请输入病人住院号"/>-->
<!--                </p>-->
<!--                <p class="gender-list-box">-->
<!--                  <span>性别</span>-->
<!--                  <span>-->
<!--                  <van-dropdown-menu>-->
<!--                    <van-dropdown-item v-model="item.generValue" :options="item.generList" />-->
<!--                  </van-dropdown-menu>-->
<!--                </span>-->
<!--                </p>-->
<!--              </div>-->
<!--              <div class="field-three">-->
<!--                <p>-->
<!--                  <van-field v-model="item.actualData"  type="number" label="运送数量" placeholder="" disabled/>-->
<!--                </p>-->
<!--              </div>-->
<!--              <div class="field-four">-->
<!--                <p class="sample-box">-->
<!--                  <span>-->
<!--                    <van-dropdown-menu>-->
<!--                      <van-dropdown-item v-model="item.sampleValue" :options="item.sampleList" @change="sampleListValueChange(index,value)" />-->
<!--                    </van-dropdown-menu>-->
<!--                  </span>-->
<!--                  <span>-->
<!--                    <span>运送类型: </span>-->
<!--                    <span>{{jointTransportMessage(index)}}</span>-->
<!--                  </span>-->
<!--                </p>-->
<!--              </div>-->
<!--              <div class="type-list-box" >-->
<!--                <div class="type-list"  v-for="(innerItem, innerIndex) in item.typeSelectList" :key="innerItem"-->
<!--                     @click.stop="sampleTypeEvent(index ,innerItem, innerIndex)"-->
<!--                     :class="{ 'typeListStyle' : templatelistTwo[index]['typeSelectList'][innerIndex].checked }"-->
<!--                >-->
<!--                  <div class="type-value">-->
<!--                    {{innerItem.text}}-->
<!--                  </div>-->
<!--                  <div class="type-number">-->
<!--                    <van-stepper v-model="innerItem.typeNumber" input-width="50px" button-size="40px" min="0"-->
<!--                                 @plus="plusNum(index)"-->
<!--                                 @minus="minusNum(index)"-->
<!--                                 @change="stepperChange(index)"-->
<!--                                 integer default-value="0"-->
<!--                    />-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="add-message" @click="addMessageEvent">-->
<!--          点击添加病人信息-->
<!--        </div>-->
<!--        <div class="describle-box">-->
<!--          <van-field v-model="taskDescribe"   type="textarea" rows="1"-->
<!--                     autosize label="任务描述:" placeholder="请输入任务描述"/>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="btn-area">-->
<!--        <span>-->
<!--          <img :src="taskSurePng" alt=""  @click="dispatchTaskSure">-->
<!--        </span>-->
<!--        <span>-->
<!--          <img :src="taskCancelPng" alt="" @click="dispatchTaskCancel">-->
<!--        </span>-->
<!--      </div>-->
<!--    </div>-->
    <van-dialog v-model="toolShow" title="请选择运送工具" show-cancel-button width="92%"
          @confirm="toolSure" @cancel="toolCancel"
        >
          <div class="tool-name-list">
            <div class="tool-name-list-title-innner">转运工具:</div>
            <div class="tool-name-list-content">
              <span :class="{spanStyle:toolIndex === index}" v-for="(item,index) in vehicleOperationList" :key="`${item}-${index}`" @click="toolCheck(item,index)">
                {{item.text}}
              </span>
            </div>
          </div>
    </van-dialog>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import FooterBottom from '@/components/FooterBottom'
import {queryAllDestination, queryTransportTypeClass, queryTransportTools, generateDispatchTask, quereDeviceMessage, queryTransportType} from '@/api/medicalPort.js'
import {userSignOut} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import Loading from '@/components/Loading'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC, removeBlock, removeAllLocalStorage } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  name: 'transportTypeMessage',
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      transportTypeParent: [],
      transportTypeChild: [],
      templatelistTwo: [
        {
          bedNumber: '',
          patientName: '',
          patientNumber: '',
          generValue: 0,
          actualData: 0,
          sampleValue: this.transportTypeParentInitValue,
          sampleList: [],
          typeSelectList: [],
          generList: [
            { text: '男', value: 0 },
            { text: '女', value: 1 }
          ]
        }
      ],
      showLoadingHint: false,
      overlayShow: false,
      liIndex: null,
      toolShow: false,
      typeIndex: '',
      typeText: '',
      toolName: '',
      toolIndex: '',
      toolText: '',
      toolValue: '',
      typeValue: '',
      checkResult: '1',
      destinationAddress: 0,
      destinationList: [],
      vehicleOperationList: [],
      typeOperationList: [],
      typeList: [],
      returnDepartureOperation: 0,
      judgeResult: '',
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
    Loading,
    FooterBottom,
    VanFieldSelectPicker
  },

  // 监听每个病人对应的运送类型数量
  watch: {
    templatelistTwo: {
      handler(newVal,oldVal) {
        this.totalNumber  = this.templatelistTwo.reduce((accumulator, currentValue) => {
          return accumulator + Number(currentValue.actualData)
        },0);
      },
      deep: true,
      immediate: true
    }
  },

  computed: {
    ...mapGetters([
      'navTopTitle',
      'transportantTaskMessage',
      'userInfo',
      'globalTimer'
    ]),
    proId () {
      return this.userInfo.extendData.proId
    },
    userName () {
      return this.userInfo.userName
    },
    proName () {
      return this.userInfo.extendData.proName
    },
    workerId () {
      return this.userInfo.extendData.userId
    },
    transportTypeParentInitValue () {
      return this.transportantTaskMessage.id
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
        this.changeIsFreshHomePage(false);
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
      'changeOverDueWay',
      'changeCatchComponent',
      'changeIsFreshHomePage'
    ]),

      // 返回上一页
      backTo () {
        this.changeIsFreshHomePage(false);
        this.$router.push({path: 'home'});
        this.changeTitleTxt({tit:'中央运送'});
        setStore('currentTitle','中央运送')
      },

      // 阻止步进器冒泡
      plusNum(index) {
        event.stopPropagation()
      },
      minusNum(index) {
        event.stopPropagation()
      },

      // 步进器绑定值变化事件
      stepperChange(index) {
        this.reduceTotal(index)
      },

      // 求和函数
      reduceTotal(index) {
        // 求该病人信息对应的运送数量
        let targetMsg = this.templatelistTwo[index].typeSelectList.filter((item) => {
          return item.checked == true
        });
        this.templatelistTwo[index].actualData = targetMsg.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.typeNumber
        },0);
      },

      // 右边下拉框菜单点击
      leftLiCLick (index) {
        this.liIndex = index;
        this.userLoginOut(this.proId, this.userInfo.userName)
      },

      // 用户签退
      userLoginOut (proId,workerId) {
        this.changeOverDueWay(true);
        setStore('storeOverDueWay',true);
        userSignOut(proId,workerId).then((res) => {
          if (res && res.data.code == 200) {
            if(this.globalTimer) {window.clearInterval(this.globalTimer)};
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

      // 跳转到我的页
      skipMyInfo () {
        this.leftDownShow = !this.leftDownShow;
      },

      // 运送类型大类下拉框值变化时事件
      sampleListValueChange (index) {
        this.querytransportChildByTransportParent(index,this.templatelistTwo[index].sampleValue);
        this.templatelistTwo[index].actualData = 0;
        console.log('飒飒',this.templatelistTwo[index].sampleValue)
      },

      // 拼接运送类型信息函数
      jointTransportMessage (index) {
        let finalMsg = '';
        let targetMsg = this.templatelistTwo[index].typeSelectList.filter((item) => {
          return item.checked == true
        });
        for (let item of targetMsg) {
          finalMsg += `${item.text}${item.typeNumber}个,`
        };
        return finalMsg
      },

      // 根据运送类型大类查询运送类型小类
      querytransportChildByTransportParent (index,id, flag) {
        queryTransportType({
          proId: this.proId,
          state: 0,
          parentId: id
        }).then((res) => {
          if (res && res.data.code == 200) {
            this.templatelistTwo[index].typeSelectList = [];
            for(let item of res.data.data) {
              this.templatelistTwo[index].typeSelectList.push({
                text: item.typeName,
                value: item.id,
                checked: false,
                typeNumber: ''
              });
            }
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {})
        })
      },

      // 查询运送类型小类
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

    // 查询运送类型大类
    getTransportsTypeParent () {
      return new Promise((resolve,reject) => {
        queryTransportTypeClass({proId: this.proId, state: 0}).then((res) => {
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              resolve(res.data.data)
            }
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
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {})
        })
      },

      // 运送类型点击事件
      typeEvent (item,index) {
        this.typeIndex = index;
        this.typeText = item.text;
        this.typeValue = item.value
      },

      // 转运工具点击事件
      toolCheck (item, index) {
        this.toolIndex = index;
        this.toolText = item.text;
        this.toolName = item.text
        this.toolValue = item.value
      },

      // 转运工具弹框确认事件
      toolSure () {
        this.toolShow = false
      },

      // 转运工具弹框取消事件
      toolCancel () {
        this.toolIndex = '';
        this.toolName = '';
        this.toolShow = false
      },

      // 转运工具点击事件
      toolEvent () {
        this.toolShow = true;
      },

      // 并行查询目的地、转运工具、运送类型小类、运送类型大类
      parallelFunction (type) {
        Promise.all([this.getAllDestination(),this.getTransportTools(), this.getTransPorttype({
          proId: this.proId,
          state: 0,
          parentId: this.transportantTaskMessage.id
        }),this.getTransportsTypeParent()])
        .then((res) => {
          if (res && res.length > 0) {
            this.destinationList = [];
            this.vehicleOperationList = [];
            this.typeOperationList = [];
            this.destinationList.push({text: '无', value: 0});
            this.transportTypeParent = [];
            this.transportTypeChild = [];
            this.templatelistTwo[0].sampleList = [];
            this.templatelistTwo[0].typeSelectList = [];
            let [item1,item2,item3,item4] = res;
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
                });
                this.templatelistTwo[0].typeSelectList.push({
                  text: item.typeName,
                  value: item.id,
                  checked: false,
                  typeNumber: ''
                });
                this.transportTypeChild.push({
                  text: item.typeName,
                  value: item.id,
                  checked: false,
                  typeNumber: ''
                })
              };
            };
            if (item4) {
              for (let item of item4) {
                this.transportTypeParent.push({
                  value: item.id,
                  text: item.typeName
                })
              };
              this.templatelistTwo[0].sampleList = this.transportTypeParent;
              this.templatelistTwo[0].sampleValue = this.transportantTaskMessage.id
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
          queryTransportTools({proId: this.proId, state: 0})
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

      // 运送类型点击事件
      sampleTypeEvent (index ,innerItem, innerIndex) {
        this.templatelistTwo[index]['typeSelectList'][innerIndex].checked = !this.templatelistTwo[index]['typeSelectList'][innerIndex].checked;
        if (!this.templatelistTwo[index]['typeSelectList'][innerIndex].checked) {
          this.templatelistTwo[index]['typeSelectList'][innerIndex].typeNumber = 0
        };
        this.reduceTotal(index)
      },

      // 病人信息删除事件
      deletetMessage (index) {
        this.templatelistTwo.splice(index,1)
      },

      // 添加病人信息事件
      addMessageEvent () {
        this.querytransportChildByTransportParent(this.transportantTaskMessage.id, true);
        this.templatelistTwo.push({
          bedNumber: '',
          patientName: '',
          patientNumber: '',
          generValue: 0,
          actualData: 0,
          sampleValue: this.transportTypeParentInitValue,
          sampleList: this.transportTypeParent,
          typeSelectList: this.transportTypeChild,
          generList: [
            { text: '男', value: 0 },
            { text: '女', value: 1 }
          ]
        });
        console.log('病人信息',this.templatelistTwo)
      },

      // 生成调度任务
      postGenerateDispatchTask (data) {
        this.showLoadingHint = true;
        this.overlayShow = true;
        generateDispatchTask(data).then((res) => {
          if (res && res.data.code == 200) {
            this.$toast(`${res.data.msg}`);
            this.$router.push({path:'/home'});
            this.changeTitleTxt({tit:'中央运送'});
            setStore('currentTitle','中央运送');
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
          };
          this.showLoadingHint = false;
          this.overlayShow = false
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
          this.showLoadingHint = false;
          this.overlayShow = false
        })
      },

      // 运送类型信息确认事件
      dispatchTaskSure () {
        let taskMessage = {
          setOutPlaceId: this.userInfo.depId,  //出发地ID
          setOutPlaceName: this.userInfo.depName,  //出发地名称
          destinationId: '',   //目的地ID
          destinationName: '',  //目的地名称
          parentTypeId:  this.transportantTaskMessage.id, //运送父类型Id
          parentTypeName: this.transportantTaskMessage.value,//运送父类型名称
          taskTypeId: this.typeValue,  //运送类型 ID
          taskTypeName: this.typeText,  //运送类型 名 称
          priority: this.checkResult,   //优先级   0-正常, 1-重要,2-紧急, 3-紧急重要
          toolId: this.toolValue,   //运送工具ID
          toolName: this.toolName,  //运送工具名称
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
          isBack: this.judgeResult,  //是否返回出发地  0-不返回，1-返回
          createType: 1   //创建类型   0-调度员,1-医务人员(平板创建),2-医务人员(小程序)
        };
        // 创建调度任务
        this.postGenerateDispatchTask(taskMessage)
      },

      // 运送类型信息取消事件
      dispatchTaskCancel () {
        this.$router.push({path:'/home'});
        this.changeTitleTxt({tit:'中央运送'});
        setStore('currentTitle','中央运送')
      }
  }
}

</script>
<style lang='less' scoped>
  @import "~@/common/stylus/variable.less";
  @import "~@/common/stylus/mixin.less";
  @import "~@/common/stylus/modifyUi.less";
  .content-wrapper {
     /deep/ .van-dialog {
        .van-dialog__content {
          margin-bottom: 6px;
          height: 300px;
          margin: 10px 0;
          .tool-name-list {
            width: 94%;
            height: 100%;
            overflow: auto;
            margin: 0 auto;
            padding: 0;
            border: 1px solid #b2b2b2;
            .tool-name-list-title-innner {
              padding: 10px;
            }
            .tool-name-list-content {
              padding: 6px;
              .spanStyle {
                color: #fff;
                background: #2895ea
              }
              span {
                display: inline-block;
                width: 45%;
                height: 40px;
                text-align: center;
                margin-bottom: 8px;
                line-height: 40px;
                background: #f3f3f3;
                margin-right: 10%;
                &:nth-child(even) {
                  margin-right: 0
                }
              }
            }
          }
        }
      };
    .loading {
      position: absolute;
      top: 300px;
      left: 0;
      width: 100%;
      height: 50px;
      text-align: center;
      pointer-events: none
    };
    position: relative;
    .content-wrapper();
    font-size: 14px;
      .left-dropDown {
      .rightDropDown
    };
    .templateOne {
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
          width: 96%;
          margin: 0 auto;
          padding: 10px;
          box-sizing: border-box;
          margin-bottom: 8px;
          border: 1px solid #b2b2b2;
          > div {
              display: inline-block
            };
            .destination-title {
              width: 18%;
              color: black
            }
            .destination-title-inner {
              width: 27%
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
                margin-right: 7%;
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
          .destination-content-inner {
            width: 71%
          }
          &:last-child {
            margin-bottom: 0
          }
        }
        .tool-box {
          width: 96%;
          margin: 0 auto;
          padding: 10px;
          box-sizing: border-box;
          border: 1px solid #b2b2b2;
          position: relative;
          margin-bottom: 8px;
          .tool-title {

          }
          .tool-sign {
            position: absolute;
            right: 6px;
            top: 10px
          }
        }
        .transport-type-box {
          width: 96%;
          margin: 0 auto;
          max-height:320px;
          overflow: auto;
          padding: 10px;
          box-sizing: border-box;
          margin-bottom: 8px;
          border: 1px solid #b2b2b2;
          .transport-type-title-inner {

          }
          .transport-type-list {
            padding: 6px;
            margin-top: 10px;
            z-index: 200;
            .spanStyle {
              color: #fff;
              background: #2895ea
            }
            span {
              display: inline-block;
              width: 45%;
              height: 40px;
              text-align: center;
              margin-bottom: 8px;
              line-height: 40px;
              background: #f3f3f3;
              margin-right: 10%;
              &:nth-child(even) {
                margin-right: 0
              }
            }
          }
        }
        .field-box {
          width: 96%;
          margin: 0 auto;
          padding: 10px;
          box-sizing: border-box;
          margin-bottom: 8px;
          border: 1px solid #b2b2b2;
          > p {
            display: inline-block;
            width: 49%;
            /deep/ .van-cell {
              padding: 10px 2px;
              .van-field__label {
                width: 70px;
                text-align: left;
                font-size: 14px;
                color: black;
                margin-top: 6px
              }
              .van-field__value {
                border: 1px solid #bcbcbc;
                height: 30px;
                line-height: 30px;
                padding-left: 4px;
                font-size: 16px;
              }
            }
          }
        }
        .describle-box {
          width: 96%;
          box-sizing: border-box;
          margin: 0 auto;
          padding: 0 10px 0 0;
          margin-bottom: 2px;
          border: 1px solid #b2b2b2;
          /deep/ .van-cell {
            padding: 10px 10px;
            .van-field__label {
              width: 80px;
              text-align: left;
              font-size: 14px;
              color: black;
              margin-top: 6px
            }
            .van-field__value {
              .van-field__control {
                border: 1px solid #bcbcbc;
                height: 30px;
                line-height: 30px;
                padding-left: 4px
              }
            }
          }
        }
      }
      .btn-area {
        height: 58px;
        text-align: center;
        line-height: 58px;
        span {
          .bottomButton;
          display: inline-block;
          img {
            width: 100%;
            height: 100%
          }
        }
      }
    };
    .templateTwo {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      margin: 10px 0;
      width: 100%;
      display: flex;
      flex-flow: column nowrap;
      .transport-type-area {
        width: 100%;
        flex:1;
        display: flex;
        flex-flow: column nowrap;
        overflow: auto;
        .destination-box {
          width: 96%;
          margin: 0 auto;
          padding: 10px;
          box-sizing: border-box;
          margin-bottom: 8px;
          border: 1px solid #b2b2b2;
          > div {
            display: inline-block
          };
          .destination-title {
            width: 18%;
            color: black
          }
          .destination-title-inner {
            width: 27%
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
                margin-right: 7%;
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
          .destination-content-inner {
            width: 71%
          }
          &:last-child {
            margin-bottom: 0
          }
        };
        .destination-box-taskTotal {
          .destination-content {
            /deep/ .van-cell {
              .van-cell__value {
                .van-field__body {
                  font-size: 18px;
                }
              }
            }
          }
        };
        .field-box-wrapper {
          padding: 4px 0;
          width: 96%;
          margin: 0 auto;
          border: 1px solid #b2b2b2;
          flex:1;
          overflow: auto;
        };
        .tool-box {
          width: 96%;
          margin: 0 auto;
          padding: 10px;
          box-sizing: border-box;
          border: 1px solid #b2b2b2;
          position: relative;
          margin-bottom: 8px;
          .tool-title {

          }
          .tool-sign {
            position: absolute;
            right: 6px;
            top: 10px
          }
        }
        .transport-type-box {
          width: 96%;
          margin: 0 auto;
          max-height:320px;
          overflow: auto;
          padding: 10px;
          box-sizing: border-box;
          margin-bottom: 8px;
          border: 1px solid #b2b2b2;
          .transport-type-title-inner {

          }
          .transport-type-list {
            padding: 6px;
            margin-top: 10px;
            z-index: 200;
            .spanStyle {
              color: #fff;
              background: #2895ea
            }
            span {
              display: inline-block;
              width: 45%;
              height: 40px;
              text-align: center;
              margin-bottom: 8px;
              line-height: 40px;
              background: #f3f3f3;
              margin-right: 10%;
              &:nth-child(even) {
                margin-right: 0
              }
            }
          }
        }
        .field-box {
          width: 96%;
          height: 100%;
          margin: 0 auto;
          padding: 2px;
          box-sizing: border-box;
          margin-bottom: 8px;
          border: 1px solid #b2b2b2;
          display: flex;
          flex-flow: column nowrap;
          > div {
            > p {
              display: inline-block;
              width: 49%;
              /deep/ .van-cell {
                padding: 10px 0;
                .van-field__label {
                  width: 70px;
                  text-align: center;
                  font-size: 14px;
                  color: black;
                  margin-top: 6px
                }
                .van-field__value {
                  border: 1px solid #bcbcbc;
                  height: 30px;
                  line-height: 30px;
                  padding-left: 4px;
                  font-size: 16px;
                }
              }
            }
          }
          .field-title {
            position: relative;
            font-size: 20px;
            color: black;
            line-height: 30px;
            font-weight: bold;
            .van-icon {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 0;
              color: red;
              font-size: 22px;
            }
          };
          .field-one {
            position: relative;
            > p {
              &:first-child {
                //position: absolute;
                //top:0;
                //left: 0
              };
              &:last-child {
                position: absolute;
                top:0;
                right: 1%
              }
            };
          };
          .field-two {
            position: relative;
            height: 50px;
            > p {
              position: absolute;
              top:0;
            };
            .admission-number {
              vertical-align: top;
              left: 0
            };
            .gender-list-box {
              top: 8px;
              height: 36px;
              right: 1%;
              display: flex;
              flex-flow: row nowrap;
              > span {
                display: inline-block;
                height: 36px;
                line-height: 36px;
                &:first-child {
                  width: 70px;
                  text-align: center;
                };
                &:last-child {
                  flex: 1;
                  height: 30px;
                  margin-top: 2px;
                  /deep/.van-dropdown-menu {
                    height: 100%;
                    border: 1px solid #bcbcbc;
                    .van-dropdown-menu__bar {
                      height: 100%;
                      .van-dropdown-menu__item {
                        .van-dropdown-menu__title {
                          font-size: 18px;
                          line-height: normal !important;
                        }
                      }
                    };
                    /deep/ .van-dropdown-item {
                      .van-popup {
                        .van-cell {
                          .van-cell__title {
                            font-size: 18px;
                          }
                        }
                      }
                    }
                  }
                }
              }
            };
          };
          .field-four {
            .sample-box {
              width: 100%;
              position: relative;
              height: 40px;
              line-height: 40px;
              > span {
                display: inline-block;
                position: absolute;
                height: 100%;
                top: 0;
                &:first-child {
                  width: 30%;
                  left: 0;
                  /deep/.van-dropdown-menu {
                    height: 100%;
                    border: 1px solid #bcbcbc;
                    .van-dropdown-menu__bar {
                      height: 100%;
                      .van-dropdown-menu__item {
                        .van-dropdown-menu__title {
                          font-size: 18px;
                          line-height: normal !important;
                        }
                      }
                    };
                    /deep/ .van-dropdown-item {
                      .van-popup {
                        .van-cell {
                          .van-cell__title {
                            font-size: 18px;
                          }
                        }
                      }
                    }
                  }
                };
                &:last-child {
                  width: 68%;
                  right: 0;
                  height: 40px;
                  overflow-y: auto;
                  > span {
                    &:first-child {
                      font-size: 16px;
                      font-weight: bold;
                      color: black
                    };
                  }
                }
              }
            };
          };
          .type-list-box {
            border: 1px solid #bcbcbc;
            padding: 4px 4px 0 4px;
            flex: 1;
            overflow: auto;
            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
            align-items: top;
            .type-list {
              border: 1px solid #bcbcbc;
              text-align: center;
              width: 48%;
              height: 40px;
              line-height: 40px;
              margin-bottom: 4px;
              position: relative;
              > div {
                position: absolute;
                top: 0;
                &:first-child {
                  left: 2px
                };
                &:last-child {
                  right: 2px
                }
              }
            };
            .typeListStyle {
              border: none;
              color: #fff;
              background: #2895ea
            }
          };
        };
        .add-message {
          margin: 0 auto;
          margin-top: 6px;
          margin-bottom: 6px;
          width: 140px;
          text-align: center;
          line-height: 30px;
          background: #2895ea;
          color: white;
        };
        .describle-box {
          width: 96%;
          box-sizing: border-box;
          margin: 0 auto;
          padding: 0 10px 0 0;
          border: 1px solid #b2b2b2;
          /deep/ .van-cell {
            padding: 10px 10px;
            .van-field__label {
              width: 80px;
              text-align: left;
              font-size: 14px;
              color: black;
              margin-top: 6px
            }
            .van-field__value {
              .van-field__control {
                border: 1px solid #bcbcbc;
                height: 30px;
                line-height: 30px;
                padding-left: 4px
              }
            }
          }
        }
      }
      .btn-area {
        text-align: center;
        margin-top: 10px;
        span {
          .bottomButton;
          display: inline-block;
          img {
            width: 100%;
            height: 100%
          }
        }
      }
    }
  }
</style>

<template>
   <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <!-- <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon>  -->
    </HeaderTop>
     <!-- 右边下拉框菜单 -->
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <div class="sweep-code-title">
      <h3>科室信息采集</h3>
    </div>
    <div class="form-two">
      <van-field v-model="bedNumber" label="床号" placeholder="请输入"/>
      <van-field v-model="patientName" label="姓名" placeholder="请输入"/>
    </div>
    <div class="sample-number-box">
      <van-field v-model="sampleAmount" disabled type="number" label="标本总数"/>
    </div>
    <div class="increase-btn">
      <span>
        <img :src="taskIncreasePng" alt=""  @click="increaseSampleCollectBox">
      </span>
    </div>
    <div class="sweep-code-area">
      <div class="increaseLineArea">
        <div class="circulation-area" v-for="(item,index) in sampleMessageList" :key="`${item}-${index}`">
          <div class="sample-box">
            <div class="sample-title">标本类型</div>
            <div class="sample-content">
                <van-dropdown-menu>
                  <van-dropdown-item v-model="item.sampleType" :options="item.sampleTypeList"/>
                </van-dropdown-menu>
            </div>
          </div>
          <div class="check-entry-box">
            <div class="check-entry-title">检查项</div>
              <div class="check-entry-content">
                <van-checkbox-group v-model="item.checkEntryList" direction="horizontal">
                  <van-checkbox
                    shape="quare"
                    v-for="(item,index) in item.entryList"
                    :key="`${item}-${index}`"
                    :name='`{"id":"${item.id}","itemName":"${item.itemName}"}`'
                  >
                    {{ item.itemName }}
                  </van-checkbox>
                </van-checkbox-group>
              </div>
            </div>
            <div class="inner-sample--number-box">
              <div class="inner-sample--number-title">数量</div>
              <div class="inner-sample--number-content">
                <van-field v-model="item.innerSampleAmount" type="number" placeholder="请输入该标本数量"/>
              </div>
            </div>
            <div class="delete-box">
              <span>
                <img :src="taskDeletePng" alt=""  @click="deleteCurrentSampleCollectBox(item,index)">
              </span>
            </div>
          </div>
      </div>
    </div>
    <div class="btn-area">
      <span>
        <img :src="taskSurePng" alt=""  @click="collectMessageSure">
      </span>
      <span>
        <img :src="taskCancelPng" alt="" @click="collectMessageCancel">
      </span>
    </div>
     <van-dialog
        v-model="collectMessaheSureShow"
        title="是否收集该科室其它床位标本"
        show-cancel-button
        confirmButtonText="确定"
        cancelButtonText="取消"
        :close-on-popstate="false"
        :close-on-click-overlay="true"
        @confirm="collectSure"
        @cancel="collectCancel"
      >
    </van-dialog>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import FooterBottom from '@/components/FooterBottom'
import {queryCheckEntry, querySampleMessage} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC, checkEmptyArray, deepClone, querySampleName, repeArray } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      liIndex: null,
      bedNumber: '',
      patientName: '',
      sampleAmount: 0,
      collectMessaheSureShow: false,
      isDialogShow: false,
      isNoSampleDialogShow: false,
      isNoBedInfoShow: false,
      sampleMessageList: [
        {
          sampleType: '',
          sampleTypeList: [],
          entryList: [],
          checkEntryList: [],
          innerSampleAmount: 0
        }
      ],
      temporaryInfo: [],
      temporarySampleTypeList: [],
      temporarySampleType: '',
      temporaryCheckEntryList: [],
      taskIncreasePng: require('@/components/images/task-increase.png'),
      taskDeletePng: require('@/components/images/task-delete.png'),
      taskSurePng: require('@/components/images/task-sure.png'),
      taskCancelPng: require('@/components/images/task-cancel.png'),
    }
  },

  components:{
    VanFieldSelectPicker,
    HeaderTop,
    NoData,
    FooterBottom
  },

  watch: {
    sampleMessageList: {
      handler(newName, oldName) {
        let emptyArr = [];
        if (newName.length > 0) {
          for (let item of newName) {
            for (let val in item) {
              if (val == 'innerSampleAmount') {
                emptyArr.push(item[val])
              }
            }
          };
        }
        if (emptyArr.length>0) {
            this.sampleAmount = checkEmptyArray(emptyArr).reduce((prev, curr, idx, arr) => {
            return Number(prev) + Number(curr);
          })
        };
      },
      immediate: true,
      deep: true
    }
  },

  // beforeRouteLeave (to, from , next) {
  //   if (!this.isDialogShow) { 
  //     this.isDialogShow = false;
  //     next(false);
  //     return 
  //   }; 
  //   if (!this.isNoSampleDialogShow) { 
  //     this.isNoSampleDialogShow = false;
  //     next(false);
  //     return 
  //   }; 
  //   if (this.collectMessaheSureShow)  {
  //     this.collectMessaheSureShow = true;
  //     next(false);
  //     return 
  //   };
  //   next()
  // },

  mounted () {
    this.parallelFunction();
    // 回显收集过的科室信息
    this.echoCollectedMessage();
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        if (!this.isDialogShow) {
          this.loseDataInfo();
          return
        };
        if (!this.isNoSampleDialogShow) {
          this.noSampleInfo();
          return
        };
        if (!this.isNoBedInfoShow) {
          this.noBedInfo();
          return
        };
        if (this.collectMessaheSureShow)  {
          this.collectMessaheSureShow = true
        }
      })
    }
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'completeDeparnmentInfo',
      'circulationTaskMessage',
      'circulationCollectMessageList',
      'isDeleteEcho',
      'isDeleteCancel',
      'isClickSure'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    },
    departmentId () {
      return this.circulationTaskMessage.officeId
    },
    circulationTaskId () {
      return this.circulationTaskMessage.currentMsg.id
    },
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeCirculationCollectMessageList',
      'changeIsrefreshCirculationConnectPage',
      'changeCompleteDeparnmentInfo',
      'changeIsDeleteCancel',
      'changeIsDeleteEcho',
      'changeIsClickSure'
    ]),

     // 右边下拉框菜单点击
      leftLiCLick (index) {
        this.liIndex = index;
        localStorage.clear();
        this.$router.push({path:'/'})
      },
      
      // 丢失数据提示
      loseDataInfo () {
        this.isDialogShow = false;
        this.isNoBedInfoShow = true;
        this.isNoSampleDialogShow = true;
        this.$dialog.alert({
          message: '返回上页后,将丢失本科室采集数据!',
          closeOnPopstate: false,
          showCancelButton: true   
        }).then(() => {
          this.temporaryInfo = deepClone(this.circulationCollectMessageList.filter((item) => {return item['taskId'] != this.circulationTaskId}));
          this.changeCirculationCollectMessageList({DtMsg: this.temporaryInfo});
          setStore('currentCirculationCollectMessage',{innerMessage: this.temporaryInfo});
          this.isDialogShow = true;
          this.isNoSampleDialogShow = true;
          this.isNoBedInfoShow = true;
          this.collectMessaheSureShow = false  
          this.skipSweepCode();
        })
        .catch((err) => {
          this.isDialogShow = false;
          this.isNoBedInfoShow = true;
          this.isNoSampleDialogShow = true;
          this.collectMessaheSureShow = false  
        })
      },

      // 没有标本采集提示
      noSampleInfo () {
        this.isDialogShow = true;
        this.isNoBedInfoShow = true;
        this.isNoSampleDialogShow = false;
        this.$dialog.alert({
          message: '该科室没有需要采集的标本?',
          closeOnPopstate: false,
          showCancelButton: true   
        }).then(() => {
          // 存储完成采集任务的科信息
          let temporaryDepartmentId = [];
          let temporaryCompleteInfo = [];
          temporaryCompleteInfo = deepClone(this.completeDeparnmentInfo);
          let temporaryIndex = this.completeDeparnmentInfo.indexOf(this.completeDeparnmentInfo.filter((item) => { return item.taskId == this.circulationTaskId})[0]);
          if (this.completeDeparnmentInfo.length > 0) {
            if (temporaryIndex != -1) {
              temporaryDepartmentId = temporaryCompleteInfo[temporaryIndex]['departmentIdList'];
              temporaryDepartmentId.push(this.departmentId);
              temporaryCompleteInfo[temporaryIndex]['departmentIdList'] = temporaryDepartmentId
            } else {
              temporaryDepartmentId.push(this.departmentId);
              temporaryCompleteInfo.push(
                { 
                  departmentIdList: temporaryDepartmentId,
                  taskId: this.circulationTaskId
                }
              )
            }
          } else {
            temporaryDepartmentId.push(this.departmentId);
            temporaryCompleteInfo.push(
              { 
                departmentIdList: temporaryDepartmentId,
                taskId: this.circulationTaskId
              }
            )
          };
          this.changeCompleteDeparnmentInfo({DtMsg: temporaryCompleteInfo});
          setStore('completeDepartmentMessage',{"sureInfo": temporaryCompleteInfo});
          this.isNoSampleDialogShow = true;
          this.isDialogShow = true;
          this.isNoBedInfoShow = true;
          this.collectMessaheSureShow = false;  
          this.$router.push({path:'/circulationTask'});
          this.changeTitleTxt({tit:'循环任务'});
          setStore('currentTitle','循环任务');
          this.$dialog.alert({
            message: '当前科室没有需要采集的信息',
            closeOnPopstate: true  
          });
        })
        .catch(() => {
          this.isNoSampleDialogShow = true;
          this.isNoBedInfoShow = true;
          this.isDialogShow = false;
          this.collectMessaheSureShow = false  
        });
      },

      // 床位信息不能为空提示
      noBedInfo () {
        this.isNoBedInfoShow = false;
        this.isDialogShow = true;
        this.isNoSampleDialogShow = true;
        this.$dialog.alert({
          message: '标本信息不能为空',
          closeOnPopstate: false
        })
        .then(() => {
          this.isNoSampleDialogShow = true;
          this.isDialogShow = false;
          this.isNoBedInfoShow = true;
          this.collectMessaheSureShow = false
        })
      },

      // 跳转到我的页
      skipMyInfo () {
        this.leftDownShow = !this.leftDownShow;
      },

    echoCollectedMessage () {
      if (this.circulationCollectMessageList.length == 0) { return };
      let echoIndex = this.circulationCollectMessageList.indexOf(this.circulationCollectMessageList.filter((item) => {return item.taskId == this.circulationTaskId})[0]);
      if (echoIndex == -1) { return };
      // 回显上次科室采集最后一个床位信息
      let temporaryEchoList = [];
      temporaryEchoList.push(deepClone(this.circulationCollectMessageList[echoIndex]['collectDepartmentList'][this.circulationCollectMessageList[echoIndex]['collectDepartmentList'].length-1]));
      this.bedNumber = temporaryEchoList[0]['bedNumber'];
      this.patientName = temporaryEchoList[0]['patientName'];
      this.sampleAmount = temporaryEchoList[0]['sampleAmount'];
      this.sampleMessageList =  temporaryEchoList[0]['sampleMessageList'];
      this.changeIsDeleteEcho(true);
      setStore('isDeleteEcho',true);
    },

      // 并行查询标本信息和检查项信息
      parallelFunction () {
        Promise.all([this.getSampleMessage(),this.getCheckEntryMessage()])
        .then((res) => {
          if (res && res.length > 0) {
            let [item1,item2] = res;
            if (item1) {
              for (let item of item1) {
                this.sampleMessageList[0].sampleType = item.id;
                this.sampleMessageList[0].sampleTypeList.push({
                  text: item.specimenName,
                  value: item.id,
                })
              };
              // 标本信息存入locaStorage
              setStore('sampleInfo',{sampleKey:this.sampleMessageList[0].sampleTypeList});
              this.temporarySampleTypeList = this.sampleMessageList[0].sampleTypeList;
              this.temporarySampleType =  this.sampleMessageList[0].sampleType
            };
            if (item2) {
              let temporaryCheckList = [];
              for (let item of item2) {
                temporaryCheckList.push({
                  id: item.id,
                  itemName: item.itemName
                })
              };
              this.sampleMessageList[0].entryList = temporaryCheckList;
              this.temporaryCheckEntryList = this.sampleMessageList[0].entryList;
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

    // 查询标本信息
    getSampleMessage () {
      return new Promise((resolve,reject) => {
        querySampleMessage(
          { proId: this.proId, // 项目ID 必输
            state: 0  //查询状态，0-启用，1-禁用，固定传 0
          })
          .then((res) => {
            this.sampleMessageList[0].sampleTypeList = [];
            this.sampleMessageList[0].sampleType = '';
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

    // 查询检查项信息
    getCheckEntryMessage () {
      return new Promise((resolve,reject) => {
        queryCheckEntry(
          { proId: this.proId, // 项目ID 必输
          state: 0  //查询状态，0-启用，1-禁用，固定传 0
          })
          .then((res) => {
            this.sampleMessageList[0].entryList = [];
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

    // 返回上一页
    backTo () {
      this.loseDataInfo()
    },

    // 重复赋值封装
    repeatAssignment () {
      this.isDialogShow = true;
      this.isNoBedInfoShow = true;
      this.isNoSampleDialogShow = true;
      this.collectMessaheSureShow = true  
    },

    // 采集信息确认事件
    collectMessageSure () {
      // 如果当前任务当前科室没有采集信息，则不签名和提交采集信息确认
      if (this.circulationCollectMessageList.length == 0) {
        if (this.bedNumber == '' && this.patientName == '' && this.sampleAmount == 0) {
          this.noSampleInfo();
        } else {
          this.repeatAssignment()
        }
      } else {
        let echoIndex = this.circulationCollectMessageList.indexOf(this.circulationCollectMessageList.filter((item) => { return item.taskId == this.circulationTaskId})[0]);
        if (echoIndex == -1 ) {
          if (this.bedNumber == '' && this.patientName == '' && this.sampleAmount == 0) {
            this.noSampleInfo()
          } else {
            this.repeatAssignment()
          }
        } else {
          let currentList = this.circulationCollectMessageList[echoIndex]['collectDepartmentList'];
          if (currentList.length == 0) {
            if (this.bedNumber == '' && this.patientName == '' && this.sampleAmount == 0) {
              this.noSampleInfo()
            } else {
              this.repeatAssignment()
            }
          } else {
            if (this.bedNumber == '' && this.patientName == '' && this.sampleAmount == 0) {
              this.noBedInfo()
            } else {
              this.repeatAssignment()
            }
          }
        }
      }
    },

    // 收集是否完成弹框确定事件
    collectSure () {
      this.changeIsClickSure(true);
      setStore('isClickSure',true);
      // store和localStorage同时存储采集的信息
      let temporaryDepartmentList = [];
      let currentCollectAllMessageSure = [];
      currentCollectAllMessageSure = deepClone(this.circulationCollectMessageList);
      if (this.circulationCollectMessageList.length > 0) {
        let temporaryIndex = this.circulationCollectMessageList.indexOf(this.circulationCollectMessageList.filter((item) => {return item.taskId == this.circulationTaskId})[0]);
        if (temporaryIndex != -1) {
          if (this.isDeleteCancel || this.isDeleteEcho) {
            // 防止最后一条信息重复存入
            let spliceInfo = [];
            let temporaryCollectInfo = deepClone(currentCollectAllMessageSure[temporaryIndex]['collectDepartmentList']);
            spliceInfo = temporaryCollectInfo.splice(temporaryCollectInfo.length-1,1);
            currentCollectAllMessageSure[temporaryIndex]['collectDepartmentList'] = temporaryCollectInfo;
            this.changeIsDeleteCancel(false);
            this.changeIsDeleteEcho(false);
            setStore('isDeleteCancel',false);
            setStore('isDeleteEcho',false);
            temporaryDepartmentList = currentCollectAllMessageSure[temporaryIndex]['collectDepartmentList'];
            temporaryDepartmentList.push({
              sampleMessageList: this.sampleMessageList,
              bedNumber: this.bedNumber,
              patientName: this.patientName,
              sampleAmount: this.sampleAmount
            });
          } else {
            temporaryDepartmentList = currentCollectAllMessageSure[temporaryIndex]['collectDepartmentList'];
            temporaryDepartmentList.push({
              sampleMessageList: this.sampleMessageList,
              bedNumber: this.bedNumber,
              patientName: this.patientName,
              sampleAmount: this.sampleAmount
            });
          }
          currentCollectAllMessageSure[temporaryIndex]['collectDepartmentList'] = repeArray(temporaryDepartmentList)
        } else {
          temporaryDepartmentList.push({
            sampleMessageList: this.sampleMessageList,
            bedNumber: this.bedNumber,
            patientName: this.patientName,
            sampleAmount: this.sampleAmount
          });
          currentCollectAllMessageSure.push({
            taskId: this.circulationTaskId,
            collectDepartmentList: temporaryDepartmentList
          })
        }
      } else {
        temporaryDepartmentList.push({
          sampleMessageList: this.sampleMessageList,
          bedNumber: this.bedNumber,
          patientName: this.patientName,
          sampleAmount: this.sampleAmount
        });
        currentCollectAllMessageSure.push(
          {
            taskId: this.circulationTaskId,
            collectDepartmentList: temporaryDepartmentList
          }
        )
      };
      this.changeCirculationCollectMessageList({DtMsg:currentCollectAllMessageSure});
      setStore('currentCirculationCollectMessage',{innerMessage:currentCollectAllMessageSure});
      // 清空上个床位的页面数据信息
      this.bedNumber = '';
      this.patientName = '';
      this.sampleAmount = 0;
      this.sampleMessageList = [
        {
          sampleType: '',
          sampleTypeList: [],
          entryList: [],
          checkEntryList: [],
          innerSampleAmount: 0
        }
      ];
      this.isDialogShow = false;
      this.isNoSampleDialogShow = true;
      this.isNoBedInfoShow = true;
      this.collectMessaheSureShow = false;
      this.parallelFunction();
    },

    // 收集是否完成弹框取消事件
    collectCancel () {
      // store和localStorage同时存储采集的信息
      let temporaryDepartmentListTwo = [];
      let currentCollectAllMessageCancel = [];
      currentCollectAllMessageCancel = deepClone(this.circulationCollectMessageList);
      if (this.circulationCollectMessageList.length > 0) {
        let temporaryIndex = this.circulationCollectMessageList.indexOf(this.circulationCollectMessageList.filter((item) => {return item.taskId == this.circulationTaskId})[0]);
        if (temporaryIndex != -1) {
          if (this.isDeleteCancel || this.isDeleteEcho) {
            // 防止最后一条信息重复存入
            let spliceInfo = [];
            let temporaryCollectInfo = deepClone(currentCollectAllMessageCancel[temporaryIndex]['collectDepartmentList']);
            spliceInfo = temporaryCollectInfo.splice(temporaryCollectInfo.length-1,1);
            currentCollectAllMessageCancel[temporaryIndex]['collectDepartmentList'] = temporaryCollectInfo;
            this.changeIsDeleteCancel(false);
            this.changeIsDeleteEcho(false);
            setStore('isDeleteCancel',false);
            setStore('isDeleteEcho',false);
            temporaryDepartmentListTwo = currentCollectAllMessageCancel[temporaryIndex]['collectDepartmentList'];
            temporaryDepartmentListTwo.push({
              sampleMessageList: this.sampleMessageList,
              bedNumber: this.bedNumber,
              patientName: this.patientName,
              sampleAmount: this.sampleAmount
            });
          } else {
            temporaryDepartmentListTwo = currentCollectAllMessageCancel[temporaryIndex]['collectDepartmentList'];
            temporaryDepartmentListTwo.push({
              sampleMessageList: this.sampleMessageList,
              bedNumber: this.bedNumber,
              patientName: this.patientName,
              sampleAmount: this.sampleAmount
            });
          }
          currentCollectAllMessageCancel[temporaryIndex]['collectDepartmentList'] = repeArray(temporaryDepartmentListTwo)
        } else {
          temporaryDepartmentListTwo.push({
            sampleMessageList: this.sampleMessageList,
            bedNumber: this.bedNumber,
            patientName: this.patientName,
            sampleAmount: this.sampleAmount
          });
          currentCollectAllMessageCancel.push({
            taskId: this.circulationTaskId,
            collectDepartmentList: temporaryDepartmentListTwo
          })
        }
      } else {
        temporaryDepartmentListTwo.push({
          sampleMessageList: this.sampleMessageList,
          bedNumber: this.bedNumber,
          patientName: this.patientName,
          sampleAmount: this.sampleAmount
        });
        currentCollectAllMessageCancel.push(
          {
            taskId: this.circulationTaskId,
            collectDepartmentList: temporaryDepartmentListTwo
          }
        )
      };
      this.changeCirculationCollectMessageList({DtMsg:currentCollectAllMessageCancel});
      setStore('currentCirculationCollectMessage',{innerMessage:currentCollectAllMessageCancel});
      this.isDialogShow = true;
      this.isNoSampleDialogShow = true;
      this.isNoBedInfoShow = true;
      this.collectMessaheSureShow = false;
      this.$router.push({path:'/circulationTaskCollectMessageSure'});
      this.changeTitleTxt({tit:'采集信息确认'});
      setStore('currentTitle','采集信息确认');
    },

    // 采集信息取消事件
    collectMessageCancel () {
      // 当前没有收集到任何数据时跳到扫码页面
      if (this.circulationCollectMessageList.length == 0) {
        this.changeCirculationCollectMessageList({DtMsg:[]});
        removeStore('currentCirculationCollectMessage');
        this.skipSweepCode()
      } else {
        // 有数据则回显该科室上个床位收集页面
        let temporaryBedCollectMsg = [];
        let temporaryIndex = this.circulationCollectMessageList.indexOf(this.circulationCollectMessageList.filter((item) => {return item.taskId == this.circulationTaskId})[0]);
        // 判断有没有点击弹框确定按钮
        if (temporaryIndex != -1) {
          if (this.isClickSure) {
            // 点过确定按钮
            this.changeIsClickSure(false);
            setStore('isClickSure',false);
            temporaryBedCollectMsg.push(deepClone(this.circulationCollectMessageList[temporaryIndex]['collectDepartmentList'][this.circulationCollectMessageList[temporaryIndex]['collectDepartmentList'].length-1]));
            this.bedNumber = temporaryBedCollectMsg[0]['bedNumber'];
            this.patientName = temporaryBedCollectMsg[0]['patientName'];
            this.sampleAmount = temporaryBedCollectMsg[0]['sampleAmount'];
            this.sampleMessageList =  temporaryBedCollectMsg[0]['sampleMessageList'];
          } else {
            if (this.circulationCollectMessageList[temporaryIndex]['collectDepartmentList'].length == 1) {
              this.bedNumber = '';
              this.patientName = '';
              this.sampleAmount = 0;
              this.sampleMessageList = [
                {
                  sampleType: '',
                  sampleTypeList: [],
                  entryList: [],
                  checkEntryList: [],
                  innerSampleAmount: 0
                }
              ];
              this.parallelFunction();
              let temporaryInnerInfo = deepClone(this.circulationCollectMessageList);
              temporaryInnerInfo = temporaryInnerInfo.filter((item) => {return item.taskId != this.circulationTaskId});
              this.changeCirculationCollectMessageList({DtMsg:temporaryInnerInfo});
              setStore('currentCirculationCollectMessage',{innerMessage:temporaryInnerInfo})
            } else {
              if (this.circulationCollectMessageList[temporaryIndex]['collectDepartmentList'].length == 0) {
                // 该科室没有任何床位信息时则删除该科室上的循环任务存储信息
                let temporaryInnerInfo = deepClone(this.circulationCollectMessageList);
                temporaryInnerInfo = temporaryInnerInfo.filter((item) => {return item.taskId != this.circulationTaskId});
                this.changeCirculationCollectMessageList({DtMsg:temporaryInnerInfo});
                setStore('currentCirculationCollectMessage',{innerMessage:temporaryInnerInfo});
                this.skipSweepCode()
              } else {
                // 没点过则删除当前采集页的数据
                let currentCollectList = deepClone(this.circulationCollectMessageList);
                let temporaryCollectInfo = deepClone(currentCollectList[temporaryIndex]['collectDepartmentList']);
                temporaryCollectInfo.splice(temporaryCollectInfo.length-1,1);
                currentCollectList[temporaryIndex]['collectDepartmentList'] = temporaryCollectInfo;
                this.changeCirculationCollectMessageList({DtMsg:currentCollectList});
                setStore('currentCirculationCollectMessage',{innerMessage:currentCollectList});
                temporaryBedCollectMsg.push(deepClone(this.circulationCollectMessageList[temporaryIndex]['collectDepartmentList'][this.circulationCollectMessageList[temporaryIndex]['collectDepartmentList'].length-1]));
                this.bedNumber = temporaryBedCollectMsg[0]['bedNumber'];
                this.patientName = temporaryBedCollectMsg[0]['patientName'];
                this.sampleAmount = temporaryBedCollectMsg[0]['sampleAmount'];
                this.sampleMessageList =  temporaryBedCollectMsg[0]['sampleMessageList']
              }
            }
          };
          this.changeIsDeleteCancel(true);
          setStore('isDeleteCancel',true);
        } else {
          this.temporaryInfo = deepClone(this.circulationCollectMessageList.filter((item) => {return item['taskId'] != this.circulationTaskId}));
          this.changeCirculationCollectMessageList({DtMsg: this.temporaryInfo});
          setStore('currentCirculationCollectMessage',{innerMessage: this.temporaryCollectInfo});
          this.skipSweepCode()
        }
      }
    },

    // 跳转到扫码页
    skipSweepCode () {
      this.$router.push({'path':'/circulationTaskSweepCode'});
      this.changeTitleTxt({tit:'扫码'});
      setStore('currentTitle','扫码')
    },

    // 新增标本采集框
    increaseSampleCollectBox () {
      this.sampleMessageList.push( 
        {
          sampleType: this.temporarySampleType,
          sampleTypeList: this.temporarySampleTypeList,
          entryList: this.temporaryCheckEntryList,
          checkEntryList: [],
          innerSampleAmount: 0
        }
      );
    },

    // 删除当前标本采集项
    deleteCurrentSampleCollectBox (item,index) {
      this.sampleMessageList.splice(index, 1);
      for (let i in this.sampleMessageList) {
        this.sampleMessageList[i].index = i
      }
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
    .sweep-code-title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      h3 {
        font-size: 14px;
        color: #1699e8
      }
    };
    .form-two {
      padding: 2px;
    };
    .increase-btn {
      height: 40px;
      line-height: 40px;
      padding-right: 10px;
      text-align: right;
      background: #f6f6f6;
      span {
        display: inline-block;
        width: 70px;
        height: 30px;
        margin-top: 5px;
        img {
          width: 100%;
          height: 100%
        }
      }
    };
    .inner-sample--number-box {
       > div {
          display: inline-block
        };
      .inner-sample--number-title {
        width: 30%
      };
      .inner-sample--number-content {
        width: 60%;
        /deep/ .van-cell{
          padding-left: 0
        }
      }
    }
    .sweep-code-area {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      margin: 10px 0;
      width: 100%;
      .increaseLineArea {
        .circulation-area {
          padding: 10px 18px;
          height: 200px;
          position: relative;
          border-bottom: 1px solid #dfdfdf;
          .sample-box {
            > div {
              display: inline-block
            };
            .sample-title {
              width: 30%
            }
            .sample-content {
              width: 60%;
              /deep/ .van-dropdown-menu {
               .van-dropdown-menu__item {
                 .van-dropdown-menu__title {
                    width: 100%;
                    padding: 0
                 }
               }
              }
            }
          }
          .check-entry-box {
            > div {
              display: inline-block
            };
            .check-entry-title {
              width: 30%;
              vertical-align: top;
            }
            .check-entry-content {
              width: 60%;
              height: 100px;
              overflow: auto;
               /depp/.van-checkbox-group {
                .van-checkbox {
                  display: inline-block
                }
              }
            }
          }
          .delete-box {
            position: absolute;
            bottom: 10px;
            right: 10px;
            span {
              display: inline-block;
              width: 70px;
              height: 30px;
              margin-top: 5px;
              img {
                width: 100%;
                height: 100%
              }
            }
          }
        }
      }
    };
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
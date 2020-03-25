<template>
   <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="sweep-code-title">
      <h3>科室信息采集确认</h3>
    </div>
      <div class="bed-number-list-outer">
        <div class="bed-number-list" v-for="(outerItem,index) in allcirculationCollectMessageList" :key="`${outerItem}-${index}`">
          <div class="form-two">
            <van-field v-model="outerItem.bedNumber" disabled label="床号"/>
            <van-field v-model="outerItem.patientName" disabled type="tel" label="姓名"/>
            <van-field v-model="outerItem.sampleAmount" disabled type="number" label="标本总数"/>
          </div>
          <div class="sweep-code-area">
            <div class="increaseLineArea">
              <div class="circulation-area" v-for="(item,index) in outerItem.sampleMessageList" :key="`${item}-${index}`">
                <div class="sample-box">
                  <div class="sample-title">标本类型</div>
                  <div class="sample-content">
                      <van-dropdown-menu>
                        <van-dropdown-item disabled v-model="item.sampleType" :options="item.sampleTypeList"/>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    <div class="electronic-signature">
      <ElectronicSignature></ElectronicSignature>
    </div>
    <div class="btn-area">
      <van-button type="info" @click="collectMessageSure">确认</van-button>
      <van-button type="info" @click="collectMessageCancel">取消</van-button>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import ElectronicSignature from '@/components/ElectronicSignature'
import FooterBottom from '@/components/FooterBottom'
 import {collectSampleInfo} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC, querySampleName } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
      allcirculationCollectMessageList: [],
        bedNumber: '',
        patientName: '',
        sampleAmount: '',
        sampleMessageList: [
          {
            sampleType: '',
            innerSampleAmount: '',
            sampleTypeList: [],
            entryList: [],
            checkEntryList: []
          }
        ]
      
    };
  },

  components:{
    VanFieldSelectPicker,
    HeaderTop,
    NoData,
    FooterBottom,
    ElectronicSignature
  },

  mounted () {
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        this.$router.push({path:'/circulationTask'})
        this.changeTitleTxt({tit:'循环任务'});
        setStore('currentTitle','循环任务')
      })
    };
    this.echoCollectMessage()
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'currentElectronicSignature',
      'circulationCollectMessageList',
      'circulationTaskMessage',
      'completeDeparnmentInfo'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    },
    circulationTaskId () {
      return this.circulationTaskMessage.currentMsg.id
    },
    departmentId () {
      return this.circulationTaskMessage.officeId
    }
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeCirculationCollectMessageList',
      'changeCompleteDeparnmentInfo',
      'changeCurrentElectronicSignature'
    ]),

    // 我的页面
    skipMyInfo () {

    },


    // 回显已经采集信息
    echoCollectMessage () {
      this.allcirculationCollectMessageList = this.circulationCollectMessageList
    },

     // 收集标本信息
    getSampleMessage (data) {
      collectSampleInfo(data).then((res) => {
        if (res && res.data.code == 200) {
          this.$dialog.alert({
            message: res.data.msg,
            closeOnPopstate: true
          }).then(() => {
            // 当前页面回显数据
            this.allcirculationCollectMessageList = [];
            this.changeCurrentElectronicSignature({DtMsg: null})
            // 上一页面store采集数据
            this.changeCirculationCollectMessageList({DtMsg:[]});
            // 上一页面Localstorage采集数据
            removeStore('currentCirculationCollectMessage');
            // 存储完成采集任务的科室信息
            let temporaryDepartmentId = [];
            temporaryDepartmentId = this.completeDeparnmentInfo['departmentIdList'];
            temporaryDepartmentId.push(this.departmentId);
            this.changeCompleteDeparnmentInfo({DtMsg: {
              departmentIdList: temporaryDepartmentId,
              taskId: this.circulationTaskId
            }});
            setStore('completeDepartmentMessage',{
              departmentIdList: temporaryDepartmentId,
              taskId: this.circulationTaskId
            });
            this.$router.push({path:'/circulationTask'});
            this.changeTitleTxt({tit:'循环任务'});
            setStore('currentTitle','循环任务');
          });
        } else {
          this.$dialog.alert({
            message: res.data.msg,
            closeOnPopstate: true
          }).then(() => {
          });
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
      this.$router.push({path:'/circulationTaskCollectMessage'});
      this.changeTitleTxt({tit:'循环信息采集'});
      setStore('currentTitle','循环信息采集')
    },

     // 采集信息确认事件
    collectMessageSure () {
      let submitCollectMsg = {
        proId: this.proId,   //项目ID
        taskId: this.circulationTaskId,   //任务ID
        departmentId: this.departmentId,  //科室ID
        singImg: this.currentElectronicSignature, //签名照片
        specList: []
      };
      if (this.circulationCollectMessageList.length > 0) {
        for (let i = 0, len = this.circulationCollectMessageList.length; i < len; i++) {
          submitCollectMsg['specList'].push(
            {
              patientName: this.circulationCollectMessageList[i].patientName,  //病人姓名
              bedNumber: this.circulationCollectMessageList[i].bedNumber,  //病人床号
              totalNum: this.circulationCollectMessageList[i].sampleAmount, //总数量
              specimen: [] //标本list
            }
          );
          if (this.circulationCollectMessageList[i].sampleMessageList.length > 0) {
            for (let j = 0, len = this.circulationCollectMessageList[i].sampleMessageList.length; j < len; j++) {
              submitCollectMsg['specList'][i]['specimen'].push(
                {
                  specimenId: this.circulationCollectMessageList[i].sampleMessageList[j].sampleType,    //标本ID
                  specimenName: querySampleName(JSON.parse(getStore('sampleInfo')).sampleKey,this.circulationCollectMessageList[i].sampleMessageList[j].sampleType), //标本名称
                  quantity: this.circulationCollectMessageList[i].sampleMessageList[j].innerSampleAmount,    //标本数量
                  checkItems: {} //检查项
                }
              );
              if (this.circulationCollectMessageList[i].sampleMessageList[j].checkEntryList.length > 0)  {
                let temporarySampleList = [];
                for (let k = 0, len = this.circulationCollectMessageList[i].sampleMessageList[j].checkEntryList.length; k < len; k++) {
                  let temporarySampleList = Object.values(JSON.parse(this.circulationCollectMessageList[i].sampleMessageList[j].checkEntryList[k]));
                  submitCollectMsg['specList'][i]['specimen'][j]['checkItems'][temporarySampleList[0]] = temporarySampleList[1];
                }
              }
            }
          }
        };
        console.log('最终标本信息',submitCollectMsg);
      }
      this.getSampleMessage(submitCollectMsg)
    },

    // 采集信息确认取消事件
    collectMessageCancel () {
      // 当前页面回显数据
      this.allcirculationCollectMessageList = [];
      // 上一页面store采集数据
      this.changeCirculationCollectMessageList({DtMsg:[]});
      // 上一页面Localstorage采集数据
      removeStore('currentCirculationCollectMessage');
      this.$router.push({path:'/circulationTaskCollectMessage'});
      this.changeTitleTxt({tit:'信息采集'});
      setStore('currentTitle','信息采集')
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
    .sweep-code-title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      h3 {
        font-size: 15px;
      }
    };
    .bed-number-list-outer {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      margin: 10px 0;
      .bed-number-list {
        border-bottom: 2px solid #f2f2f2;
        .form-two {
          padding: 2px;
          box-sizing: border-box;
        };
        .sweep-code-area {
          width: 100%;
          overflow: auto;
          .increaseLineArea {
            .circulation-area {
              padding: 0 18px;
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
                  height: 50px;
                  overflow: auto;
                  /depp/.van-checkbox-group {
                    .van-checkbox {
                      display: inline-block
                    }
                  }
                }
              }
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
            }
          }
        };
      }
    }
    .electronic-signature {
      height: 250px
    }
    .btn-area {
      height: 50px;
      text-align: center;
      line-height: 50px;
    }
  }
</style>
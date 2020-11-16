<template>
  <div class="content-wrapper">
    <van-overlay :show="overlayShow" />
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
<!--      <span class="right-text" slot="right" @click="takePhoto">自主拍照</span>-->
    </HeaderTop>
    <div class="basic-message">
      <p class="basic-message-title">基本信息</p>
       <div class="wait-handle-message">
        <div class="handle-message-line-wrapper">
          <P>
            <span class="message-tit">任务类型:</span>
            <span class="message-tit-real">{{dispatchTaskMessage.taskTypeName}}</span>
          </P>
          <p>
            <span class="message-tit">优先级:</span>
            <span class="message-tit-real" style="color:#ff0000">{{priorityTransfer(dispatchTaskMessage.priority)}}</span>
          </p>
        </div>
        <div class="handle-message-line-wrapper handle-message-line-wrapper-other">
          <P>
            <span class="message-tit">任务起点:</span>
            <span class="message-tit-real">{{dispatchTaskMessage.setOutPlaceName}}</span>
          </P>
        </div>
        <div class="handle-message-line-wrapper handle-message-line-wrapper-other">
          <P>
            <span class="message-tit">任务终点:</span>
            <span class="message-tit-real">{{dispatchTaskMessage.destinationName}}</span>
          </P>
        </div>
        <div class="handle-message-line-wrapper">
          <p>
            <span class="message-tit">任务状态:</span>
            <span class="message-tit-real">{{stateTransfer(dispatchTaskMessage.state)}}</span>
          </p>
        </div>
        <div class="handle-message-line-wrapper handle-message-line-wrapper-other">
          <p>
            <span class="message-tit">任务时间:</span>
            <span class="message-tit-real">{{dispatchTaskMessage.planStartTime}}</span>
          </p>
        </div>
        <div class="handle-message-line-wrapper">
          <P>
            <span class="message-tit">病人姓名:</span>
            <span class="message-tit-real">{{dispatchTaskMessage.patientName == "" ? '无' : dispatchTaskMessage.patientName}}</span>
          </P>
          <p>
            <span class="message-tit">床号:</span>
            <span class="message-tit-real">{{dispatchTaskMessage.bedNumber == "" ? '无' : dispatchTaskMessage.bedNumber}}</span>
          </p>
        </div>
        <div class="handle-message-line-wrapper">
          <p>
            <span class="message-tit">数量:</span>
            <span class="message-tit-real">{{dispatchTaskMessage.actualCount == "" ? "无" : dispatchTaskMessage.actualCount}}</span>
          </p>
          <p>
            <span class="message-tit">转运工具:</span>
            <span class="message-tit-real">{{dispatchTaskMessage.toolName == "" ? '无' : dispatchTaskMessage.toolName}}</span>
          </p>
        </div>
        <div class="handle-message-line-wrapper">
          <p class="describe-line-wrapper">
            <span class="message-tit">任务描述:</span>
            <span class="message-tit-real">{{dispatchTaskMessage.taskRemark ? dispatchTaskMessage.taskRemark : '无'}}</span>
          </p>
        </div>
        <div class="handle-message-line-wrapper">
          <p class="describe-line-wrapper">
            <span class="message-tit">语音备注:</span>
            <span class="message-tit-real-audio" v-if="showChildrenComponent">
              <MyAudio v-show="dispatchTaskMessage.recordTime > 0" :src="`http://blinktech.cn/${dispatchTaskMessage.taskNumber}.mp3`"></MyAudio>
            </span>
            <span class="message-tit-real" v-show="dispatchTaskMessage.recordTime == 0">
              无语音信息
            </span>
          </p>
        </div>
      </div>
    </div>
<!--    <div class="content-middle">-->
<!--      <p class="issue-photo">-->
<!--        <span>问题拍照</span>-->
<!--        <ul class="photo-list">-->
<!--          <li v-for="(item,index) in issueImageList" :key="`${item}-${index}`" v-show="dispatchTaskMessage.state !== 7">-->
<!--            <img width="100" height="130" :src="item" @click="enlargeCompleteImgEvent(item)"/>-->
<!--            <van-icon name="cross" @click="issueDelete(index)"/>-->
<!--          </li>-->
<!--          <li v-for="(item,index) in historyIssueImageList" :key="`${item}-${index}`" v-show="dispatchTaskMessage.state == 7">-->
<!--            <img width="100" height="130" :src="Base64.decode(item)" @click="enlargeCompleteImgEvent(Base64.decode(item))"/>-->
<!--          </li>-->
<!--        </ul>-->
<!--        <span @click="issueClickEvent" class="icon-wrapper" v-show="dispatchTaskMessage.state !== 7">-->
<!--              <van-icon name="plus"/>-->
<!--        </span>-->
<!--      </p>-->
<!--    </div>-->
    <div class="office-list">
      <div class="basic-message-title">地点轨迹</div>
      <div class="office-list-inner-wrapper">
        <p class="track-name" v-if="dispatchTaskMessage.state !== 7">
          <span>{{dispatchTaskMessage.hasSanOut ? dispatchTaskMessage.hasSanOut.split(';')[0] : ''}}</span>
          <span v-show="dispatchTaskMessage.hasSanOut!=''" class="collect-parcel">(取件)</span>
          <span v-for="(item,index) in dispatchTaskMessage.distName" :key="`we${item}-${index}`">{{item}}
            <span class="send-parcel">(送件)</span>
          </span>
        </p>
        <p class="track-name" v-else>
          <span>{{dispatchTaskMessage.setOutPlaceName}}</span>
          <span class="collect-parcel">(取件)</span>
          <span v-for="(item,index) in dispatchTaskMessage.distName" :key="`we${item}-${index}`">{{item}}
            <span class="send-parcel">(送件)</span>
          </span>
          <span v-show="dispatchTaskMessage.isBack == 1">{{dispatchTaskMessage.setOutPlaceName}}</span>
          <span v-show="dispatchTaskMessage.isBack == 1" class="collect-parcel">(取件)</span>
        </p>
      </div>
    </div>
    <div class="circultion-task-btn">
      <p class="circultion-task-btn-top" v-show="dispatchTaskMessage.state != 7">
        <span @click="fetchPiece">取件</span>
        <span @click="sendPiece">送件</span>
      </p>
      <p class="circultion-task-btn-bottom" v-show="!isSingleDestination && dispatchTaskMessage.state != 7">
        <span @click="endTask">完成任务</span>
      </p>
      <p class="circultion-task-btn-bottom" v-show="dispatchTaskMessage.state == 7">
        <span @click="backTo">返回</span>
      </p>
    </div>
    <transition name="van-slide-up">
      <div class="choose-photo-box" v-show="photoBox">
        <div class="choose-photo">
          <van-icon name="photo" />
          <input name="uploadImg1" id="demo1" @change="previewFileOne" type="file" accept="image/album"/>从图库中选择
        </div>
        <div class="photo-graph">
          <van-icon name="photograph" />
          <input name="uploadImg2" id="demo2"  @change="previewFileTwo" type="file" accept="image/camera"/>拍照
        </div>
        <div class="photo-cancel" @click="photoCancel">取消</div>
      </div>
    </transition>
    <van-dialog v-model="enlargeImgShow" width="90%">
      <img :src="enlargeImgUrl">
    </van-dialog>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import FooterBottom from '@/components/FooterBottom'
import {} from '@/api/medicalPort.js'
import {updateDispatchTask,getDispatchTaskMessageById} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import MyAudio from '@/components/MyAudio'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC, removeBlock, Dictionary, deepClone, compress, repeArray} from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  name: 'dispatchDetails',
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      liIndex: null,
      trackList: [],
      showChildrenComponent: false,
      overlayShow: false,
      enlargeImgShow: false,
      photoBox: false,
      enlargeImgUrl: '',
      issueImageList: [],
      historyIssueImageList: []
    }
  },

  components: {
    HeaderTop,
    NoData,
    FooterBottom,
    MyAudio
  },

  computed: {
    ...mapGetters([
      'navTopTitle',
      'userInfo',
      'completeDeparnmentInfo',
      'isCompleteSweepCodeDestinationList',
      'departmentInfoListNo',
      'dispatchTaskMessage',
      'isSingleDestination',
      'dispatchTaskState',
      'dispatchTaskDepartmentType',
      'isCompleteSweepCode',
      'isBack',
      'dispatchTaskId',
      'currentDepartmentNumber',
      'catch_components',
      'isCompleteDispatchIssuePhotoList'
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
    taskId () {
      return this.dispatchTaskMessage.id
    }
  },


  mounted () {
    // 控制设备物理按键返回
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        if (this.dispatchTaskMessage.state == 7) {
          this.changeIsFreshDispatchTaskPage(false)
        } else {
          this.changeIsFreshDispatchTaskPage(true)
        };
        this.$router.push({path:'/dispatchTask'});
        this.changeTitleTxt({tit:'调度任务'});
        setStore('currentTitle','调度任务')
      })
    };
    document.addEventListener('click', (e) => {
      if(e.target.className !='van-icon van-icon-plus' && e.target.className != 'quit-account'){
        this.photoBox = false;
        this.overlayShow = false
      }
    });
    this.echoPhoto();
    this.getTaskMessage()
  },

  beforeRouteLeave(to, from, next) {
    if (to.name == 'dispatchTaskSweepCode'){
      this.changeIsCallDispatchSweepcodeMethod(true)
    };
    next()
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeIsCompleteSweepCodeDestinationList',
      'changeisCompleteSweepCode',
      'changeIsFreshDispatchTaskPage',
      'changeDispatchTaskMessage',
      'changeIsCoerceTakePhoto',
      'changeDispatchTaskDepartmentType',
      'changeDispatchTaskState',
      'changeCurrentDepartmentNumber',
      'changeCatchComponent',
      'changeIsCallDispatchSweepcodeMethod',
      'changeIsCompleteDispatchIssuePhotoList'
    ]),

    // 图片上传预览
    previewFileOne() {
      let Orientation;
      let file = document.getElementById("demo1").files[0];
      let _this = this;
      let reader = new FileReader();
      let isLt2M = file.size/1024/1024 < 16;
      if (!isLt2M) {
        this.$dialog.alert({
          message: '上传图片大小不能超过16MB!',
          closeOnPopstate: true
        }).then(() => {
        });
        return
      };
      reader.addEventListener("load", function () {
        // 压缩图片
        let result = reader.result;
        let img = new Image();
        img.src = result;
        img.onload = function () {
          let src = compress(img,Orientation);
          _this.issueImageList.push(src);
          _this.storePhoto(_this.issueImageList)
        }
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      };
    },

    //拍照预览
    previewFileTwo() {
      let Orientation;
      let file = document.getElementById("demo2").files[0];
      let _this = this;
      let reader = new FileReader();
      let isLt2M = file.size/1024/1024 < 16;
      if (!isLt2M) {
        _this.$dialog.alert({
          message: '上传图片大小不能超过16MB!',
          closeOnPopstate: true
        }).then(() => {
        });
        return
      };
      reader.addEventListener("load", function () {
        // 压缩图片
        let result = reader.result;
        let img = new Image();
        img.src = result;
        img.onload = function () {
          let src = compress(img,Orientation);
          _this.issueImageList.push(src);
          _this.storePhoto(_this.issueImageList)
        }
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      };
    },

    // 放大维修后图片点击事件
    enlargeCompleteImgEvent (item) {
      this.enlargeImgShow = true;
      this.enlargeImgUrl = item
    },

    // 拍照取消
    photoCancel () {
      this.photoBox = false;
      this.overlayShow = false
    },

    // 拍照问题照片点击
    issueClickEvent () {
      this.photoBox = true;
      this.overlayShow = true
    },

    // 问题照片删除
    issueDelete (index) {
      this.issueImageList.splice(index,1);
      this.storePhoto(this.issueImageList)
    },

    // 回显照片
    echoPhoto () {
      this.historyIssueImageList = [];
      this.issueImageList = [];
      if (this.isCompleteDispatchIssuePhotoList.length == 0) { return };
      let echoIndex = this.isCompleteDispatchIssuePhotoList.indexOf(this.isCompleteDispatchIssuePhotoList.filter((item) => {return item.taskId == this.taskId})[0]);
      if (echoIndex === -1) { return };
      if (this.isCompleteDispatchIssuePhotoList[echoIndex]['issuePhototList']) {
        this.issueImageList = deepClone(this.isCompleteDispatchIssuePhotoList[echoIndex]['issuePhototList'])
      };
    },

    // 存储已经上传的照片
    storePhoto (photoId) {
      let temporaryPhotoList = [];
      temporaryPhotoList = deepClone(this.isCompleteDispatchIssuePhotoList);
      if (this.isCompleteDispatchIssuePhotoList.length > 0 ) {
        let temporaryIndex = this.isCompleteDispatchIssuePhotoList.indexOf(this.isCompleteDispatchIssuePhotoList.filter((item) => {return item.taskId == this.taskId})[0]);
        if (temporaryIndex !== -1) {
          temporaryPhotoList[temporaryIndex]['issuePhototList'] = photoId;
        } else {
          temporaryPhotoList.push(
            {
              issuePhototList: photoId,
              taskId: this.taskId
            }
          )
        };
      } else {
        temporaryPhotoList.push(
          {
            issuePhototList: photoId,
            taskId: this.taskId
          }
        )
      };
      this.changeIsCompleteDispatchIssuePhotoList(temporaryPhotoList);
      setStore('completdispatchIssuePhotoInfo', {"photoInfo": temporaryPhotoList})
    },

    // 获取任务详情
    getTaskMessage () {
      getDispatchTaskMessageById(this.dispatchTaskId)
      .then((res) => {
        if (res && res.data.code == 200) {
          this.showChildrenComponent = true;
          // 改变调度具体某一任务的信息状态
          this.changeDispatchTaskMessage({DtMsg: res.data.data});
          console.log('飒飒飒飒',this.dispatchTaskMessage.taskNumber)
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
      if (this.dispatchTaskMessage.state == 7) {
        this.changeIsFreshDispatchTaskPage(false)
      } else {
        this.changeIsFreshDispatchTaskPage(true)
      };
      this.$router.push({path:'/dispatchTask'});
      this.changeTitleTxt({tit:'调度任务'});
      setStore('currentTitle','调度任务')
    },
    // 自主拍照
    takePhoto () {
      this.$router.push({path:'/dispatchTakePhoto'});
      this.changeTitleTxt({tit:'拍照'});
      setStore('currentTitle','拍照')
    },

    // 结束任务
    endTask () {
      if (this.dispatchTaskMessage.distName.length == 0) {
        this.$toast('至少完成一个目的地时,才能结束任务');
        return
      };
      if (this.dispatchTaskMessage.state == 4) {
        this.$toast('请再次扫描出发地结束任务');
      } else {
        this.$dialog.alert({
          message: '确定结束任务?',
          showCancelButton: true
        })
        .then(() => {
          if (this.dispatchTaskMessage.state == 7) {
            this.changeIsFreshDispatchTaskPage(false)
          } else {
            this.changeIsFreshDispatchTaskPage(true)
          };
          this.judgeIsGoDeparture()
        })
        .catch((err) => {
        })
      }
    },

    // 判断是否需要要回到出发地 0不回 1回
    judgeIsGoDeparture () {
      if (this.isBack == 1) {
        // 需要回到出发地时更新任务状态为4未结束
        this.updateTaskState({
          proId: this.proId, //当前项目ID
          id: this.dispatchTaskMessage.id, //当前任务ID
          state: 4//更新后的状态 {0: '未分配', 1: '未查阅', 2: '未开始', 3: '进行中', 4: '未结束', 5: '已延迟', 6: '已取消', 7: '已完成'
        })
      } else {
        this.updateTaskState({
          proId: this.proId, //当前项目ID
          id: this.dispatchTaskMessage.id, //当前任务ID
          state: this.dispatchTaskState//更新后的状态 {0: '未分配', 1: '未查阅', 2: '未开始', 3: '进行中', 4: '未结束', 5: '已延迟', 6: '已取消', 7: '已完成'
        })
      }
    },

    // 更新任务状态
    updateTaskState (data) {
      updateDispatchTask(data).then((res) => {
        if (res && res.data.code == 200) {
          // 为单一类型目的地或第二次扫出发地时结束该任务
          if ((this.dispatchTaskDepartmentType == 1 && this.isSingleDestination && this.dispatchTaskState != 4) || (this.dispatchTaskState == 7)) {
            this.$toast('该条任务已完成');
            // 清空该完成任务存储的已扫过非单一目的地科室信息
            let temporarySweepCodeOficeList = deepClone(this.isCompleteSweepCodeDestinationList);
            temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return item.taskId != this.taskId});
            this.changeIsCompleteSweepCodeDestinationList(temporarySweepCodeOficeList);
            setStore('completeDispatchSweepCodeDestinationInfo', {"sweepCodeInfo": temporarySweepCodeOficeList});

            // 清空该完成任务存储的已校验通过的当前科室编号
            let temporaryCurrentDepartmentNumber = deepClone(this.currentDepartmentNumber);
            temporaryCurrentDepartmentNumber = temporaryCurrentDepartmentNumber.filter((item) => { return item.taskId != this.taskId});
            this.changeCurrentDepartmentNumber(temporaryCurrentDepartmentNumber);
            setStore('completDepartmentNumber', {"number": temporaryCurrentDepartmentNumber})
          };
          // 清空完成该任务存储的已扫过出发地和单一目的地科室信息
          let temporarySweepCodeOficeList = deepClone(this.isCompleteSweepCode);
          temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return item.taskId != this.taskId});
          this.changeisCompleteSweepCode(temporarySweepCodeOficeList);
          setStore('completeDispatchSweepCodeInfo', {"sweepCodeInfo": temporarySweepCodeOficeList});
          this.$router.push({path:'/dispatchTask'});
          this.changeTitleTxt({tit:'调度任务'});
          setStore('currentTitle','调度任务')
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

    // 根据科室id获取科室名称
    getDepartmentName () {
      let temporarySweepCodeDestinationList = [];
      let temporarySweepCodeOficeList = [];
      let echoIndex = this.isCompleteSweepCodeDestinationList.indexOf(this.isCompleteSweepCodeDestinationList.filter((item) => {return item.taskId == this.taskId})[0]);
      if (echoIndex == -1) {return};
      temporarySweepCodeOficeList = this.isCompleteSweepCodeDestinationList.filter((item) => { return item.taskId == this.taskId})[0]['officeList'];
      for (let item of temporarySweepCodeOficeList) {
        temporarySweepCodeDestinationList.push(Dictionary(this.departmentInfoListNo,item.toString()))
      };
      this.trackList = temporarySweepCodeDestinationList;
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
        }
      },

    // 取件
    fetchPiece () {
      if (this.dispatchTaskMessage.state == 3 || this.dispatchTaskMessage.state == 4) {
        this.$toast('取件已完成，请点击送件')
      } else {
        this.joinSweepCode()
      }
    },

    // 送件
    sendPiece () {
      if (this.dispatchTaskMessage.state == 2) {
        this.$toast('请先完成出发地取件');
      } else {
        this.joinSweepCode()
      }
    },

    // 进入扫码页
    joinSweepCode () {
      if (this.dispatchTaskMessage.state == 7) {
        this.$dialog.alert({
          message: '该条调度任务已完成,不能进行扫码',
          closeOnPopstate: true
        }).then(() => {
        })
      } else {
      if (this.dispatchTaskMessage.state == 2) {
          // 判断出发地是否强制拍照
          this.changeIsCoerceTakePhoto(this.dispatchTaskMessage.startPhoto);
          this.changeDispatchTaskDepartmentType(0);
          this.changeDispatchTaskState(3)
        } else if (this.dispatchTaskMessage.state == 3) {
          // 判断目的地是否强制拍照
          this.changeIsCoerceTakePhoto(this.dispatchTaskMessage.endPhoto);
          this.changeDispatchTaskDepartmentType(1);
          // 判断是否回到出发地0不回1回
          if (this.dispatchTaskMessage.isBack == 0) {
            this.changeDispatchTaskState(7)
          } else {
            this.changeDispatchTaskState(4)
          }
        } else if (this.dispatchTaskMessage.state == 4) {
          this.changeIsCoerceTakePhoto(this.dispatchTaskMessage.startPhoto);
          this.changeDispatchTaskDepartmentType(0);
          this.changeDispatchTaskState(7)
        };
        this.$router.push({'path':'/dispatchTaskSweepCode'});
        this.changeTitleTxt({tit:'扫码'});
        setStore('currentTitle','扫码')
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
      font-size: 16px;
    .right-text {
      position: absolute;
      top: 10px;
      right: 9px;
      font-size: 16px;
      color: #4788fe;
      width: 80px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: #fff;
      border-radius: 4px;
      display: inline-block
    };
    .basic-message {
      width: 95%;
      margin: 0 auto;
      margin-top: 6px;
      height: auto;
      background: #f3f3f3;
      position: relative;
      border: 1px solid #d6d6d6;
      .basic-message-title {
        position: absolute;
        top: 0;
        left: 0;
        padding: 4px 6px;
        box-sizing: border-box;
        border-right: 1px solid #d6d6d6;
        border-bottom: 1px solid #d6d6d6;
      }
      .wait-handle-message {
        margin-top: 35px;
        .handle-message-line-wrapper {
          margin: 0 5px;
          p {
            margin-bottom: 12px;
            width: 49%;
            display: inline-block;
            vertical-align: top;
            span:first-child {
              color: black
            };
            .message-tit-real-style {
              color: #2895ea;
            }
            span:last-child {
              line-height: 18px
            }
          };
          .describe-line-wrapper {
            width: 100%;
            .message-tit-real-audio {
              margin-left: 4px
            }
          }
        }
        .handle-message-line-wrapper-other {
          p {
            width: 100%;
          }
        }
      }
    }
    .content-middle {
      height: 120px;
      margin: 0 auto;
      width: 100%;
      font-size: 14px;
      background: #f7f7f7;
      position: relative;
      .photo-list {
        position: absolute;
        left: 70px;
        width: 250px;
        top: 10px;
        height: 100px;
        overflow: auto;
        li {
          width: 80px;
          height: 80px;
          float: left;
          margin-right: 4px;
          position: relative;
          margin-bottom: 4px;
          /deep/ .van-icon-cross {
            position: absolute;
            top: 0;
            right:0;
            color: @color-theme;
            font-size: 20px;
          };
          img {
            width: 100%;
            height: 100%
          };
          &:nth-of-type(3n+0)
          {
            margin-right: 0
          }
        }
      };
      .issue-photo {
        position: relative;
        margin-top: 15px;
        height: 100px;
        background: #fff;
        line-height: 100px;
        box-sizing: border-box;
        > span {
          position: absolute;
          display: inline-block;
          &:first-child {
            left: 0;
            top: 0;
            color: #bbbaba;
            padding-left: 10px;
          };
          &:last-child {
            color: @color-theme;
            font-size: 34px;
            font-weight: bold;
            right: 10px;
            top: 4px
          }
        }
      }
    };
    .office-list {
      flex:1;
      overflow: auto;
      width: 95%;
      margin: 0 auto;
      margin-top: 8px;
      height: auto;
      background: #f3f3f3;
      position: relative;
      border: 1px solid #d6d6d6;
      .basic-message-title {
        position: absolute;
        top: 0;
        left: 0;
        padding: 4px 6px;
        box-sizing: border-box;
        border-right: 1px solid #d6d6d6;
        border-bottom: 1px solid #d6d6d6;
      }
      .office-list-inner-wrapper {
        margin-top: 25px;
        box-sizing: border-box;
        width: 100%;
        height: 90%;
        padding: 10px;
        overflow: auto;
        .track-name {
          span {
            display: inline-block;
            line-height: 24px
          }
          .collect-parcel {
            position: relative;
            margin-right: 16px;
            &:after {
              content: "—";
              position: absolute;
            }
          }
          .send-parcel {
            position: relative;
            margin-right: 20px;
            &:after {
              content: "—";
              position: absolute;
            }
          }
        }
      }
    }
    .circultion-task-btn {
      width: 95%;
      margin: 0 auto;
      padding: 10px;
      height: auto;
      span {
        vertical-align: top;
        display: inline-block;
        line-height: 40px;
        height: 40px;
        background: #2895ea;
        color: #fff;
        text-align: center
      }
      .circultion-task-btn-top {
        position: relative;
        height: 40px;
        span {
          width: 47%;
          border-radius: 4px;
          &:first-child {
            position: absolute;
            top: 0;
            left: 0
          }
          &:last-child {
            position: absolute;
            top: 0;
            right: 0
          }
        }
      };
       .circultion-task-btn-bottom {
        position: relative;
        height: 40px;
        margin-top: 10px;
        span {
          width: 100%;
          border-radius: 4px
        }
      }
    };
    .choose-photo-box {
      position: fixed;
      margin: auto;
      left: 0;
      bottom: 0;
      width: 100%;
      z-index: 1000;
      font-size: 0;
      > div {
        width: 100%;
        text-align: center;
        font-size: 16px;
        background: #f6f6f6
      }
      .choose-photo {
        padding: 8px 10px;
        height: 30px;
        .bottom-border-1px(#cbcbcb);
        line-height: 30px;
        position: relative;
        cursor: pointer;
        color: @color-theme;
        overflow: hidden;
        display: inline-block;
        *display: inline;
        *zoom: 1;
        /deep/ .van-icon {
          vertical-align: top;
          font-size: 20px;
          display: inline-block;
          line-height: 30px
        };
        input {
          position: absolute;
          font-size: 100px;
          right: 0;
          top: 0;
          height: 100%;
          opacity: 0;
          filter: alpha(opacity=0);
          cursor: pointer
        }
      };
      .photo-graph {
        position: relative;
        display: inline-block;
        height: 50px;
        overflow: hidden;
        .bottom-border-1px(#cbcbcb);
        color: @color-theme;
        text-decoration: none;
        text-indent: 0;
        line-height: 50px;
        /deep/ .van-icon {
          vertical-align: top;
          font-size: 20px;
          display: inline-block;
          line-height: 50px
        };
        input {
          position: absolute;
          font-size: 100px;
          right: 0;
          height: 100%;
          top: 0;
          opacity: 0;
        }
      };
      .photo-cancel {
        position: relative;
        display: inline-block;
        padding: 8px 12px;
        overflow: hidden;
        color: @color-theme;
        text-decoration: none;
        text-indent: 0;
        line-height: 30px;
        font-weight: bold
      }
    }
  }
</style>

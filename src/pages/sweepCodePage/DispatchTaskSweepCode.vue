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
    <div class="loading">
      <loading :isShow="showLoadingHint" textContent="上传中,请稍候····" textColor="#2895ea"></loading>
    </div>
    <div class="sweep-code-title">
      <h3></h3>
    </div>
    <div class="sweep-code-area">
      <div class="point-area" v-show="appointAreaShow">
        <p class="task-start-point">
          <span>任务起点:</span>
          <span>{{dispatchTaskMessage.setOutPlaceName}}</span>
        </p>
        <p class="task-end-point">
          <span>任务终点:</span>
          <span>{{dispatchTaskMessage.destinationName}}</span>
        </p>
      </div>
      <div class="photo-area-box" v-show="photoAreaBoxShow">
        <div class="photo-preview">
          <img width="100" height="130" id="preview1" :src="upImgUrl"/>
        </div>
        <div class="choose-photo-box">
          <div class="choose-photo">
            <input name="uploadImg1" id="demo1" @change="previewFileOne" type="file" accept="image/album"/>上传照片
          </div>
          <div class="photo-graph">
            <input name="uploadImg2" id="demo2"  @change="previewFileTwo" type="file" accept="image/camera"/>拍照
          </div>
        </div>
      </div>
    </div>
    <div class="btn-area">
      <span v-show="photoAreaBoxShow == true">
        <img :src="taskSurePng" alt=""  @click="submitPhoto">
      </span>
      <span v-show="photoAreaBoxShow == false">
        <img :src="taskSweepCodePng" alt=""  @click="sweepCodeSure">
      </span>
      <span>
        <img :src="taskCancelPng" alt="" @click="cancelSweepCode">
      </span>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import AfterSaleImage from '@/components/AfterSaleImage'
import {judgeDispatchTaskDepartment,updateDispatchTask,dispatchTaskUploadMsg} from '@/api/workerPort.js'
import NoData from '@/components/NoData'
import Loading from '@/components/Loading'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC, repeArray, compressImg} from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  data () {
    return {
      temporaryUpImgUrl: '',
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      showLoadingHint: false,
      photoAreaBoxShow: false,
      appointAreaShow: true,
      srcUrl: '',
      headerImg: '',
      liIndex: null,
      departmentId: '',
      currentSiteId: '',
      compressImgUrl: '',
      upImgUrl: require('@/common/images/home/no-data-default.png'),
      taskSurePng: require('@/components/images/task-sure.png'),
      taskCancelPng: require('@/components/images/task-cancel.png'),
      taskSweepCodePng: require('@/components/images/task-sweep-code.png')
    };
  },

  components:{
    HeaderTop,
    NoData,
    Loading,
    AfterSaleImage
  },

  mounted () {
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        this.$router.push({path:'/dispatchTask'});
        this.changeTitleTxt({tit:'调度任务'});
        setStore('currentTitle','调度任务')
      })
    };
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    };
    if (this.dispatchTaskDepartmentType == 0) {
      this.currentSiteId = this.dispatchTaskMessage.setOutPlaceId
    } else if (this.dispatchTaskDepartmentType == 1) {
      this.currentSiteId = this.dispatchTaskMessage.destinationId
    };
    console.log('调度任务状态' ,this.dispatchTaskMessage, this.dispatchTaskState, this.dispatchTaskDepartmentType,this.isCoerceTakePhoto);
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'dispatchTaskMessage',
      'dispatchTaskState',
      'dispatchTaskDepartmentType',
      'isCoerceTakePhoto',
      'isCompleteSweepCode'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    },
    proName () {
      return JSON.parse(getStore('userInfo')).extendData.proName
    },
    taskId () {
      return this.dispatchTaskMessage.id
    }
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeisCompleteSweepCode',
    ]),

    // 扫描二维码方法
    sweepAstoffice () {
      window.android.scanQRcode()
    },

    // 图片上传预览
    previewFileOne() {
      let img = document.getElementById("preview1");
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
        img.src = reader.result;
        _this.upImgUrl = reader.result;
        _this.temporaryUpImgUrl = reader.result
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      };
    },

    //拍照预览
    previewFileTwo() {
      let img = document.getElementById("preview1");
      let file = document.getElementById("demo2").files[0];
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
        img.src = reader.result;
        _this.upImgUrl = reader.result;
        _this.temporaryUpImgUrl = reader.result
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      };
    },

    // 压缩回调
    compressCallback(data) {
      this.compressImgUrl = data;
      this.uploadPhoto(
        {
          taskId: this.taskId,  //任务ID必填
          proId: this.proId,  //项目ID必填
          proName: this.proName,//项目名称必填项
          type: this.dispatchTaskDepartmentType,  //'图片类型 0-出发地，1-目的地', 必填项
          taskType: 0,     //'任务类型 0-调度类，1-循环类，2-预约类' 必填项
          photo: this.compressImgUrl //base64字符串必填
        }
      );
    },
    
    // 上传图片
    uploadPhoto (data) {
      dispatchTaskUploadMsg(data).then((res) => {
        this.showLoadingHint = false;
        if (res && res.data.code == 200) {
          this.updateTaskState({
            proId: this.proId, //当前项目ID
            id: this.dispatchTaskMessage.id, //当前任务ID
            state: this.dispatchTaskState//更新后的状态 {0: '未分配', 1: '未查阅', 2: '未开始', 3: '进行中', 4: '未结束', 5: '已延迟', 6: '已取消', 7: '已完成'
          });
          this.photoAreaBoxShow = false
        } else {
          this.$dialog.alert({
            message: `${res.data.msg}`,
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
        this.showLoadingHint = false;
      })
    },

    // 提交图片
    submitPhoto () {
      if (this.temporaryUpImgUrl == '') {
        this.$dialog.alert({
          message: '请上传照片',
          closeOnPopstate: true
        }).then(() => {
        });
        return
      };
      this.showLoadingHint = true;
      // 压缩图片
      compressImg(this.upImgUrl,this.compressCallback);
    },

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      if (code) {
        let codeData = code.split('|');
        if (codeData.length > 0) {
          this.departmentId = codeData[0];
          this.juddgeCurrentDepartment({
            id: this.dispatchTaskMessage.id,  //任务ID
            proId: this.proId,  //项目ID
            departmentId: this.departmentId,  //科室ID
            checkType: this.dispatchTaskDepartmentType   //校验类型  出发地-0,目的地-1
          })
        }
      } else {
        this.$dialog.alert({
          message: '当前没有扫描到任何信息,请重新扫描'
        }).then(() => {
          this.sweepAstoffice()
        });
      }
    },

    // 重新扫码弹窗
    againSweepCode () {
      this.sweepAstoffice()
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

    // 判断扫码科室
    juddgeCurrentDepartment (data) {
      judgeDispatchTaskDepartment(data).then((res) => {
        if (res && res.data.code == 200) {
          // 存储扫码校验通过的科室id
          let temporaryDepartmentIdListOne = [];
          // 将本次校验通过的科室Id存入store
          temporaryDepartmentIdListOne = this.isCompleteSweepCode;
          temporaryDepartmentIdListOne.push(this.currentSiteId);
          this.changeisCompleteSweepCode(repeArray(temporaryDepartmentIdListOne));
          if (this.isCoerceTakePhoto == 0) {
            this.updateTaskState({
              proId: this.proId, //当前项目ID
              id: this.dispatchTaskMessage.id, //当前任务ID
              state: this.dispatchTaskState//更新后的状态 {0: '未分配', 1: '未查阅', 2: '未开始', 3: '进行中', 4: '未结束', 5: '已延迟', 6: '已取消', 7: '已完成'
            });
            this.photoAreaBoxShow = false;
            this.appointAreaShow = true;
          } else {
            this.photoAreaBoxShow = true;
            this.appointAreaShow = false;
          }
        } else {
          this.$dialog.alert({
            message: res.data.msg,
            closeOnPopstate: true,
            showCancelButton: true 
          }).then(() => {
            this.againSweepCode()
          }).catch((err) =>{})
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

    // 更新任务状态
    updateTaskState (data) {
      updateDispatchTask(data).then((res) => {
        if (res && res.data.code == 200) {
          this.temporaryUpImgUrl = '';
          if (this.dispatchTaskDepartmentType == 1) {
            this.$dialog.alert({
              message: '该条任务已完成',
              closeOnPopstate: true
            }).then(() => {
            });
          };
          // 从store中删除本次更新过状态的科室id
          let temporaryDepartmentIdListTwo = [];
          temporaryDepartmentIdListTwo = this.isCompleteSweepCode;
          this.changeisCompleteSweepCode(temporaryDepartmentIdListTwo.filter((item) => { return item != this.currentSiteId}));
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

    // 返回上一页
    backTo () {
      this.$router.push({path:'/dispatchTask'});
      this.changeTitleTxt({tit:'调度任务'});
      setStore('currentTitle','调度任务')
    },

     // 扫码确认事件
    sweepCodeSure () {
      if (this.isCompleteSweepCode.indexOf(this.currentSiteId) !== -1) {
        if (this.isCoerceTakePhoto == 1) {
          this.$dialog.alert({
            message: '该科室校验已验证通过,请拍照',
            closeOnPopstate: true
          }).then(() => {
          });
          this.photoAreaBoxShow = true;
          this.appointAreaShow = false
        } else {
          this.sweepAstoffice()
        };
        return
      };
      this.sweepAstoffice()
    },

    // 取消扫码事件
    cancelSweepCode () {
      this.$router.push({path:'/dispatchTask'});
      this.changeTitleTxt({tit:'调度任务'});
      setStore('currentTitle','调度任务')
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
    .loading {
      position: absolute;
      top: 450px;
      left: 0;
      width: 100%;
      height: 50px;
      text-align: center;
    };
    .sweep-code-title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      h3 {
        font-size: 14px;
        color: #1699e8
      }
    };
    .sweep-code-area {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
      .point-area {
        height: auto;
        width: 80%;
        background: #fff;
        margin-left: 4%;
        margin-top: 140px;
        padding: 20px 10px 20px 20px;
        box-shadow: 0 2.5px 12px 4px #d1d1d1;
        border-radius: 8px;
        color: #313131;
        font-weight: bold;
        letter-spacing: 2px;
        p {
          margin-bottom: 20px;
          padding-left: 10px;
          font-size: 16px;
          span {
            &:first-child {
              color: #585858;
            }
          }
        }
      }
      .photo-area-box {
        .photo-preview {
          width: 70%;
          height: 250px;
          margin: 0 auto;
          margin-top: 50px;
          box-shadow: 0px 0px 8px 6px rgba(231, 231, 231, 0.8);
          img {
            width: 100%;
            height: 100%
          }
        }
        .choose-photo-box {
          margin-top: 30px;
          text-align: center;
          > div {
            display: inline-block;
            width: 100px
          }
          .choose-photo {
            padding: 8px 10px;
            height: 20px;
            line-height: 20px;
            position: relative;
            cursor: pointer;
            color: #888;
            background: #fafafa;
            border: 1px solid #ddd;
            border-radius: 4px;
            overflow: hidden;
            display: inline-block;
            *display: inline;
            *zoom: 1;
            input {
              position: absolute;
              font-size: 100px;
              right: 0;
              top: 0;
              opacity: 0;
              filter: alpha(opacity=0);
              cursor: pointer
            }
          };
          .photo-graph {
            position: relative;
            display: inline-block;
            background: #D0EEFF;
            border: 1px solid #99D3F5;
            border-radius: 4px;
            padding: 8px 12px;
            overflow: hidden;
            color: #1E88C7;
            text-decoration: none;
            text-indent: 0;
            line-height: 20px;
            input {
              position: absolute;
              font-size: 100px;
              right: 0;
              top: 0;
              opacity: 0;
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
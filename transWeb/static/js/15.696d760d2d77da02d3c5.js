webpackJsonp([15],{bLQi:function(e,t){},c7aL:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=i("4YfN"),a=i.n(s),n=i("hRKE"),c=i.n(n),o=i("0eBz"),r=i("0DTB"),l=i("fFvN"),f=i("sqAx"),h=i("NxGh"),p=i("upvi"),d=i("fdFc"),u=(i("M9A7"),{data:function(){return{leftDropdownDataList:["退出登录"],leftDownShow:!1,showLoadingHint:!1,liIndex:null,startPointList:[],taskCancelPng:i("faDW"),taskSweepCodePng:i("g5KD")}},components:{HeaderTop:o.a,NoData:f.a,Loading:h.a,FooterBottom:r.a},mounted:function(){var e=this;if(console.log("id",this.clickDepartmentId,c()(this.clickDepartmentId)),!Object(d.b)()){pushHistory(),this.gotoURL(function(){e.changeIsrefreshCirculationConnectPage(!1),e.$router.push({path:"/circulationTask"}),e.changeTitleTxt({tit:"循环任务"}),Object(d.o)("currentTitle","循环任务")})}this.echoOfficeList();var t=this;window.scanQRcodeCallback=function(e){t.scanQRcodeCallback(e)}},computed:a()({},Object(p.b)(["navTopTitle","circulationTaskMessage","isCollectEnterSweepCodePage","stipulateOfficeList","arriveDepartmentId","isDispatchTaskCompleteSweepCodeOfficeList","isFirstSweepCode"]),{proId:function(){return JSON.parse(Object(d.i)("userInfo")).extendData.proId},circulationId:function(){return this.circulationTaskMessage.currentMsg.id},officeNameList:function(){return this.stipulateOfficeList},clickDepartmentId:function(){return this.circulationTaskMessage.officeId}}),methods:a()({},Object(p.c)(["changeTitleTxt","changeStoreArriveDeparnmentId","changeIsrefreshCirculationConnectPage","changeIsDispatchTaskCompleteSweepCodeOfficeList","changeIsFirstSweepCode"]),{leftLiCLick:function(e){this.liIndex=e,localStorage.clear(),this.$router.push({path:"/"})},skipMyInfo:function(){this.leftDownShow=!this.leftDownShow},sweepAstoffice:function(){window.android.scanQRcode()},againSweepCode:function(){this.sweepAstoffice()},echoOfficeList:function(){this.startPointList=this.officeNameList},backTo:function(){this.changeIsrefreshCirculationConnectPage(!1),this.$router.push({path:"/circulationTask"}),this.changeTitleTxt({tit:"循环任务"}),Object(d.o)("currentTitle","循环任务")},scanQRcodeCallback:function(e){var t=this;if(e){var i=e.split("|");if(i.length>0){var s=i[0];if(this.arriveDepartmentId)this.changeStoreArriveDeparnmentId(s),Object(d.o)("currentDepartmentId",s),this.changeIsrefreshCirculationConnectPage(!0),this.$router.push({path:"/circulationTaskMessageConnect"}),this.changeTitleTxt({tit:"循环信息交接"}),Object(d.o)("currentTitle","循环信息交接");else{if(s!=this.clickDepartmentId)return void this.$dialog.alert({message:"当前扫码科室与所选科室不一致,请重新扫码"}).then(function(){});this.juddgeMedicalCorrect({id:this.circulationId,proId:this.proId,departmentId:s})}}}else this.$dialog.alert({message:"当前没有扫描到任何信息,请重新扫描"}).then(function(){t.sweepAstoffice()})},sweepCodeSure:function(){var e=this;if(this.arriveDepartmentId)this.sweepAstoffice();else if(this.isFirstSweepCode)this.sweepAstoffice();else{var t,i="";-1!=(t=this.isDispatchTaskCompleteSweepCodeOfficeList.indexOf(this.isDispatchTaskCompleteSweepCodeOfficeList.filter(function(t){return t.taskId==e.circulationId})[0]))&&(i=this.isDispatchTaskCompleteSweepCodeOfficeList[t].officeList.indexOf(this.clickDepartmentId)),-1!==t&&-1!==i&&""!==i?(this.$dialog.alert({message:"当前科室已扫码校验通过,请直接开始采集"}).then(function(){}),this.$router.push({path:"/circulationTaskCollectMessage"}),this.changeTitleTxt({tit:"循环信息采集"}),Object(d.o)("currentTitle","循环信息采集")):this.sweepAstoffice()}},juddgeMedicalCorrect:function(e){var t=this;this.showLoadingHint=!0,Object(l.l)(e).then(function(e){if(e&&200==e.data.code){if(t.changeIsFirstSweepCode(!1),Object(d.o)("isCirculationFirstSweepCode",!1),t.isCollectEnterSweepCodePage){var i=[],s=[];if(i=Object(d.g)(t.isDispatchTaskCompleteSweepCodeOfficeList),t.isDispatchTaskCompleteSweepCodeOfficeList.length>0){var a=t.isDispatchTaskCompleteSweepCodeOfficeList.indexOf(t.isDispatchTaskCompleteSweepCodeOfficeList.filter(function(e){return e.taskId==t.circulationId})[0]);-1!=a?((s=i[a].officeList).push(t.clickDepartmentId),i[a].officeList=Object(d.m)(s)):(s.push(t.clickDepartmentId),i.push({officeList:Object(d.m)(s),taskId:t.circulationId}))}else s.push(t.clickDepartmentId),i.push({officeList:Object(d.m)(s),taskId:t.circulationId});t.changeIsDispatchTaskCompleteSweepCodeOfficeList(i),Object(d.o)("completeCirculationSweepCodeInfo",{sweepCodeInfo:i}),t.$router.push({path:"/circulationTaskCollectMessage"}),t.changeTitleTxt({tit:"循环信息采集"}),Object(d.o)("currentTitle","循环信息采集")}}else t.$dialog.alert({message:e.data.msg,closeOnPopstate:!0,showCancelButton:!0}).then(function(){t.againSweepCode()}).catch(function(e){});t.showLoadingHint=!1}).catch(function(e){t.showLoadingHint=!1,t.$dialog.alert({message:""+e.message,closeOnPopstate:!0}).then(function(){})})},cancelSweepCode:function(){this.changeIsrefreshCirculationConnectPage(!1),this.$router.push({path:"/circulationTask"}),this.changeTitleTxt({tit:"循环任务"}),Object(d.o)("currentTitle","循环任务")}})}),C={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"content-wrapper"},[i("HeaderTop",{attrs:{title:e.navTopTitle}},[i("van-icon",{attrs:{slot:"left",name:"arrow-left"},on:{click:e.backTo},slot:"left"})],1),e._v(" "),i("ul",{directives:[{name:"show",rawName:"v-show",value:e.leftDownShow,expression:"leftDownShow"}],staticClass:"left-dropDown"},e._l(e.leftDropdownDataList,function(t,s){return i("li",{key:s,class:{liStyle:e.liIndex==s},on:{click:function(t){return e.leftLiCLick(s)}}},[e._v(e._s(t))])}),0),e._v(" "),i("div",{staticClass:"loading"},[i("loading",{attrs:{isShow:e.showLoadingHint,textContent:"校验中,请稍候····",textColor:"#2895ea"}})],1),e._v(" "),i("div",{staticClass:"sweep-code-area"},[i("div",{staticClass:"point-area"},[i("div",{directives:[{name:"show",rawName:"v-show",value:0==e.arriveDepartmentId,expression:"arriveDepartmentId == false"}],staticClass:"task-start-point"},[i("p",[e._v("任务起点:(扫码科室必须为下列其中一个)")]),e._v(" "),i("ul",e._l(e.startPointList,function(t,s){return i("li",{key:s},[e._v(e._s(t.text))])}),0)]),e._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:1==e.arriveDepartmentId,expression:"arriveDepartmentId == true"}],staticClass:"task-start-point"},[i("p",[e._v("请扫描标本送达的科室")])])])]),e._v(" "),i("div",{staticClass:"btn-area"},[i("span",[i("img",{attrs:{src:e.taskSweepCodePng,alt:""},on:{click:e.sweepCodeSure}})]),e._v(" "),i("span",[i("img",{attrs:{src:e.taskCancelPng,alt:""},on:{click:e.cancelSweepCode}})])])],1)},staticRenderFns:[]};var w=i("C7Lr")(u,C,!1,function(e){i("bLQi")},"data-v-7046261a",null);t.default=w.exports}});
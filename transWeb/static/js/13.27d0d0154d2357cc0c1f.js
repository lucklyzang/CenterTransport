webpackJsonp([13],{ILpw:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n("HzJ8"),a=n.n(o),r=n("4YfN"),s=n.n(r),i=n("0eBz"),c=n("0DTB"),p=n("M9A7"),l=n("fFvN"),u=n("sqAx"),f=n("SJI6"),h=n("fdFc"),d={name:"appointTaskForm",data:function(){return{leftDropdownDataList:["退出登录"],leftDownShow:!1,liIndex:null,currentPerson:"",onlinePersonLlist:[],taskSurePng:n("WoXg"),taskCancelPng:n("faDW")}},components:{HeaderTop:i.a,NoData:u.a,FooterBottom:c.a},mounted:function(){var e=this;if(!Object(h.b)()){pushHistory(),this.gotoURL(function(){pushHistory(),e.$router.push({path:"/appointTask"}),e.changeTitleTxt({tit:"预约任务"}),Object(h.q)("currentTitle","预约任务")})}this.queryOnlineWorker({proId:this.proId,state:""})},computed:s()({},Object(f.mapGetters)(["appointTaskTransferIdList","navTopTitle","userInfo","completeCheckedItemInfo","completeSweepcodeDestinationInfo","completeSweepcodeDepartureInfo"]),{proId:function(){return this.userInfo.extendData.proId},workerId:function(){return this.userInfo.extendData.userId},workerName:function(){return this.userInfo.name}}),methods:s()({},Object(f.mapMutations)(["changeTitleTxt","changeAppointTaskTransferIdList","changeCatchComponent","changeCompleteCheckedItemInfo","changeCompleteSweepcodeDestinationInfo","changeCompleteSweepcodeDepartureInfo"]),{queryOnlineWorker:function(e){var t=this;Object(p.a)(e).then(function(e){if(e&&200==e.data.code){t.onlinePersonLlist=[{text:"请选择",value:""}];var n=!0,o=!1,r=void 0;try{for(var s,i=a()(e.data.data);!(n=(s=i.next()).done);n=!0){var c=s.value,p=[];for(var l in c)"id"==l&&p.push(c[l]),"workerName"==l&&p.push(c[l]);t.onlinePersonLlist.push({text:p[1],value:p[0]})}}catch(e){o=!0,r=e}finally{try{!n&&i.return&&i.return()}finally{if(o)throw r}}}}).catch(function(e){console.log(e)})},leftLiCLick:function(e){this.liIndex=e,localStorage.clear(),this.$router.push({path:"/"})},skipMyInfo:function(){this.leftDownShow=!this.leftDownShow},backTo:function(){this.$router.push({path:"/appointTask"}),this.changeTitleTxt({tit:"预约任务"}),Object(h.q)("currentTitle","预约任务")},sureTransferDispatchTask:function(e){var t=this;Object(l.G)(e).then(function(e){e&&200==e.data.code?(t.$toast(""+e.data.msg),t.emptyCompleteCheckedItem(),t.emptyCompleteDestinationDepartment(),t.emptyCompleteDepartureDepartment(),t.$router.push({path:"/appointTask"}),t.changeTitleTxt({tit:"预约任务"}),Object(h.q)("currentTitle","预约任务")):t.$dialog.alert({message:e.data.msg,closeOnPopstate:!0}).then(function(){})}).catch(function(e){t.$dialog.alert({message:""+e.message,closeOnPopstate:!0}).then(function(){})})},transferPersonSure:function(){var e,t=this;(e=this.onlinePersonLlist.filter(function(e){return e.value==t.currentPerson})[0].text)!=this.workerName?"请选择"!=e?this.sureTransferDispatchTask({taskId:this.appointTaskTransferIdList[0],afterWorkerId:this.currentPerson,beforeWorkerId:this.workerId}):this.$toast("请选择要转移的人员"):this.$toast("任务不能转移给自己")},transferPersonCancel:function(){this.$router.push({path:"/appointTask"}),this.changeTitleTxt({tit:"预约任务"}),Object(h.q)("currentTitle","预约任务")},emptyCompleteCheckedItem:function(){var e=this,t=Object(h.j)(this.completeCheckedItemInfo);t=t.filter(function(t){return t.taskId!=e.appointTaskTransferIdList[0]}),this.changeCompleteCheckedItemInfo(t),Object(h.q)("completAppointTaskCheckedItemInfo",{sweepCodeInfo:t})},emptyCompleteDestinationDepartment:function(){var e=this,t=Object(h.j)(this.completeSweepcodeDestinationInfo);t=t.filter(function(t){return t.taskId!=e.appointTaskTransferIdList[0]}),this.changeCompleteSweepcodeDestinationInfo(t),Object(h.q)("completAppointTaskSweepCodeDestinationInfo",{sweepCodeInfo:t})},emptyCompleteDepartureDepartment:function(){var e=this,t=Object(h.j)(this.completeSweepcodeDepartureInfo);t=t.filter(function(t){return t.taskId!=e.appointTaskTransferIdList[0]}),this.changeCompleteSweepcodeDepartureInfo(t),Object(h.q)("completAppointTaskSweepCodeDepartureInfo",{sweepCodeInfo:t})}})},m={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"content-wrapper"},[n("HeaderTop",{attrs:{title:e.navTopTitle}},[n("van-icon",{attrs:{slot:"left",name:"arrow-left"},on:{click:e.backTo},slot:"left"})],1),e._v(" "),n("ul",{directives:[{name:"show",rawName:"v-show",value:e.leftDownShow,expression:"leftDownShow"}],staticClass:"left-dropDown"},e._l(e.leftDropdownDataList,function(t,o){return n("li",{key:o,class:{liStyle:e.liIndex==o},on:{click:function(t){return e.leftLiCLick(o)}}},[e._v(e._s(t))])}),0),e._v(" "),n("div",{staticClass:"sweep-code-title"},[n("h3",[e._v("在线的工作人员")]),e._v(" "),n("van-dropdown-menu",[n("van-dropdown-item",{attrs:{options:e.onlinePersonLlist},model:{value:e.currentPerson,callback:function(t){e.currentPerson=t},expression:"currentPerson"}})],1)],1),e._v(" "),n("div",{staticClass:"btn-area"},[n("span",[n("img",{attrs:{src:e.taskSurePng,alt:""},on:{click:e.transferPersonSure}})]),e._v(" "),n("span",[n("img",{attrs:{src:e.taskCancelPng,alt:""},on:{click:e.transferPersonCancel}})])])],1)},staticRenderFns:[]};var I=n("C7Lr")(d,m,!1,function(e){n("xaLs")},"data-v-b4b9d492",null);t.default=I.exports},xaLs:function(e,t){}});
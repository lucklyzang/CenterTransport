webpackJsonp([11],{ILpw:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n("HzJ8"),a=n.n(r),o=n("4YfN"),s=n.n(o),i=n("0eBz"),c=n("0DTB"),l=n("M9A7"),u=n("fFvN"),f=n("sqAx"),h=n("upvi"),p=n("fdFc"),d={data:function(){return{leftDropdownDataList:["退出登录"],leftDownShow:!1,liIndex:null,currentPerson:"",onlinePersonLlist:[],taskSurePng:n("WoXg"),taskCancelPng:n("faDW")}},components:{HeaderTop:i.a,NoData:f.a,FooterBottom:c.a},mounted:function(){var t=this;if(!Object(p.b)()){pushHistory(),this.gotoURL(function(){pushHistory(),t.$router.push({path:"/appointTask"}),t.changeTitleTxt({tit:"预约任务"}),Object(p.o)("currentTitle","预约任务")})}this.queryOnlineWorker({proId:this.proId,state:""})},computed:s()({},Object(h.b)(["appointTaskTransferIdList","navTopTitle","userInfo"]),{proId:function(){return this.userInfo.extendData.proId},workerId:function(){return this.userInfo.extendData.userId},workerName:function(){return this.userInfo.extendData.userName}}),methods:s()({},Object(h.c)(["changeTitleTxt","changeAppointTaskTransferIdList"]),{queryOnlineWorker:function(t){var e=this;Object(l.a)(t).then(function(t){if(t&&200==t.data.code){e.onlinePersonLlist=[];var n=!0,r=!1,o=void 0;try{for(var s,i=a()(t.data.data);!(n=(s=i.next()).done);n=!0){var c=s.value,l=[];for(var u in c)"id"==u&&l.push(c[u]),"workerName"==u&&l.push(c[u]);e.onlinePersonLlist.push({text:l[1],value:l[0]})}}catch(t){r=!0,o=t}finally{try{!n&&i.return&&i.return()}finally{if(r)throw o}}}}).catch(function(t){console.log(t)})},leftLiCLick:function(t){this.liIndex=t,localStorage.clear(),this.$router.push({path:"/"})},skipMyInfo:function(){this.leftDownShow=!this.leftDownShow},backTo:function(){this.$router.push({path:"/appointTask"}),this.changeTitleTxt({tit:"预约任务"}),Object(p.o)("currentTitle","预约任务")},sureTransferDispatchTask:function(t){var e=this;Object(u.y)(t).then(function(t){t&&200==t.data.code?e.$dialog.alert({message:t.data.msg,closeOnPopstate:!0}).then(function(){e.$router.push({path:"/appointTask"}),e.changeTitleTxt({tit:"预约任务"}),Object(p.o)("currentTitle","预约任务")}):e.$dialog.alert({message:t.data.msg,closeOnPopstate:!0}).then(function(){})}).catch(function(t){e.$dialog.alert({message:""+t.message,closeOnPopstate:!0}).then(function(){})})},transferPersonSure:function(){var t,e=this;(t=this.onlinePersonLlist.filter(function(t){return t.value==e.currentPerson})[0].text)!=this.workerName?this.sureTransferDispatchTask({taskIds:this.appointTaskTransferIdList,afterId:this.currentPerson,afterName:t,modifyId:this.workerId,modifyName:this.workerName}):this.$dialog.alert({message:"任务不能转移给自己",closeOnPopstate:!0}).then(function(){})},transferPersonCancel:function(){this.$router.push({path:"/appointTask"}),this.changeTitleTxt({tit:"预约任务"}),Object(p.o)("currentTitle","预约任务")}})},v={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"content-wrapper"},[n("HeaderTop",{attrs:{title:t.navTopTitle}},[n("van-icon",{attrs:{slot:"left",name:"arrow-left"},on:{click:t.backTo},slot:"left"})],1),t._v(" "),n("ul",{directives:[{name:"show",rawName:"v-show",value:t.leftDownShow,expression:"leftDownShow"}],staticClass:"left-dropDown"},t._l(t.leftDropdownDataList,function(e,r){return n("li",{key:r,class:{liStyle:t.liIndex==r},on:{click:function(e){return t.leftLiCLick(r)}}},[t._v(t._s(e))])}),0),t._v(" "),n("div",{staticClass:"sweep-code-title"},[n("h3",[t._v("在线的工作人员")]),t._v(" "),n("van-dropdown-menu",[n("van-dropdown-item",{attrs:{options:t.onlinePersonLlist},model:{value:t.currentPerson,callback:function(e){t.currentPerson=e},expression:"currentPerson"}})],1)],1),t._v(" "),n("div",{staticClass:"btn-area"},[n("span",[n("img",{attrs:{src:t.taskSurePng,alt:""},on:{click:t.transferPersonSure}})]),t._v(" "),n("span",[n("img",{attrs:{src:t.taskCancelPng,alt:""},on:{click:t.transferPersonCancel}})])])],1)},staticRenderFns:[]};var T=n("C7Lr")(d,v,!1,function(t){n("jYcq")},"data-v-fcb7682e",null);e.default=T.exports},jYcq:function(t,e){}});
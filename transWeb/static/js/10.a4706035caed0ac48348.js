webpackJsonp([10],{"37W5":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("4YfN"),s=a.n(n),i=a("0eBz"),o=a("yl8L"),c=a("0DTB"),l=a("L0wb"),r=a("sqAx"),u=a("upvi"),d=a("fdFc"),h=(a("M9A7"),{data:function(){return{leftDropdownDataList:["退出登录"],leftDownShow:!1,liIndex:null,destinationAddress:0,destinationList:[{text:"全部商品",value:0},{text:"新款商品",value:1},{text:"活动商品",value:2}],vehicleOperation:"",vehicleOperationList:[{text:"全部商品",value:0},{text:"新款商品",value:1},{text:"活动商品",value:2}],bedNumber:"",patientName:"",patientNumber:"",taskDescribe:"",actualData:""}},components:{HeaderTop:i.a,NoData:r.a,FooterBottom:c.a,VanFieldSelectPicker:o.a},computed:s()({},Object(u.b)(["navTopTitle","transportantTaskMessage"])),mounted:function(){var t=this;if(console.log(this.changetransportTypeMessage),!Object(d.b)()){pushHistory(),this.gotoURL(function(){pushHistory(),t.$router.push({path:"home"}),t.changeTitleTxt({tit:"首页"}),Object(d.o)("currentTitle","首页")})}},methods:s()({},Object(u.c)(["changeTitleTxt","changeDispatchTaskMessage","changeIsRefershHome","changeIsHomeJumpOtherPage"]),{backTo:function(){this.$router.push({path:"home"}),this.changeTitleTxt({tit:"中央运送"}),Object(d.o)("currentTitle","中央运送"),this.changeIsHomeJumpOtherPage({DtMsg:!0})},leftLiCLick:function(t){this.liIndex=t,localStorage.clear(),this.$router.push({path:"/"})},skipMyInfo:function(){this.leftDownShow=!this.leftDownShow},getAllDestination:function(t){var e=this;Object(l.c)(t).then(function(t){t&&t.data.code}).catch(function(t){e.$dialog.alert({message:""+t.message,closeOnPopstate:!0}).then(function(){})})},getTransportTools:function(t){var e=this;Object(l.e)(t).then(function(t){t&&t.data.code}).catch(function(t){e.$dialog.alert({message:""+t.message,closeOnPopstate:!0}).then(function(){})})},postGenerateDispatchTask:function(t){var e=this;Object(l.b)(t).then(function(t){t&&t.data.code}).catch(function(t){e.$dialog.alert({message:""+t.message,closeOnPopstate:!0}).then(function(){})})},dispatchTaskSure:function(){this.$router.push({path:"/home"}),this.changeTitleTxt({tit:"中央运送"}),Object(d.o)("currentTitle","中央运送"),this.changeIsRefershHome({DtMsg:!0}),this.changeIsHomeJumpOtherPage({DtMsg:!0})},dispatchTaskCancel:function(){this.$router.push({path:"/home"}),this.changeTitleTxt({tit:"中央运送"}),Object(d.o)("currentTitle","中央运送"),this.changeIsRefershHome({DtMsg:!1}),this.changeIsHomeJumpOtherPage({DtMsg:!0})}})}),p={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"content-wrapper"},[a("HeaderTop",{attrs:{title:t.navTopTitle}},[a("van-icon",{attrs:{slot:"left",name:"arrow-left"},on:{click:t.backTo},slot:"left"}),t._v(" "),a("van-icon",{attrs:{slot:"right",name:"manager-o"},on:{click:t.skipMyInfo},slot:"right"})],1),t._v(" "),a("ul",{directives:[{name:"show",rawName:"v-show",value:t.leftDownShow,expression:"leftDownShow"}],staticClass:"left-dropDown"},t._l(t.leftDropdownDataList,function(e,n){return a("li",{key:n,class:{liStyle:t.liIndex==n},on:{click:function(e){return t.leftLiCLick(n)}}},[t._v(t._s(e))])}),0),t._v(" "),a("div",{staticClass:"transport-type-title"},[a("h3",[t._v(t._s(t.transportantTaskMessage))])]),t._v(" "),a("div",{staticClass:"transport-type-area"},[a("div",{staticClass:"destination-box"},[a("div",{staticClass:"destination-title"},[t._v("目的地")]),t._v(" "),a("div",{staticClass:"destination-content"},[a("van-dropdown-menu",[a("van-dropdown-item",{attrs:{options:t.destinationList},model:{value:t.destinationAddress,callback:function(e){t.destinationAddress=e},expression:"destinationAddress"}})],1)],1)]),t._v(" "),a("van-field",{attrs:{label:"床号",placeholder:"请输入床号"},model:{value:t.bedNumber,callback:function(e){t.bedNumber=e},expression:"bedNumber"}}),t._v(" "),a("van-field",{attrs:{label:"病人姓名",placeholder:"请输入病人姓名"},model:{value:t.patientName,callback:function(e){t.patientName=e},expression:"patientName"}}),t._v(" "),a("van-field",{attrs:{label:"病人编号",placeholder:"请输入病人编号"},model:{value:t.patientNumber,callback:function(e){t.patientNumber=e},expression:"patientNumber"}}),t._v(" "),a("div",{staticClass:"destination-box"},[a("div",{staticClass:"destination-title"},[t._v("工具")]),t._v(" "),a("div",{staticClass:"destination-content"},[a("van-dropdown-menu",[a("van-dropdown-item",{attrs:{options:t.vehicleOperationList},model:{value:t.vehicleOperation,callback:function(e){t.vehicleOperation=e},expression:"vehicleOperation"}})],1)],1)]),t._v(" "),a("van-field",{attrs:{label:"任务描述",placeholder:"请输入任务描述"},model:{value:t.taskDescribe,callback:function(e){t.taskDescribe=e},expression:"taskDescribe"}}),t._v(" "),a("van-field",{attrs:{label:"实际数据",placeholder:"请输入实际数据"},model:{value:t.actualData,callback:function(e){t.actualData=e},expression:"actualData"}})],1),t._v(" "),a("div",{staticClass:"btn-area"},[a("van-button",{attrs:{type:"info"},on:{click:t.dispatchTaskSure}},[t._v("确认")]),t._v(" "),a("van-button",{attrs:{type:"default"},on:{click:t.dispatchTaskCancel}},[t._v("取消")])],1)],1)},staticRenderFns:[]};var v=a("C7Lr")(h,p,!1,function(t){a("WHG2")},"data-v-7dfd277c",null);e.default=v.exports},L0wb:function(t,e,a){"use strict";e.f=function(){return Object(n.a)({url:"",method:"get"})},e.c=function(){return Object(n.a)({url:"",method:"get"})},e.e=function(){return Object(n.a)({url:"",method:"get"})},e.b=function(){return Object(n.a)({url:"",method:"post"})},e.d=function(){return Object(n.a)({url:"",method:"post"})},e.g=function(){return Object(n.a)({url:"",method:"get"})},e.a=function(){return Object(n.a)({url:"",method:"get"})};var n=a("vLgD")},WHG2:function(t,e){}});
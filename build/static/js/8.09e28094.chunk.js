(this.webpackJsonpecomerce=this.webpackJsonpecomerce||[]).push([[8],{109:function(e,a,t){"use strict";t.r(a);var n=t(2),r=t.n(n),l=t(4),o=t(6),s=t(1),c=t(0),i=t.n(c),u=t(3),m=t(7),p=t(90),b=t(29),d=t(14),g=t(88),f=t(93),E=t.n(f);a.default=function(){var e=Object(c.useState)({message:null,loading:!1,succeed:!1}),a=Object(s.a)(e,2),t=a[0],n=a[1],f=Object(m.b)("name",!0),_=Object(m.b)("email",!0),v=Object(m.b)("password",!0);Object(c.useEffect)((function(){var e=setTimeout((function(){n((function(e){return Object(o.a)(Object(o.a)({},e),{},{message:null})}))}),3e3);return function(){clearTimeout(e)}}),[t.message]);var j=function(){var e=Object(l.a)(r.a.mark((function e(a){var t;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a.preventDefault(),n((function(e){return Object(o.a)(Object(o.a)({},e),{},{loading:!0})})),e.next=4,Object(u.a)("post","users",null,{name:f.value,email:_.value,password:v.value});case 4:t=e.sent,n((function(e){return Object(o.a)(Object(o.a)({},e),{},{message:t.message,loading:!1,succeed:t.ok})})),t.ok&&(f.onChange({target:{value:""}}),_.onChange({target:{value:""}}),v.onChange({target:{value:""}}));case 7:case"end":return e.stop()}}),e)})));return function(a){return e.apply(this,arguments)}}();return i.a.createElement(g.a,null,i.a.createElement(p.a,Object.assign({},f,{label:"User name"})),i.a.createElement("br",{style:{marginBottom:"3rem"}}),i.a.createElement(p.a,Object.assign({},_,{label:"Email"})),i.a.createElement("br",{style:{marginBottom:"3rem"}}),i.a.createElement(p.a,Object.assign({},v,{label:"Password"})),i.a.createElement("p",{className:E.a.Message,style:{color:t.succeed?"green":"red"}},t.loading?i.a.createElement(d.a,null):t.message),t.succeed?i.a.createElement("p",{className:E.a.checkMail},"Check your mail!"):i.a.createElement(b.a,{text:"Sign Up",classFromProps:_.isValid&&v.isValid&&f.isValid?E.a.Button:E.a.ButtonDisabled,onClick:_.isValid&&v.isValid&&f.isValid&&!t.loading?j:function(e){return e.preventDefault()}}))}},88:function(e,a,t){"use strict";var n=t(0),r=t.n(n),l=t(89),o=t.n(l);a.a=function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:o.a.Background}),r.a.createElement("form",{className:o.a.FormContainer},e.children))}},89:function(e,a,t){e.exports={Background:"FormContainer_Background__2lPQo",FormContainer:"FormContainer_FormContainer__1rPIB"}},90:function(e,a,t){"use strict";function n(e,a){if(null==e)return{};var t,n,r=function(e,a){if(null==e)return{};var t,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)t=l[n],a.indexOf(t)>=0||(r[t]=e[t]);return r}(e,a);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)t=l[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var r=t(0),l=t.n(r),o=t(91),s=t.n(o);a.a=function(e){var a=e.type,t=e.label,r=e.isValid,o=e.error,c=n(e,["type","label","isValid","error"]),i={};switch(!0===r?i={borderBottom:"2px solid blue"}:!1===r&&(i={borderBottom:"2px solid red"}),a){case"email":return l.a.createElement("div",{className:s.a.InputContainer},l.a.createElement("label",{htmlFor:"email"},t),l.a.createElement("input",Object.assign({},c,{type:a,id:"email",className:s.a.Input,style:i})),!1===r&&l.a.createElement("div",{className:s.a.Tooltip},"!",l.a.createElement("span",{className:s.a.TooltipText},o.join(".\n"))));case"number":return l.a.createElement("div",{className:s.a.InputContainer},l.a.createElement("label",{htmlFor:t},t),l.a.createElement("input",Object.assign({},c,{type:"text",id:t,className:s.a.Input,style:i})),!1===r&&l.a.createElement("div",{className:s.a.Tooltip},"!",l.a.createElement("span",{className:s.a.TooltipText},o.join(".\n"))));case"password":return l.a.createElement("div",{className:s.a.InputContainer},l.a.createElement("label",{htmlFor:t},t),l.a.createElement("input",Object.assign({},c,{type:a,id:t,className:s.a.Input,style:i})),!1===r&&l.a.createElement("div",{className:s.a.Tooltip},"!",l.a.createElement("span",{className:s.a.TooltipText},o.join(".\n"))));default:return l.a.createElement("div",{className:s.a.InputContainer},l.a.createElement("label",{htmlFor:t},t),l.a.createElement("input",Object.assign({type:"text"},c,{id:t,className:s.a.Input,style:i})),!1===r&&l.a.createElement("div",{className:s.a.Tooltip},"!",l.a.createElement("span",{className:s.a.TooltipText},o.join(".\n"))))}}},91:function(e,a,t){e.exports={InputContainer:"Input_InputContainer__3-grW",Input:"Input_Input__bZUEZ",Tooltip:"Input_Tooltip__1uJvh",TooltipText:"Input_TooltipText__1VF9Q"}},93:function(e,a,t){e.exports={Background:"SignUpForm_Background__2A8BP",FormContainer:"SignUpForm_FormContainer__3XNy7",Message:"SignUpForm_Message__3k1Be",checkMail:"SignUpForm_checkMail__3_w7-",Button:"SignUpForm_Button__1bUT-",ButtonDisabled:"SignUpForm_ButtonDisabled__2pYbI"}}}]);
//# sourceMappingURL=8.09e28094.chunk.js.map
(this.webpackJsonpecomerce=this.webpackJsonpecomerce||[]).push([[9],{112:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a(0),c=a.n(r),o=a(5),s=a(3),l=a(88),u=a(29),i=a(14),m=a(96),_=a.n(m);t.default=function(){var e=Object(o.i)().token,t=Object(o.g)(),a=Object(r.useState)(null),m=Object(n.a)(a,2),g=m[0],F=m[1],f=Object(r.useState)(!0),b=Object(n.a)(f,2),p=b[0],E=b[1],d=Object(r.useState)(!1),j=Object(n.a)(d,2),O=j[0],k=j[1];Object(r.useEffect)((function(){Object(s.a)("post","users/activate",null,{token:e}).then((function(e){k(e.ok),F(e.message),E(!1)}))}),[e]);var v=O?c.a.createElement(u.a,{text:"Switch to login",classFromProps:_.a.Button,onClick:function(){return t.push("/auth/login")}}):c.a.createElement("p",{className:_.a.Failed},"Please try again!");return c.a.createElement(l.a,null,p?c.a.createElement(i.a,null):c.a.createElement(c.a.Fragment,null,c.a.createElement("p",{className:_.a.Message,style:{color:O?"green":"red"}},g),v))}},88:function(e,t,a){"use strict";var n=a(0),r=a.n(n),c=a(89),o=a.n(c);t.a=function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:o.a.Background}),r.a.createElement("form",{className:o.a.FormContainer},e.children))}},89:function(e,t,a){e.exports={Background:"FormContainer_Background__2lPQo",FormContainer:"FormContainer_FormContainer__1rPIB"}},96:function(e,t,a){e.exports={Message:"ActivateForm_Message__nnCYM",Button:"ActivateForm_Button__3x7eA",Failed:"ActivateForm_Failed__3ZEVl"}}}]);
//# sourceMappingURL=9.f0de25c1.chunk.js.map
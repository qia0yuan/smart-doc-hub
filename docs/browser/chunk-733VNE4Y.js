import{a as v,b as M,c as U,d as w}from"./chunk-RLVUNBHG.js";import{pa as S,qa as E}from"./chunk-VYUACRAI.js";import"./chunk-U3QUSVWF.js";import"./chunk-52IFERTC.js";import{Ab as h,Bb as x,Ca as o,Cb as C,Eb as _,Ma as f,Nb as c,Ra as b,Za as s,ca as u,da as g,gb as e,hb as t,ib as p,mb as y,wb as i,xb as r}from"./chunk-XA343ORM.js";var R=()=>({"min-width":"50rem"});function k(a,l){a&1&&(e(0,"tr")(1,"th",9),p(2,"p-tableHeaderCheckbox"),t(),e(3,"th"),i(4,"User ID"),t(),e(5,"th"),i(6,"Name"),t(),e(7,"th"),i(8,"Group"),t(),e(9,"th"),i(10,"Date Joined"),t()())}function D(a,l){if(a&1&&(e(0,"tr")(1,"td"),p(2,"p-tableCheckbox",10),t(),e(3,"td"),i(4),t(),e(5,"td"),i(6),t(),e(7,"td"),i(8),t(),e(9,"td"),i(10),t()()),a&2){let n=l.$implicit;o(2),s("value",n),o(2),r(n.id),o(2),r(n.name),o(2),r(n.group),o(2),r(n.date)}}var T=class a{users;selectedUsers;ngOnInit(){this.users=[{id:"1000",name:"George",description:"Account of George.",group:"Retail",date:"08/01/2021"},{id:"1001",name:"Venky",description:"Account of Venky.",group:"Retail",date:"09/01/2021"},{id:"1002",name:"Rahul",description:"Account of Rahul.",group:"ERMS+",date:"09/01/2021"}]}static \u0275fac=function(n){return new(n||a)};static \u0275cmp=f({type:a,selectors:[["app-user-management"]],decls:11,vars:4,consts:[["header",""],["body",""],[1,"user-management-container"],[1,"d-flex","gap-3","justify-content-end","mb-3"],["label","Create"],["label","Update"],["label","Delete"],[1,"card"],["dataKey","id",3,"selectionChange","value","selection","tableStyle"],[2,"width","4rem"],[3,"value"]],template:function(n,m){if(n&1){let I=y();e(0,"div",2)(1,"div",3),p(2,"p-button",4)(3,"p-button",5)(4,"p-button",6),t(),e(5,"div",7)(6,"p-table",8),C("selectionChange",function(d){return u(I),x(m.selectedUsers,d)||(m.selectedUsers=d),g(d)}),b(7,k,11,0,"ng-template",null,0,c)(9,D,11,5,"ng-template",null,1,c),t()()()}n&2&&(o(6),s("value",m.users),h("selection",m.selectedUsers),s("tableStyle",_(3,R)))},dependencies:[w,v,M,U,E,S],styles:[".user-management-container[_ngcontent-%COMP%]{margin:20px}"]})};export{T as UserManagementComponent};
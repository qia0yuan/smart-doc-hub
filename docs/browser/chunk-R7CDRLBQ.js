import{Fa as y,ka as o,ma as h,o as g}from"./chunk-RGVLX5LA.js";import{p as m}from"./chunk-DZKEWX2Z.js";import{Jb as u,Kb as d,U as n,V as p,Zb as b,_ as r,cb as f,db as s,fb as c,ka as i}from"./chunk-OFYNKHI3.js";var v=({dt:e})=>`
.p-iftalabel {
    display: block;
    position: relative;
}

.p-iftalabel label {
    position: absolute;
    pointer-events: none;
    top: ${e("iftalabel.top")};
    transition-property: all;
    transition-timing-function: ease;
    line-height: 1;
    font-size: ${e("iftalabel.font.size")};
    font-weight: ${e("iftalabel.font.weight")};
    inset-inline-start: ${e("iftalabel.position.x")};
    color: ${e("iftalabel.color")};
    transition-duration: ${e("iftalabel.transition.duration")};
}

.p-iftalabel .p-inputtext,
.p-iftalabel .p-textarea,
.p-iftalabel .p-select-label,
.p-iftalabel .p-multiselect-label-container,
.p-iftalabel .p-autocomplete-input-multiple,
.p-iftalabel .p-cascadeselect-label,
.p-iftalabel .p-treeselect-label {
    padding-top: ${e("iftalabel.input.padding.top")};
}

.p-iftalabel:has(.ng-invalid.ng-dirty) label {
    color: ${e("iftalabel.invalid.color")};
}

.p-iftalabel:has(input:focus) label,
.p-iftalabel:has(input:-webkit-autofill) label,
.p-iftalabel:has(textarea:focus) label,
.p-iftalabel:has(.p-inputwrapper-focus) label {
    color: ${e("iftalabel.focus.color")};
}

.p-iftalabel .p-inputicon {
    top: ${e("iftalabel.input.padding.top")};
    transform: translateY(25%);
    margin-top: 0;
}

/*.p-iftalabel .p-placeholder,
.p-iftalabel input::placeholder,
.p-iftalabel .p-inputtext::placeholder {
    opacity: 0;
    transition-property: all;
    transition-timing-function: ease;
}

.p-iftalabel .p-focus .p-placeholder,
.p-iftalabel input:focus::placeholder,
.p-iftalabel .p-inputtext:focus::placeholder {
    opacity: 1;
    transition-property: all;
    transition-timing-function: ease;
}*/
`,I={root:"p-iftalabel"},M=(()=>{class e extends h{name="iftalabel";theme=v;classes=I;static \u0275fac=(()=>{let t;return function(l){return(t||(t=i(e)))(l||e)}})();static \u0275prov=n({token:e,factory:e.\u0275fac})}return e})();var D=["*"],k=(()=>{class e extends y{_componentStyle=r(M);static \u0275fac=(()=>{let t;return function(l){return(t||(t=i(e)))(l||e)}})();static \u0275cmp=f({type:e,selectors:[["p-iftalabel"],["p-iftaLabel"],["p-ifta-label"]],hostAttrs:[1,"p-iftalabel"],features:[b([M]),c],ngContentSelectors:D,decls:1,vars:0,template:function(a,l){a&1&&(u(),d(0))},encapsulation:2,changeDetection:0})}return e})(),U=(()=>{class e{static \u0275fac=function(a){return new(a||e)};static \u0275mod=s({type:e});static \u0275inj=p({imports:[m,o,g,o]})}return e})();var J=[{id:"firstname",label:"First Name"},{id:"lastname",label:"Last Name"},{id:"emailid",label:"Email ID"},{id:"phonenumber",label:"Phone Number"}],P=[{id:"sharedByUser",label:"sharedBy"}];export{k as a,U as b,J as c,P as d};

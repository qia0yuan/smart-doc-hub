import{Oa as g,g as m,sa as o,va as h,w as y}from"./chunk-RCUMONAM.js";import{$a as s,Db as b,Eb as u,R as n,S as p,Tb as d,X as r,_a as c,bb as f,fa as i}from"./chunk-WSNZY3U7.js";var x=["*"],k=({dt:e})=>`
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

.p-iftalabel > .p-inputtext,
.p-iftalabel .p-textarea,
.p-iftalabel .p-select-label,
.p-iftalabel .p-multiselect-label-container,
.p-iftalabel .p-autocomplete-input-multiple,
.p-iftalabel .p-cascadeselect-label,
.p-iftalabel .p-treeselect-label,
.p-iftalabel .p-datepicker-input,
.p-iftalabel .p-inputmask,
.p-iftalabel .p-autocomplete .p-inputtext,
.p-iftalabel .p-inputnumber .p-inputtext,
.p-iftalabel .p-password .p-inputtext,
.p-iftalabel > .p-iconfield .p-inputtext {
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

.p-iftalabel > .p-iconfield .p-inputicon {
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
`,I={root:"p-iftalabel"},v=(()=>{class e extends h{name="iftalabel";theme=k;classes=I;static \u0275fac=(()=>{let t;return function(l){return(t||(t=i(e)))(l||e)}})();static \u0275prov=n({token:e,factory:e.\u0275fac})}return e})();var R=(()=>{class e extends g{_componentStyle=r(v);static \u0275fac=(()=>{let t;return function(l){return(t||(t=i(e)))(l||e)}})();static \u0275cmp=c({type:e,selectors:[["p-iftalabel"],["p-iftaLabel"],["p-ifta-label"]],hostAttrs:[1,"p-iftalabel"],features:[d([v]),f],ngContentSelectors:x,decls:1,vars:0,template:function(a,l){a&1&&(b(),u(0))},encapsulation:2,changeDetection:0})}return e})(),j=(()=>{class e{static \u0275fac=function(a){return new(a||e)};static \u0275mod=s({type:e});static \u0275inj=p({imports:[m,o,y,o]})}return e})();var P=[{id:"firstname",label:"First Name"},{id:"lastname",label:"Last Name"},{id:"emailid",label:"Email ID"},{id:"phonenumber",label:"Phone Number"}],U=[{id:"title",label:"title"},{id:"sharedByUser",label:"sharedBy"},{id:"category",label:"category"},{id:"subcategory",label:"subcategory"}],B=[{key:"0",label:"TAXATION",children:[{key:"0-0",label:"W2"},{key:"0-1",label:"1099"},{key:"0-2",label:"1099-G"},{key:"0-3",label:"1099-K"}]},{key:"1",label:"AUTO_INSURANCE",children:[]},{key:"2",label:"LEGAL",children:[]},{key:"3",label:"PERSONAL",children:[{key:"0-0",label:"PASSPORT"},{key:"0-1",label:"AUTO_POLICY"},{key:"0-2",label:"DL"}]}];export{R as a,j as b,P as c,U as d,B as e};

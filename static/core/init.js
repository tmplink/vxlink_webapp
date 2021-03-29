var vxCore = new vxlink_core;
var vxUser = new vxlink_user;
var vxTrans = new vxlink_vxtrans;
var vxPing = new vxlink_vxping;
var vxHome = new vxlink_home;
var vxSettings = new vxlink_settings;
var vxBilling = new vxlink_billing;
var vxAffiliate = new vxlink_affiliate;
var vxDbservice = new vxlink_dbservice;
var vxDns = new vxlink_vxdns;

//init
vxCore.init();
vxCore.bind('op_user', vxUser);
vxCore.bind('op_vxtrans', vxTrans);
vxCore.bind('op_vxping', vxPing);
vxCore.bind('op_home', vxHome);
vxCore.bind('op_home', vxSettings);
vxCore.bind('op_billing', vxBilling);
vxCore.bind('op_affiliate', vxAffiliate);
vxCore.bind('op_dbservice',vxDbservice);
vxCore.bind('op_vxdns',vxDns);

vxUser.init(vxCore);
vxTrans.init(vxCore);
vxPing.init(vxCore);
vxHome.init(vxCore);
vxSettings.init(vxCore);
vxBilling.init(vxCore);
vxAffiliate.init(vxCore)
vxDbservice.init(vxCore)
vxDns.init(vxCore);

app.language_set('cn');
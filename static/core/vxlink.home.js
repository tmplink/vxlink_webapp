class vxlink_home {
    core = null
    dpp_notice = 0

    init(core) {
        this.core = core;
    }

    pageInit() {
        if (document.getElementById('init_home') !== null) {
            this.refreshUsage(3, '过去一周');
            this.refreashMessage();
            this.refreshBundel();
            this.navFuncions();
            this.navBuyCheck();
            this.navBuyCheckout();
            this.dppInit();
            this.chargeTransferHisgory();

            $('.dpp_start').html(Number(vxCore.user_point)+Number(vxCore.user_rpoint)+64);
            $('.dpp_end').html(2048);

            $('.user_rpoint').html(vxCore.user_rpoint);
            $('.user_point').html(vxCore.user_point);
            $('.user_coins').html(vxCore.user_coin);
            $('.user_charge').html(vxCore.user_charge);
        }
    }

    dppInit(){
        let dpp_notice = localStorage.getItem('dpp_notice');
        this.dpp_notice = dpp_notice;
        if(dpp_notice===null||dpp_notice==='1'){
            localStorage.setItem('dpp_notice',1);
            $('#dpp_notification_status').attr('checked',true);
        }
    }

    dppNotificationChange(){
        let status = ($('#dpp_notification_status').is(':checked')) ? 'yes' : 'no';
        if(status==='yes'){
            localStorage.setItem('dpp_notice',1);
            this.dpp_notice = 1;
        }else{
            localStorage.setItem('dpp_notice',0);
            this.dpp_notice = 0;
        }
    }

    refreshBundel(){
        $.post(this.core.api_user, {token: this.core.token, action: 'bundle_list2'}, function (rsp) {
            if (rsp.data.available !== false) {
                $('#bundle_list').fadeIn(0);
                $('#bundle_list').html(app.tpl('bundle_list_tpl', rsp.data.available));
            }else{
                $('#no_bundle').fadeIn();
            }
            if (rsp.data.delay !== false) {
                $('#home_bundle_delay_btn').fadeIn();
                $('#bundle_delay_count').html(rsp.data.delay.length);
                $('#bundle_delay_list').html(app.tpl('bundle_list_tpl', rsp.data.delay));
            }
        }, 'json');
    }

    refreashMessage(){
        $.post(this.core.api_user, {token: this.core.token, action: 'notification_list'}, function (rsp) {
            if (rsp.status === 1) {
                $('#notifications_list').html(app.tpl('notifications_list_tpl', rsp.data));
            }
            $('#loading_notifications').fadeOut();
        }, 'json');
        $.post(this.core.api_user, {token: this.core.token, action: 'notification_rss'}, function (rsp) {
            if (rsp.status === 1) {
                $('#rss_link').attr('href',rsp.data);
            }
        }, 'json');
    }

    giftRequest(){
        $.post(this.core.api_user, {token: this.core.token,notice:this.dpp_notice, action: 'gift_2022_req'},  (rsp) => {
            if (rsp.status === 1) {
                alert('领取成功');
                setTimeout(()=>{
                    this.refreshBundel();
                },3000);
            }else{
                alert('已经领取过了。可不要贪心哦。');
            }
        }, 'json');
    }

    refreshUsage(rt,title) {
        $('#loading_usage').fadeIn();
        $('#x2_chart_usage_title').html(title+'的点券使用情况');
        var post = {
            token: this.core.token,
            rt: rt,
            action: 'get_usage_chart'
        };
        $.post(this.core.api_user, post, (rsp) => {
            var opt = {
                data: {},
                axis: {
                    y: {
                        padding: {
                            bottom: 0
                        },
                        show: false,
                        tick: {
                            outer: false
                        }
                    },
                    x: {
                        padding: {
                            left: 0,
                            right: 0
                        }
                    }
                },
                tooltip: {
                    format: {
                        title: function (x) {
                            return rsp.data.time[x];
                        },
                        value: function (value, ratio, id) {
                            return toconver(value, true);
                        }
                    }
                },
                padding: {
                    bottom: 0,
                    left: 0,
                    right: 0
                },
                transition: {
                    duration: 0
                },
                point: {
                    show: false
                }
            };
            opt.axis.x.categories = rsp.data.time;
            opt.axis.x.show = false;
            //draw chart
            opt.bindto = '#x2_chart_usage';
            opt.legend = { show: true };
            opt.data.columns = [rsp.data.vxtrans, rsp.data.dbs, rsp.data.vxdns,rsp.data.vxping];
            opt.data.names = { 'data1': 'vxTrans', 'data2': 'DB Service', 'data3': 'vxDNS','data4': 'vxPing' };
            opt.data.types = {data1:'area-spline',data2:'area-spline',data3:'area-spline',data4:'area-spline'},
            opt.data.groups = [['data1', 'data2', 'data3', 'data4']];
            opt.data.colors = {
                'data1': '#20c997',
                'data2': '#ffc107',
                'data3': '#17a2b8',
                'data4': '#6610f2'
            };
            opt.data.type = 'line';
            c3.generate(opt);
            $('#loading_usage').fadeOut();
        }, 'json');
    }

     modal_buy_type = 'bundle'
     modal_buy_code = 0
     modal_buy_time = 1
     modal_buy_price = 0

    navFuncions() {
        $("input[name=select_buy_type]").each((i,e)=> {
            $(e).on('click', (i,e) => {
                this.modal_buy_type = $(e).val();
                this.navBuyCheck();
            });
        });
            $('#select_bundle_stack').on('change', ()=> {
                this.navBuyCheckout();
            });
            $('#select_bundle_type').on('change', ()=> {
                this.navBuyCheckout();
            });
            $('#select_vxfly_type').on('change', ()=> {
                this.navBuyCheckout();
            });
    }
    
    navBuyCheck() {
        if (this.modal_buy_type === "vxfly") {
            $('#buy_step2_vxfly').fadeIn();
            $('#buy_step2_bundle').fadeOut();
            $('#buy_step3_bundle').fadeOut();
            $('#buy_notice_2').fadeIn();
            $('#buy_notice_1').fadeOut();
        }
        if (this.modal_buy_type === "bundle") {
            $('#buy_step2_bundle').fadeIn();
            $('#buy_step3_bundle').fadeIn();
            $('#buy_step2_vxfly').fadeOut();
            $('#buy_notice_2').fadeOut();
            $('#buy_notice_1').fadeIn();
        }
        this.navBuyCheckout();
    }
    
    navBuyCheckout(){
        if(this.modal_buy_type === "vxfly"){
            this.modal_buy_price = $("#select_vxfly_type option:selected").attr('data-price');
            this.modal_buy_code = $("input[name=bundle_type]:checked").val();
            $('#buy_total').html(this.modal_buy_price);
        }else{
            this.modal_buy_price = $("input[name=bundle_type]:checked").attr('data-price');
            this.modal_buy_code = $("input[name=bundle_type]:checked").val();
            this.modal_buy_usage = $("input[name=bundle_type]:checked").attr('data-usage');
            this.modal_buy_time = $("#select_bundle_stack").val();
            if(this.modal_buy_time>1){
                $('#times_addon').slideDown();
            }else{
                $('#times_addon').hide();
            }
            if(this.modal_buy_time==12){
                this.modal_buy_price = this.modal_buy_price * 10;
                $('#buy_total').html(this.modal_buy_price);
            }else{
                this.modal_buy_price = this.modal_buy_price * this.modal_buy_time;
                $('#buy_total').html(this.modal_buy_price);
            }
            $('#buy_usage').html(this.modal_buy_usage+'G');
            $('#buy_time').html(this.modal_buy_time);
        }
    }

    chargePress(){
        $('#chargeShow').show();
        this.modal_buy_price = $("#charge_input").val();
        //转换成整数
        this.modal_buy_price = parseInt(this.modal_buy_price);
        $('#charge_points').html(this.modal_buy_price);
        $('#charge_total').html(this.modal_buy_price);
    }
    
    chargeConfirm(){
        if(this.modal_buy_price<1){
            alert('请输入正确的充值金额');
            return false;
        }
        let checkouturl = 'https://pay.vezii.com/id1/v2_pay?token='+ this.core.token + '&price=' + this.modal_buy_price;
        window.open(checkouturl);
        setTimeout('location.reload()', 3000);
    }

    chargePay(){
        //按钮设置成不可点击
        $('#charge_pay_btn').attr('disabled', 'disabled');
        $('#charge_pay_btn').html('正在处理');
        $.post(this.core.api_user, {
            token: this.core.token,
            type: 'bundle',
            code: this.modal_buy_code,
            time: this.modal_buy_time,
            action: 'charge_pay'
        },  (rsp) => {
            if (rsp.status === 1) {
                alert('完成');
                setTimeout(()=>{
                    this.refreshBundel();
                },3000);
            }else{
                alert('购买失败，点数不足');
            }
            $('#charge_pay_btn').html('点数支付');
            $('#charge_pay_btn').removeAttr('disabled');
        }, 'json');
    }

    chargeTranser(){
        $('#charge_transfer_btn').attr('disabled', 'disabled');
        $('#charge_transfer_btn').html('正在处理');
        let transfer_to = $('#transfer_to').val();
        let transfer_amount = $('#transfer_amount').val();
        $.post(this.core.api_user, {
            token: this.core.token,
            to: transfer_to,
            amount: transfer_amount,
            action: 'charge_transfer'
        },  (rsp) => {
            if (rsp.status === 1) {
                alert('完成');
                this.core.refreshUserInfo();
                this.chargeTransferHisgory();
            }else{
                alert(rsp.data);
            }
            $('#charge_transfer_btn').html('开始转账');
            $('#charge_transfer_btn').removeAttr('disabled');
        }, 'json');
    }

    chargeTransferHisgory(){
        $.post(this.core.api_user, {
            token: this.core.token,
            action: 'charge_transfer_history'
        },  (rsp) => {
            if (rsp.status === 1) {
                $('#charge_transfer_no_history').hide();
                $('#charge_transfer_history').show();
                $('#charge_transfer_history_list').html(app.tpl('charge_transfer_history_list_tpl', rsp.data));
            }
        }, 'json');
    }

    navBuyConfirm(){
        let checkouturl = 'https://pay.vezii.com/id1/v2_pay?token='+ this.core.token + '&price=' + this.modal_buy_price+ '&time=' + this.modal_buy_time+ '&type=' + this.modal_buy_type+ '&code=' + this.modal_buy_code;
        window.open(checkouturl);
        setTimeout('location.reload()', 3000);
    }

    sp2000(){
        let checkouturl = 'https://pay.vezii.com/id1/v2_pay?token='+ this.core.token + '&price=588&time=1&type=bundle&code=sp2000';
        window.open(checkouturl);
        setTimeout('location.reload()', 3000);
    }

    sp800(){
        let checkouturl = 'https://pay.vezii.com/id1/v2_pay?token='+ this.core.token + '&price=288&time=1&type=bundle&code=sp800';
        window.open(checkouturl);
        setTimeout('location.reload()', 3000);
    }
}

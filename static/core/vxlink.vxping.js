class vxlink_vxping {
    core = null
    alert_list = null
    monitor_list = null
    refresh_alert_list_init = false
    refresh_monitor_list_init = false

    init(core) {
        this.core = core;
    }

    pageInit() {
        if (document.getElementById('init_vxping') !== null) {
            //初始化
            this.refreshMonitorList();

            //安装定时器
            if (!this.refresh_monitor_list_init) {
                this.refresh_monitor_list_init = true;
                setInterval(() => { this.refreshMonitorList() }, 60000);
            }
        }
    }

    refreshAlertAllList() {
        $.post(this.core.api_vxping, { action: 'list_alert', token: this.core.token }, (rsp) => {
            if (rsp.status === 1) {
                for (let i in rsp.data) {
                    rsp.data[i].bg_color = rsp.data[i].status === 'wait' ? 'bg-white' : 'bg-pink';
                }
                $('#vxping_alert_all_list_box').html(app.tpl('vxping_alert_all_list_tpl', rsp.data));
                console.log('vxPing Alert List Loaded');
            }else{
                $('#vxping_alert_all_list_box').html('目前没有设置告警器');
            }
        }, 'json');
    }

    openAlertAllList(){
        this.refreshAlertAllList();
        $('#vxping_alert_all_list_Modal').modal('show');
    }

    refreshAlertList(id) {
        $('#vxping_alert_list_Modal').modal('show');
        let alert_list = this.monitor_list;
        for (let i in alert_list) {
            if(alert_list[i].id==id){
                console.log(alert_list[i]);
                $('#vxping_alert_list_box').html(app.tpl('vxping_alert_list_tpl', alert_list[i].alert_list));
                return true;
            }
        }
    }

    refreshMonitorList() {
        if (document.getElementById('loading_vxping_monitor_list') === null) {
            return false;
        }

        $('#loading_vxping_monitor_list').fadeIn();
        $.post(this.core.api_vxping, { action: 'list_monitor', token: this.core.token }, (rsp) => {
            $('#loading_vxping_monitor_list').fadeOut();
            if (rsp.status === 1) {
                this.monitor_list = rsp.data;
                for (let i in rsp.data) {
                    rsp.data[i].bg_color = rsp.data[i].status === 'wait' ? 'bg-white' : 'bg-pink';
                }
                $('#vxping_monitor_list').html(app.tpl('vxping_monitor_list_tpl', rsp.data));
                $('#vxping_monitor_count').html('一共有 ' + rsp.data.length + ' 个监测点。');
                console.log('vxPing Monitor List Loaded');
            }
        }, 'json');
    }

    deleteAlert(id) {
        $('#vxping_alert_rule_' + id).fadeOut();
        $.post(this.core.api_vxping, { action: 'del_alert', id: id, token: this.core.token });
    }

    deleteAlertUnit(id) {
        $('#vxping_alert_unit_rule_' + id).fadeOut();
        $.post(this.core.api_vxping, { action: 'del_alert', id: id, token: this.core.token });
    }

    deleteMonitor(id) {
        if (confirm('您确定要关闭该监测项目吗?')) {
            $('#vxping_monitor_' + id).fadeOut();
            $.post(this.core.api_vxping, { action: 'del_monitor', id: id, token: this.core.token });
        }
    }

    editerOpen() {
        $('#vxping_monitor_createset_name').val('');
        $('#vxping_monitor_createset_traget_ip').val('');
        $('#vxping_monitor_createset_location').find("option[value='1']").attr("selected", true);
        $('#vxping_monitor_create_post').html('<i class="far fa-check"></i>');
        $('#vxping_monitor_create_post').removeAttr('disabled');
        $('#vxping_monitor_create_Modal').modal('show');
    }

    editerPost() {
        //收集数据
        let name = $('#vxping_monitor_create_set_name').val();
        let location = $('#vxping_monitor_create_set_location').val();
        let model = $('#vxping_monitor_create_set_model').val();
        let target_ip = $('#vxping_monitor_create_set_traget_ip').val();
        let triger = $("input[name=trigger_options]:checked").val();
        $('#vxping_monitor_create_post').html('<i class="fas fa-spinner fa-spin"></i>');
        $('#vxping_monitor_create_post').attr('disabled', 'true');

        //根据触发器类型获取相应的数据
        if(triger=='webhook'){
            let trigger_params = $('#vxping_alert_set_m_webhook_url').val();
            let trigger_type = 'webhook';
        }

        if(triger=='email'){
            let trigger_params = '';
            let trigger_type = 'email';
        }
        
        //发送请求
        $.post(this.core.api_vxping, { 
            name: name, action: 'add_monitor', location: location, to_ip: target_ip,
            model:model, token: this.core.token,
            trigger_type:trigger_type, trigger_params:trigger_params
        }, (rsp) => {
            if (rsp.status === 1) {
                $('#vxping_monitor_create_post').html('<i class="far fa-check"></i>');
                this.refreshMonitorList();
                $('#vxping_monitor_create_Modal').modal('hide');
            } else {
                $('#vxping_monitor_create_post').html('创建失败：' + rsp.data);
            }
        }, 'json');
    }

    triggerAddonAreaOnChange() {
        let triger = $("input[name=trigger_options]:checked").val();
        //隐藏其它的区域
        $('.trigger_addon_area').hide();

        if(triger=='webhook'){
            $('#trigger_addon_area_webhook').show();
        }
    }

    editerReset() {
        $('#vxping_monitor_createset_name').val('');
        $('#vxping_monitor_createset_traget_ip').val('');
        $('#vxping_monitor_createset_location').find("option[value='1']").attr("selected", true);
        $('#vxping_monitor_create_post').html('<i class="far fa-check"></i>');
        $('#vxping_monitor_create_post').removeAttr('disabled');
    }

    editerRefresh() {
        $('#vxping_monitor_create_post').html('<i class="far fa-check"></i>');
        $('#vxping_monitor_create_post').removeAttr('disabled');
    }

    setAlert(ping_id,name){
        this.alert_add_id = ping_id;
        $('#vxping_alert_title').html('为['+name+']设置告警');
        $('#vxping_alert_set_m_val').val('');
        $('#vxping_alert_set_m_type').find("option[value='avg']").attr("selected", true);
        $('#vxping_alert_set_m_method').find("option[value='more']").attr("selected", true);
        $('#vxping_alert_Modal').modal('show');
    }

    alertPost() {
        var type = $('#vxping_alert_set_m_method').val();
        var check_type = $('#vxping_alert_set_m_type').val();
        var val = $('#vxping_alert_set_m_val').val();

        $('#vxping_alert_post').html('<i class="fas fa-spinner fa-spin"></i>');
        $('#vxping_alert_post').attr('disabled', 'true');

        $.post(this.core.api_vxping, { token: this.core.token, action: 'add_alert', type: type, val: val, check_type: check_type, ping_id: this.alert_add_id }, (rsp) => {
            if (rsp.status === 1) {
                this.refreshMonitorList();
                $('#vxping_alert_Modal').modal('hide');
            } else {
                alert('创建失败：' + rsp.data);
            }
            $('#vxping_alert_post').html('<i class="far fa-check"></i>');
            $('#vxping_alert_post').removeAttr('disabled');
        }, 'json');
    }

    downloadLog(id){
        let url = "https://vx.link/x2/service/vxping/log?id="+id+'&token='+this.core.token;
        window.location = url;
    }

    drawIdSet(id){
        this.drawId = id;
        $('#vxping_charts_Modal').modal('show');
    }

    drawCharts(rt, title) {
        $('#vxping_loading').fadeIn();
        $('#x2_chart_vxping_title').html(title);
        var post = {
            id: this.drawId,
            token: this.core.token,
            rt: rt,
            action: 'x2_chart'
        };
        $.post(this.core.api_vxping, post, (rsp) => {
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
            opt.axis.x.type = 'category';
            opt.axis.x.categories = rsp.data.time;
            opt.axis.x.show = false;
            //draw chart
            opt.bindto = '#x2_chart_vxping_ping';
            opt.legend = { show: true };
            opt.data.columns = [rsp.data.avg, rsp.data.min, rsp.data.max];
            opt.data.names = { 'data1': 'Ping 平均值', 'data2': 'Ping 最小值', 'data3': 'Ping 最大值' };
            opt.data.colors = {
                'data1': '#20c997',
                'data2': '#6610f2',
                'data3': '#17a2b8'
            };
            opt.data.type = 'spline';
            c3.generate(opt);
            opt.bindto = '#x2_chart_vxping_lost';
            opt.legend = { show: false };
            opt.data.type = 'area';
            opt.data.columns = [rsp.data.lost];
            opt.data.names = { 'data1': '丢包率' };
            c3.generate(opt);
            $('#vxping_loading').fadeOut();
        }, 'json');
    }
}
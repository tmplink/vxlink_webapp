class vxlink_vxping {
    core = null
    trigger_list = null
    monitor_list = null
    refresh_trigger_list_init = false
    refresh_monitor_list_init = false
    trigger_id = 0

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

    refreshtriggerAllList() {
        $.post(this.core.api_vxping, { action: 'trigger_list', token: this.core.token }, (rsp) => {
            if (rsp.status === 1) {
                for (let i in rsp.data) {
                    rsp.data[i].bg_color = rsp.data[i].status === 'wait' ? 'bg-white' : 'bg-pink';
                }
                $('#vxping_trigger_all_list_box').html(app.tpl('vxping_trigger_all_list_tpl', rsp.data));
                console.log('vxPing trigger List Loaded');
            } else {
                $('#vxping_trigger_all_list_box').html('目前没有设置告警器');
            }
        }, 'json');
    }

    openTriggerAllList() {
        this.refreshtriggerAllList();
        $('#vxping_trigger_all_list_Modal').modal('show');
    }

    historyListOnChange(){
        this.refreshHistoryList();
    }

    refreshHistoryList(){
        let type = $("input[name=history_options]:checked").val()
        $.post(this.core.api_vxping, { action: 'history',type:type, token: this.core.token }, (rsp) => {
            if (rsp.status === 1) {
                $('#history_list').html(app.tpl('history_list_tpl', rsp.data));
                console.log(`vxPing History::${type} List Loaded`);
            }
        }, 'json');
    }

    refreshTriggerList(id) {
        $('#vxping_trigger_list_Modal').modal('show');
        let trigger_list = this.monitor_list;
        for (let i in trigger_list) {
            if (trigger_list[i].id == id) {
                $('#vxping_trigger_list_box').html(app.tpl('vxping_trigger_list_tpl', trigger_list[i].trigger_list));
                return true;
            }
        }
    }

    refreshMonitorList() {
        if (document.getElementById('loading_vxping_monitor_list') === null) {
            return false;
        }

        $('#loading_vxping_monitor_list').fadeIn();
        $('#vxping_refresh_btn').attr('disabled',true);

        $.post(this.core.api_vxping, { action: 'monitor_list', token: this.core.token }, (rsp) => {
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
            $('#vxping_refresh_btn').removeAttr('disabled');
        }, 'json');
    }

    deleteTrigger(id) {
        $('#vxping_trigger_rule_' + id).fadeOut();
        $.post(this.core.api_vxping, { action: 'trigger_del', id: id, token: this.core.token });
    }

    deleteTriggerUnit(id) {
        $('#vxping_trigger_unit_rule_' + id).fadeOut();
        $.post(this.core.api_vxping, { action: 'trigger_del', id: id, token: this.core.token });
    }

    deleteMonitor(id) {
        if (confirm('您确定要关闭该监测项目吗?')) {
            $('#vxping_monitor_' + id).fadeOut();
            $.post(this.core.api_vxping, { action: 'monitor_del', id: id, token: this.core.token });
        }
    }

    restartMonitor(id) {
        if (confirm('您确定要重新启动该监测项目吗?')) {
            $.post(this.core.api_vxping, { action: 'monitor_restart', id: id, token: this.core.token },()=>{
                this.refreshMonitorList();
            });
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
        $('#vxping_monitor_create_post').html('<i class="fas fa-spinner fa-spin"></i>');
        $('#vxping_monitor_create_post').attr('disabled', 'true');


        //发送请求
        $.post(this.core.api_vxping, {
            name: name, action: 'monitor_add', location: location, to_ip: target_ip,
            model: model, token: this.core.token,
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

        if (triger == 'webhook') {
            $('#trigger_addon_area_webhook').show();
        }
        if (triger == 'vxdns') {
            $('#trigger_vxdns').show();
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

    vxDNSOnTrigger(id) {
        $('#vxping_trigger_all_list_Modal').modal('hide');
        $('#vxping_trigger_list_Modal').modal('hide');
        setTimeout(() => {
            $('#vxping_dns_edit_Modal').modal('show');
            this.trigger_id = id;
            vxPing.vxDNSRecordList();
        }, 500);

    }

    vxDNSRecordSearch() {
        let searchString = $('#vxDNSRecordSearch').val();
        $('#record_find').html('<div class="text-center">处理中...</div>');
        if (searchString !== "") {
            //发送请求
            $.post(this.core.api_vxping, {
                name: searchString, action: 'dns_record_find', token: this.core.token,
            }, (rsp) => {
                if (rsp.status === 1) {
                    let html = app.tpl('record_find_tpl', rsp.data);
                    $('#record_find').html(html);
                } else {
                    $('#record_find').html('<div class="text-center">没有找到匹配的记录</div>');
                }
            }, 'json');
        }
    }

    vxDNSRecordListofTrigger(id) {
        //发送请求
        $('#dns').html('<div class="text-center">处理中...</div>');
        $.post(this.core.api_vxping, {
            id: id, action: 'dns_record_list', token: this.core.token,
        }, (rsp) => {
            if (rsp.status === 1) {
                let html = app.tpl('record_find_tpl', rsp.data);
                $('#record_find').html(html);
            } else {
                $('#record_find').html('<div class="text-center">没有找到匹配的记录</div>');
            }
        }, 'json');
    }

    vxDNSRecordList() {
        //发送请求
        $('#dns').html('<div class="text-center">处理中...</div>');
        $.post(this.core.api_vxping, {
            action: 'dns_record_list', trigger_id: this.trigger_id, token: this.core.token,
        }, (rsp) => {
            if (rsp.status === 1) {
                let html = app.tpl('record_list_tpl', rsp.data);
                $('#record_list').html(html);
            } else {
                $('#record_list').html('<div class="text-center">暂无</div>');
            }
        }, 'json');
    }

    addDNSRecordToTrigger(id) {
        $.post(this.core.api_vxping, {
            id: id, trigger_id: this.trigger_id, action: 'dns_record_add', token: this.core.token,
        }, () => {
            //隐藏已添加的记录
            $('#record_find_id_' + id).hide();
            //刷新列表
            this.vxDNSRecordList();
        }, 'json');
    }

    removeDNSRecordFromTrigger(id) {
        $.post(this.core.api_vxping, {
            id: id, action: 'dns_record_del', token: this.core.token,
        }, () => {
            $('#record_list_id_' + id).hide();
        }, 'json');
    }

    setTrigger(ping_id, name) {
        this.trigger_add_id = ping_id;
        $('#vxping_trigger_title').html('为[' + name + ']设置告警');
        $('#vxping_trigger_set_m_val').val('');
        $('#vxping_trigger_set_m_type').find("option[value='avg']").attr("selected", true);
        $('#vxping_trigger_set_m_method').find("option[value='more']").attr("selected", true);
        $('#vxping_trigger_Modal').modal('show');
    }

    triggerPost() {
        var type = $('#vxping_trigger_set_m_method').val();
        var check_type = $('#vxping_trigger_set_m_type').val();
        var val = $('#vxping_trigger_set_m_val').val();


        let triger = $("input[name=trigger_options]:checked").val();
        let trigger_type = 'email';
        let trigger_params = '';
        $('#vxping_monitor_create_post').html('<i class="fas fa-spinner fa-spin"></i>');
        $('#vxping_monitor_create_post').attr('disabled', 'true');

        //根据触发器类型获取相应的数据
        if (triger == 'webhook') {
            trigger_params = $('#vxping_trigger_set_m_webhook_url').val();
            trigger_type = 'webhook';
        }

        if (triger == 'vxdns') {
            trigger_params = $('#vxping_trigger_set_dns').val();
            trigger_type = 'vxdns';
        }

        if (triger == 'email') {
            trigger_params = '';
            trigger_type = 'email';
        }


        $('#vxping_trigger_post').html('<i class="fas fa-spinner fa-spin"></i>');
        $('#vxping_trigger_post').attr('disabled', 'true');

        $.post(this.core.api_vxping, {
            token: this.core.token, action: 'trigger_add',
            type: type, val: val, check_type: check_type, ping_id: this.trigger_add_id,
            trigger_type: trigger_type, trigger_params: trigger_params
        }, (rsp) => {
            if (rsp.status === 1) {
                this.refreshMonitorList();
                $('#vxping_trigger_Modal').modal('hide');
            } else {
                trigger('创建失败：' + rsp.data);
            }
            $('#vxping_trigger_post').html('<i class="far fa-check"></i>');
            $('#vxping_trigger_post').removeAttr('disabled');
        }, 'json');
    }

    downloadLog(id) {
        let url = "https://vx.link/x2/service/vxping/log?id=" + id + '&token=' + this.core.token;
        window.location = url;
    }

    drawIdSet(id) {
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
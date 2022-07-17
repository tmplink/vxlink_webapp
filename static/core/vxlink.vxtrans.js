class vxlink_vxtrans {
    core = null
    server_list = null
    vxtrans_list = null
    acl_list = null
    acl_id = 0
    assign_id = 0
    refresh_vxtrans_list_init = false
    refresh_vxtrans_trusted_addr_list_init = false
    refresh_server_list_init = false
    refresh_server_list_area_init = false
    sortQueue = []

    init(core) {
        this.core = core;
    }

    pageInit() {
        if (document.getElementById('init_vxtrans') !== null) {
            //初始化
            if(this.core.user_point<100){
                //this.refreshVxtransTrustedAddrList();
            }else{
                $('#vxtrans_trustip_list').hide();
                $('#vxtrans_trustip_list_without').fadeIn();
            }
            this.refreshVxtransList();
            this.refreshServerList();
            this.aclListRefresh();

            //安装定时器
            if(this.core.user_point<100){
                // if(!this.refresh_vxtrans_trusted_addr_list_init){
                //     this.refresh_vxtrans_trusted_addr_list_init = true;
                //     setInterval(()=>{this.refreshVxtransTrustedAddrList()},60000);
                // }
            }
            if(!this.refresh_vxtrans_list_init){
                this.refresh_vxtrans_list_init = true;
                setInterval(()=>{this.refreshVxtransList()},30000);
            }
            if(!this.refresh_server_list_init){
                this.refresh_server_list_init = true;
                setInterval(()=>{this.refreshServerList()},30000);
            }
            // if(!this.refresh_server_list_area_init){
            //     this.refresh_server_list_area_init = true;
            //     setInterval(()=>{this.serverListResort()},3000);
            // }

            if(this.core.user_rpoint>=200){
                $('#specail_idle_time_active').show();
                $('#specail_idle').addClass('alert-success');
            }else{
                $('#specail_idle_time').show();
                $('#specail_idle').addClass('alert-warning');
            }
        }
    }

    refreshVxtransList() {
        if (document.getElementById('loading_vxtrans_list') === null) {
            return false;
        }

        $('#loading_vxtrans_list').fadeIn();
        $('#vxtrans_refresh_btn').attr('disabled',true);
        $.post(this.core.api_vxtrans, {
            action: 'list',
            token: this.core.token
        },
            (rsp) => {
                $('#loading_vxtrans_list').fadeOut();
                if (rsp.status === 1) {
                    // $('#vxtrans_list').html(app.tpl('vxtrans_list_tpl', rsp.data.all));
                    $('#vxtrans_group_list').html(app.tpl('vxtrans_group_list_tpl', rsp.data.group));
                    $('#vxtrans_count').html('一共有 ' + rsp.data.all.length + ' 个连接点。');
                    this.vxtrans_list = rsp.data.all;
                    console.log('vxTrans List Loaded');
                }
                $('#vxtrans_refresh_btn').removeAttr('disabled');
            }, 'json'
        );
    }

    getConnectionsList(transid) {

        $('#connectionsModal').modal('show');
        $('#conn_list').html('');
        $.post(this.core.api_vxtrans, {
            action: 'list_connections',
            token: this.core.token,
            id: transid
        },
            (rsp) => {
                $('#loading_vxtrans_list').fadeOut();
                if (rsp.status === 1) {
                    // $('#vxtrans_list').html(app.tpl('vxtrans_list_tpl', rsp.data.all));
                    $('#conn_list').html(app.tpl('conn_list_tpl', rsp.data));
                }
            }, 'json'
        );
    }

    getHistoryList() {

        $('#historyModal').modal('show');
        $('#conn_list').html('');
        $.post(this.core.api_vxtrans, {
            action: 'list_history',
            token: this.core.token,
        },
            (rsp) => {
                $('#loading_vxtrans_list').fadeOut();
                if (rsp.status === 1) {
                    // $('#vxtrans_list').html(app.tpl('vxtrans_list_tpl', rsp.data.all));
                    $('#history_list').html(app.tpl('history_list_tpl', rsp.data));
                }
            }, 'json'
        );
    }

    refreshVxtransTrustedAddrList() {
        if (document.getElementById('loading_vxtrans_trusted') === null) {
            return false;
        }

        $('.trusted_auth_url').html("https://vx.link/service/vxtrans/core?action=auth&token=" + this.core.token);
        $('.trusted_auth_url_for_curl').html("curl -k 'https://vx.link/service/vxtrans/core?action=auth&token=" + this.core.token + "'");
        $('.trusted_auth_url_cp').attr('data-clipboard-text',"https://vx.link/service/vxtrans/core?action=auth&token=" + this.core.token);
        $('.trusted_auth_url_for_curl_cp').attr('data-clipboard-text',"curl -k 'https://vx.link/service/vxtrans/core?action=auth&token=" + this.core.token + "'");
        $('#loading_vxtrans_trusted').fadeIn();

        $.post(this.core.api_vxtrans, {
            action: 'trustip_list',
            token: this.core.token
        },
            (rsp) => {
                $('#loading_vxtrans_trusted').fadeOut();
                if (rsp.status === 1) {
                    $('#trusted_addr_list').html(app.tpl('trusted_addr_list_tpl', rsp.data));
                    $('#trusted_count').html(rsp.data.length + '个授权地址。');
                    console.log('Trusted Addr Loaded');
                }
            }, 'json'
        );
    }

    refreshServerList() {
        if (document.getElementById('server_list') === null) {
            return false;
        }
        this.getServerList((serverlist)=>{
            $('#server_list').html(app.tpl('server_list_tpl', serverlist));
            $('#server_area_list').html(app.tpl('server_area_list_tpl', serverlist));
            this.speedTest();
            console.log('Server List Loaded');
        });
    }

    getServerList(cb){
        if(this.server_list!==null){
            cb(this.server_list);
            return true;
        }
        $.post(this.core.api_vxtrans, {
            action: 'server_list',
            token: this.core.token
        },
            (rsp) => {
                if (rsp.status === 1) {
                    this.server_list = rsp.data;

                    //add speed into server list
                    for (let i = 0; i < this.server_list.length; i++) {
                        this.server_list[i].speed = 9999;
                        this.server_list[i].speed_text = '...';
                        this.server_list[i].speed_color = 'text-black';
                    }
                    cb(this.server_list);
                }
            }, 'json'
        );
    }

    serverListResort(){
        // if (document.getElementById('server_area_selected') === null) {
        //     return false;
        // }
        // this.server_list.sort(this.compare('speed'));
        // $('#server_area_list').html(app.tpl('server_area_list_tpl', this.server_list));
    }

    deleteTrustedAddr(id) {
        if (confirm('删除IP授权是一种不可恢复的操作，您确定要这么做吗?')) {
            $('#loading_vxtrans_trusted').fadeIn();
            $('#trusted_unit_' + id).hide();
            $.post(this.core.api_vxtrans, {
                id: id,
                action: 'trustip_del',
                token: this.core.token
            }, () => {
                $('#loading_vxtrans_trusted').fadeOut();
                this.refreshVxtransTrustedAddrList();
            }, 'json');
        }
    }

    resetName(id) {
        var name = prompt("请输入新名字", "")
        if (name != null && name != "") {
            $.post(this.core.api_vxtrans, {
                action: 'new_name',
                id: id,
                name: name,
                token: this.core.token
            }, () => {
                this.refreshVxtransList();
            });
        }
    }

    resetDestination(id) {
        var name = prompt("请输入新的目标IP或者域名", "");
        if (name != null && name != "") {
            var ip = prompt("请输入新的目标端口", "");
            if (ip != null && ip != "") {
                $.post(this.core.api_vxtrans, {
                    action: 'edit',
                    id: id,
                    to_ip: name,
                    to_port: ip,
                    token: this.core.token
                }, (rsp) => {
                    if(rsp.status){
                        this.refreshVxtransList();
                    }else{
                        alert('调整失败：'+rsp.data);
                    }
                },'json');
            }
        }
    }

    resetLimit(id) {
        var limit = prompt("请输入新配额 (GB)", "");
        if (limit != null && limit != "") {
            $.post(this.core.api_vxtrans, {
                action: 'new_limit',
                id: id,
                limit: limit,
                token: this.core.token
            }, () => {
                this.refreshVxtransList();
            });
        }
    }

    resetAllCounter() {
        if (confirm('您确定要重置全部连接点的已传输流量统计信息吗?')) {
            $.post(this.core.api_vxtrans, {
                action: 'reset_all',
                token: this.core.token
            }, () => {
                this.refreshVxtransList();
            });
        }
    }

    resetCounter(id) {
        if (confirm('您确定要重置该连接点的已传输流量统计信息吗?')) {
            $.post(this.core.api_vxtrans, {
                action: 'reset',
                id: id,
                token: this.core.token
            }, () => {
                this.refreshVxtransList();
            });
        }
    }

    areaSelected(code,name,ipv6){
        $('#set_location').val(code);
        $('#server_area_selected').html(' : '+name);
        $('#server_area_redo').fadeIn();
        $('#vxtrans_stage_1').hide();
        $('#vxtrans_stage_2').show();
        if(ipv6=='yes'){
            $('.ipv6_notice').show();
        }else{
            $('.ipv6_notice').hide();
        }
    }

    areaSelectRede(){
        $('#vxtrans_stage_1').show();
        $('#vxtrans_stage_2').fadeOut();
        $('#server_area_selected').html('');
        $('#server_area_redo').fadeOut();
    }

    deleteVxTrans(id) {
        if (confirm('您确定要关闭该连接点吗?')) {
            $.post(this.core.api_vxtrans, {
                action: 'del',
                id: id,
                token: this.core.token
            }, () => {
                this.refreshVxtransList();
            });
        }
    }

    keepOn(id) {
        var _c = {
            div_id: '#keep_' + id,
            send: (id) => {
                $(_c.div_id).attr('disabled', 'true');
                $(_c.div_id).html('<i class="fas fa-heart"></i>');
                $.post(this.core.api_vxtrans, {
                    action: 'keep_on',
                    token: this.core.token,
                    id: id
                }, (rsp) => {
                    if (rsp.status === 1) {
                        $(_c.div_id).html('<i class="fa-fw fas fa-lock"></i>');
                        $(_c.div_id).attr('onclick', 'vxTrans.keepOff(' + id + ')');
                    }
                    $(_c.div_id).removeAttr('disabled');
                }, 'json');
            }
        }
        _c.send(id);
    }

    keepOff(id) {
        var _c = {
            div_id: '#keep_' + id,
            send: (id) => {
                $(_c.div_id).attr('disabled', 'true');
                $(_c.div_id).html('<i class="fas fa-heart-broken"></i>');
                $.post(this.core.api_vxtrans, {
                    action: 'keep_off',
                    token: this.core.token,
                    id: id
                }, (rsp) => {
                    if (rsp.status === 1) {
                        $(_c.div_id).html('<i class="fa-fw far fa-unlock-alt"></i>');
                        $(_c.div_id).attr('onclick', 'vxTrans.keepOn(' + id + ')');
                    }
                    $(_c.div_id).removeAttr('disabled');
                }, 'json');
            }
        }
        _c.send(id);
    }

    editerReset() {
        $('#set_name').val('');
        $('#set_traget_ip').val('');
        $('#set_target_port').val('');
        $('#set_local_port').val('');
        $('#box_post').html('<i class="far fa-check"></i>');
        $('#set_location').val('');
        $('#box_post').removeAttr('disabled');
        this.areaSelectRede();
    }

    editerRefresh() {
        $('#box_post').html('<i class="far fa-check"></i>');
        $('#box_post').removeAttr('disabled');
    }

    editerPost() {
        //收集数据
        var name = $('#set_name').val();
        var location = $('#set_location').val();
        var target_ip = $('#set_traget_ip').val();
        var target_port = $('#set_target_port').val();
        var local_port = $('#set_local_port').val();
        var local_limit = $('#set_target_limit').val();
        var protocol = $('#set_protocol').val();
        $('#box_post').html('<i class="fas fa-spinner fa-spin"></i>');
        $('#box_post').attr('disabled', 'true');
        //发送请求
        $.post(this.core.api_vxtrans, {
            token: this.core.token,
            protocol: protocol,
            name: name,
            action: 'add',
            location: location,
            localport: local_port,
            to_ip: target_ip,
            to_port: target_port,
            limit: local_limit
        }, (rsp) => {
            if (rsp.status === 1) {
                $('#box_post').html('<i class="far fa-check"></i>');
                this.refreshVxtransList();
                $('#createVxtransModal').modal('hide');
            } else {
                if (rsp.data == '该目标地址未授权，请到“授权列表”进行授权。') {
                    $('#box_post').html('创建失败,目标地址未授权，请返回并点击 <i class="far fa-shield-check"></i> 进行授权');
                } else {
                    $('#box_post').html('创建失败,' + rsp.data);
                }
            }

        }, 'json');
    }

    cloneToUDP(vxtrans_id){
        //停止响应点击
        $(`#vxtrans_clone_${vxtrans_id}`).attr('disabled', 'true');
        let vxtrans = null;

        //查找到这个 ID 的所有配置信息
        for(let x in this.vxtrans_list){
            if(this.vxtrans_list[x].id == vxtrans_id){
                vxtrans = this.vxtrans_list[x];
                break;
            }
        }
        
        let target = null;
        if(vxtrans.target_cname!==0){
            target = vxtrans.target_cname;
        }else{
            target = vxtrans.target_ip;
        }

        //构建请求
        $.post(this.core.api_vxtrans, {
            token: this.core.token,
            protocol: 'udp',
            name: vxtrans.title,
            action: 'add',
            location: vxtrans.location,
            localport: vxtrans.localport,
            to_ip: target,
            to_port: vxtrans.target_port,
            limit: 0
        }, (rsp) => {
            $(`#vxtrans_clone_${vxtrans_id}`).removeAttr('disabled');
            if (rsp.status === 1) {
                this.refreshVxtransList();
            } else {
                alert(rsp.data);
            }

        }, 'json');
    }

    speedTest() {
        for (var i in this.server_list) {
            this.speedTestUnit(i);
        }
    }

    speedTestUnit(i) {
        let code = this.server_list[i].code;

        //preset
        if(code === 'mix'|| code === 'miz'|| code === 'mik'){
            $('#select_area_' + code).removeAttr('class');
            $('#select_area_' + code).html(10 + ' ms');
            $('#select_area_' + code).addClass(this.textColorSelect(10));
            return;
        }

        $.ajax({
            url: 'https://trans-' + code + '.ip.parts:466/?v=' + Date.now(),
            timeout: 5000,
            error: () => {
                // let text = $('#spd_' + code).attr('data-text');
                // $('.spdx_' + code).html(text + ' - 无法连接');
                // $('.spdx_' + code).attr('disabled', true);

                // this.server_list[i].speed = 9999;
                // this.server_list[i].speed_text = '...';
                // this.server_list[i].speed_color = 'text-black';
            },
            success: () => {
                var dtStart = new Date();
                $.get('https://trans-' + code + '.ip.parts:466/', {
                    v: Date.now()
                }, () => {
                    var dtEnd = new Date();
                    var dtPingRaw = dtEnd.getTime() - dtStart.getTime();
                    //暂停
                    // let text = $('#spd_' + code).attr('data-text');
                    // $('#spdtext_' + code).removeAttr('class');
                    // $('#spdtext_' + code).html(text + ' - ' + dtPingRaw + ' ms');
                    // $('#spdx_' + code).removeAttr('disabled');
                    // $('#spdtext_' + code).addClass(this.textColorSelect(dtPingRaw));
                    //
                    $('#select_area_' + code).removeAttr('class');
                    $('#select_area_' + code).html(dtPingRaw + ' ms');
                    $('#select_area_' + code).addClass(this.textColorSelect(dtPingRaw));
                    // $('.spdc_' + code).each(function () {
                    // 	$(this).html('(+' + dtPingRaw + ' ms)');
                    // });

                    // this.server_list[i].speed = dtPingRaw;
                    // this.server_list[i].speed_text = dtPingRaw + ' ms';
                    // this.server_list[i].speed_color = this.textColorSelect(dtPingRaw);
                }, 'text');
            }
        });
    }

    compare(property) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    }

    textColorSelect(val){
        if(val>500)return 'text-black';
        if(val>400)return 'text-red';
        if(val>300)return 'text-pink';
        if(val>200)return 'text-orange';
        if(val>100)return 'text-teal';
        if(val>50)return 'text-green';
        return 'text-success';
    }

    aclListRefresh(){
        $.post(this.core.api_vxtrans, {
            token: this.core.token,
            action: 'acl_list'
        }, (rsp) => {
            if (rsp.status === 1) {
                this.acl_list = rsp.data;
                $('#sg_list').html(app.tpl('sg_list_tpl', rsp.data));
                $('#sg_join_list').html(app.tpl('sg_join_list_tpl', rsp.data));
                $('#sgJoinBtn').removeAttr('disabled');
            } else {
                $('#sg_list').html('目前没有设置安全组。');
                $('#sg_join_list').html('目前没有设置安全组。');
                $('#sgJoinBtn').attr('disabled', true);
            }
        }, 'json');
    }

    aclAdd(){
        let name = prompt('请输入安全组名称');
        if(name === null || name === ''){
            name = 'none';
        }
        $.post(this.core.api_vxtrans, {
            token: this.core.token,
            name: name,
            action: 'acl_add'
        }, (rsp) => {
            if(rsp.status === 1){
                this.aclListRefresh();
            }else{
                alert(rsp.data);
            }
        }, 'json');
    }

    aclNewTitle(id){
        let name = prompt('请输入安全组名称');
        if(name === null || name === ''){
            name = 'none';
        }
        $.post(this.core.api_vxtrans, {
            token: this.core.token,
            acl_id: id,
            name: name,
            action: 'acl_new_title'
        }, (rsp) => {
            if(rsp.status === 1){
                this.aclListRefresh();
            }else{
                alert(rsp.data);
            }
        }, 'json');
    }

    aclDelete(id){
        if(confirm('确定要删除安全组吗？')){
            $.post(this.core.api_vxtrans, {
                token: this.core.token,
                acl_id: id,
                action: 'acl_del'
            }, (rsp) => {
                if(rsp.status === 1){
                    this.aclListRefresh();
                }else{
                    alert(rsp.data);
                }
            }, 'json');
        }
    }

    aclUpdate(id){
        this.acl_id = id;
        $('#vxtrans_acl_rules_box').show();
        //将 id 匹配的 content 写入
        for(let x in this.acl_list){
            if(this.acl_list[x].id === id){

                $('#vxtrans_acl_rules').html(this.acl_list[x].content);
                break;
            }
        }
    }

    aclUpdatePost(){
        let content = $('#vxtrans_acl_rules').val();
        $.post(this.core.api_vxtrans, {
            token: this.core.token,
            acl_id: this.acl_id,
            content: content,
            action: 'acl_update'
        }, () => {
            this.aclListRefresh();
            $('#vxtrans_acl_rules_box').hide();
        });
    }

    aclAssign(vxtrans_id){
        this.assign_id = vxtrans_id;
        $('#sgJoinVxtransModal').modal('show');
    }

    aclAssignPost(){
        let acl_id = $('#vxtrans_acl_select').val();
        $.post(this.core.api_vxtrans, {
            token: this.core.token,
            id: this.assign_id,
            acl_id: acl_id,
            action: 'acl_assign'
        }, () => {
            this.aclListRefresh();
            this.refreshVxtransList();
            $('#sgJoinVxtransModal').modal('hide');
        });
    }

    aclUnassign(id,vxtrans_id){
        if(confirm('确定要取消绑定安全组吗？')){
            $.post(this.core.api_vxtrans, {
                token: this.core.token,
                id: vxtrans_id,
                acl_id : id,
                action: 'acl_unassign'
            }, () => {
                this.aclListRefresh();
                this.refreshVxtransList();
            });
        }
    }
}
class vxlink_vxdns {
    core = null
    currentDomainId = 0
    currentDomainName = ''
    monthlyCounter = 0

    init(core) {
        this.core = core;
    }

    pageInit() {
        if (document.getElementById('init_vxdns') !== null) {
            //初始化
            this.refreshDomainList();
            this.refreshMonthly();
            this.refreshAreaList();
        }
    }

    refreshMonthly() {
        $.post(this.core.api_vxdns, { token: this.core.token, action: 'monthly_counter' }, (rsp) => {
            $('#monthly_counter').html(`本月已处理 ${rsp.data} 次回源解析`);
        }, 'json');
    }

    refreshDomainList() {
        $('#loading_vxdns_domain_list').fadeIn();
        $.post(this.core.api_vxdns, { token: this.core.token, action: 'domain_list' }, (rsp) => {
            if (rsp.status === 1) {
                $('#domain_list').html(app.tpl('domain_list_tpl', rsp.data));
                $('#vxdns_domain_count').html('一共有 ' + rsp.data.length + ' 个域名。');
            }
            $('#loading_vxdns_domain_list').fadeOut();
        }, 'json');
    }

    refreshAreaList() {
        $('#select_area').html(app.tpl('preset_area_tpl',{}));
        $('#loading_vxdns_area_list').fadeIn();
        $.post(this.core.api_vxdns, { token: this.core.token, action: 'area_list' }, (rsp) => {
            if (rsp.status === 1) {
                $('#area_list').html(app.tpl('area_list_tpl', rsp.data));
                $('#vxdns_area_count').html('一共有 ' + rsp.data.length + ' 个配置。');

                $('#my_area').html(app.tpl('area_list_for_record_tpl', rsp.data));
                this.areaSelectDraw();
            }else{
                this.areaSelectDraw();
                $('#area_list').html('暂时没有可用的配置。');
            }
            $('#loading_vxdns_area_list').fadeOut();
        }, 'json');
    }

    backToDomainPannel(){
        $('#vxdns_domain_panel').show();
        $('#vxdns_record_panel').hide();
    }

    recordPannelOpen(domain_id, domain_name){
        $('#vxdns_domain_panel').hide();
        $('#vxdns_record_panel').show();
        $('#vxdns_record_of_domain').html(domain_name);
        $('#record_list').html('正在处理...');
        this.currentDomainId = domain_id;
        this.currentDomainName = domain_name;
        this.refreshRecordList();
    }

    refreshRecordList() {
        let domain_id = this.currentDomainId;
        let domain_name = this.currentDomainName;
        $('#loading_vxdns_record_list').fadeIn();
        $.post(this.core.api_vxdns, { token: this.core.token, action: 'record_list', domain_id: domain_id }, (rsp) => {
            if (rsp.status === 1) {
                //Precore.
                for(let i in rsp.data){
                    let index = rsp.data[i].name.indexOf(domain_name)-1;
                    rsp.data[i].sorname = index==-1?'@':rsp.data[i].name.substr(0,index);
                }
                $('#record_list').html(app.tpl('record_list_tpl', rsp.data));
                $('#vxdns_record_count').html('一共有 ' + rsp.data.length + ' 条记录。');
            }else{
                $('#record_list').html('这个域名目前还没有任何记录。');
            }
            $('#loading_vxdns_record_list').fadeOut();
        }, 'json');
    }

    openAddDomain() {
        $('#set_domain').val('');
        $('#vxdnsDomainModal').modal('show');
    }

    addDomain() {
        var domain = $('#set_domain').val();
        if (!this.domainValidation(domain)) {
            alert('错误的域名格式，请添加顶级域名，如baidu.com。');
        } else {
            $('#refresh_ani').show();
            $('#domain_post').html('<i class="fas fa-spinner fa-spin"></i>');
            $('#domain_post').attr('disabled', 'true');
            $.post(this.core.api_vxdns, { token: this.core.token, action: 'domain_add', domain_name: domain }, (rsp) => {
                if (rsp.status === 0) {
                    alert('添加失败，这个域名已经存在了。');
                } else {
                    alert('添加完成。');
                }
                $('#domain_post').html('<i class="far fa-check"></i>');
                $('#domain_post').removeAttr('disabled');
                $('#refresh_ani').hide();
                this.refreshDomainList();
            }, 'json');
        }
    }

    domainValidation(value) {
        var myReg = new RegExp('^([a-zA-Z0-9][-a-zA-Z0-9]{1,62}\.){1,1}[a-z]{2,10}$');
        return myReg.test(value);
    }

    openAddRecord() {
        $('#set_r_name').val('');
        $('#set_r_content').val('');
        $('#set_r_ttl').val('');
        $('#set_r_mx').val('');
        $('#set_r_type').val(0);
        $('#vxdnsRecordModal').modal('show');
    }

    addRecord() {
        var domain_id = this.currentDomainId;
        var name = $('#set_r_name').val();
        var content = $('#set_r_content').val();
        var ttl = $('#set_r_ttl').val();
        var mx = $('#set_r_mx').val();
        var type = $("#set_r_type option:selected").val();
        var area = $("#set_r_area option:selected").val();
        $('#record_post').html('<i class="fas fa-spinner fa-spin"></i>');
        $('#record_post').attr('disabled', 'true');
        if (ttl === '') {
            ttl = 600;
        }
        if (mx === '') {
            mx = 0;
        }
        $.post(this.core.api_vxdns, {
            token: this.core.token,
            action: 'record_add',
            domain_id: domain_id,
            record_area_id: area,
            record_ttl: ttl,
            record_type: type,
            record_name: name,
            record_content: content,
            record_mx: mx,
        },  (rsp) => {
            if (rsp.status === 0) {
                alert('添加失败。');
            }
            $('#record_post').html('<i class="far fa-check"></i>');
            $('#record_post').removeAttr('disabled');
            this.refreshRecordList();
        }, 'json');
    }

    editRecord(id){
        $(`#record_view_name_${id}`).hide();
        $(`#record_edit_name_${id}`).show();
        $(`#record_view_content_${id}`).hide();
        $(`#record_edit_content_${id}`).show();
    }

    editRecordPost(id){
        $(`#record_view_name_${id}`).show();
        $(`#record_edit_name_${id}`).hide();
        $(`#record_view_content_${id}`).show();
        $(`#record_edit_content_${id}`).hide();

        let name = $(`#record_edit_name_input_${id}`).val();
        let content = $(`#record_edit_content_input_${id}`).val();
        let type = $(`#record_type_${id}`).val();

        $.post(this.core.api_vxdns, {
            token: this.core.token,
            action: 'record_edit',
            domain_id: this.currentDomainId,
            record_id: id,
            record_name: name,
            record_content: content,
            record_type: type,
        },  (rsp) => {
            if (rsp.status === 0) {
                alert(rsp.data);
            }else{
                //更新到 view
                $(`#record_view_name_${id}`).html(name);
                $(`#record_view_content_${id}`).html(content);
            }
        }, 'json');

        
    }

    openAddArean() {
        $('#set_area_name').val('');
        $('#set_area_id').val(0);
        $('#set_area_content').val('');
        $('#vxdnsAreaModal').modal('show');
    }

    addArea() {
        var id = $('#set_area_id').val();
        var title = $('#set_area_name').val();
        var content = $('#set_area_content').val();
        $('#area_post').html('<i class="fa fa-spinner-third fa-spin"></i>');
        $('#area_post').attr('disabled', 'true');
        $.post(this.core.api_vxdns, { token: this.core.token, action: 'area_add', area_id: id, area_title: title, area_content: content }, () => {
            $('#area_post').html('<i class="far fa-check"></i>');
            $('#area_post').removeAttr('disabled');
            this.refreshAreaList();
        }, 'json');
    }

    delDomain(id) {
        if (confirm('真的要删除吗？')) {
            $('#vxdns_unit_' + id).fadeOut();
            $.post(this.core.api_vxdns, { token: this.core.token, action: 'domain_del', domain_id: id }, () => {
                this.refreshDomainList();
            }, 'json');
        }
    }

    delRecord(id) {
        $('#vxdns_record_unit_'+id).fadeOut();
        $.post(this.core.api_vxdns, { token: this.core.token, action: 'record_del',record_id: id },  () => {
            this.refreshRecordList();
        });
    }

    delArea(id) {
        if (confirm('真的要删除吗？删除此区域配置将同时删除关联了此区域配置的所有域名记录。')) {
            $('#loading_vxdns_area_list').fadeIn();
            $('#record_unit_'+id).fadeOut();
            $.post(this.core.api_vxdns, { token: this.core.token, action: 'area_del', area_id: id },  ()=>{
                $('#loading_vxdns_area_list').fadeOut();
            }, 'json');
        }
    }

    editArea(id) {
        $('#loading_vxdns_area_list').fadeIn();
        $.post(this.core.api_vxdns, { token: this.core.token, action: 'area_detail', area_id: id }, function (rsp) {
            $('#set_area_name').val(rsp.data.title);
            $('#set_area_content').val(rsp.data.content);
            $('#set_area_id').val(rsp.data.id);
            $('#vxdnsAreaModal').modal('show');
            $('#loading_vxdns_area_list').fadeOut();
        }, 'json');
    }

    activeRecord(id) {
        $('#vxdns_unit_active_' + id).addClass('bg-gray');
        var _c = {
            div_id: '#vxdns_unit_active_' + id,
            send: (id) => {
                $(_c.div_id).attr('disabled', 'true');
                $.post(this.core.api_vxdns, { action: 'record_active', record_active: 'on', token: this.core.token, record_id: id },  (rsp)=>{
                    if (rsp.status === 1) {
                        $(_c.div_id).addClass('btn-success');
                        $(_c.div_id).removeClass('btn-danger');
                        $(_c.div_id+">i").removeClass('fa-stop-circle');
                        $(_c.div_id+">i").addClass('fa-check-circle');
                        $(_c.div_id).attr('onclick', 'vxDns.deActivateRecord(' + id + ')');
                    }
                    $(_c.div_id).removeAttr('disabled');
                    $('#vxdns_unit_active_' + id).removeClass('bg-gray');
                }, 'json');
            }
        }
        _c.send(id);
    }

    deActivateRecord(id) {
        $('#vxdns_unit_active_' + id).addClass('bg-gray');
        var _c = {
            div_id: '#vxdns_unit_active_' + id,
            send: (id) => {
                $(_c.div_id).attr('disabled', 'true');
                $.post(this.core.api_vxdns, { action: 'record_active', record_active: 'off', token: this.core.token, record_id: id }, function (rsp) {
                    if (rsp.status === 1) {
                        $(_c.div_id).removeClass('btn-success');
                        $(_c.div_id).addClass('btn-danger');
                        $(_c.div_id+">i").removeClass('fa-check-circle');
                        $(_c.div_id+">i").addClass('fa-stop-circle');
                        $(_c.div_id).attr('onclick', 'vxDns.activeRecord(' + id + ')');
                    }
                    $(_c.div_id).removeAttr('disabled');
                    $('#vxdns_unit_active_' + id).removeClass('bg-gray');
                }, 'json');
            }
        }
        _c.send(id);
    }

    monitorRecord(id) {
        $('#vxdns_unit_mon_' + id).addClass('bg-gray');
        var _c = {
            div_id: '#vxdns_unit_mon_' + id,
            send: (id )=> {
                $(_c.div_id).attr('disabled', 'true');
                $.post(this.core.api_vxdns, { action: 'record_check', record_check: 1, token: this.core.token, record_id: id }, (rsp) => {
                    $(_c.div_id).removeClass('btn-outline-success');
                    $(_c.div_id).addClass('btn-success');
                    $(_c.div_id).removeAttr('disabled');
                    $('#vxdns_unit_mon_' + id).removeClass('bg-gray');
                }, 'json');
            }
        }
        _c.send(id);
    }

    unMonitorRecord(id) {
        $('#vxdns_unit_mon_' + id).addClass('bg-gray');
        var _c = {
            div_id: '#vxdns_unit_mon_' + id,
            send: (id) => {
                $(_c.div_id).attr('disabled', 'true');
                $.post(this.core.api_vxdns, { action: 'record_check', record_check: 0, token: this.core.token, record_id: id }, (rsp) => {
                    $(_c.div_id).removeClass('btn-success');
                    $(_c.div_id).addClass('btn-outline-success');
                    $(_c.div_id).attr('onclick', 'vxDns.monitorRecord(' + id + ')');
                    $(_c.div_id).removeAttr('disabled');
                    $('#vxdns_unit_mon_' + id).removeClass('bg-gray');
                }, 'json');
            }
        }
        _c.send(id);
    }

    areaSelectDraw() {
        $('#set_r_area').selectize({
            persist: false,
            render: {
                option: function (data, escape) {
                    return '<div>' +
                        '<span class="image"><img src="' + data.image + '" alt=""></span>' +
                        '<span class="title">' + escape(data.text) + '</span>' +
                        '</div>';
                },
                item: function (data, escape) {
                    return '<div>' +
                        '<span class="image"><img src="' + data.image + '" alt=""></span>' +
                        escape(data.text) +
                        '</div>';
                }
            }
        });
    }

}
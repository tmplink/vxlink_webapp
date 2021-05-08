class vxlink_vxserver {
    core = null
    servicesize = ''
    servicearea = ''
    param_init = false

    init(core) {
        this.core = core;
    }

    pageInit() {
        if (document.getElementById('init_vxserver') !== null) {
            $('#nav_vxserver').addClass('active');
            this.refreshList();
        }
    }

    refreshList() {
        $('#loading_vxserver_list').fadeIn();
        $.post(this.core.api_vxserver, { action: 'list', token: this.core.token }, function (rsp) {
            if (rsp.status === 1) {
                $('#vxserver_count').html('一共有 ' + rsp.data.length + ' 个项目。');
                $('#vxserver_list').html(app.tpl('vxserver_list_tpl', rsp.data));
            } else {
                $('#vxserver_list').html('暂无项目。');
            }
            $('#loading_vxserver_list').fadeOut();
        }, 'json');
    }


    addOpen() {
        //申请一个cert
        this.cert_request();
        $('#myModal').modal('show');
    }

    cert_request(){
        $.post(this.core.api_vxserver, { action: 'cert_request', token: this.core.token }, (rsp) => {
            $('#set_cert').val(rsp.data);
        }, 'json');    
    }

    add() {
        //收集数据
        var title = $('#set_title').val();
        var domain = $('#set_domain').val();
        var repo = $('#set_repo').val();
        var cert = $('#set_cert').val();
        $('#box_post').html('正在处理');
        $('#box_post').attr('disabled', 'true');
        $('#box_post_doing').fadeIn(300);
        //发送请求
        $.post(this.core.api_vxserver, {action: 'add', title: title, domain: domain, repo: repo,cert:cert,token: this.core.token }, (rsp) => {
            if (rsp.status === 0) {
                $('#box_post').html(rsp.data);
                setTimeout(() =>{
                    $('#box_post').removeAttr('disabled');
                    $('#box_post').html('创建');
                },3000);
            } else {
                $('#box_post').removeAttr('disabled');
                $('#box_post').html('创建');
                $('#myModal').modal('hide');
                this.refreshList();
            }
            $('#box_post_doing').fadeOut(300);
        }, 'json');
    }

    delete(id){
        $.post(this.core.api_vxserver, {action: 'del', id: id, token: this.core.token }, () => {
            this.refreshList();
        }, 'json');
    }
}
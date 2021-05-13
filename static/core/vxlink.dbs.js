class vxlink_dbservice {
    core = null
    servicesize = ''
    servicearea = ''
    param_init = false

    init(core) {
        this.core = core;
    }

    pageInit() {
        if (document.getElementById('init_dbservice') !== null) {
            this.refreshList();
            if(this.param_init===false){
                this.paramInit();
            }
        }
    }

    paramInit() {
        this.servicesize += '<option value="10">128MB存储,10并发连接,25IOPS</option>';
        this.servicesize += '<option value="9">256MB存储,10并发连接,25IOPS</option>';
        this.servicesize += '<option value="8">512MB存储,10并发连接,25IOPS</option>';
        this.servicesize += '<option value="1">1GB存储,10并发连接,25IOPS]</option>';
        this.servicesize += '<option value="2">2GB存储,25并发连接,50IOPS</option>';
        this.servicesize += '<option value="3">4GB存储,50并发连接,100IOPS</option>';
        this.servicesize += '<option value="4">8GB存储,100并发连接,200IOPS</option>';
        this.servicesize += '<option value="5">16GB存储,200并发连接,400IOPS</option>';
        this.servicesize += '<option value="6">32GB存储,400并发连接,800IOPS</option>';
        this.servicesize += '<option value="7">64GB存储,800并发连接,1600IOPS</option>';

        this.servicearea += '<option value="c-cn">中国广州</option>';
        this.servicearea += '<option value="c-hk">中国香港</option>';
        this.servicearea += '<option value="c-jp">日本东京</option>';
        this.servicearea += '<option value="c-us">美国洛杉矶</option>';
        this.servicearea += '<option value="c-ca">加拿大多伦多</option>';
        this.servicearea += '<option value="c-de">德国法兰克福</option>';
        this.servicearea += '<option value="c-sg">新加坡</option>';
        
        this.param_init = true;
    }

    refreshList() {
        $('#loading_dbservice_list').fadeIn();
        $.post(this.core.api_dbs, { action: 'db_list', token: this.core.token }, function (rsp) {
            if (rsp.status === 1) {
                $('#dbservice_count').html('一共有 ' + rsp.data.length + ' 个云数据库。');
                $('#dbservice_list').html(app.tpl('dbservice_list_tpl', rsp.data));
            } else {
                $('#dbservice_list').html('暂无正在运行的数据库实例。');
            }
            $('#loading_dbservice_list').fadeOut();
        }, 'json');
    }


    editerCreate(id) {
        //重设选项
        $('#set_plan').html(this.servicesize);
        $('#set_area').html(this.servicearea);
        //根据ID选择处理
        if (id === 0) {
            $('#edit_id').val(0);
            $('#set_name').val('');
            $('#box_post').html('创建');
            $('#set_speed').find("option[value='1']").attr("selected", true);
            $('#myModal').modal('show');
        }
    }
    editerPost() {
        //收集数据
        var id = $('#edit_id').val();
        var name = $('#set_name').val();
        var plan = $('#set_plan').val();
        var area = $('#set_area').val();
        $('#box_post').html('正在处理');
        $('#box_post').attr('disabled', 'true');
        $('#box_post_doing').fadeIn(300);
        //发送请求
        $.post(this.core.api_dbs, { id: id, action: 'db_add', area: area, name: name, plan: plan, type: 0, token: this.core.token }, (rsp) => {
            if (rsp.status === 0) {
                $('#box_post').html(rsp.data);
            } else {
                $('#box_post').removeAttr('disabled');
                $('#box_post').html('创建');
                this.refreshList();
                $('#myModal').modal('hide');
            }
            $('#box_post_doing').fadeOut(300);
        }, 'json');
    }
    editerPlanto(id) {
        //重设选项
        $('#edit_plan_id').val(id);
        $('#set_newplan').html(this.servicesize);
        $('#set_new_plan').modal('show');
    }
    editerPlan() {
        //收集数据
        var id = $('#edit_plan_id').val();
        var plan = $('#set_newplan').val();
        $('#box_plan_doing').fadeIn(300);
        //发送请求
        $.post(this.core.api_dbs, { id: id, action: 'db_plan', plan: plan, token: this.core.token }, (rsp) => {
            if (rsp.status === 0) {
                $('#box_plan').html(rsp.data);
            } else {
                $('#box_plan').html(rsp.data);
                this.refreshList();
                $('#set_new_plan').modal('hide');
            }
            $('#box_plan_doing').fadeOut(300);
        }, 'json');
    }
    editerDelete(id) {
        if (confirm('删除数据库是一种不可恢复的操作，您确定要这么做吗?')) {
            $.post(this.core.api_dbs, { id: id, action: 'db_del', token: this.core.token }, (rsp) => {
                this.refreshList();
            }, 'json');
        }
    }

    editerOpen(url) {
        window.open(url);
    }
}
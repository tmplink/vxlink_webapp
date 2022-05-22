class vxlink_prophet {
    core = null
    prophet_archive_list = null

    init(core) {
        this.core = core;
    }

    pageInit() {
        if (document.getElementById('init_prophet') !== null) {
            this.refreshArchiveList();
        }
    }

    refreshArchiveList(){
        $.post(this.core.api_prophet, { action: 'archive_list', token: this.core.token }, (rsp) => {
            $('#loading_prophet_list').fadeOut();
            if (rsp.status === 1) {
                this.prophet_archive_list = rsp.data;
                $('#prophet_archive_list').html(app.tpl('prophet_archive_list_tpl', rsp.data));
                console.log('Prophet List Loaded');
            }
        }, 'json');
    }

    archiveEditerOpen() {
        $('#prophet_create_set_name').val('');
        $('#prophet_create_set_key').val('');
        $('#prophet_create_post').html('<i class="far fa-check"></i>');
        $('#prophet_create_post').removeAttr('disabled');
        $('#prophet_create_Modal').modal('show');
    }

    archiveEditerPost() {
        //收集数据
        let name = $('#prophet_create_set_name').val();
        let key = $('#prophet_create_set_key').val();
        $('#prophet_create_post').html('<i class="fas fa-spinner fa-spin"></i>');
        $('#prophet_create_post').attr('disabled', 'true');


        //发送请求
        $.post(this.core.api_prophet, {
            name: name, action: 'archive_add', 
            key: key, token: this.core.token,
        }, (rsp) => {
            if (rsp.status === 1) {
                $('#prophet_create_post').html('<i class="far fa-check"></i>');
                this.refreshMonitorList();
                $('#prophet_create_Modal').modal('hide');
            } else {
                $('#prophet_create_post').html('创建失败：' + rsp.data);
            }
        }, 'json');
    }
}
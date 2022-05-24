class vxlink_prophet {
    core = null
    prophet_archive_list = null

    init(core) {
        this.core = core;
    }

    pageInit() {
        if (document.getElementById('init_prophet') !== null) {
            this.refreshArchiveList();
            this.refreshDashboardList();
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

    archiveDelete(key){
        let comfirm = confirm('确定删除？');
        if (comfirm===false) {
            return;
        }
        $.post(this.core.api_prophet, { action: 'archive_delete', token: this.core.token, key: key }, (rsp) => {
            if (rsp.status === 1) {
                this.refreshArchiveList();
            }
        }, 'json');
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
                $('#prophet_create_modal').modal('hide');
            } else {
                $('#prophet_create_post').html('创建失败：' + rsp.data);
            }
        }, 'json');
    }

    refreshDashboardList(){
        $.post(this.core.api_prophet, { action: 'dashboard_list', token: this.core.token }, (rsp) => {
            $('#loading_prophet_dashboard_list').fadeOut();
            if (rsp.status === 1) {
                this.prophet_dashboard_list = rsp.data;
                $('#prophet_dashboard_list').html(app.tpl('prophet_dashboard_list_tpl', rsp.data));
                console.log('Prophet Dashboard List Loaded');
            }
        }, 'json');
    }

    dashboardEditerOpen() {
        $('#prophet_dashboard_set_name').val('');
        $('#prophet_dashboard_set_key').val('');
        $('#prophet_dashboard_post').html('<i class="far fa-check"></i>');
        $('#prophet_dashboard_post').removeAttr('disabled');
        $('#prophet_dashboard_modal').modal('show');
    }

    dashboardEditerPost() {
        //收集数据
        let name = $('#prophet_dashboard_set_name').val();
        let key = $('#prophet_dashboard_set_key').val();
        $('#prophet_dashboard_post').html('<i class="fas fa-spinner fa-spin"></i>');
        $('#prophet_dashboard_post').attr('disabled', 'true');


        //发送请求
        $.post(this.core.api_prophet, {
            name: name, action: 'dashboard_add', 
            key: key,  token: this.core.token,
        }, (rsp) => {
            if (rsp.status === 1) {
                $('#prophet_dashboard_post').html('<i class="far fa-check"></i>');
                this.refreshDashboardList();
                $('#prophet_dashboard_modal').modal('hide');
            } else {
                $('#prophet_dashboard_post').html('创建失败：' + rsp.data);
            }
        }, 'json');
    }

    dashboardDelete(key){
        let comfirm = confirm('确定删除？');
        if (comfirm===false) {
            return;
        }
        $.post(this.core.api_prophet, { action: 'dashboard_delete', key: key, token: this.core.token }, (rsp) => {
            if (rsp.status === 1) {
                this.refreshDashboardList();
            }
        }, 'json');
    }
}
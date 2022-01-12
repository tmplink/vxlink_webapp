class vxlink_settings {
    core = null

    init(core) {
        this.core = core;
    }

    pageInit() {
        if (document.getElementById('init_settings') !== null) {
            $('#delete_code').html(this.core.uid);

            $('#current_email').html(this.core.email);
            if(this.core.email_notification){
                $('#email_notification_status').attr('checked',true);
            }
            if(this.core.tg_notification){
                $('#tg_notification_status').attr('checked',true);
            }
        }
    }

    emailNotificationChange(){
        let status = ($('#email_notification_status').is(':checked')) ? 'yes' : 'no';
        $.post(this.core.api_user, { token: this.core.token, action: 'notification_subscribe', subscribe: status });
    }

    telegramNotificationChange(){
        let status = ($('#tg_notification_status').is(':checked')) ? 'yes' : 'no';
        $.post(this.core.api_user, { token: this.core.token, action: 'notification_tg', subscribe: status });
    }

    setEmail() {
        var email = $('#email_val').val();
        $('#msgbox_email').fadeIn();
        $('#msgbox_email').html('正在处理...');
        $('#core_email').attr('disabled', true);
        $.post(this.core.api_user, { token: this.core.token, email: email, action: 'init' }, (rsp) => {
            if (rsp.status === 1) {
                $('#msgbox_email').html('验证邮件已发送');
            } else {
                $('#msgbox_email').html('失败，' + rsp.data);
                $('#core_email').removeAttr('disabled');
            }
        }, 'json');
    }

    setPassword() {
        var pwd1 = $('#password1_val').val();
        var pwd2 = $('#password2_val').val();
        $('#msgbox_setpwd').fadeIn();
        $('#msgbox_setpwd').html('正在处理...');
        $('#core_setpwd').attr('disabled', true);
        $.post(this.core.api_user, { token: this.core.token, password: pwd1, rpassword: pwd2, action: 'setpwd' }, (rsp) => {
            if (rsp.status === 1) {
                $('#msgbox_setpwd').html('新密码已生效');
            } else {
                $('#msgbox_setpwd').html('失败，' + rsp.data);
                $('#core_setpwd').removeAttr('disabled');
            }
        }, 'json');
    }

    deleteAccount(){
        var code = $('#delete_code_val').val();
        if(!confirm('确定要删除账号吗?注销账号是无法撤销的操作.')){
            return false;
        }
        if(code !== this.core.uid){
            alert('请输入正确的确认码');
            return false;
        }
        $.post(this.core.api_user, { token: this.core.token, code: code, action: 'delete_account' }, (rsp) => {
            app.open('/');
        }, 'json');
    }
}
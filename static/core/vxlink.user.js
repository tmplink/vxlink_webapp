class vxlink_user {
    core = null

    init(core) {
        this.core = core;
    }

    pageInit() {
        if (document.getElementById('init_signup') !== null) {
            this.pageSignUpInit();
        }
        if (document.getElementById('init_signin') !== null) {
            this.pageSignInInit();
        }
        if (document.getElementById('init_reset') !== null) {
            this.pageResetInit();
        }
        if (document.getElementById('init_email') !== null) {
            this.pageEmailInit();
        }
    }

    pageSignUpInit() {
        this.core.initExec(() => {
            if (this.core.uid != null) {
                $('#user-signup-box').prepend('<div class="overlay"></div>');
                $('#msgbox').html('账号已登录,正在进入...');
                setTimeout(() => {
                    app.open('/admin/');
                }, 2000);
                return true;
            }
        });
        if (localStorage.getItem('rel') !== null) {
            $('#regcodex').val(localStorage.getItem('rel'));
            $('#regcodex_box').hide();
        }
    }

    pageSignInInit() {
        this.core.initExec(() => {
            if (this.core.uid != null) {
                $('#user-signin-box').prepend('<div class="overlay"></div>');
                $('#msgbox').html('账号已登录,正在进入...');
                setTimeout(() => {
                    app.open('/admin/');
                }, 2000);
                return true;
            }
        });
    }

    pageEmailInit() {
        this.core.initExec(() => {
            if (this.core.uid == null) {
                app.open('/signin.html');
                return true;
            }
        });
    }

    pageResetInit() {
        this.core.initExec(() => {
            if (this.core.uid != null) {
                app.open('/admin/');
                return true;
            }
        });
    }

    regGetCheckCode() {
        var email = $('#reg_email').val();
        $('#button-reg-checkcode').attr('disabled', '');
        $('#button-reg-checkcode').html('正在发送');
        $.post(this.core.api_user, {
            token: this.core.token,
            action: 'checkcode_send',
            email: email,
        }, (rsp) => {
            if (rsp.status === 1) {
                $('#msgbox').fadeIn();
                $('#msgbox').addClass('alert-warning');
                $('#msgbox').html('验证码<b style="color:red;">已发送到您的邮箱</b>。<br>没有收到？试试检查<b style="color:red;">垃圾箱</b>或者更换其他邮箱。<br>建议使用 Gmail 邮箱。');
                $('#button-reg-checkcode').html('已送达');
            } else {
                $('#msgbox').fadeIn();
                $('#msgbox').addClass('alert-warning');
                $('#msgbox').html('失败：' + rsp.data);
                $('#button-reg-checkcode').removeAttr('disabled');
                $('#button-reg-checkcode').html('发送验证码');
            }
        }, 'json');
    }

    signUp() {
        var email = $('#reg_email').val();
        var password = $('#password').val();
        var regcode = $('#regcodex').val();
        var checkcode = $('#checkcode').val();
        $('#msgbox').fadeIn();
        $('#msgbox').addClass('alert-primary');
        $('#msgbox').html('正在进行...');
        $('#reg').addClass('disabled');

        if (email === undefined || password === undefined || email === '' || password === '') {
            $('#msgbox').html('用户名或者密码不能为空。');
            $('#reg').removeClass('disabled');
            return false;
        }

        if (checkcode === undefined || checkcode === '') {
            $('#msgbox').html('邀请码不能为空。');
            $('#reg').removeClass('disabled');
            return false;
        }

        if ($('#customCheck1').is(':checked') === false) {
            $('#msgbox').html('您需要同意服务条款和隐私政策才能进行注册。');
            $('#reg').removeClass('disabled');
            return false;
        }

        $.post(this.core.api_user, { 
            token: this.core.token, 
            email: email, password: password,checkcode:checkcode,
            regcode: regcode, action: 'reg_2' 
        }, (rsp) => {
            $('#msgbox').removeClass('alert-primary');
            if (rsp.status === 1) {
                $('#msgbox').removeClass('alert-danger');
                $('#msgbox').addClass('alert-success');
                $('#msgbox').html('创建成功，正在进入');
                $.post(this.core.api_user, { token: this.core.token, username: email, password: password, action: 'login' }, (rsp) => {
                    if (rsp.status === 1) {
                        app.open('/admin/');
                    }
                }, 'json');
            } else {
                if(rsp.data==='无效的邀请码'){
                    $('#regcodex_box').show();
                    $('#regcodex').val('');
                }
                $('#msgbox').removeClass('alert-success');
                $('#msgbox').addClass('alert-danger');
                $('#msgbox').html('失败，' + rsp.data);
                $('#reg').removeClass('disabled');
            }
        }, 'json');
    }

    signIn() {
        var username = $('#username').val();
        var password = $('#password').val();
        $('#msgbox').html('正在登录...');
        $('#msgbox').removeClass('alert-success');
        $('#msgbox').removeClass('alert-danger');
        $('#msgbox').addClass('alert-primary');
        $('#submit').addClass('disabled');
        $.post(this.core.api_user, { token: this.core.token, username: username, password: password, action: 'login' }, (rsp) => {
            if (rsp.status === 1) {
                $('#msgbox').removeClass('alert-primary');
                $('#msgbox').removeClass('alert-danger');
                $('#msgbox').addClass('alert-success');
                $('#msgbox').html('登录成功，正在进入');
                //重新初始化用户信息
                this.core.userInit(()=>{
                    app.open('/admin/');
                });
            } else {
                $('#msgbox').html(rsp.data);
                $('#msgbox').removeClass('alert-primary');
                $('#msgbox').removeClass('alert-success');
                $('#msgbox').addClass('alert-danger');
                $('#submit').removeClass('disabled');
            }
        }, 'json');
    }

    resetPassword() {
        var email = $('#email').val();
        $('#msgbox').html('正在处理...');
        $('#msgbox').removeClass('alert-success');
        $('#msgbox').removeClass('alert-danger');
        $('#msgbox').addClass('alert-primary');
        $('#submit').addClass('disabled');
        $.post(this.core.api_user, { token: this.core.token, email: email, action: 'resetpwd' }, (rsp) => {
            if (rsp.status === 1) {
                $('#msgbox').removeClass('alert-primary');
                $('#msgbox').removeClass('alert-danger');
                $('#msgbox').addClass('alert-success');
                $('#msgbox').html('新密码已通过邮件发送到您的邮箱,请注意查收.');

            } else {
                $('#msgbox').html(rsp.data);
                $('#msgbox').removeClass('alert-primary');
                $('#msgbox').removeClass('alert-success');
                $('#msgbox').addClass('alert-danger');
                $('#submit').removeClass('disabled');
            }
        }, 'json');
    }

    emailInit() {
        var email = $('#email').val();
        $('#msgbox').html('正在处理...');
        $('#msgbox').removeClass('alert-success');
        $('#msgbox').removeClass('alert-danger');
        $('#msgbox').addClass('alert-primary');
        $('#submit').addClass('disabled');
        $.post(this.core.api_user, { token: this.core.token, email: email, action: 'init' }, (rsp) => {
            if (rsp.status === 1) {
                $('#msgbox').removeClass('alert-primary');
                $('#msgbox').removeClass('alert-danger');
                $('#msgbox').addClass('alert-success');
                $('#msgbox').html('确认链接已通过邮件发送到您的邮箱,请注意查收.');
                gtag('event', 'conversion', {
                    'send_to': 'AW-977119233/klB8CN6rstkBEIHQ9tED'
                });
            } else {
                $('#msgbox').html(rsp.data);
                $('#msgbox').removeClass('alert-primary');
                $('#msgbox').removeClass('alert-success');
                $('#msgbox').addClass('alert-danger');
                $('#submit').removeClass('disabled');
            }
        }, 'json');
    }

    signOut() {
        if (confirm('确定要退出吗？')) {
            $.post(this.core.api_user, { token: this.core.token, action: 'logout' }, () => {
                window.location = '/';
            }, 'json');
        }
    }
}
class vxlink_user {
    core = null

    init(core) {
        this.core = core;
    }

    pageInit() {
        if (document.getElementById('init_signup') !== null) {
            $('#submit').html('提交注册');
            $('#submit').removeAttr('disabled');
            this.pageSignUpInit();
        }
        if (document.getElementById('init_signin') !== null) {
            $('#submit').html('登录');
            $('#submit').removeAttr('disabled');
            this.pageSignInInit();
        }
        if (document.getElementById('init_reset') !== null) {
            $('#submit').html('重设密码');
            $('#submit').removeAttr('disabled');
            this.pageResetInit();
        }
        if (document.getElementById('init_email') !== null) {
            $('#submit').html('确定');
            $('#submit').removeAttr('disabled');
            this.pageEmailInit();
        }
    }

    pageSignUpInit() {
        this.core.initExec(() => {
            if (this.core.uid != null) {
                $('#user-signup-box').prepend('<div class="overlay"></div>');
                $('#msgbox').html('账号已登陆,正在进入...');
                setTimeout(() => {
                    app.open('/service/home.html');
                }, 2000);
                return true;
            }
        });

        $('#submit').on('click', () => {
            this.signUp();
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
                $('#msgbox').html('账号已登陆,正在进入...');
                setTimeout(() => {
                    app.open('/service/home.html');
                }, 2000);
                return true;
            }
        });

        $('#submit').on('click', () => {
            this.signIn();
        });
    }

    pageEmailInit() {
        this.core.initExec(() => {
            if (this.core.uid == null) {
                app.open('/signin.html');
                return true;
            }
        });

        $('#submit').on('click', () => {
            this.emailInit();
        });
    }

    pageResetInit() {
        this.core.initExec(() => {
            if (this.core.uid != null) {
                app.open('/service/home.html');
                return true;
            }
        });

        $('#submit').on('click', () => {
            this.resetPassword();
        });
    }

    signUp() {
        var username = $('#username').val();
        var password = $('#password').val();
        var regcode = $('#regcodex').val();
        $('#msgbox').html('正在进行...');
        $('#reg').addClass('disabled');

        if (username === undefined || password === undefined || username === '' || password === '') {
            $('#msgbox').html('用户名或者密码不能为空。');
            $('#reg').removeClass('disabled');
            return false;
        }
        if ($('#customCheck1').is(':checked') === false) {
            $('#msgbox').html('您需要同意服务条款和隐私政策才能进行注册。');
            $('#reg').removeClass('disabled');
            return false;
        }

        $.post(this.core.api_user, { token: this.core.token, username: username, password: password, regcode: regcode, action: 'reg' }, (rsp) => {
            if (rsp.status === 1) {
                $('#msgbox').html('创建成功，正在进入');
                $.post(this.core.api_user, { token: this.core.token, username: username, password: password, action: 'login' }, (rsp) => {
                    if (rsp.status === 1) {
                        app.open('/init.html');
                    }
                }, 'json');
            } else {
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
                app.open('/service/home.html');
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
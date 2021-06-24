class vxlink_core {
    uid = null
    email = null
    email_notification = null
    user_position = 0
    user_point = 0
    user_rpoint = 0
    token = null
    ready = false
    api_chart = 'https://vx.link/api/chart'
    api_vxtrans = 'https://vx.link/openapi/v1/vxtrans'
    api_dbs = 'https://vx.link/openapi/v1/dbs'
    api_vxdns = 'https://vx.link/openapi/v1/vxdns'
    api_vxping = 'https://vx.link/openapi/v1/vxping'
    api_user = 'https://vx.link/openapi/v1/user'
    api_vxserver = 'https://vx.link/openapi/v1/vxserver'
    api_token = 'https://vx.link/openapi/v1/token'
    clipboard = null

    op_user = null

    init() {
        if (getQueryVariable('rel') !== false) {
            localStorage.setItem('rel', getQueryVariable('rel'));
        }
        this.initGetToken(() => {
            this.userInit();
        });

        //绑定粘贴
        this.bindCopyBtn();
        //issue -> https://github.com/zenorocha/clipboard.js/issues/155#issuecomment-217372642
        $.fn.modal.Constructor.prototype._enforceFocus = function() {};
    }

    bindCopyBtn() {
        $.fn.modal.Constructor.prototype._enforceFocus = function() {};
        this.clipboard = new ClipboardJS('.btncp');
        this.clipboard.on('success', (e) => {
            let tmp = $(e.trigger).html();
            $(e.trigger).html('<i class="fas fa-check-circle fa-fw text-success"></i>');
            setTimeout(() => {
                $(e.trigger).html(tmp);
            }, 3000);
        });
    }

    bind(op, ops) {
        this[op] = ops;
    }

    userInit(cb) {
        $.post(this.api_user, { token: this.token, action: 'get_user' }, (rsp) => {
            if (rsp.status) {
                this.uid = rsp.data.uid;
                this.email = rsp.data.email;
                this.email_notification = rsp.data.subscribe;
                this.user_position = rsp.data.position;
                this.user_point = rsp.data.point;
                this.user_rpoint = rsp.data.rpoint;
                this.user_coin = rsp.data.coin;
            }
            this.ready = true;
            if (typeof (cb) === 'function') {
                cb();
            }
        }, 'json');
    }

    initExec(cb) {
        if (this.ready === false) {
            setTimeout(() => {
                console.log('Not ready,wating');
                this.initExec(cb);
            }, 1000);
        } else {
            cb();
        }
    }

    initGetToken(cb) {
        let token = localStorage.getItem('app_token');
        if (token !== null) {
            this.token = token;
            if (typeof (cb) === 'function') {
                cb();
            }
        } else {
            $.post(this.api_token, (rsp) => {
                this.token = rsp;
                localStorage.setItem('app_token', rsp);
                if (typeof (cb) === 'function') {
                    cb();
                }
            });
        }
    }
}
class vxlink_core{
    uid = null
    email = null
    email_notification = null
    token = null
    ready = false
    api_chart = 'https://vx.link/api/chart'
    api_vxtrans = 'https://vx.link/openapi/v1/vxtrans'
    api_dbs = 'https://vx.link/openapi/v1/dbs'
    api_vxdns = 'https://vx.link/openapi/v1/vxdns'
    api_vxping = 'https://vx.link/openapi/v1/vxping'
    api_user = 'https://vx.link/openapi/v1/user'
    api_token = 'https://vx.link/openapi/v1/token'

    op_user = null

    init() {
        if (getQueryVariable('rel')!==false) {
            localStorage.setItem('rel',getQueryVariable('rel'));
        }
        this.initGetToken( () => {
            $.post(this.api_user, { token: this.token, action: 'get_user' },  (rsp) => {
                if(rsp.status){
                    this.uid = rsp.data.uid;
                    this.email = rsp.data.email;
                    this.email_notification = rsp.data.subscribe;
                }
                this.ready = true;
            }, 'json');
        });
    }

    bind(op,ops){
        this[op] = ops;
    }

    initExec(cb){
        if(this.ready===false){
            setTimeout(()=>{
                console.log('Not ready,wating');
                this.initExec(cb);
            },1000);
        }else{
            cb();
        }
    }

    initGetToken(cb) {
        let token = localStorage.getItem('app_token');
        if (token !== null) {
            this.token = token;
            if(typeof(cb)==='function'){
                cb();
            }
        } else {
            $.post(this.api_token,  (rsp) => {
                this.token = rsp;
                localStorage.setItem('app_token', rsp);
                if(typeof(cb)==='function'){
                    cb();
                }
            });
        }
    }
}
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  import resource from './api/resource.js'
  import * as dd from 'dingtalk-jsapi';
  export default {
    created() {

      this.getUserInfo();
      return;

      let user_type = sessionStorage.getItem("user_type");
      if(user_type != '2'){ //内部
        if(dd.env.platform != 'notInDingTalk'){ //是钉钉环境
          //获取code
          this.getCode();
        }else{                                  //不是钉钉环境
          this.getUserInfo();
        }
      }
    },
    watch:{
      $route:function(n,o){
        document.title = n.name;
      }
    },
    methods: {
        //获取code
      getCode(){
        dd.ready(() => {
          dd.runtime.permission.requestAuthCode({
            corpId: "ding7828fff434921f5b",
            onSuccess: res =>{
                      //获取钉钉用户信息
              let code = res.code;
              this.GetDingUserInfo(code);
            },
            onFail : err => {
              alert('dd error: ' + JSON.stringify(err));
            }
          });
        });
      },
          //钉钉获取用户信息
      GetDingUserInfo(code){
        resource.dingLogin({code:code}).then(res => {
          if(res.data.code == 1){
            this.getUserInfo();
          }else{
            this.$message.warning(res.data.msg);
          }
        })
      },
        //获取用户信息
      getUserInfo() {
        resource.getUserInfo().then((res) => {
          if (res.data.code == 1) {
            sessionStorage.setItem("cache",true);
            let data = res.data.data;
            sessionStorage.setItem("user_type", data.user_type);
            sessionStorage.setItem("ding_user_id", data.ding_user_id);
            sessionStorage.setItem("ding_user_name", data.ding_user_name);
            sessionStorage.setItem("secret_key", data.secret_key);
            sessionStorage.setItem("login_token", data.login_token);
            let user_info = {
              user_type:data.user_type,
              ding_user_id:data.ding_user_id,
              ding_user_name:data.ding_user_name,
              login_token:data.login_token,
              secret_key:data.secret_key
            }
            this.$store.commit('setToken',user_info);
            let domain = data.img_domain;
            this.$store.commit('setDomain',domain);
            sessionStorage.setItem("domain",domain);
              //获取导航
            this.getMenuNotice();
          } else {
            this.$message.warning(res.data.msg);
          }
        });
      },
        //获取导航
      getMenuNotice(){
        resource.getMenuNotice().then(res => {
          if(res.data.code == 1){
            let data = res.data.data;
            let menu_list = [
            {
              "menu_id": 1,
              "menu_name": "选品中心",
              "web_url": "index",
              "icon": "s-order",
              "show_type": 1,
              "list": []
            },
            {
              "menu_id": 4,
              "menu_name": "供应链中心",
              "web_url": "supply_chain",
              "icon": "s-order",
              "show_type": 1,
              "list": [
              {
                "menu_id": 7,
                "menu_name": "供应商",
                "web_url": "chain_supplier_page",
                "icon": "s-order",
                "show_type": 1,
                "list": []
              },
              {
                "menu_id": 12,
                "menu_name": "款式资料",
                "web_url": "chain_style_info",
                "icon": "s-order",
                "show_type": 1,
                "list": [
                {
                  "menu_id": 18,
                  "menu_name": "款式资料",
                  "web_url": "style_info",
                  "icon": "s-order",
                  "show_type": 1,
                  "list": []
                },
                {
                  "menu_id": 19,
                  "menu_name": "款式资料审核",
                  "web_url": "info_audit",
                  "icon": "s-order",
                  "show_type": 1,
                  "list": []
                }
                ]
              },
              {
                "menu_id": 5,
                "menu_name": "公告管理",
                "web_url": "chain_message_page",
                "icon": "s-order",
                "show_type": 1,
                "list": []
              },
              {
                "menu_id": 10,
                "menu_name": "反馈",
                "web_url": "chain_feekback_page",
                "icon": "s-order",
                "show_type": 1,
                "list": []
              },
              {
                "menu_id": 9,
                "menu_name": "权限",
                "web_url": "chain_permissions_page",
                "icon": "s-order",
                "show_type": 1,
                "list": [
                {
                  "menu_id": 13,
                  "menu_name": "权限配置",
                  "web_url": "user_table",
                  "icon": "s-order",
                  "show_type": 1,
                  "list": []
                },
                {
                  "menu_id": 14,
                  "menu_name": "访问权限",
                  "web_url": "role_table",
                  "icon": "s-order",
                  "show_type": 1,
                  "list": []
                },
                {
                  "menu_id": 15,
                  "menu_name": "权限录入",
                  "web_url": "entry_table",
                  "icon": "s-order",
                  "show_type": 1,
                  "list": []
                }
                ]
              },
              {
                "menu_id": 25,
                "menu_name": "操作日志",
                "web_url": "setting_record_page",
                "icon": "",
                "show_type": 1,
                "list": []
              }
              ]
}
]

// let menu_list = data.menu_list;

this.$store.commit("setMenuList", menu_list);
sessionStorage.setItem("menu_list",JSON.stringify(menu_list))
if(window.location.hash.split('#/')[1] == ''){
  this.$router.replace('/tab_menu')
}
}else{
  this.$message.warning(res.data.msg);
}
})
},
},
};
</script>
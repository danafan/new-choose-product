<template>
	<div class="login_container">
		<img class="login_page_back" src="../static/login_page_back.png">
		<div class="login_content">
			<div class="content_left">
				<img class="login_big_back" src="../static/login_big_back.png">
				<img class="login_small_back" src="../static/login_small_back.png">
			</div>
			<div class="content_right">
				<div class="content">
          <div class="text">用户名密码登录</div>
          <div class="gys_box">
            <input class="login_input" ref="userName" autofocus v-model="user_name" placeholder="请输入用户名称" maxlength="20" @keyup.enter="login">
            <input class="login_input" type="password" v-model="password" placeholder="请输入登录密码" maxlength="20" @keyup.enter="login">
            <div class="login" @click="login">登录</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .login_container{
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
   .login_page_back{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .login_content{
    width: 1510rem;
    height: 780rem;
    background: #FFFFFF;
    border-radius: 8rem;
    z-index: 9;
    display: flex;
    .content_left{
     position: relative;
     height: 780rem;
     flex:1;
     display: flex;
     align-items: center;
     padding-left: 48rem;
     .login_big_back{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
    }
    .login_small_back{
      width: 713rem;
      height: 632rem;
      z-index: 11;
    }
  }
  .content_right{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 780rem;
    padding-right: 70rem;
    .content{
      background: #FFFFFF;
      border-radius: 8rem;
      border: 1px solid #EBEBEB;
      width: 478rem;
      height: 532rem;
      padding-top:30rem;
      .gys_box{
        display: flex;
        flex-direction: column;
        align-items: center;
        .login_input{
          box-sizing: border-box;
          margin-top: 32rem;
          outline: none;
          border:none;
          width: 380rem;
          height: 52rem;
          background: #FFF8EE;
          border-radius: 6rem;
          padding: 0 22rem;
          font-size: 16rem;
        }
        .login{
          margin-top: 60px;
          width: 380rem;
          text-align: center;
          height: 42rem;
          line-height: 42rem;
          background: #F37605;
          border-radius: 4rem;
          font-size: 14px;
          color: #ffffff;
          cursor: pointer;
        }
      }
      .tab_row{
        margin-bottom: 36rem;
        display: flex;
        align-items: center;
        justify-content:space-around;
        .tab_item{
          cursor: pointer;
          height: 40rem;
          display: flex;
          align-items: center;
          justify-content:center;
          position: relative;
          .tab_text{
            font-size: 18px;
            font-weight: bold;
            color: #666666;
          }
          .active_tab_text{
            color: #333333;
          }
          .active_line{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4rem;
            background: var(--color);
          }
        }
      }
      .text{
       color: var(--color);
       font-size: 24rem;
       font-weight: 500;
       width: 100%;
       text-align: center;
     }
   }
 }
}
}
</style>
<script>
	import resource from '../api/resource.js'
	export default{
		data() {
			return {
        user_name:"",         //用户名
        password:"",          //密码
      };
    },
    methods: {
     //点击登录
     login(){
      if(this.user_name == ''){
        this.$message.warning('请输入用户名');
        return;
      }else if(this.password == ''){
        this.$message.warning('请输入密码');
        return;
      }
      let arg = {
        username:this.user_name,
        password:this.password
      }
      resource.merchantLogin(arg).then(res => {
        if (res.data.code == "1") {
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
            secret_key:data.secret_key,
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
      })
    },
    //获取导航
    getMenuNotice(){
      resource.getMenuNotice().then(res => {
        if(res.data.code == 1){
          let data = res.data.data;
          let menu_list = data.menu_list;
          this.$store.commit("setMenuList", menu_list);
          sessionStorage.setItem("menu_list",JSON.stringify(menu_list))
          this.$router.replace('/tab_menu')
        }else{
          this.$message.warning(res.data.msg);
        }
      })
    },

  },
}
</script>

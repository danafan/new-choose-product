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
          <div class="text">钉钉扫码一键登录</div>
          <div id="container"></div>
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
    created(){
      this.getAppKey();
    },
    methods: {
      getAppKey() {
        resource.getAppKey().then((res) => {
         if (res.data.code == "1") {
          let appKey = res.data.data.appkey;
          this.ddLoginInit(appKey);
        } else {
          this.$message.warning(res.data.msg);
        }
      });
      },
      ddLoginInit(appKey) {
        let url = `${location.origin}/api/scancodes/ewmlogin`;
        const goto = encodeURIComponent(
         `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appKey}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${url}`
         );
        window.DDLogin({
         id: "container",
         goto: goto,
         style: "border:none;background-color:#FFFFFF;margin:0 auto;",
            width: "100%", //官方参数 365
            height: "300", //官方参数 400
          });
        let handleMessage = (event) => {
         let origin = event.origin;
         if (origin == "https://login.dingtalk.com") {
          const loginTmpCode = event.data;
          window.location.href = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appKey}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${url}&loginTmpCode=${loginTmpCode}`;
        }
      };
      if (typeof window.addEventListener != "undefined") {
       window.addEventListener("message", handleMessage, false);
     } else if (typeof window.attachEvent != "undefined") {
       window.attachEvent("onmessage", handleMessage);
     }
   }

 }


 
}
</script>

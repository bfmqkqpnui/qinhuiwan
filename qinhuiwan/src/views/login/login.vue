<style lang="scss" src="./css/_login.scss" scoped></style>
<template>
<div class="register" @click="test">
    <!-- header start -->
    <header class="bar bar-header bar-light">
      <div class="bar-left">
        <a href="javascript:" class="button">
          <div class="iconfont icon-modal-close"></div>
        </a>
      </div>
      <div class="title">
        <img src="./i/bl3.png" alt=""> 登录
      </div>
      <label class="registerText" @click="register">注册</label>
    </header>
    <div class="tabBar">
      <bl-navbar class="flex" v-model="tabsModel">
        <bl-tab-item class="flex-item flex-c-m " :id="index" v-for="(item, index) in tab" @click.native="tabItem = item">
          {{ item.text }}
        </bl-tab-item>
      </bl-navbar>
    </div>
    <!-- header end -->
    <login-safe style="position: fixed;top:0;left:0;width:100%;height:100%;" v-if="showSafe" :promobile="phone" @hideSafe="toHide"></login-safe>
    <!-- content start -->
    <bl-tab-container :swipeable="false" v-model="tabsModel">
      <bl-tab-container-item :id="0">
        <!--账号密码登录-->
        <div class="joint-wrap content">
          <ul>
            <li>
              <div class="joint-input j-input">
                <input v-model="phone" type="tel" maxlength="11" placeholder="请输入账号" class="j-login">
                <div class="form-close"></div>
              </div>
            </li>
            <li>
              <div class="joint-input j-input">
                <input v-model="pass" type="password" placeholder="请输入密码" class="j-code">
                <div class="form-close"></div>
              </div>
            </li>
            <!-- 判断是否是微信端。微信端不显示图形验证码 -->
            <li v-show='!openId'>
              <div class="joint-input j-input" style="position:relative">
                <input v-model="imgCode" type="text" maxlength="11" placeholder="请输入验证码" class="j-login">
                <img class="valcode" @click="refresh" :src="url">
                <div class="form-close"></div>
              </div>
            </li>
          </ul>
        </div>
        <div class="bottom"><input class="circle-select" v-model="checked" id="checkbox" type="checkbox" ><label class="tips" for="checkbox">两周内免登录</label> <label @click="forget">忘记密码?</label></div>
      </bl-tab-container-item>
      <bl-tab-container-item :id="1">
        <!--短信验证码登录-->
        <div class="joint-wrap content">
          <ul>
            <li>
              <div class="joint-input j-input">
                <input type="tel" v-model="mobile" maxlength="11" placeholder="请输入手机号码" class="j-login">
              </div>
            </li>
            <li>
              <div class="joint-input j-input">
                <input type="text" v-model="code" placeholder="请输入短信验证码" class="j-code">
                <button class="getSMSCode" @click="getSMSCode" :disabled="codeDisabled">{{smsCodeText}}</button>
              </div>
            </li>
            <!-- 判断是否是微信端。微信端不显示图形验证码 -->
            <li v-show='!openId'>
              <div class="joint-input j-input" style="position:relative">
                <input v-model="imgCode2" type="text" maxlength="11" placeholder="请输入验证码" class="j-login">
                <img class="valcode" @click="refresh2" :src="url2">
                <div class="form-close"></div>
              </div>
            </li>
          </ul>
        </div>
        <div class="bottom"><input class="circle-select" v-model="checkedSMS" id="checkbox2" type="checkbox" ><label class="tips" for="checkbox2">两周内免登录</label> <label></label></div>
      </bl-tab-container-item>
    </bl-tab-container>
    <!-- content end -->
    <div class="submitBind">
      <input type="button" class="joint-submit" @click="login" value="登 录">
    </div>
    <!-- <div class="unionLogin">
      <div class="line flex-m"></div>
      <div class="text">联合登录</div>
      <img @click="unionlogin" src="./i/unionLogin.png">
    </div> -->
</div>
</template>
<script>
  import api from './api/index'
  import utils from '../../utils'
  export default {
    name: 'login',
    data() {
      return {
        showSafe: false,
        url: "",
        url2: "",
        imgCode2: "",
        imgCode: "",
        phone: "", // 账号
        pass: "",  // 密码
        code: "", // 验证码
        mobile: "", // 手机号
        codeDisabled: false,  // 能否点击发送验证码
        checked: false, // 默认是否2周免登录
        checkedSMS: false, // 短信登录是否2周内免登录
        tabsModel: 0, // tab 默认第一个
        tab: [{text: '账号密码登录', type: "account"}, {text: '手机动态密码登录', type: "phone"}],
        tabItem: {},
        smsCodeText: "获取短信验证码",
        isWxOpen: navigator.userAgent.toLowerCase().indexOf('micromessenger'), // 判断是否在微信端
        openId: localStorage.getItem('open_Id'),
        buid: this.$route.query.buid || utils.getCookie("buid"),
        store_id: this.$route.query.store_id || utils.getCookie("store_id")
      }
    },
    components: {
    },
    watch: {
    },
    created() {
    },
    mounted() {
    },
    methods: {
      // 登录
      login() {
        console.log("登录")
      },
      // 获取短信验证码
      getSMSCode() {
        if (this.mobile && /^1\d{10}$/.test(this.mobile)) {
          this.inlineLoading = this.$toast({
            iconClass: 'preloader white',
            message: '请求中',
            duration: 'loading'
          })
          api.sendSMSCode({
            mobile: this.mobile
          }).then(data => {
            this.inlineLoading.close();
            let that = this;
            if (data.body.resCode == "00100000") {
//              let json = JSON.parse(data.body.obj);
              let times = 60;
              this.timeId = setInterval(function() {
                if (times > 0) {
                  that.codeDisabled = true;
                  that.smsCodeText = "重新获取(" + (times--) + "s)";
                } else {
                  that.codeDisabled = false;
                  that.smsCodeText = "获取短信验证码";
                  clearInterval(that.timeId)
                }
              }, 1000);
            } else {
              this.alertTip("短信验证码获取失败!")
            }
          });
        } else {
          this.valPhone(this.mobile);
        }
      },
      // 去注册
      register() {
        this.$router.push({path: '/register'})
      },
      // 忘记密码
      forget() {
        this.$router.push({path: '/findpass/1'})
      },
    }
  }
</script>

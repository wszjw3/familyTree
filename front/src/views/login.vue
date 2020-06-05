<template>
<section>

  <div class="login-container clearfix">
    <div class="container-top">
      <div class="container-top-left">
        <!-- <img class="container-top-img" src="@/assets/imgs/ancestry.png" > -->
        <router-link class="ontainer-top-img" :to="{path: '/'}">
        <img src="@/assets/imgs/family-logo.png" class="logo">
      </router-link>
      </div>
    </div>
    <div class="container-box" style="margin-bottom: 90px;">
      <div class="login-left"><img src="@/assets/imgs/name.png" alt=""></div>
      <div class="loginForm-container">
        <div class="loginForm-top">登录</div>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-width="100px" label-position="top" >
          <!-- <div class="title-container">
                    <h3 class="title">管理平台</h3>
                  </div> -->
          <div class="loginformlable loginformlablemargin">手机号</div>
          <el-form-item prop="phone">
            <el-input v-model="loginForm.phone" placeholder="请输入用户名" name="phone" type="text" auto-complete="on" />
          </el-form-item>
          <div class="loginformlable ">
            <div style="margin-bottom: 8px;">登录密码</div>
            <router-link class="forgetPwd" :to="{ path: '/resetPassWord' }">忘记密码？</router-link>
          </div>
          <el-form-item prop="password">
            <el-input :type="passwordType" v-model="loginForm.password" placeholder="请输入密码" name="password" auto-complete="on" @keyup.enter.native="handleLogin"  show-password/>
          </el-form-item>
          <div class="errorMsgBox">
            {{resultMessage}}
          </div>
          <el-button :loading="loading" type="primary"  @click.native.prevent="handleLogin" style="font-size:20px;">登&nbsp;&nbsp;录</el-button>
          <el-form-item>
            <el-checkbox v-model="loginForm.checked" style="color:#57D092;">记住用户名</el-checkbox>
            <router-link class="forgetPwd" :to="{ path: '/register' }"><span style="color:#000;">没有账号？</span><span style="color:#57D092;">立即注册</span></router-link>
          </el-form-item>
          
        </el-form>
      </div>
    </div>
    
    
    
    
  </div>
</section>
</template>

<script>
import {
  Family
} from '@/api'
import md5 from 'md5'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        phone: '',
        password: '',
        graphLoginCode: '',
        graphId: '',
        graphUrl: '',
        checked: false
      },
      loginRules: {
        phone: [{
          required: true,
          trigger: 'blur',
          validator: validateUsername
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePassword
        }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      resultMessage: ''
    }
  },
  methods: {
    toindex() {
      this.$router.push({
        path: '/'
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // this.loading = true
          // this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
          // this.loading = false
          // this.$router.push('/')
          // }).catch(() => {
          // this.loading = false
          // })
          const params = {
            phone: this.loginForm.phone,
            // passwd: this.loginForm.password,
            passwd: md5(this.loginForm.password)
          }

          Family.login(params).then((res) => {
            console.log(res)
            if (res.code === '000000') {
              this.resultMessage = ''
              this.$store.dispatch('setToken', res.data)
              this.$router.push('/')
            } else {
              this.resultMessage = res.message
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
a {
    text-decoration: none;
    color: #1a90ff;
}
.forgetPwd {
    float: right;
    color:#57D092;

}
.login-container {
    width: 100%;
    height: 100%;
    background:rgba(239,243,245,1);
    border-top: 1px solid #dddddd;
    border-bottom: 1px solid #dddddd;
    // background-image: url("@/assets/imgs/family.png");
    background-size: cover;
    background-repeat: no-repeat;
    .container-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 1200px;
      margin: auto;
      margin-top: 14px;
      .container-top-img {
        width: 120px;
        height: 58px;
      }
      .container-top-right {
        font-size: 16px;
      }
    }

    .container-box {
      width: 1000px;
      height: 468px;
      margin: auto;
      margin-top: 78px;
      display: flex;
    }
    .login-left {
      
      height: 100%;
      width: 630px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .loginForm-container {
        width: 310px;
        position: relative;
        background-color: white;
        padding: 10px 30px;
        .loginForm-top {
          text-align: left;
          font-size: 34px;
          color:rgba(52,73,94,1);
          font-weight:500;
          color:rgba(52,73,94,1);
        }
        .errorMsgBox {
            color: rgb(245, 108, 108);
            line-height: 1rem;
            height: 1rem;
        }
        .login-form {
            width: 85%;
            overflow: hidden;
            margin: 1rem auto 0;
            .loginformlable {
              display: flex;
              justify-content: space-between;
            }
            .loginformlablemargin {
              margin-bottom: 8px;
            }
            .el-button {
                margin-bottom: 15px;
                width: 100%;
                height: 50px;
                background-color: #57D092;
                font-size: 16px;
            }
            .el-form-item {
                
                .el-form-item__content {
                    .el-input {
                        .el-input__inner {
                            height: 51px;
                            line-height: 51px;
                        }
                    }
                }
            }
            
        }
    }
}

.clearfix:after,
.clearfix:before {
    content: " ";
    display: table;
}
.clearfix:after {
    clear: both;
}
</style>

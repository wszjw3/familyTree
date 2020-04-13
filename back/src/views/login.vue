<template>
<section>

  <div class="login-container clearfix">
    <div class="login-left"><img src="@/assets/imgs/family.png" alt=""></div>
    <div class="loginForm-container">
      <div class="loginForm-top">登录</div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-width="100px" label-position="left">
        <!-- <div class="title-container">
                  <h3 class="title">管理平台</h3>
                </div> -->
        <el-form-item prop="login_name" label="用户名:">
          <el-input v-model="loginForm.login_name" placeholder="请输入用户名" name="login_name" type="text" auto-complete="on" />
        </el-form-item>

        <el-form-item prop="login_passwd" label="密码:">
          <el-input :type="passwordType" v-model="loginForm.login_passwd" placeholder="请输入密码" name="login_passwd" auto-complete="on" @keyup.enter.native="handleLogin" />
        </el-form-item>
        <div class="errorMsgBox">
          {{resultMessage}}
        </div>
        <el-form-item>
          <el-checkbox v-model="loginForm.checked">记住用户名</el-checkbox>
        </el-form-item>
        <el-button :loading="loading" type="primary"  @click.native.prevent="handleLogin" style="font-size:20px;">登&nbsp;&nbsp;录</el-button>
      </el-form>
    </div>
  </div>
</section>
</template>

<script>
import {
  Manage
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
        login_name: '',
        login_passwd: '',
        checked: false
      },
      loginRules: {
        login_name: [{
          required: true,
          trigger: 'blur',
          validator: validateUsername
        }],
        login_passwd: [{
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
            login_name: this.loginForm.login_name,
            login_passwd: md5(this.loginForm.login_passwd)
          }
          Manage.manageLogin(params).then((res) => {
            console.log('---', res)
            if (res.code === '000000') {
              this.resultMessage = ''
              this.$store.dispatch('setBackToken', res.data)
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

}
.login-container {
    width: 100%;
    height: 100%;
    border-top: 1px solid #dddddd;
    border-bottom: 1px solid #dddddd;
    // background-image: url("@/assets/imgs/family.png");
    background-size: cover;
    background-repeat: no-repeat;
    .login-left {
      float:left;
      height: 100%;
      width: 60%;
      img {
        width: 100%;
      }
    }
    .loginForm-container {
        width: 30%;
        margin-right: 8%;
        float: right;
        position: relative;
        margin-top: 50px;
        margin-bottom: 80px;
        background-color: white;
        padding-top: 1rem;
        padding-bottom: 1rem;
        .loginForm-top {
          text-align: center;
          font-size: 28px;
          color: #1890FF;
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
            .el-button {
                margin-bottom: 25px;
                width: 100%;
                height: 51px;
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

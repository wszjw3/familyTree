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
    <div class="loginForm-container">
      <div class="loginForm-top">重置密码</div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="top" hide-required-asterisk>
        <!-- <div class="title-container">
                  <h3 class="title">管理平台</h3>
                </div> -->
        <div class="loginformlable">手机号</div>
        <el-form-item prop="phone" >
          <el-input autocomplete="new-password" type="tel" v-model="loginForm.phone" placeholder="请输入您的手机号" name="phone" auto-complete="on" />
        </el-form-item>
        <div class="loginformlable">验证码</div>
        <el-form-item prop="verification" >
          <el-input autocomplete="new-password" type="text" v-model="loginForm.verification" placeholder="请输入验证码" name="verification" auto-complete="on">
            <el-button size="mini" @click="sendCode()" slot="append" :disabled="loginForm.disabled">{{loginForm.disabled?`${loginForm.time}s重新发送`:'发送验证码'}}</el-button>
          </el-input>
        </el-form-item>

        

        <div class="loginformlable">新密码</div>
        <el-form-item prop="password">
          <el-input autocomplete="new-password" :type="passwordType" v-model="loginForm.password" placeholder="
  请设置不少于6位的新密码" name="password" auto-complete="on" />
        </el-form-item>
        <div class="loginformlable">确认密码</div>
        <el-form-item prop="checkPass" >
          <el-input autocomplete="new-password" :type="passwordType" v-model="loginForm.checkPass" placeholder="
  请再次输入新密码" name="password" auto-complete="on" />
        </el-form-item>
       
        <div class="errorMsgBox">
          {{resultMessage}}
        </div>

        <el-button class="submit-buttom" :loading="loading" type="primary"  @click.native.prevent="handleLogin" style="font-size:20px;">完&nbsp;&nbsp;成</el-button>
        <el-form-item style="text-align:center;">
            <router-link class="forgetPwd" :to="{ path: '/login' }">返回登录</router-link>
          </el-form-item>
      </el-form>
    </div>
  </div>
</section>
</template>

<script>
import { Family } from '@/api'
import md5 from 'md5'

export default {
  name: 'resetPasswd',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }

    var validateCheckNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.loginForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        password: '',
        checkPass: '',
        phone: '',
        checked: false,
        verification: '',
        time: 0,
        disabled: false,
        isSendCode: false,
        sendCodeFlag: false,
      },
      loginRules: {
        checkPass: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePassword,
          },
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validateCheckNewPass,
          },
        ],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        verification: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
        checked: [
          { required: true, message: '请阅读并同意', trigger: 'change' },
        ],
      },
      intervalid: null,
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      resultMessage: '',
    }
  },
  mounted() {
    this.$np.done()
  },
  created() {},
  methods: {
    toindex() {
      this.$router.push({
        path: '/',
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    //发送验证码
    sendCode() {
      // var a=this.$refs.form2.validateField("validateGraphForm2")
      // console.log(a)
      if (this.loginForm.sendCodeFlag) {
        return
      }
      var params = {
        phone: this.loginForm.phone,
      }
      Family.sendVerifyCode(params).then((content) => {
        console.log(content)
        if (content.code && content.code == '000000') {
          this.loginForm.disabled = true
          this.loginForm.time = 60
          this.loginForm.isSendCode = true
          this.loginForm.sendCodeFlag = true
          this.intervalid = setInterval(() => {
            if (this.loginForm.time > 0) {
              this.loginForm.time--
            } else {
              this.loginForm.disabled = false
              this.loginForm.sendCodeFlag = false
              clearInterval(this.intervalid)
            }
          }, 1000)

          this.$message({
            type: 'success',
            message: '验证码发送成功',
          })
        } else {
          this.$message.error(
            '' == content.message ? '验证码发送失败' : content.message
          )
          this.loginForm.disabled = false
          this.loginForm.time = 0
        }
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
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
            newpasswd: md5(this.loginForm.password),
            verification: this.loginForm.verification,
          }

          Family.resetPasswd(params).then((res) => {
            console.log(res)
            if (res.code === '000000') {
              this.$message({
                type: 'success',
                message: '密码修改成功',
              })
              this.$router.push('/login')
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
a {
  text-decoration: none;
  color: #1a90ff;
}
.forgetPwd {
  text-align: center;
  margin: auto;
  color: #57d092;
}
.login-container {
  width: 100%;
  height: 100%;
  background: rgba(239, 243, 245, 1);
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
  .login-left {
    float: left;
    height: 100%;
    width: 60%;
    img {
      width: 100%;
    }
  }
  .loginForm-container {
    width: 30%;
    margin: auto;
    position: relative;
    background-color: white;
    padding: 10px 30px;
    .loginForm-top {
      text-align: left;
      font-size: 34px;
      color: rgba(52, 73, 94, 1);
      font-weight: 500;
      color: rgba(52, 73, 94, 1);
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
        margin-bottom: 8px;
      }
      .submit-buttom {
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
  content: ' ';
  display: table;
}
.clearfix:after {
  clear: both;
}
</style>

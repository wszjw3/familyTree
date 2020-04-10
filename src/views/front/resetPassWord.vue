<template>
<section>
 
  <div class="login-container clearfix">
    <div class="login-left"><img src="@/assets/imgs/family.png" alt=""></div>
    <div class="loginForm-container">
      <div class="loginForm-top">重新设置密码</div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"  hide-required-asterisk="true">
        <!-- <div class="title-container">
                  <h3 class="title">管理平台</h3>
                </div> -->
        <el-form-item prop="phone" >
          <el-input :type="tel" v-model="loginForm.phone" placeholder="请输入您的手机号" name="phone" auto-complete="on" />
        </el-form-item>
        <el-form-item prop="verification" >
          <el-input :type="text" v-model="loginForm.verification" placeholder="请输入验证码" name="verification" auto-complete="on">
            <el-button size="mini" @click="sendCode()" slot="append" :disabled="loginForm.disabled">{{loginForm.disabled?`${loginForm.time}s重新发送`:'发送验证码'}}</el-button>
          </el-input>
        </el-form-item>

        


        <el-form-item prop="password">
          <el-input :type="passwordType" v-model="loginForm.password" placeholder="
  请设置不少于6位的新密码" name="password" auto-complete="on" />
        </el-form-item>

        <el-form-item prop="checkPass" >
          <el-input :type="passwordType" v-model="loginForm.checkPass" placeholder="
  请再次输入新密码" name="password" auto-complete="on" />
        </el-form-item>

        
        <el-form-item prop="checkpro">
          <el-checkbox v-model="loginForm.checked">我已阅读并同意 家谱服务协议 </el-checkbox>
        </el-form-item>
        

       
        <div class="errorMsgBox">
          {{resultMessage}}
        </div>

        <el-button class="submit-buttom" :loading="loading" type="primary"  @click.native.prevent="handleLogin" style="font-size:20px;background-color:#FF0000;">完&nbsp;&nbsp;成</el-button>
        
      </el-form>
    </div>
  </div>
</section>
</template>

<script>
import {
  Family
} from '@/api'
var md5 = require('md5')

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
        sendCodeFlag: false
      },
      loginRules: {
        checkPass: [{
          required: true,
          trigger: 'blur',
          validator: validatePassword
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validateCheckNewPass
        }],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        verification: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        checkpro:[
          { required: true, message: '请阅读并同意', trigger: 'change' }
        ]
      },
      intervalid:null,
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      resultMessage: ''
    }
  },
  mounted() {
    this.$np.done()
  },
  created() {
  },
  methods: {
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
      if (this.registerForm.sendCodeFlag) {
        return
      }
      var params = {
        phone: this.registerForm.phone
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
            message: '验证码发送成功'
          })
        } else {
          this.$message.error('' == content.message ? '验证码发送失败' : content.message)
          this.loginForm.disabled = false
          this.loginForm.time = 0
        }
      })
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
            newpasswd: this.loginForm.password,
            verification: this.loginForm.verification
          }

          Family.resetPasswd(params).then((res) => {
            console.log(res)
            if (res.code === '000000') {
              this.$message({
                type: 'success',
                message: '密码修改成功'
              })
            } else {
              this.$message.error(res.message);
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
          color: #6B6B6B;
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
            .submit-buttom {
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

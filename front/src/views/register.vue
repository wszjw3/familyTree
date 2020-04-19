<template>
<section>
 
  <div class="login-container clearfix">
    <div class="container-top">
      <div class="container-top-left">
        <img class="container-top-img" src="@/assets/imgs/ancestry.png" >
      </div>
      <div  class="container-top-right" @click="toindex()">返回首页</div>
    </div>
    <div class="registerForm-container">
      <div class="registerForm-top">注册</div>
      <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="login-form" auto-complete="on" label-width="100px" label-position="top" >
        <!-- <div class="title-container">
                  <h3 class="title">管理平台</h3>
                </div> -->
        <div class="loginformlable">用户名</div>
        <el-form-item prop="nickname">
          <el-input v-model="registerForm.nickname" placeholder="用户名为4-16为数字，字母，拼音组合" name="nickname" type="text"  />
        </el-form-item>
        <div class="loginformlable">真实姓名</div>
        <el-form-item>
          <el-col :span="11">
            <el-form-item prop="surname">
              <el-input v-model="registerForm.surname" placeholder="姓" name="surname" type="text" auto-complete="on" />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">&nbsp;&nbsp; </el-col>
          
          <el-col :span="11">
            <el-form-item prop="name">
              <el-input v-model="registerForm.name" placeholder="名" name="name" type="text" auto-complete="on" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <div class="loginformlable">性别</div>
         <el-form-item prop="sex">
          <el-radio-group v-model="registerForm.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <div class="loginformlable">密码</div>
        <el-form-item prop="password">
          <el-input :type="passwordType" v-model="registerForm.password" placeholder="请输入密码" name="password" auto-complete="on" />
        </el-form-item>

        <div class="loginformlable">确认密码</div>
        <el-form-item prop="confirm_password">
          <el-input :type="passwordType" v-model="registerForm.confirm_password" placeholder="请输入密码" name="password" auto-complete="on" />
        </el-form-item>

        <div class="loginformlable">手机号</div>
        <el-form-item prop="phone">
          <el-input  v-model="registerForm.phone" placeholder="请输入手机号" name="phone" auto-complete="on" />
        </el-form-item>

        <div class="loginformlable">验证码</div>
        <el-form-item prop="verification">
          <el-input v-model="registerForm.verification" auto-complete="on">
            <el-button size="mini" @click="sendCode()" slot="append" :disabled="registerForm.disabled">{{registerForm.disabled?`${registerForm.time}s重新发送`:'发送验证码'}}</el-button>
          </el-input>
        </el-form-item>

       
        <div class="errorMsgBox">
          {{resultMessage}}
        </div>

        <el-button class="submit-register" :loading="loading" type="primary"  @click.native.prevent="handleRegister" style="font-size:20px;">注&nbsp;&nbsp;册</el-button>
        
      </el-form>
    </div>
  </div>
</section>
</template>

<script>
import {
  Family
} from '@/api'
import { MessageBox } from 'element-ui'
import md5 from 'md5'
export default {
  name: 'Login',
  data() {
    // const validateUserNo = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入用户名'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validateUsername = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入用户名'))
    //   } else {
    //     callback()
    //   }
    // }
    
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (rule.field === 'confirm_password' && this.registerForm.password !== this.registerForm.confirm_password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        nickname: '',
        surname: '', //姓 
        name: '', //名
        sex: '',
        password: '',
        confirm_password: '',
        phone: '',
        verification: '',
        time: 0,
        disabled: false,
        isSendCode: false,
        sendCodeFlag: false
      },
      registerRules: {
        nickname: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个数字，字母，拼音组合', trigger: 'blur' }
        ],
        surname: [
          { required: true, message: '请输入姓', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePassword
        }],
        confirm_password: [{
          required: true,
          trigger: 'blur',
          validator: validatePassword
        }],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        verification: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
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
    toindex() {
      this.$router.push({
        path: '/'
      })
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
          this.registerForm.disabled = true
          this.registerForm.time = 60
          this.registerForm.isSendCode = true
          this.registerForm.sendCodeFlag = true
          this.intervalid = setInterval(() => {
            if (this.registerForm.time > 0) {
              this.registerForm.time--
            } else {
              this.registerForm.disabled = false
              this.registerForm.sendCodeFlag = false
              clearInterval(this.intervalid)
            }
          }, 1000)
          
          this.$message({
            type: 'success',
            message: '验证码发送成功'
          })
        } else {
          this.$message.error('' == content.message ? '验证码发送失败' : content.message)
          this.registerForm.disabled = false
          this.registerForm.time = 0
        }
      })
    },
    
    
    handleRegister() {

      this.$refs.registerForm.validate(valid => {

        if (valid) {
          const params = {
            nickname: this.registerForm.nickname,
            surname: this.registerForm.surname,
            name: this.registerForm.name,
            sex: this.registerForm.sex,
            passwd: md5(this.registerForm.password),
            phone: this.registerForm.phone,
            verification: this.registerForm.verification
          }

          Family.register(params).then((res) => {
            console.log(res)
            if (res.code === '000000') {
              this.$alert('注册成功')
              setTimeout(() => {
                this.$router.push('/login')
              }, 500)
            } else {
              MessageBox.alert( res.message, '', {
                confirmButtonText: '确定',
              })
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
    .login-left {
      float:left;
      height: 100%;
      width: 60%;
      img {
        width: 100%;
      }
    }
    .registerForm-container {
        width: 30%;
        margin: auto;
        position: relative;
        background-color: white;
        padding: 10px 30px;
        .registerForm-top {
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
              margin-bottom: 8px;
            }
            .submit-register {
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

<template>
<section>
 
  <div class="login-container clearfix">
    <div class="login-left"><img src="../assets/imgs/family.png" alt=""></div>
    <div class="loginForm-container">
      <div class="loginForm-top">注册</div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-width="100px" label-position="left" hide-required-asterisk="true">
        <!-- <div class="title-container">
                  <h3 class="title">管理平台</h3>
                </div> -->
        <el-form-item prop="userNo" label="用户名：">
          <el-input v-model="loginForm.userNo" placeholder="用户名为4-16为数字，字母，拼音组合" name="userNo" type="text"  />
        </el-form-item>

        <el-form-item label="真实姓名：">
          <el-col :span="11">
            <el-form-item prop="userFan">
              <el-input v-model="loginForm.userFan" placeholder="姓" name="userFan" type="text" auto-complete="on" />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">&nbsp;&nbsp; </el-col>
          
          <el-col :span="11">
            <el-form-item prop="userFull">
              <el-input v-model="loginForm.userFull" placeholder="名" name="userFull" type="text" auto-complete="on" />
            </el-form-item>
          </el-col>
        </el-form-item>

         <el-form-item prop="sex" label="性别：">
          <el-radio-group v-model="loginForm.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="password" label="密码：">
          <el-input :type="passwordType" v-model="loginForm.password" placeholder="请输入密码" name="password" auto-complete="on" />
        </el-form-item>

        <el-form-item prop="phone" label="手机号：">
          <el-input :type="tel" v-model="loginForm.phone" placeholder="请输入手机号" name="phone" auto-complete="on" />
        </el-form-item>

        <el-form-item prop="verification" label="验证码：">
          <el-input :type="text" v-model="loginForm.verification" placeholder="请输入验证码" name="verification" auto-complete="on"/>
        </el-form-item>

       
        <div class="errorMsgBox">
          {{resultMessage}}
        </div>

        <el-button :loading="loading" type="primary"  @click.native.prevent="handleLogin" style="font-size:20px;background-color:#FF0000;">注&nbsp;&nbsp;册</el-button>
        
      </el-form>
    </div>
  </div>
</section>
</template>

<script>
import {
  Account
} from '@/api'
var md5 = require('md5')

export default {
  name: 'Login',
  data() {
    const validateUserNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
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
        userNo: '',
        userFan: '', //姓 
        userFull: '', //名
        sex: '',
        password: '',
        phone: '',
        verification: ''
      },
      loginRules: {
        userNo: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个数字，字母，拼音组合', trigger: 'blur' }
        ],
        userFan: [
          { required: true, message: '请输入姓', trigger: 'blur' }
        ],
        userFull: [
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
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        verification: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]


        
      },
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
    this.getGraph()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    //获取图片验证码
    getGraph() {
      Account.getGraph().then((content) => {
        console.log(content)
        console.log(Account.showgraph(content.graphId))
        this.loginForm.graphId = content.graphId
        this.$set(this.loginForm,'graphUrl',Account.showgraph(content.graphId))
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
            userNo: this.loginForm.userNo,
            password: md5(this.loginForm.password),
            appid: process.env.VUE_APP_BASE_APPID,
            graphId: this.loginForm.graphId,
            graphLoginCode: this.loginForm.graphLoginCode
          }

          Account.login(params).then((res) => {
            console.log(res)
            if (res.result === '0') {
              this.$store.dispatch('setToken', res.token)
              this.$router.push('/')
            } else {
              this.resultMessage = res.resultMessage
              this.getGraph()
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
    // background-image: url("../assets/imgs/family.png");
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
          color: #FF0000;
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

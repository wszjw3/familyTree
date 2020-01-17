<template>
<section>
  <div class="head">
    <div class="logoContent"> <span style="font-size: 2.2rem;font-weight: 100;padding: 5px;">|</span> <span>经代机构管理平台</span></div>
  </div>
  <div class="login-container clearfix">

    <div class="loginForm-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on">
        <!-- <div class="title-container">
                  <h3 class="title">管理平台</h3>
                </div> -->
        <el-form-item prop="userNo">
          <el-input v-model="loginForm.userNo" placeholder="请输入用户名" name="userNo" type="text" auto-complete="on" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input :type="passwordType" v-model="loginForm.password" placeholder="请输入密码" name="password" auto-complete="on" @keyup.enter.native="handleLogin" />
        </el-form-item>

        <el-form-item prop="graphLoginCode">
          <el-input v-model="loginForm.graphLoginCode" placeholder="请输入图形验证码">
            <template slot="append">
              <el-tooltip class="item" effect="dark" content="点击刷新" placement="bottom">
                <img style="width:5rem;" @click="getGraph()" :src='loginForm.graphUrl' />
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>
        <div class="errorMsgBox">
          {{resultMessage}}
        </div>
        <el-button :loading="loading" type="primary"  @click.native.prevent="handleLogin" style="font-size:20px;">登&nbsp;&nbsp;录</el-button>
        <router-link class="forgetPwd" :to="{ path: '/account/forgetPwd' }">忘记密码？</router-link>
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
        password: '',
        graphLoginCode: '',
        graphId: '',
        graphUrl: ''
      },
      loginRules: {
        userNo: [{
          required: true,
          trigger: 'blur',
          validator: validateUsername
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePassword
        }],
        graphLoginCode: [{
          required: true,
          trigger: 'blur',
          message: '请输入图形验证码'
        }]
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
.head {
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    .logoContent {
        width: 80%;
        height: 45px;
        margin: 1rem auto 1rem 8rem;
        background-image: url("../assets/imgs/guohuaLogo.png");
        background-size: 178px 45px;
        background-repeat: no-repeat;
        padding-left: 178px;
        font-size: 1.3rem;
        font-weight: 600;
        span {
            height: 45px;
            line-height: 45px;
        }
    }
}
.login-container {
    width: 100%;
    height: 100%;
    border-top: 1px solid #dddddd;
    border-bottom: 1px solid #dddddd;
    background-image: url("../assets/imgs/1.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    .loginForm-container {
        width: 485px;
        margin-right: 8%;
        float: right;
        position: relative;
        margin-top: 50px;
        margin-bottom: 80px;
        background-color: white;
        padding-top: 1rem;
        padding-bottom: 1rem;
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

<template>
<el-card class="forgetPwd">
  <!-- <div slot="header" class="clearfix">
    <h1>忘记密码</h1>
  </div> -->

  <!-- 步骤条 -->
  <el-steps :active="active" align-center finish-status="success">
    <el-step title="验证账号">1</el-step>
    <el-step title="找回方式">2</el-step>
    <el-step title="设置密码">3</el-step>
    <el-step title="完成">4</el-step>
  </el-steps>
  <!-- 验证账号表单 -->
  <el-form label-width="100px" :model="form1" :rules="form1Rules" ref="form1" class="form" v-show="active==0">
    <el-form-item label="账号" prop="loginNo">
      <el-input v-model="form1.loginNo" clearable></el-input>
    </el-form-item>
    <el-form-item label="图形验证" prop="graphLoginCode">
      <el-input v-model="form1.graphLoginCode" clearable>
        <template slot="append">
          <el-tooltip class="item" effect="dark" content="点击刷新" placement="right">
            <img style="width:5rem;" @click="getGraph('form1')" :src='form1.graphUrl' />
          </el-tooltip>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width:100%" @click="checkAccount()">下一步</el-button>
    </el-form-item>
  </el-form>
  <!-- 找回方式表单 -->
  <el-form label-width="100px" :model="form2" :rules="form2Rules" ref="form2" class="form" v-show="active==1">
    <el-form-item label="账号">
      <el-input v-model="form2.loginNo" disabled></el-input>
    </el-form-item>
    <el-form-item label="找回方式">
      <el-select v-model="form2.type" clearable placeholder="请选择">
        <el-option v-for="item in fondTypes" :key="item.type" :label="item.label" :value="item.type">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="手机号" v-if="form2.type=='mobile'">
      <el-input v-model="form2.mobile" disabled></el-input>
    </el-form-item>
    <el-form-item label="邮箱" v-if="form2.type=='email'">
      <el-input v-model="form2.email" disabled></el-input>
    </el-form-item>
    <el-form-item label="验证码" clearable prop="verifyCode">
      <el-input v-model="form2.verifyCode">
        <el-button @click="sendCode()" slot="append" :disabled="form2.disabled">{{form2.disabled?`${form2.time}s重新发送`:'发送验证码'}}</el-button>
      </el-input>
    </el-form-item>
    <el-form-item label="图形验证" v-if="form2.isGraph" prop="graphLoginCode">
      <el-input v-model="form2.graphLoginCode">
        <template slot="append">
          <el-tooltip class="item" effect="dark" content="点击刷新" placement="right">
            <img style="width:5rem;" @click="getGraph('form2')" :src='form2.graphUrl' />
          </el-tooltip>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="active=0">上一步</el-button>
      <el-button type="primary" @click="next()">下一步</el-button>
    </el-form-item>
  </el-form>
  <!-- 设置密码表单 -->
  <el-form label-width="100px" :model="form3" :rules="form3Rules" ref="form3" class="form" v-show="active==2">
    <el-form-item label="账号">
      <el-input v-model="form3.loginNo" disabled></el-input>
    </el-form-item>
    <el-form-item label="密码" clearable prop="password">
      <el-input v-model="form3.password"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" clearable prop="confirmPassword">
      <el-input v-model="form3.confirmPassword"></el-input>
    </el-form-item>
    <el-form-item label="图形验证" clearable v-if="form3.isGraph" prop="graphLoginCode">
      <el-input v-model="form3.graphLoginCode">
        <template slot="append">
          <el-tooltip class="item" effect="dark" content="点击刷新" placement="right">
            <img style="width:5rem;" @click="getGraph('form3')" :src='form3.graphUrl' />
          </el-tooltip>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="active=1">上一步</el-button>
      <el-button type="primary" @click="submit()">下一步</el-button>
    </el-form-item>
  </el-form>
  <div class="form result" v-show="active==3">
    <i class="el-icon-success success icon"></i>
    <div class="content">重置成功</div>
    <el-button type="primary" @click="goLogin">去登陆</el-button>
  </div>
</el-card>
</template>
<script>
import {
  Account
} from '@/api'
import md5 from 'md5'
export default {
  data: function() {
    //表单校验
    const validateGraphForm2 = (rule, value, callback) => {
      if ((!value) && this.form2.isGraph) {
        return callback(new Error('请输入图形验证码'))
      }
      callback()
    }
    const validateGraphForm3 = (rule, value, callback) => {
      if ((!value) && this.form3.isGraph) {
        return callback(new Error('请输入图形验证码'))
      }
      callback()
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form3.confirmPassword !== '') {
          this.$refs.form3.validateField('confirmPassword')
        }
        callback()
      }
    }
    const validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form3.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      active: 0,
      intervalid:null,
      fondTypes: [{
        type: 'mobile',
        label: '手机号找回'
      }, {
        type: 'email',
        label: '邮箱找回'
      }],
      form1: {
        loginNo: '',
        graphId: '',
        graphLoginCode: '',
        graphUrl: '',
      },
      form1Rules: {
        loginNo: [{
          required: true,
          message: '请输入账号',
          trigger: 'blur'
        }],
        graphLoginCode: [{
          required: true,
          message: '请输入图形验证码',
          trigger: 'blur'
        }]
      },
      form2: {
        graphId: '',
        graphLoginCode: '',
        graphUrl: '',
        isGraph: false,
        loginNo: '',
        type: 'mobile',
        email: '',
        mobile: '',
        resetToken: '',
        verifyCode: '',
        time: 0,
        disabled: false,
        isSendCode: false,
        sendCodeFlag: false
      },
      form2Rules: {
        graphLoginCode: [{
          validator: validateGraphForm2,
          trigger: 'blur'
        }],
        verifyCode: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }]
      },
      form3: {
        graphId: '',
        graphLoginCode: '',
        graphUrl: '',
        loginNo: '',
        confirmPassword: '',
        password: '',
        resetToken: '',
        verifyCode: '',
        isGraph: ''
      },
      form3Rules: {
        graphLoginCode: [{
          validator: validateGraphForm3,
          trigger: 'blur'
        }],
        password: [{
          validator: validatePass,
          trigger: 'blur'
        }],
        confirmPassword: [{
          validator: validateCheckPass,
          trigger: 'blur'
        }]
      }
    }
  },
  watch:{
    'form2.type':{
      handler() {
        this.form2.disabled = false
        this.form2.sendCodeFlag = false
        clearInterval(this.intervalid)
        this.form2.time=0
      },
      immediate: true,
    }
  },
  created() {
    this.getGraph('form1')
  },
  methods: {
    //获取图片验证码
    getGraph(form) {
      Account.getGraph().then((content) => {
        console.log(content)
        console.log(Account.showgraph(content.graphId))
        this[form].graphId = content.graphId
        this[form].graphUrl = Account.showgraph(content.graphId)
      })
    },
    //验证账号表单提交
    checkAccount() {
      this.$refs['form1'].validate((valid) => {
        if (valid) {
          var params = {
            loginNo: this.form1.loginNo,
            graphId: this.form1.graphId,
            graphLoginCode: this.form1.graphLoginCode
          }
          Account.checkAccount(params).then((content) => {
            console.log(content)
            if (content.result == '0') {
              this.form2.loginNo = this.form1.loginNo
              this.form2.email = content.email
              this.form2.mobile = content.mobile
              this.form2.resetToken = content.resetToken
              this.active = 1
            } else {
              this.$message.error('' == content.resultMessage ? '验证账号失败' : content.resultMessage)
              this.getGraph('form1')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //发送验证码
    sendCode() {
      // var a=this.$refs.form2.validateField("validateGraphForm2")
      // console.log(a)
      if (this.form2.sendCodeFlag) {
        return
      }
      var params = {
        type: this.form2.type,
        email: this.form2.email,
        mobile: this.form2.mobile,
        graphId: this.form2.graphId,
        graphLoginCode: this.form2.graphLoginCode,
        resetToken: this.form2.resetToken,
      }
      Account.sendVerifyCode(params).then((content) => {
        if (content.result && content.result == '0') {
          this.form2.disabled = true
          this.form2.time = 60
          this.form2.isSendCode = true
          this.form2.sendCodeFlag = true
          this.intervalid = setInterval(() => {
            if (this.form2.time > 0) {
              this.form2.time--
            } else {
              this.form2.disabled = false
              this.form2.sendCodeFlag = false
              clearInterval(this.intervalid)
            }
          }, 1000)
          console.log(content)
          this.$message({
            type: 'success',
            message: '验证码发送成功'
          })
        } else if (content.result && content.result == '5') {
          this.form2.disabled = false
          this.form2.time = 0
          this.form2.isGraph = true
          this.getGraph('form2')
        } else {
          this.$message.error('' == content.resultMessage ? '验证码发送失败' : content.resultMessage)
          this.form2.disabled = false
          this.form2.time = 0
        }
      })
    },
    next() {
      if (this.form2.isSendCode) {
        if (this.form2.verifyCode) {
          this.form3.verifyCode = this.form2.verifyCode
          this.form3.resetToken = this.form2.resetToken
          this.form3.loginNo = this.form2.loginNo
          this.active = 2
        } else {
          this.$message.error('请输入验证码')
        }
      } else {
        this.$message.error('请先发送验证码')
      }
    },
    // 设置密码提交接口
    submit() {
      this.$refs['form3'].validate((valid) => {
        if (valid) {
          var params = {
            verifyCode: this.form3.verifyCode,
            resetToken: this.form3.resetToken,
            password: md5(this.form3.password),
            confirmPassword: md5(this.form3.confirmPassword)
          }
          Account.forgetPwdSubmit(params).then((content) => {
            if (content.result && content.result == '0') {
              this.active = 3
            } else if (content.result && content.result == '5') {
              this.form3.isGraph = true
              this.getGraph('form3')
            } else {
              this.$message.error('' == content.resultMessage ? '重置密码失败' : content.resultMessage)
              this.form3.isGraph ? this.getGraph('form3') : () => {
                return
              }
            }
          })
        }
      })
    },
    goLogin() {
      this.$router.push({
        path: '/login'
      })
    }

  }
}
</script>

<style lang="less" scoped>
.forgetPwd {
    width: 86%;
    margin: 4% auto auto;
    padding-bottom: 2%;
    .el-steps {
        width: 70%;
        margin: 6% auto auto;
    }
    .form {
        width: 30%;
        margin: 4rem auto auto;
        /deep/.el-input-group__append{
          padding: 0 10px;
        }
        /deep/input{
          min-width: 3rem;
        }
    }
    .result {
        text-align: center;
        width: 72%;
        margin: 60px auto;

        .content {
            font-size: 56px;
            color: rgba(0, 0, 0, .85);
            font-weight: 500;
            margin-bottom: 16px;
        }

        .icon {
            font-size: 130px;
            margin-bottom: 24px;
        }
    }

    .success {
        color: green;
    }
}
</style>

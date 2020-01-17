<template>
  <el-card class="box-card">
<el-form :model="resetPwdRules" status-icon :rules="rules" ref="resetPwdRules" label-width="100px">
  <el-form-item label="旧密码" prop="oldPass">
    <el-input type="password" v-model="resetPwdRules.oldPass" placeholder='旧密码' clearable></el-input>
  </el-form-item>
  <el-form-item label="新密码" prop="pass">
    <el-input type="password" v-model="resetPwdRules.pass" placeholder="新密码" clearable></el-input>
  </el-form-item>
  <el-form-item label="新密码确认" prop="checkPass">
    <el-input type="password" v-model="resetPwdRules.checkPass" placeholder="新密码确认" clearable></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('resetPwdRules')">提交</el-button>
    <el-button @click="resetForm('resetPwdRules')">重置</el-button>
  </el-form-item>
</el-form>
</el-card>
</template>
<script>
import {
  Account
} from '@/api'
import md5 from 'md5'
export default {
  data() {
    //表单校验
    var validateOldPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入旧密码'))
      }
      callback()
    }
    var validateNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.resetPwdRules.checkPass !== '') {
          this.$refs.resetPwdRules.validateField('checkPass')
        }
        callback()
      }
    }
    var validateCheckNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.resetPwdRules.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userInfo:{},
      resetPwdRules: {
        pass: '',
        checkPass: '',
        oldPass: ''
      },
      rules: {
        pass: [{
          validator: validateNewPass,
          trigger: 'blur'
        }],
        checkPass: [{
          validator: validateCheckNewPass,
          trigger: 'blur'
        }],
        oldPass: [{
          validator: validateOldPass,
          trigger: 'blur'
        }]
      }
    }
  },
  created: function() {
    Account.getUserInfo().then(content => {
      console.log(content)
      this.userInfo = content.userInfo
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var params = {
            name:this.userInfo.userName,
            oldPassword: md5(this.resetPwdRules.oldPass),
            password: md5(this.resetPwdRules.pass),
            confirmPassword: md5(this.resetPwdRules.checkPass)
          }
          Account.modifyPass(params).then(content => {
            console.log(content)
            if (content && content.result == '0') {
              this.$message({
                message: ''==content.resultMessage ? '密码修改成功！' : content.resultMessage,
                type: 'success'
              })
            } else {
              this.$message.error(''==content.resultMessage  ? '密码修改失败！' : content.resultMessage)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },
}
</script>
<style scoped>
.el-form {
  width: 30%;
  min-width: 16rem;
}
</style>

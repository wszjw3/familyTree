<template>
<el-card class="accountInfoCard">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="基本资料" name="first">
      <el-form ref="firstForm" :model="firstForm" :rules="firstRules" class="login-form" label-width="100px" label-position="left">
        <el-form-item label="真实姓名：">
          <el-col :span="11">
            <el-form-item prop="userFan">
              <el-input v-model="firstForm.userFan" placeholder="姓" name="userFan" type="text" auto-complete="on" />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">&nbsp;&nbsp; </el-col>
          
          <el-col :span="11">
            <el-form-item prop="userFull">
              <el-input v-model="firstForm.userFull" placeholder="名" name="userFull" type="text" auto-complete="on" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item prop="sex" label="性别：">
          <el-radio-group v-model="firstForm.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所在地区：" prop="selected">
          <div style='display: flex;width: 600px;line-height: 21px;'>
            <area-select :level="2" v-model='firstForm.selected'></area-select>
          </div>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <textarea style="width: 500px;height: 100px;" v-model="firstForm.address"></textarea>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" size="medium">保存</el-button>
          <el-button @click="resetForm('firstForm')">重置</el-button>
        </el-form-item>
        
      </el-form>
      
    </el-tab-pane>
    <el-tab-pane label="联系方式" name="second">
      <el-form :model="secondForm" status-icon :rules="secondRules" ref="secondForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="邮箱：" prop="email">
          <el-input  v-model="secondForm.email" ></el-input>
        </el-form-item>
        <el-form-item label="微信：" prop="wechat">
          <el-input  v-model="secondForm.wechat" ></el-input>
        </el-form-item>
        <el-form-item label="QQ：" prop="qq">
          <el-input v-model="secondForm.qq"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('secondForm')">提交</el-button>
          <el-button @click="resetForm('secondForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="密码设置" name="third">
      <el-form :model="thirdForm" status-icon :rules="thirdRules" ref="thirdForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="原密码" prop="oldpass">
        <el-input v-model.number="thirdForm.oldpass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="thirdForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="thirdForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm('thirdForm')">提交</el-button>
        <el-button @click="resetForm('thirdForm')">重置</el-button>
      </el-form-item>
    </el-form>
    </el-tab-pane>
  </el-tabs>
</el-card>
</template>

<script>
import {
  Account
} from '@/api'
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.thirdForm.checkPass !== '') {
          this.$refs.thirdForm.validateField('checkPass')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.thirdForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      firstForm: {
        userFan: '',
        userFull: '',
        sex: '',
        selected: [],
        address: ''
      },
      firstRules: {
        userFan: [
          { required: true, message: '请输入姓', trigger: 'blur' },
        ],
        userFull: [
          { required: true, message: '请输入名', trigger: 'blur' }
        ],
        selected: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      secondForm: {
        email: '',
        wechat: '',
        qq: ''
      },
      secondRules:{
        email :[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
        ],
        wechat :[
          { required: true, message: '请输入微信号', trigger: 'blur' },
        ],
        qq :[
          { required: true, message: '请输入QQ', trigger: 'blur' },
        ],
      },
      thirdForm: {
        oldpass: '',
        pass: '',
        checkPass: ''
      },
      thirdRules : {
        oldpass:[
          { validator: validatePass, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      },
      activeName:'first',
      
      userInfo: {
        userName: '',
        accountName: '',
        userMobile: '',
        userEmail: '',
        remark: '',
        companyName:''
      },
      
      
      
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    onSubmit() {
      console.log('submit!')
    },
    getAccountInfo() {
      Account.getUserInfo().then((res) =>{
        this.userInfo = res.userInfo
      })
    },
    resetForm(formName) {
      console.log('11111111111!')
      this.$refs[formName].resetFields()
    }
  },
  created: function(){
    this.getAccountInfo()
  }
}
</script>
<style lang="less" scoped>
.accountInfoCard {
    width: 90%;
    margin: 5% auto 0;
    .clearfix{
      text-align:center;
    }
    .accountInfoForm{
      padding:4% 0px;
      width:45%;
      margin:0px auto;
    }
    .el-form {
      width: 30%;
      min-width: 20rem;
    }
}
</style>

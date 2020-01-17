<template>
<el-card class="accountInfoCard">
  <el-form class="accountInfoForm" ref="userInfo" :model="userInfo" label-width="80px">
    <el-form-item label="用户账号">
      <el-input v-model="userInfo.userName" disabled></el-input>
    </el-form-item>
    <!-- <el-form-item label="用户名称">
      <el-input v-model="userInfo.accountName" disabled></el-input>
    </el-form-item> -->
    <el-form-item label="所属机构">
      <el-input v-model="userInfo.companyName" disabled></el-input>
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model="userInfo.userMobile" disabled></el-input>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="userInfo.userEmail" disabled></el-input>
    </el-form-item>
    <!-- <el-form-item label="备注">
      <el-input v-model="userInfo.remark" disabled></el-input>
    </el-form-item> -->
  </el-form>
</el-card>
</template>

<script>
import {
  Account
} from '@/api'
export default {
  data() {
    return {
      userInfo: {
        userName: '',
        accountName: '',
        userMobile: '',
        userEmail: '',
        remark: '',
        companyName:''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    getAccountInfo() {
      Account.getUserInfo().then((res) =>{
        this.userInfo = res.userInfo
      })
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

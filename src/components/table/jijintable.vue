<template>
<section>
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form inline :model="searchForm">
      <el-row type="flex" class="row-bg" justify="end">
        <el-form-item label="家谱名称：">
          <el-input v-model="searchForm.name" placeholder='请输入' clearable></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="searchForm.status" filterable placeholder="请选择" clearable>
            <el-option v-for="item in searchForm.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择日期：">
          <el-date-picker v-model="searchForm.startDate" type="daterange" range-separator="-"  start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="searchFormSubmit()">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type=""  @click="searchFormSubmit()">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="searchFormSubmit()">导出数据</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button @click="resetSearchForm">重置</el-button>
        </el-form-item> -->
      </el-row>
    </el-form>
  </el-col>
  <el-table :data="subAccountList" border highlight-current-row :header-cell-style="{background:'#eef1f6',color:'#606266'}" v-loading="loading">
    <el-table-column property="subUserName" label="时间" min-width="150" align="center">
    </el-table-column>
    <!-- <el-table-column property="appCode" label="应用代码" min-width="80" align="center">
    </el-table-column> -->
    <el-table-column property="email" label="家谱树名称" min-width="150" align="center">
    </el-table-column>
    <el-table-column property="mobile" label="姓名" min-width="120" align="center">
    </el-table-column>
    <el-table-column property="roleName" label="手机号码" min-width="120" align="center">
    </el-table-column>
    <el-table-column label="类型" min-width="120" align="center">
    </el-table-column>
    <el-table-column label="支付方式" min-width="120" align="center">
    </el-table-column>
    <el-table-column label="金额（元）" min-width="120" align="center">
    </el-table-column>
    <el-table-column label="剩余修谱基金（元）" min-width="120" align="center">
    </el-table-column>
    <el-table-column label="本次抽成（元）" min-width="120" align="center">
    </el-table-column>
    <el-table-column label="平台抽成总额（元）" min-width="120" align="center">
    </el-table-column>
  </el-table>
  <el-col :span="24" class="toolbar">
    <el-pagination style="float:right" :pager-count="5" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30,40,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="records">
    </el-pagination>
  </el-col>
</section>
</template>
<script>
import {
  Account
} from '@/api'
import md5 from 'md5'
export default {
  name: 'jijin-table',
  data() {
    // 表单校验
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.resetPass.checkPass !== '') {
          this.$refs.resetPass.validateField('checkPass')
        }
        callback()
      }
    }
    const validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.resetPass.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入登陆账号'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入登陆密码'))
      } else {
        callback()
      }
    }
    const validateCheckPass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入请再次输入登陆密码'))
      } else if (value !== this.addForm.password) {
        callback(new Error('两次登陆密码不一致'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        var reg = /^1[3456789]\d{9}$/
        if (!reg.test(value)) {
          callback(new Error('请输入有效的手机号码'))
        }
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z]{2,3})$/
        if (!reg.test(value)) {
          callback(new Error('请输入有效的邮箱'))
        }
        callback()
      }
    }
    const validateRoleId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择角色名称'))
      } else {
        callback()
      }
    }
    // 表单校验结束
    return {
      reviseFormDialogVisible: false,
      resetPassDialogVisible: false, //修改密码
      addDialogVisible: false,
      loading: false,
      subRoleList: [],
      userInfo: {},
      searchForm: {
        name: '',
        status: '',
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
      },
      reviseForm: {
        appCode: '',
        email: '',
        mobile: '',
        remark: [],
        roleId: '',
        roleName: '',
        subUserId: '',
        subUserName: '',
        userId: '',
        userName: '',
      },
      reviseFormRules: {
        subUserName: [{
          required: true,
          message: '请输入登陆账号',
          trigger: 'blur'
        }],
        mobile: [{
          validator: validateMobile,
          trigger: 'blur'
        }],
        email: [{
          validator: validateEmail,
          trigger: 'blur'
        }],
        roleId: [{
          required: true,
          message: '请选择角色',
          trigger: 'change'
        }]
      },

      resetPass: {
        pass: '',
        checkPass: '',
        oldPassword: '',
        subUserId: ''
      },
      resetPassRules: {
        pass: [{
          validator: validatePass,
          trigger: 'blur'
        }],
        checkPass: [{
          validator: validateCheckPass,
          trigger: 'blur'
        }],
        oldPassword: [{
          required: true,
          message: '请输入原密码',
          trigger: 'blur'
        }]

      },
      addForm: {
        name: '',
        password: '',
        checkPass: '',
        mobile: '',
        email: '',
        roleId: '',
        remark: []
      },
      addAccountRules: {
        name: [{
          validator: validateName,
          trigger: 'blur'
        }],
        password: [{
          validator: validatePass2,
          trigger: 'blur'
        }],
        checkPass: [{
          validator: validateCheckPass2,
          trigger: 'blur'
        }],
        mobile: [{
          validator: validateMobile,
          trigger: 'blur'
        }],
        email: [{
          validator: validateEmail,
          trigger: 'blur'
        }],
        roleId: [{
          validator: validateRoleId,
          trigger: 'change'
        }]
      },
      subAccountList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      records: 0
    }
  },
  watch: {
    addDialogVisible: function() {
      //弹窗关闭清空校验
      if (!this.addDialogVisible) {
        this.$refs['addForm'].resetFields(() => {
          return
        })
      }
      this.addForm.remark = []
      this.addForm.roleId = this.subRoleList[0].roleId
    },
    reviseFormDialogVisible: function() {
      //弹窗关闭清空校验
      if (!this.reviseFormDialogVisible) {
        this.$refs['reviseForm'].resetFields(() => {
          return
        })
      }
    },
    // 修改密码功能
    resetPassDialogVisible: function() {
      if (!this.resetPassDialogVisible) {
        this.$refs['resetPass'].resetFields(() => {
          return
        })
      }
    }
  },
  created: function() {
    this.searchFormSubmit()
    var params = {
      currentPage: 1,
      pageSize: 1000
    }
    //获取角色列表
    Account.getSubRoleList(params).then(content => {
      console.log(content)
      this.subRoleList = []
      if (content && content.subRoleList && content.subRoleList.length > 0) {
        this.subRoleList = content.subRoleList ? content.subRoleList : []
      } else {
        return
      }
    })
    //获取用户信息
    Account.getUserInfo().then(content => {
      console.log(content)
      this.userInfo = content.userInfo
      this.userInfo.remark = JSON.parse(content.userInfo.remark ? content.userInfo.remark : '[]')
      console.log(this.userInfo.remark)
    })
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      var params = this.searchForm
      params.pageSize = this.pageSize
      params.currentPage = this.currentPage
      this.searchFormSubmit(params)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      var params = this.searchForm
      params.pageSize = this.pageSize
      params.currentPage = this.currentPage
      this.searchFormSubmit(params)
    },
    //查询子账户列表
    searchFormSubmit(params) {
      this.loading = true
      var data = this.searchForm
      data.pageSize = this.pageSize
      data.currentPage = 1
      data = params || data
      Account.getSubUserList(data).then(content => {
        console.log(content)
        this.subAccountList = []
        if (content && content.subUserList && content.subUserList.length > 0) {
          this.total = content.total
          this.records = content.records
          this.subAccountList = content.subUserList ? content.subUserList : []
        } else {
          this.subAccountList = []
        }
      }).then(() => {
        this.loading = false
      })
    },
    //重置查询表单//按钮已经注释
    resetSearchForm() {
      this.searchForm = {
        mobile: '',
        accountName: '',
        email: ''
      }
    },
    //修改按钮事件
    handleReset(index, row) {
      console.log(index, row)
      var params = {
        subUserId: row.subUserId
      }
      Account.querySubUserInfo(params).then((content) => {
        console.log(content)
        if (content.subUserInfo) {
          this.reviseForm = content.subUserInfo
          this.reviseForm.subUserName = this.reviseForm.subUserName.split('@')[0]
          this.reviseForm.remark = JSON.parse(content.subUserInfo.remark ? content.subUserInfo.remark : '[]')
          let remark = []
          for (let item of this.reviseForm.remark) {
            remark.push(item.agentCode)
          }
          this.reviseForm.remark = remark
          this.reviseFormDialogVisible = !this.reviseFormDialogVisible
        } else {
          this.$message.error({
            message: `子账户查询失败${content.resultMessage?','+content.resultMessage:''}`
          })
        }
      })
    },
    //删除按钮事件
    handleDelete(index, row) {
      console.log(index, row)
      this.$confirm('是否继续删除该子账户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          subUserIds: row.subUserId
        }
        Account.delSubUser(params).then((content) => {
          console.log(content)
          if (content.result && content.result == '0') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.searchFormSubmit()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    //修改子账户表单提交
    reviseSubmit() {
      this.$refs['reviseForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          var params = {
            subUserId: this.reviseForm.subUserId,
            name: `${this.reviseForm.subUserName}@${this.userInfo.userName}`,
            email: this.reviseForm.email,
            mobile: this.reviseForm.mobile,
            remark: this.fmtRemark(this.reviseForm.remark),
            roleId: this.reviseForm.roleId
          }
          Account.updateSubUser(params).then((content) => {
            console.log(content)
            if (content.result && content.result == '0') {
              this.reviseFormDialogVisible = false
              this.$message({
                type: 'success',
                message: '修改子账户成功'
              })
              this.searchFormSubmit()
            } else {
              this.$message.error({
                message: `修改子账户失败${content.resultMessage?','+content.resultMessage:''}`
              })
            }
          })
        }
      })
    },
    handleResetPwd(index, row) {
      this.resetPass.subUserId = row.subUserId
      this.resetPassDialogVisible = true
    },
    resetPassSubmit() {
      console.log(this.resetPass)
      this.$refs['resetPass'].validate((valid) => {
        if (valid) {
          var params = {
            userId: this.resetPass.subUserId,
            password: md5(this.resetPass.pass),
            oldPassword: md5(this.resetPass.oldPassword),
            confirmPassword: md5(this.resetPass.checkPass)
          }
          Account.updateSubUserPwd(params).then((content) => {
            if (content.result && content.result == '0') {
              this.$message({
                type: 'success',
                message: '密码修改成功'
              })
              this.resetPassDialogVisible = false
            } else {
              this.$message.error(`${content.resultMessage?content.resultMessage:'密码修改失败'}`)
            }
          })
        }
      })
    },
    //新增子账户表单提交
    addSubmit() {
      console.log(this.addForm)
      this.$refs['addForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          var params = {
            'name': `${this.addForm.name}@${this.userInfo.userName}`,
            'password': md5(this.addForm.password),
            'mobile': this.addForm.mobile,
            'email': this.addForm.email,
            'roleId': this.addForm.roleId,
            'remark': this.fmtRemark(this.addForm.remark)
          }
          Account.insertSubUser(params).then(content => {
            console.log(content)
            if (content.result && content.result == '0') {
              this.addDialogVisible = false
              this.$message({
                type: 'success',
                message: '新增子账户成功'
              })
              this.searchFormSubmit()
            } else {
              this.$message.error({
                message: `新增子账户失败${content.resultMessage?','+content.resultMessage:''}`
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    fmtRemark(remark) {
      let data = []
      for (let item of remark) {
        for (let item2 of this.userInfo.remark) {
          if (item === item2.agentCode) {
            data.push(item2)
          }
        }
      }
      return JSON.stringify(data).trim()
    }
  }
}
</script>
<style lang="less" scoped>
// .title {
//     padding: 0.5rem;
//     box-shadow: 0.1rem 0.1rem 0.4rem rgba(210, 210, 210, 0.97);
//     border-radius: 0.5rem;
//     color: #6e6e6e;
// }
/deep/.dialog {
    width: 30%;
    min-width: 20rem;
}
</style>

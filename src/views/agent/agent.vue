<template>
<section>
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form inline :model="searchForm">
      <el-row>
        <el-form-item>
          <el-input v-model.number="searchForm.mobile" placeholder='手机号' clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.idNo" placeholder='身份证号' clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.agentCode" filterable placeholder="请选择经代公司" clearable>
            <el-option v-for="item in agentCodeOptions" :key="item.agentCode" :label="item.name" :value="item.agentCode">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.agentCode }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getAgentList()">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-col>
  <el-table :data="agentList" highlight-current-row :header-cell-style="{background:'#eef1f6',color:'#606266'}" v-loading="loading">
    <el-table-column property="name" label="姓名" min-width="100" align="center">
    </el-table-column>
    <el-table-column property="mobile" label="手机号" min-width="120" align="center">
    </el-table-column>
    <el-table-column property="idNo" label="身份证号" min-width="150" align="center">
    </el-table-column>
    <el-table-column property="companyName" label="所属机构" min-width="150" align="center">
    </el-table-column>
    <el-table-column property="companyAgentCode" label="所属机构编号" min-width="150" align="center">
    </el-table-column>
    <el-table-column property="status" label="状态" min-width="100" align="center">
      <template slot-scope="scope">
        <el-tag :type="statusOptions[scope.row.status].type">{{statusOptions[scope.row.status].label}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" align="center" min-width="180">
      <template slot-scope="scope">
        <el-button size="mini" @click="handleReset(scope.$index, scope.row)">修改</el-button>
        <el-button size="mini" type="danger" v-if="scope.row.status!=='BANNED'" @click="handleDelete(scope.$index, scope.row)">禁用</el-button>
        <el-button size="mini" type="success" v-if="scope.row.status==='BANNED'" @click="handleReturn(scope.$index, scope.row)">启用</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-col :span="24" class="toolbar">
    <el-pagination style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :pager-count="5" :current-page="currentPage" :page-sizes="[10, 20, 30,40,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="records">
    </el-pagination>
  </el-col>
  <!-- 修改代理人信息弹窗 -->
  <el-dialog title="修改代理人信息" :visible.sync="reviseFormDialogVisible" :close-on-click-modal="false" custom-class="dialog">
    <el-form :model="reviseForm" :rules="reviseFormRules" ref="reviseForm" label-width="100px" status-icon>
      <el-form-item label='代理人姓名' prop="agentName">
        <el-input v-model="reviseForm.agentName" :placeholder="reviseForm.agentName" clearable></el-input>
      </el-form-item>
      <el-form-item label='身份证号' prop="idNo">
        <el-input v-model="reviseForm.idNo" :placeholder="reviseForm.idNoStar" clearable></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="reviseFormDialogVisible=false">取消</el-button>
      <el-button type="primary" @click.native="reviseSubmit">提交</el-button>
    </div>
  </el-dialog>
  <!-- 修改子账户信息弹窗 -->
</section>
</template>
<script>
import {
  Account,
  Esp
} from '@/api'
export default {
  data() {
    const validateidNo = (rule, value, callback) => {
      if (value != '') {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (!reg.test(value)) {
          callback(new Error('请输入有效的身份证号'))
        }
        callback()
      } else {
        callback()
      }
    }
    return {
      searchForm: {
        agentName: '',
        agentCode: '',
        idNo:'',
        mobile: '',
        status: ''
      },
      reviseForm: {
        userId: '',
        agentName: '',
        idNo: '',
        idNoStar: ''
      },
      reviseFormRules: {
        agentName: [{
          required: true,
          message: '请输入代理人姓名',
          trigger: 'blur'
        }],
        idNo: [{
          validator: validateidNo,
          trigger: 'blur'
        }],
      },
      statusOptions: {
        NORMAL: {
          label: '正常',
          type: 'success',
          value: 'NORMAL'

        },
        BANNED: {
          label: '禁用',
          type: 'danger',
          value: 'BANNED'
        },
        // BLACKLIST: {
        //   label: '黑名单',
        //   type: 'info',
        //   value: 'BLACKLIST'
        // },
      },
      agentCodeOptions: [],
      agentList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      records: 0,
      loading: true,
      reviseFormDialogVisible: false
    }
  },
  created() {
    Account.getUserInfo().then((res) => {
      this.agentCodeOptions = JSON.parse(res.userInfo.remark)
    })
    this.getAgentList()
  },
  watch: {
    reviseFormDialogVisible: function() {
      //弹窗关闭清空校验
      if (!this.reviseFormDialogVisible) {
        this.$refs['reviseForm'].resetFields(() => {
          return
        })
      }
    },
  },
  methods: {
    getAgentList(params) {
      var data = {
        agentName: this.searchForm.agentName,
        agentCode: this.searchForm.agentCode,
        idNo:this.searchForm.idNo,
        mobile: this.searchForm.mobile,
        status: this.searchForm.status,
        pageSize: this.pageSize
      }
      data.currentPage = 1
      data = params || data
      console.log(data)
      Esp.getAgentList(data).then(content => {
        this.agentList = []
        if (content && content.agentList && content.agentList.length > 0) {
          this.agentList = content.agentList
          this.records = content.records
          this.total = content.total
        }
      }).then(() => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      var params = {
        agentName: this.searchForm.agentName,
        agentCode: this.searchForm.agentCode,
        mobile: this.searchForm.mobile,
        idNo:this.searchForm.idNo,
        status: this.searchForm.status,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.getAgentList(params)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      var params = {
        agentName: this.searchForm.agentName,
        agentCode: this.searchForm.agentCode,
        mobile: this.searchForm.mobile,
        idNo:this.searchForm.idNo,
        status: this.searchForm.status,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.getAgentList(params)
    },
    handleReset(index, row) {
      var params = {
        userId: row.userId
      }
      Esp.getAgentDetail(params).then(content => {
        console.log(content)
        if (content && content.result && content.result == '0') {
          this.reviseForm.userId = content.userId
          this.reviseForm.agentName = content.name
          this.reviseForm.idNoStar = content.idNo
          this.reviseFormDialogVisible = !this.reviseFormDialogVisible
        } else {
          this.$message.error({
            message: `代理人查询失败${content.resultMessage?','+content.resultMessage:''}`
          })
        }
      })


    },
    handleDelete(index, row) {
      console.log(index, row)
      this.$confirm('是否继续停用该代理人?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          userId: row.userId,
          mobile: '',
          name: '',
          idType: '',
          idNo: '',
          status: 'BANNED',
          manageStatus: ''
        }
        Esp.modifyAgent(params).then(content => {
          if (content && content.result && content.result == '0') {
            this.reviseFormDialogVisible = false
            this.$message({
              type: 'success',
              message: '停用代理人成功'
            })
            this.getAgentList()
          } else {
            this.$message.error({
              message: `停用代理人失败${content.resultMessage?','+content.resultMessage:''}`
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消置为停用操作'
        })
      })
    },
    handleReturn(index, row) {
      console.log(index, row)
      this.$confirm('是否将该代理人置为正常?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          userId: row.userId,
          mobile: '',
          name: '',
          idType: '',
          idNo: '',
          status: 'NORMAL',
          manageStatus: ''
        }
        Esp.modifyAgent(params).then(content => {
          if (content && content.result && content.result == '0') {
            this.reviseFormDialogVisible = false
            this.$message({
              type: 'success',
              message: '代理人已置为正常'
            })
            this.getAgentList()
          } else {
            this.$message.error({
              message: `代理人置为正常失败${content.resultMessage?','+content.resultMessage:''}`
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消置为正常操作'
        })
      })
    },
    reviseSubmit() {
      this.$refs['reviseForm'].validate((valid) => {
        if (valid) {
          var params = {
            userId: this.reviseForm.userId,
            mobile: '',
            name: this.reviseForm.agentName,
            idType: '',
            idNo: this.reviseForm.idNo,
            status: '',
            manageStatus: ''
          }
          Esp.modifyAgent(params).then(content => {
            if (content && content.result && content.result == '0') {
              this.reviseFormDialogVisible = false
              this.$message({
                type: 'success',
                message: '修改代理人成功'
              })
              this.getAgentList()
            } else {
              this.$message.error({
                message: `修改代理人失败${content.resultMessage?','+content.resultMessage:''}`
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.dialog {
    width: 30%;
    min-width: 20rem;
}
</style>

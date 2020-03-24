<template>
<section>
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form inline :model="searchForm" ref="searchForm">
      <el-row type="flex" class="row-bg" justify="end">
        <el-form-item label="名称：">
          <el-input v-model="searchForm.label_name" placeholder='请输入' clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="searchFormSubmit()">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type=""  @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-row>
      <el-row type="flex" class="row-bg" justify="begin">
        <el-form-item>
          <el-button type="primary"  @click="addDialogVisible=!addDialogVisible">新增</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-col>
  <el-table :data="subList" border  :header-cell-style="{background:'#eef1f6',color:'#606266'}" v-loading="loading" :row-class-name="tableRowClassName">
    <el-table-column property="label_name" label="标签名称" min-width="150" align="center">
    </el-table-column>
    <!-- <el-table-column property="appCode" label="应用代码" min-width="80" align="center">
    </el-table-column> -->
    <el-table-column property="label_desc" label="标签说明" min-width="150" align="center">
    </el-table-column>
    <el-table-column  label="状态" min-width="120" align="center">
      <template slot-scope="scope">
        <el-switch
          v-model="scope.row.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="2"
          @change="handleResetStatus(scope.$index, scope.row)">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" align="center" min-width="200">
      <template slot-scope="scope">
        <el-button size="mini" @click="handleReset(scope.$index, scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-col :span="24" class="toolbar">
    <el-pagination style="float:right"  @current-change="handleCurrentChange"  background :current-page="currentPage" layout=" prev, pager, next" prev-text="上一页" next-text="下一页"
      :total="records">
    </el-pagination>
  </el-col>
  <!-- 修改弹窗 -->
  <el-dialog title="编辑" :visible.sync="resetDialogVisible" custom-class="dialog" center>
    <el-form :model="resetTag" :rules="resetTagRules" ref="resetTag" label-width="6rem">
      <el-form-item label="标签名称:" prop="label_name">
        <el-input type="text" v-model="resetTag.label_name" placeholder="标签名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="标签描述:" prop="label_desc">
        <el-input type="text" v-model="resetTag.label_desc" placeholder="标签描述" clearable></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="resetDialogVisible = false">取消</el-button>
      <el-button type="primary" @click.native="resetSubmit">提交</el-button>
    </div>
  </el-dialog>
  <!-- 修改弹窗 -->
  <!-- 新增弹窗 -->
  <el-dialog title="新增" :visible.sync="addDialogVisible" custom-class="dialog" center>
    <el-form :model="addForm" :rules="addTagRules" ref="addForm" label-width="6rem">
      <el-form-item label="标签名称:" prop="label_name">
        <el-input type="text" v-model="addForm.label_name" placeholder="标签名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="标签描述:" prop="label_desc">
        <el-input type="text" v-model="addForm.label_desc" placeholder="标签描述" clearable></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="addDialogVisible = false">取消</el-button>
      <el-button type="primary" @click.native="addSubmit">提交</el-button>
    </div>
  </el-dialog>
  <!-- 新增弹窗 -->
</section>
</template>
<script>
import {
  Manage
} from '@/api'
export default {
  name: 'tag-table',
  data() {
    
    return {
      addDialogVisible: false,
      loading: false,
      restaurants: [],
      timeout:  null,
      searchForm: {
        label_name: ''
      },
      
      subList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      records: 0,
      resetDialogVisible: false, //修改密码
      resetTag: {
        label_name: '',
        label_desc: '',
        label_id: ''
      },
      resetTagRules: {
        label_name: [{ required: true, message: '标签名称', trigger: 'blur' }],
        label_desc: [{ required: true, message: '标签描述', trigger: 'blur' }]
      },
      addForm: {
        label_name: '',
        label_desc: '',
      },
      addTagRules: {
        label_name: [{ required: true, message: '标签名称', trigger: 'blur' }],
        label_desc: [{ required: true, message: '标签描述', trigger: 'blur' }]
      },
    }
  },
  watch: {
    
  },
  created: function() {
    this.searchFormSubmit()
  },
  methods: {
    tableRowClassName({rowIndex}) {
      if (rowIndex % 2 == 1) {
        return 'warning-row'
      }
      return ''
    },
    resetForm() {
      this.searchForm.label_name = ''
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      var params = Object.assign({},this.searchForm) 
      params.page = val
      this.searchFormSubmit(params)
    },
    //查询子账户列表
    searchFormSubmit(params) {
      this.loading = true
      var data = this.searchForm
      data.page = 1
      data = params || data
      Manage.labelFindOperation(data).then(content => {
        console.log(content)
        this.subList = []
        if (content && content.data && content.data.length > 0) {
          this.total = content.pageContent
          this.records = Number(content.pageContent)
          this.subList = content.data ? content.data : []
        } else {
          this.subList = []
        }
      }).then(() => {
        this.loading = false
      })
    },
    handleReset(index, row) {
      console.log(index, row)
      this.resetTag = row
      this.resetDialogVisible = !this.resetDialogVisible

    },
    resetSubmit() {
      console.log(this.resetTag)
      this.$refs['resetTag'].validate((valid) => {
        console.log(valid)
        if (valid) {
          var params = {
            label_name: this.resetTag.label_name,
            label_desc: this.resetTag.label_desc,
            label_id: this.resetTag.label_id,
            opertion: 1
          }
          Manage.labelMaintainOperation(params).then(content => {
            console.log(content)
            if(content.code && content.code === '000000') {
              this.resetDialogVisible = false
              this.$message({
                type: 'success',
                message: '修改标签成功'
              })
              var params = Object.assign({},this.searchForm) 
              params.page = this.currentPage
              this.searchFormSubmit(params)
            } else {
              this.$message.error({
                message: `${content.message?','+content.message:''}`
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleResetStatus(index, row) {
      console.log(index, row)
      let params = {
        label_id:row.label_id,
        status: row.status,
        opertion: 1
      }
      Manage.labelMaintainOperation(params).then(content => {
        if(content.code && content.code === '000000') {
          this.resetDialogVisible = false
          this.$message({
            type: 'success',
            message: '修改标签状态成功'
          })
          var params = Object.assign({},this.searchForm) 
          params.page = this.currentPage
          this.searchFormSubmit(params)
        } else {
          this.$message.error({
            message: `${content.message?','+content.message:''}`
          })
        }
      })
    },
    addSubmit() {
      console.log(this.addForm)
      this.$refs['addForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          var params = {
            label_name: this.addForm.label_name,
            label_desc: this.addForm.label_desc,
            status: 1,
            opertion: 0
          }
          Manage.labelMaintainOperation(params).then(content => {
            console.log(content)
            if(content.code && content.code === '000000') {
              this.addDialogVisible = false
              this.$message({
                type: 'success',
                message: '新增标签成功'
              })
              this.searchFormSubmit()
            } else {
              this.$message.error({
                message: `新标签失败${content.message?','+content.message:''}`
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

  .el-table .warning-row {
    background-color: #eee;
  }


</style>

<template>
<section>
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form inline :model="searchForm" ref="searchForm">
      <el-row type="flex" class="row-bg" justify="end">
        <el-form-item label="管理员姓名：">
          <el-autocomplete
            v-model="searchForm.manage_id"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入"
            value-key="manage_name"
            value="manage_id"
            clearable
          ></el-autocomplete>
          <!-- <el-input v-model="searchForm.manage_id" placeholder='请输入' clearable></el-input> -->
        </el-form-item>
        <el-form-item label="最近登陆时间：">
          <el-select v-model="searchForm.login_type" filterable placeholder="请选择" clearable>
            <el-option v-for="item in loginOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最近登陆时间：">
          <el-select v-model="searchForm.score" filterable placeholder="请选择" clearable>
            <el-option v-for="item in scoreOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="searchFormSubmit()">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type=""  @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-row>
      <el-row type="flex" class="row-bg" justify="begin">
        <el-form-item label="总得分：">
          <el-input v-model="searchForm.total_score" placeholder='请输入' clearable></el-input>
        </el-form-item>
      </el-row>
    </el-form>
  </el-col>
  <el-table :data="subList" border  :header-cell-style="{background:'#eef1f6',color:'#606266'}" v-loading="loading" :row-class-name="tableRowClassName">
    <el-table-column property="family_name" label="家谱树名称" min-width="150" align="center">
    </el-table-column>
    <!-- <el-table-column property="appCode" label="应用代码" min-width="80" align="center">
    </el-table-column> -->
    <el-table-column property="manage_name" label="管理员姓名" min-width="150" align="center">
    </el-table-column>
    <el-table-column property="phone" label="手机号码" min-width="150" align="center">
    </el-table-column>
    <el-table-column property="complete_number" label="已完成任务分数" min-width="150" align="center">
    </el-table-column>
    <el-table-column property="unfinished_number" label="未完成任务分数" min-width="150" align="center">
    </el-table-column>
    <el-table-column property="score" label="得分" min-width="150" align="center">
    </el-table-column>
    <el-table-column property="lately_login" label="最近登陆时间" min-width="150" align="center">
    </el-table-column>
    
    <el-table-column label="操作" fixed="right" align="center" min-width="200">
      <template slot-scope="scope">
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">移除</el-button>
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
  <el-dialog title="任命管理员" :visible.sync="resetDialogVisible" custom-class="dialog" center>
    <el-form :model="resetTag" :rules="resetTagRules" ref="resetTag" label-width="8rem">
      <el-form-item label="管理员姓名：" prop="manage_name">
        <el-autocomplete
            v-model="resetTag.manage_id"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入"
            value-key="manage_name"
            value="manage_id"
            @select="handleSelect"
            clearable
          ></el-autocomplete>
      </el-form-item>
      <el-form-item label="所管家谱树名称：" prop="family_name">
        <el-input type="text" v-model="resetTag.family_name" placeholder="标签描述" disabled></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="resetDialogVisible = false">取消</el-button>
      <el-button type="primary" @click.native="resetSubmit">提交</el-button>
    </div>
  </el-dialog>
  <!-- 修改弹窗 -->
  
</section>
</template>
<script>
import {
  Manage
} from '@/api'
export default {
  name: 'familymanage-table',
  data() {
    
    return {
      addDialogVisible: false,
      loading: false,
      restaurants: [],
      timeout:  null,
      searchForm: {
        manage_id: '',
        login_type: '',
        score: '',
        total_score: '',
      },
      loginOptions:[
        {
          value: '0',
          label: '一个月'
        }, {
          value: '1',
          label: '半个月'
        },
        {
          value: '2',
          label: '七天'
        }
      ],
      scoreOptions:[{
          value: '0',
          label: '由高到低'
        }, {
          value: '1',
          label: '由低到高'
        }
      ],
      subList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      records: 0,
      resetDialogVisible: false, //修改密码
      resetTag: {
        family_id: '',
        manage_id: '',
        manage_name: '',
        family_name: '',
        manage_phone: ''
      },
      resetTagRules: {
        manage_id: [{ required: true, message: '管理员名称', trigger: 'blur' }]
      },
      
    }
  },
  watch: {
    
  },
  created: function() {
    let params = {
      operation_type: 1
    }
    Manage.familyManagePpeopleFind(params).then((res) => {
      console.log(res)
      this.restaurants = res.data
    })
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
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 3000 * Math.random())
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.manage_name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      console.log(item)
      this.resetTag.manage_name = item.manage_name
      this.resetTag.manage_phone = item.manage_phone
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
      Manage.familyManageListFind(data).then(content => {
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
      this.resetTag.family_name = row.family_name
      this.resetTag.family_id = row.family_id
      this.resetDialogVisible = !this.resetDialogVisible

    },
    resetSubmit() {
      console.log(this.resetTag)
      this.$refs['resetTag'].validate((valid) => {
        console.log(valid)
        if (valid) {
          var params = {
            ...this.resetTag,
            opertion: 0
          }
          Manage.familyManagePeopleAppointment(params).then(content => {
            console.log(content)
            if(content.code && content.code === '000000') {
              this.resetDialogVisible = false
              this.$message({
                type: 'success',
                message: '任命成功'
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
    //删除按钮事件
    handleDelete(index, row) {
      console.log(index, row)
      this.$confirm('是否继续删除该管理员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          family_id: row.family_id,
          manage_id: row.manage_id,
          manage_name: row.manage_name,
          opertion: 1
        }
        Manage.familyManagePeopleAppointment(params).then((content) => {
          console.log(content)
          if (content.code && content.code === '000000') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            var params = Object.assign({},this.searchForm) 
            params.page = this.currentPage
            this.searchFormSubmit(params)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
    width: 50%;
    min-width: 20rem;

}

  .el-table .warning-row {
    background-color: #eee;
  }


</style>

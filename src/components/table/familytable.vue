<template>
<section>
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form inline :model="searchForm" ref="searchForm">
      <el-row type="flex" class="row-bg" justify="end">
        <el-form-item label="家谱名称：">
          <el-autocomplete
            v-model="searchForm.family_name"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            value-key="family_name"
            @select="handleSelect"
            clearable
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="家谱树繁荣度：">
          <el-select v-model="searchForm.prosperity_type" filterable placeholder="请选择" clearable>
            <el-option v-for="item in searchForm.options" :key="item.value" :label="item.label" :value="item.value">
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
    </el-form>
  </el-col>
  <el-table :data="subAccountList" border highlight-current-row :header-cell-style="{background:'#eef1f6',color:'#606266'}" v-loading="loading">
    <el-table-column property="family_name" label="家谱名称" min-width="150" align="center">
    </el-table-column>
    <!-- <el-table-column property="appCode" label="应用代码" min-width="80" align="center">
    </el-table-column> -->
    <el-table-column property="family_manage_name" label="管理员姓名" min-width="150" align="center">
    </el-table-column>
    <el-table-column property="family_fund" label="家谱总基金" min-width="120" align="center">
    </el-table-column>
    <el-table-column property="generations" label="家谱总代数/代" min-width="120" align="center">
    </el-table-column>
    <el-table-column property="people_number" label="家谱总人数/个" min-width="120" align="center">
    </el-table-column>
    <el-table-column property="family_prosperity" label="家谱树繁荣度/分" min-width="120" align="center">
    </el-table-column>
  </el-table>
  <el-col :span="24" class="toolbar">
    <el-pagination style="float:right" :pager-count="5" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30,40,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="records">
    </el-pagination>
  </el-col>
</section>
</template>
<script>
import {
  Manage
} from '@/api'
export default {
  name: 'family-table',
  data() {
    
    return {
      reviseFormDialogVisible: false,
      resetPassDialogVisible: false, //修改密码
      addDialogVisible: false,
      loading: false,
      restaurants: [],
      timeout:  null,
      searchForm: {
        family_name: '',
        prosperity_type: '',
        options: [{
          value: '0',
          label: '由高到低'
        }, {
          value: '1',
          label: '由低到高'
        }],
      },
      
      subAccountList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      records: 0
    }
  },
  watch: {
    
  },
  created: function() {
    Manage.familyTreeDropDownFind().then((res) => {
      console.log(res)
      this.restaurants = res.data
    })
  },
  methods: {
    resetForm() {
      this.searchForm.family_name = ''
      this.searchForm.prosperity_type = ''
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
        return (state.family_name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      console.log(item)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      var params = this.searchForm
      params.page = this.currentPage
      this.searchFormSubmit(params)
    },
    //查询子账户列表
    searchFormSubmit(params) {
      this.loading = true
      var data = this.searchForm
      data.pageSize = this.pageSize
      data.currentPage = 1
      data = params || data
      Manage.familyTreeFind(data).then(content => {
        console.log(content)
        this.subAccountList = []
        if (content && content.data && content.data.length > 0) {
          this.total = content.pageNumber
          this.records = content.pageNumber
          this.subAccountList = content.data ? content.data : []
        } else {
          this.subAccountList = []
        }
      }).then(() => {
        this.loading = false
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
</style>

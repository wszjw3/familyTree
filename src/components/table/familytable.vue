<template>
<section>
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form inline :model="searchForm" ref="searchForm">
      <el-row type="flex" class="row-bg" justify="end">
        <el-form-item label="家谱名称：">
          <el-select
							v-model="searchForm.family_id"
							filterable
							placeholder="请选择"
              clearable
						>
							<el-option
								v-for="item in familyOpts"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
        </el-form-item>
        <el-form-item label="家谱树繁荣度：">
          <el-select v-model="searchForm.prosperity_type" filterable placeholder="请选择" clearable>
            <el-option v-for="item in prosperOpts" :key="item.value" :label="item.label" :value="item.value">
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
    <el-table-column prop="family_name" label="家谱名称" min-width="150" align="center">
    </el-table-column>
    <!-- <el-table-column prop="appCode" label="应用代码" min-width="80" align="center">
    </el-table-column> -->
    <el-table-column prop="manage_name" label="管理员姓名" min-width="150" align="center">
    </el-table-column>
    <el-table-column prop="amount" label="家谱总基金" min-width="120" align="center">
    </el-table-column>
    <el-table-column prop="generations" label="家谱总代数/代" min-width="120" align="center">
    </el-table-column>
    <el-table-column prop="people_number" label="家谱总人数/个" min-width="120" align="center">
    </el-table-column>
    <el-table-column prop="family_prosperity" label="家谱树繁荣度/分" min-width="120" align="center">
    </el-table-column>
  </el-table>
  <el-col :span="24" class="toolbar">
    <el-pagination
				style="float:right"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				layout="prev, pager, next"
				:total="records"
			>
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
      loading: false,
      searchForm: {
        family_id: '',
        prosperity_type: ''
      },
      prosperOpts: [{
        value: '0',
        label: '由高到低'
      }, {
        value: '1',
        label: '由低到高'
      }],
      subAccountList: [],
      currentPage: 1,
      records: 0,
      familyOpts: []
    }
  },
  watch: {
    
  },
  created: function() {
    this.getFamilyOpts()
		this.searchFormSubmit()
  },
  methods: {
    getFamilyOpts () {
      Manage.familyTreeDropDownFind().then(res => {
        if (res.data) {
          this.familyOpts = res.data.map(v => {
            return {
              label: v.family_name,
              value: v.family_id
            }
          })
        }
      })
    },
    resetForm() {
      this.searchForm.family_id = ''
      this.searchForm.prosperity_type = ''
      this.searchFormSubmit()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.searchFormSubmit()
    },
    searchFormSubmit() {
      this.loading = true
      const params = Object.assign({}, this.searchForm, {page: this.currentPage})
      Manage.familyTreeFind(params).then(content => {
        console.log(content)
        this.subAccountList = []
        if (content && content.data && content.data.length > 0) {
          this.records = parseInt(content.pageContent)
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

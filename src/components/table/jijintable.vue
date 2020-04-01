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
  Family
} from '@/api'
export default {
  name: 'jijin-table',
  data () {
    return {
      familyOpts: []
    }
  },
  created () {
    this.getFamilyOpts()
  },
  methods: {
    getFamilyOpts () {
      // Family.familyQueryOptions(){}
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

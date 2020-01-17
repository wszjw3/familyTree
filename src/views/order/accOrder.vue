<template>
<!-- 承保订单 -->
<section>
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form inline :model="searchForm">
      <el-row>
        <el-form-item>
          <el-input v-model="searchForm.contNo" placeholder='保单号' clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.orderNo" placeholder='订单号' clearable></el-input>
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
          <el-date-picker v-model="searchForm.startDate" type="date" placeholder="承保日期起" :picker-options="pickerOptionsStart" format="yyyy-MM-dd" value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="searchForm.endDate" type="date" placeholder="承保日期止" :picker-options="pickerOptionsEnd" format="yyyy-MM-dd" value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.appntName" placeholder='投保人姓名' clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getOrderList()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-download" @click="exportExcel">导出Excel</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-col>
  <el-table :data="orderList" highlight-current-row :header-cell-style="{background:'#eef1f6',color:'#606266'}" v-loading="loading">
    <el-table-column property="manageCom" label="国华管理机构" min-width="120" align="center">
    </el-table-column>
    <el-table-column property="agentCode" label="代理人编码" width="120" align="center">
    </el-table-column>
    <el-table-column property="agencyName" label="代理人名称" min-width="120" align="center">
    </el-table-column>
    <el-table-column property="agentName" label="销售人员名称" min-width="120" align="center">
    </el-table-column>
    <el-table-column property="appntName" label="投保人姓名" min-width="120" align="center">
    </el-table-column>
    <el-table-column property="insuredName" label="被保人姓名" min-width="120" align="center">
    </el-table-column>
    <el-table-column property="prem" label="规模保费" min-width="120" align="center">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{scope.row.prem }}</span>
      </template>
    </el-table-column>
    <el-table-column property="standPrem" label="标准保费" min-width="120" align="center">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{scope.row.standPrem }}</span>
      </template>
    </el-table-column>
    <el-table-column property="caseCount" label="件数" min-width="80" align="center">
    </el-table-column>
    <el-table-column property="contNo" label="保单号" width="200" align="center">
    </el-table-column>
    <el-table-column property="riskCode" label="险种编码" min-width="120" align="center">
    </el-table-column>
    <el-table-column property="riskName" label="险种名称" min-width="250" align="center">
    </el-table-column>
    <el-table-column label="缴费期间" min-width="80" align="center">
      <template slot-scope="scope" v-if="scope.row.payEndYear">
        <span>{{scope.row.payEndYear}}</span><span>{{scope.row.payEndYearFlag&&scope.row.payEndYearFlag=='Y'?'年':scope.row.payEndYearFlag=='A'?'岁':''}}</span>
      </template>
    </el-table-column>
    <el-table-column property="insuYears" label="保险期间" min-width="80" align="center">
      <template slot-scope="scope">
        <template v-if="scope.row.insuYear&&(scope.row.insuYear-0)<=150">
          <span>{{scope.row.insuYear}}</span>
          <span>{{scope.row.insuYearFlag&&scope.row.insuYearFlag=='Y'?'年':scope.row.insuYearFlag=='A'?'岁':''}}</span>
        </template>
        <template v-else-if="scope.row.insuYear&&(scope.row.insuYear-0)>150">
          <span>终身</span>
        </template>
      </template>
    </el-table-column>
    <el-table-column property="appntDate" label="收单日期" min-width="150" align="center">
      <template slot-scope="scope">
        <i class="el-icon-time" v-if="scope.row.appntDate"></i>
        <span style="margin-left: 10px">{{formatDate(scope.row.appntDate) }}</span>
      </template>
    </el-table-column>
    <el-table-column property="cvalidate" label="签单日期" min-width="150" align="center">
      <template slot-scope="scope">
        <i class="el-icon-time" v-if="scope.row.cvalidate"></i>
        <span style="margin-left: 10px">{{formatDate(scope.row.cvalidate) }}</span>
      </template>
    </el-table-column>
    <el-table-column property="surrenderDate" label="契撤日期" min-width="150" align="center">
      <template slot-scope="scope">
        <i class="el-icon-time" v-if="scope.row.surrenderDate"></i>
        <span style="margin-left: 10px">{{formatDate(scope.row.surrenderDate) }}</span>
      </template>
    </el-table-column>
    <el-table-column property="payYears" label="承保日期" min-width="150" align="center">
      <template slot-scope="scope">
        <i class="el-icon-time" v-if="scope.row.signDate"></i>
        <span style="margin-left: 10px">{{formatDate(scope.row.signDate) }}</span>
      </template>
    </el-table-column>
  </el-table>
  <el-col :span="24" class="toolbar">
    <el-pagination style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :pager-count="5" :current-page="currentPage" :page-sizes="[10, 20, 30,40,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="records">
    </el-pagination>
  </el-col>
</section>
</template>
<script>
import {
  Account,
  Esp
} from '@/api'
import util from '@/utils/util'
import axios from 'axios'
export default {
  data() {

    return {
      searchForm: {
        orderNo: '',
        contNo: '',
        agentCode: '',
        startDate: '',
        endDate: '',
        appntName: ''
      },
      agentCodeOptions: [],
      orderList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      records: 0,
      loading: false,
      pickerOptionsStart: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      pickerOptionsEnd: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
    }
  },
  created() {
    Account.getUserInfo().then((res) => {
      this.agentCodeOptions = JSON.parse(res.userInfo.remark)
    })
    this.getOrderList()
  },
  watch: {
    searchForm: {
      handler() {
        let searchForm = this.searchForm
        this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
          disabledDate(time) {
            let currentTime, oneMonths
            if (searchForm.endDate) {
              currentTime = new Date(searchForm.endDate)
              oneMonths = currentTime.setMonth(currentTime.getMonth() - 3)
              currentTime.setMonth(currentTime.getMonth() + 3)
            }
            return time.getTime() > Date.now() || (searchForm.endDate ? time.getTime() > searchForm.endDate : time.getTime() > Date.now()) || (searchForm.endDate ? time.getTime() < oneMonths : time.getTime() > Date.now())
          }
        })
        this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
          disabledDate(time) {
            let currentTime, oneMonths
            if (searchForm.startDate) {
              currentTime = new Date(searchForm.startDate)
              oneMonths = currentTime.setMonth(currentTime.getMonth() + 3)
              currentTime.setMonth(currentTime.getMonth() - 3)
            }
            return time.getTime() > Date.now() || (searchForm.startDate ? time.getTime() < searchForm.startDate : time.getTime() > Date.now()) || (searchForm.startDate ? time.getTime() > oneMonths : time.getTime() > Date.now())
          }
        })
      },
      deep: true
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      var params = {
        orderNo: this.searchForm.orderNo,
        contNo: this.searchForm.contNo,
        signStartDate: this.searchForm.startDate,
        signEndDate: this.searchForm.endDate,
        appntName: this.searchForm.appntName,
        agentCode: this.searchForm.agentCode,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.getOrderList(params)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      var params = {
        orderNo: this.searchForm.orderNo,
        contNo: this.searchForm.contNo,
        signStartDate: this.searchForm.startDate,
        signEndDate: this.searchForm.endDate,
        appntName: this.searchForm.appntName,
        agentCode: this.searchForm.agentCode,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.getOrderList(params)
    },
    exportExcel() {
      console.log(process.env.VUE_APP_BASE_ESP)
      var params = {
        orderNo: this.searchForm.orderNo,
        contNo: this.searchForm.contNo,
        signStartDate: this.searchForm.startDate,
        signEndDate: this.searchForm.endDate,
        appntName: this.searchForm.appntName,
        agentCode: this.searchForm.agentCode
      }
      // if (!(params.signStartDate && params.signEndDate)) {
      //   this.$message.error('请选择承保起始日期')
      //   this.loading = false
      //   return
      // }
      axios({
        method: 'get',
        baseURL: process.env.VUE_APP_BASE_ESP,
        url: '/order/exportAcc',
        responseType: 'blob',
        params: params,
      }).then((data) => {
        console.log(data)
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(data)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', `${util.formatDate(new Date(), 'yyyyMMddhhmmss')}.xls`)
        document.body.appendChild(link)
        link.click()
      })
    },
    getOrderList(params) {
      var data = {
        orderNo: this.searchForm.orderNo,
        contNo: this.searchForm.contNo,
        signStartDate: this.searchForm.startDate,
        signEndDate: this.searchForm.endDate,
        appntName: this.searchForm.appntName,
        agentCode: this.searchForm.agentCode,
        pageSize: this.pageSize
      }
      data.currentPage = 1
      data = params || data
      // if (!(data.signStartDate && data.signEndDate)) {
      //   this.$message.error('请选择承保起始日期')
      //   this.loading = false
      //   return
      // }
      Esp.getaccOrderList(data).then(content => {
        this.orderList = []
        if (content && content.result && content.result == '0') {
          this.orderList = content.data
          this.records = content.records
          this.total = content.total
        } else {
          this.$message.error({
            message: `查询失败${content.resultMessage?','+content.resultMessage:''}`
          })
        }
        this.loading = false
      })
    },
    formatDate(date) {
      return (date && date != '') ? util.formatDate(new Date(date), 'yyyy-MM-dd') : ''
    },
    formatMoney(money, num) {
      return util.formatNumber(money, num)
    }
  }
}
</script>

<style lang="less" scoped>
span {
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>

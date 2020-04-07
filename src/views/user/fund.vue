<template>
  <div>
    <h5 class="header">
      我管理的家谱 / 
      {{familyName}}
      / 家谱基金
    </h5>
    <div class="mt-md">
      <div class="desc">
        最高捐献者：
        <span class="text-red">{{fundInfo.high_name}}</span>
      </div>
      <div class="desc">
        捐献金额：
        <span class="text-red">{{fundInfo.high_count_amt}}</span>
      </div>
      <div class="desc">
        捐献总人数：
        <span class="text-red">{{fundInfo.donate_number}}</span>
      </div>
      <div class="desc">
        累计总额：
        <span class="text-red">{{fundInfo.donate_amt}}</span>
      </div>
    </div>
    <div class="mt-md flex">
      <el-button type="primary" @click="handleAdd">添加收入</el-button>
      <div class="inline-block align-right flex-1">
        <div class="inline-block">
          捐献者：
          <el-input type="text" v-model="user_name" placeholder="请输入" style="width: 180px"></el-input>
        </div>
        <div class="inline-block ml-md">
          选择日期：
          <el-date-picker
							v-model="date"
							type="daterange"
							range-separator="~"
							format="yyyy-MM-dd"
							value-format="yyyy-MM-dd"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
					/>
        </div>
        <div class="inline-block ml-md">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>
      </div>
    </div>
    <div class="mt-md">
      <el-table :data="tableData">
        <el-table-column prop="time" label="时间"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop="pay_mode" label="支付方式"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="trans_amt" label="金额（元）"></el-table-column>
        <el-table-column prop="remain_amt" label="剩余修谱总额"></el-table-column>
      </el-table>
      <el-pagination
				style="float:right"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				layout="prev, pager, next"
				:total="records"
			>
			</el-pagination>
    </div>
  </div>
</template>

<script>
import { Family } from '@/api'
export default {
  name: 'Fund',
  data () {
    return {
      user_name: '',
      date: [],
      fundInfo: {},
      currentPage: 1,
      records: 0
    }
  },
  created () {
    // this.loadData()
  },
  computed: {
    familyName () {
      return this.$router.currentRoute.query.name
    },
    tableData () {
      return this.fundInfo.donate || []
    },
    userId () {
      return this.$store.getters.getToken.user_id
    }
  },
  methods: {
    handleSearch () {
      const params = {
        user_id: this.userId,
        family_id: this.$router.currentRoute.query.familyId,
        user_name: this.user_name,
        begin_time: this.date[0] || '',
        end_time: this.date[1] || '',
        page: this.currentPage
      }
      Family.familyFundIncomeFind(params).then(res => {
        if (res.code === '000000') {
          this.fundInfo = res.data
          this.records = res.pageNumber
        }
      })
    },
    handleAdd () {},
    handleCurrentChange (val) {
      this.currentPage = val
      this.handleSearch()
    }
  }
}
</script>

<style scoped lang="less">
.header {
  font-size: 24px;
  padding: 0 0 20px 0;
  border-bottom: 1px solid #ddd;
  margin: 0;
}
.desc {
  display: inline-block;
  width: 23%;
  border-right: 5px solid #000;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
}
.mt-md {
  margin-top: 20px
}
.ml-md {
  margin-left: 20px
}
.text-red {
  color: red;
  margin-left: 20px
}
.inline-block {
  display: inline-block;
}
.align-right {
  text-align: right;
}
.flex {
  display: flex;

  .flex-1 {
    flex: 1
  }
}
</style>
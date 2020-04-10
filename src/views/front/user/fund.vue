<template>
  <div>
    <el-breadcrumb class="header" separator="/">
      <el-breadcrumb-item :to="{ path: '/?active=fourth' }">我管理的家谱</el-breadcrumb-item>
      <el-breadcrumb-item>{{familyName}}</el-breadcrumb-item>
      <el-breadcrumb-item>家谱基金</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="mt-md">
      <div class="desc text-left">
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
      <div class="desc no-border">
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
    <el-dialog title="添加基金收入" :visible.sync="isShow" width="80%">
      <el-form v-model="addFundForm" label-width="150px">
        <el-form-item label="捐献人：">
          <el-input v-model="addFundForm.donate_people" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="addFundForm.phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="捐献金额：">
          <el-input v-model="addFundForm.donate_amt" type="number" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </el-dialog>
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
      records: 0,
      isShow: false,
      addFundForm: {
        donate_people: '',
        donate_amt: null,
        phone: ''
      }
    }
  },
  computed: {
    familyName () {
      return this.$router.currentRoute.query.familyName
    },
    tableData () {
      return this.fundInfo.donate || []
    },
    userId () {
      return this.$store.getters.getToken.user_id
    }
  },
  created () {
    this.getDefaultDateRange()
    this.handleSearch()
  },
  methods: {
    getDefaultDateRange() {
			this.date = []
			var date = new Date()
			var seperator1 = '-'
			var year = date.getFullYear()
			var month = date.getMonth() + 1
			var strDate = date.getDate()
			if (month >= 1 && month <= 9) {
				month = '0' + month
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = '0' + strDate
			}
			this.date.push(
				year + seperator1 + month + seperator1 + strDate
			)

			date.setDate(date.getDate() - 7)
			year = date.getFullYear()
			month = date.getMonth() + 1
			strDate = date.getDate()
			if (month >= 1 && month <= 9) {
				month = '0' + month
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = '0' + strDate
			}
			this.date.unshift(
				year + seperator1 + month + seperator1 + strDate
			)
		},
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
    handleAdd () {
      this.isShow = true
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.handleSearch()
    },
    cancel () {
      this.isShow = false
      this.addFundForm = {
        donate_people: '',
        donate_amt: null,
        phone: ''
      }
    },
    confirm () {
      const params = {
        donate_people: this.addFundForm.donate_people,
        donate_amt: this.addFundForm.donate_amt,
        phone: this.addFundForm.phone,
        user_id: this.userId,
        family_id: this.$router.currentRoute.query.familyId
      }
      Family.familyFundAddIncome(params).then(res => {
        if (res.code === '000000') {
          this.$alert('添加成功')
          this.cancel()
          this.currentPage = 1
          this.handleSearch()
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.header {
  font-size: 18px;
  padding: 0 0 20px 0;
  border-bottom: 1px solid #ddd;
  margin: 0;
}
.desc {
  display: inline-block;
  width: 23%;
  border-right: 5px solid #333;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  text-align: center;
}
.text-left {
  text-align: left
}
.no-border {
  border: none
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
<template>
  <div>
    <el-breadcrumb class="header" separator="/">
      <el-breadcrumb-item :to="{ path: '/?active=fourth' }"
        >我管理的家谱</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ familyName }}</el-breadcrumb-item>
      <el-breadcrumb-item>家谱基金</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="mt-md">
      <div class="total-desc">
        <el-row class="full-height flex-center">
          <el-col class="text-center" :span="6">
            <p>最高捐献者</p>
            <p class="text-blue">{{ fundInfo.high_name }}</p>
          </el-col>
          <el-col class="text-center" :span="6">
            <p>捐献金额</p>
            <p class="text-blue">{{ fundInfo.high_count_amt }}</p>
          </el-col>
          <el-col class="text-center" :span="6">
            <p>捐献总人数</p>
            <p class="text-blue">{{ fundInfo.donate_number }}</p>
          </el-col>
          <el-col class="text-center" :span="6">
            <p>累计总额</p>
            <p class="text-blue">{{ fundInfo.donate_amt }}</p>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="mt-md content">
      <div class="flex">
        <div class="flex-1">
          <el-input
            type="text"
            v-model="user_name"
            placeholder="捐献者"
            style="width: 200px"
          ></el-input>
          <el-date-picker
            class="ml-md"
            v-model="date"
            type="daterange"
            range-separator="~"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <div class="inline-block ml-md">
            <el-button class="btn" @click="handleSearch">搜索</el-button>
          </div>
        </div>
        <el-button class="btn" @click="handleAdd">添加收入</el-button>
      </div>
      <div class="mt-md">
        <el-table :data="tableData" :header-cell-style="{backgroundColor: 'rgba(248,250,252,1)', color: 'rgba(52,73,94,1)'}">
          <el-table-column prop="time" label="时间"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="phone" label="手机号码"></el-table-column>
          <el-table-column
            prop="pay_mode_desc"
            label="支付方式"
          ></el-table-column>
          <el-table-column
            prop="trans_amt"
            label="金额（元）"
          ></el-table-column>
          <el-table-column
            prop="remain_amt"
            label="剩余修谱总额"
          ></el-table-column>
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
    <el-dialog title="添加基金收入" :visible.sync="isShow" width="50%">
      <el-form v-model="addFundForm" ref="form" :rules="rules">
        <el-form-item class="form-item" prop="donate_people">
          <p>捐献人</p>
          <el-input
            v-model="addFundForm.donate_people"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item class="form-item" prop="phone">
          <p>手机号</p>
          <el-input v-model="addFundForm.phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item class="form-item" prop="donate_amt">
          <p>捐献金额</p>
          <el-input
            v-model="addFundForm.donate_amt"
            type="number"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="btn cancel" @click="cancel">取消</el-button>
        <el-button class="btn btn-confirm" @click="confirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Family } from '@/api'
export default {
  name: 'Fund',
  data() {
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
        phone: '',
      },
      rules: {
        donate_people: [
          {
						required: true,
						trigger: 'blur',
						message: '请输入捐献人'
          }
        ],
        donate_amt: [
          {
						required: true,
						trigger: 'blur',
						message: '请输入捐献金额'
          }
        ],
        phone: [
          {
						required: true,
						trigger: 'blur',
						message: '请输入手机号'
          }
        ]
      }
    }
  },
  computed: {
    familyName() {
      return this.$router.currentRoute.query.familyName
    },
    tableData() {
      return this.fundInfo.donate || []
    },
    userId() {
      return this.$store.getters.getToken.user_id
    },
  },
  created() {
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
      this.date.push(year + seperator1 + month + seperator1 + strDate)

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
      this.date.unshift(year + seperator1 + month + seperator1 + strDate)
    },
    handleSearch() {
      const params = {
        user_id: this.userId,
        family_id: this.$router.currentRoute.query.familyId,
        user_name: this.user_name,
        begin_time: this.date[0] || '',
        end_time: this.date[1] || '',
        page: this.currentPage,
      }
      Family.familyFundIncomeFind(params).then((res) => {
        if (res.code === '000000') {
          this.fundInfo = res.data
          this.fundInfo.donate = res.data.donate.map((v) => {
            if (v.pay_mode === '0') {
              v.pay_mode_desc = '微信支付'
            } else if (v.pay_mode === '1') {
              v.pay_mode_desc = '支付宝支付'
            } else {
              v.pay_mode_desc = '线下支付'
            }
            return v
          })
          this.records = res.pageNumber
        }
      })
    },
    handleAdd() {
      this.isShow = true
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.handleSearch()
    },
    cancel() {
      this.isShow = false
      this.addFundForm = {
        donate_people: '',
        donate_amt: null,
        phone: '',
      }
    },
    confirm() {
      const params = {
        donate_people: this.addFundForm.donate_people,
        donate_amt: this.addFundForm.donate_amt,
        phone: this.addFundForm.phone,
        user_id: this.userId,
        family_id: this.$router.currentRoute.query.familyId,
      }
      Family.familyFundAddIncome(params).then((res) => {
        if (res.code === '000000') {
          this.$alert('添加成功')
          this.cancel()
          this.currentPage = 1
          this.handleSearch()
        } else {
          this.$message.error(res.message)
        }
      })
    },
  },
}
</script>

<style scoped lang="less">
.header {
  font-size: 18px;
  padding: 0 0 20px 0;
  border-bottom: 1px solid #ddd;
  margin: 0;
}

.total-desc {
  height: 123px;
  background: rgba(255, 255, 255, 1);
  box-shadow: -2px 4px 10px 0px rgba(0, 0, 0, 0.08);
  border-radius: 4px;

  p {
    font-size: 14px;
    font-weight: 500;
    color: rgba(52, 73, 94, 1);
  }

  .text-blue {
    color: rgba(87, 208, 146, 1);
  }
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

.content {
  background: rgba(255, 255, 255, 1);
  box-shadow: -2px 4px 10px 0px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  padding: 10px 20px;
}
.text-left {
  text-align: left;
}
.no-border {
  border: none;
}
.mt-md {
  margin-top: 20px;
}
.ml-md {
  margin-left: 20px;
}
.text-red {
  color: red;
  margin-left: 20px;
}
.inline-block {
  display: inline-block;
}
.align-right {
  text-align: right;
}
.text-center {
  text-align: center;
}
.flex {
  display: flex;

  .flex-1 {
    flex: 1;
  }
}

.full-height {
  height: 100%;
}
.flex-center {
  display: flex;
  align-items: center;
}

.btn {
  height:40px;
  width:94px;
  border-radius:4px;
  font-weight: 600px;
  background:rgba(87,208,146,1);
  border: 1px solid rgba(87,208,146,1);
  color: #fff;
  font-size: 16px;
}
.confirm {
  background:rgba(87,208,146,1);
  border: 1px solid rgba(87,208,146,1);
  color: #fff;
}

.cancel {
  background:rgba(232,235,238,1);
  border: 1px solid transparent;
  color: rgba(87,208,146,1);;
}

.form-item {
  margin: 5px 0;

  p {
    margin: 0
  }
}
</style>

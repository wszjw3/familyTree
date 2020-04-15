<template>
  <el-dialog :title="computedTitle" :visible.sync="isShow" width="60%">
    <el-tabs v-model="active">
      <el-tab-pane label="捐献流水" name="first">
        <el-table :data="histroy.data">
          <el-table-column prop="time" label="时间"></el-table-column>
          <el-table-column prop="user_name" label="姓名"></el-table-column>
          <el-table-column prop="donate_amt" label="捐献金额"></el-table-column>
          <el-table-column
            prop="donate_sum_amt"
            label="总捐献金额"
          ></el-table-column>
        </el-table>
        <el-pagination
          style="float:right"
          @current-change="handleCurrentChange('histroy')"
          :current-page="histroy.page"
          layout="prev, pager, next"
          :total="histroy.records"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="捐献排名" name="second">
        <el-table :data="rank.data">
          <el-table-column prop="idx" label="排名"></el-table-column>
          <el-table-column prop="user_name" label="姓名"></el-table-column>
          <el-table-column
            prop="donate_sumnumber"
            label="捐献次数"
          ></el-table-column>
          <el-table-column
            prop="donate_amt"
            label="捐献总金额"
          ></el-table-column>
        </el-table>
        <el-pagination
          style="float:right"
          @current-change="handleCurrentChange('rank')"
          :current-page="rank.page"
          layout="prev, pager, next"
          :total="rank.records"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { Family } from '@/api'
export default {
  name: 'DonateHistroyModal',
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    },
    familyId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: this.value,
      active: 'first',
      histroy: {
        data: [],
        page: 1,
        records: 0
      },
      rank: {
        data: [],
        page: 1,
        records: 0
      },
      statistics: {}
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.getToken
    },
    computedTitle() {
      return (
        '捐献记录     当前已有' +
        this.statistics.recordnumber +
        '人捐赠，捐赠总基金 ¥ :' +
        this.statistics.trans_amt
      )
    }
  },
  watch: {
    value(val) {
      this.isShow = val
      val && this.load()
    },
    isShow(val) {
      this.$emit('input', val)
      !val && this.reset()
    }
  },

  methods: {
    reset() {
      this.isShow = false
      this.histroy = {
        data: [],
        page: 1,
        records: 0
      }
      this.rank = {
        data: [],
        page: 1,
        records: 0
      }
    },
    load() {
      this.getTotal()
      this.getHistroy()
      this.getRank()
    },
    getTotal() {
      Family.familyDonateRecordStatistics({
        family_id: this.$router.currentRoute.query.familyId || this.familyId
      }).then(res => {
        this.statistics = res.data
      })
    },
    getHistroy() {
      const params = {
        family_id: this.$router.currentRoute.query.familyId || this.familyId,
        page: this.histroy.page
      }
      Family.familyDonateRecordStream(params).then(res => {
        this.histroy.data = res.data
      })
    },
    getRank() {
      const params = {
        family_id: this.$router.currentRoute.query.familyId || this.familyId,
        page: this.rank.page
      }
      Family.familyDonateRecordRanking(params).then(res => {
        this.rank.data = res.data.map((v, i) => {
          v.idx = i + 1
          return v
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.item {
  display: flex;
  margin-top: 30px;
  margin-left: 100px;

  .label {
    width: 150px;
  }

  .content {
    flex: 1;

    .opt-item {
      width: 70px;
      height: 70px;
      line-height: 70px;
      text-align: center;
      margin-right: 20px;
      cursor: pointer;
      border: 1px solid #ddd;
      display: inline-block;
      position: relative;

      .icon {
        position: absolute;
        top: 0;
        right: 0;
        color: red;
        font-size: 20px;
        display: inline-block;
        height: 20px;
        line-height: 20px;
      }
    }
    .active {
      border: 1px solid red;
    }

    .input-money {
      margin-top: 20px;

      .input {
        width: auto;
      }
    }
  }
}

.qr-code {
  text-align: center;
  position: relative;

  .back {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px 8px;
    border: 1px solid #ddd;
    cursor: pointer;
  }

  img {
    width: 200px;
    height: 200px;
    margin-top: 50px;
  }

  .qr-img-error {
    width: 200px;
    height: 200px;
    line-height: 200px;
    margin-top: 50px;
    cursor: pointer;
    text-align: center;
  }
}
</style>

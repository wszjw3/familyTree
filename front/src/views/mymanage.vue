<template>
  <el-table class="table" :data="myManage" :header-cell-style="{backgroundColor: 'rgba(248,250,252,1)', color: 'rgba(52,73,94,1)'}">
    <el-table-column prop="idx" label="序号"></el-table-column>
    <el-table-column prop="family_name" label="家谱名称">
      <template slot-scope="scope">
        <router-link
          class="link"
          :to="{
            path: '/family/detail',
            query: { familyId: scope.row.family_id, from: 'manage' },
          }"
          >{{ scope.row.family_name }}</router-link
        >
      </template>
    </el-table-column>
    <el-table-column prop="family_stay" label="待办事项">
      <template slot-scope="scope">
        <router-link
          class="link"
          :to="{
            path: '/user/task',
            query: {
              familyName: scope.row.family_name,
            },
          }"
          >{{ scope.row.family_stay }}</router-link
        >
      </template>
    </el-table-column>
    <el-table-column prop="fund_total" label="基金总额">
      <template slot-scope="scope">
        <router-link
          class="link"
          :to="{
            path: '/user/fund',
            query: {
              familyName: scope.row.family_name,
              familyId: scope.row.family_id,
            },
          }"
          >{{ scope.row.fund_total }}</router-link
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { Family } from '@/api'
export default {
  name: 'MyManage',
  data () {
    return {
      myManage: []
    }
  },
  computed: {
    userId () {
      return this.$store.getters.getToken.user_id
    },
  },
  created () {
    Family.familyManageFind({user_id: this.userId}).then(res => {
      this.myManage = res.data.family.map((v, i) => {
        v.idx = i + 1
        return v
      })
    })
  }
}
</script>

<style lang="less" scoped>
.table {
  border-radius:4px;
}
.link {
  font-size:14px;
  font-weight:400;
  color:rgba(52,73,94,1);
  line-height:17px;
  text-decoration: none
}
</style>

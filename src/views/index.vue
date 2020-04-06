<template>
  <el-tabs v-model="activeName">
		<el-tab-pane label="首页" name="first" class="table-item">
      <el-row>
        <el-col :span="12">
          <el-table :data="familyData">
            <el-table-column prop="idx" label="排名"></el-table-column>
            <el-table-column prop="family_name" label="家谱树名称"></el-table-column>
            <el-table-column prop="family_score" label="家谱树繁荣得分"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <el-table :data="manageData">
            <el-table-column prop="idx" label="排名"></el-table-column>
            <el-table-column prop="manage_name" label="管理员姓名"></el-table-column>
            <el-table-column prop="manage_number" label="管理员得分"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
		</el-tab-pane>
    <el-tab-pane label="家谱查询" name="second" class="table-item">
		</el-tab-pane>
    <el-tab-pane label="我管理的家谱" name="thired" class="table-item">
		</el-tab-pane>
  </el-tabs>
</template>
<script>
import { Family } from '@/api'
export default {
  name: 'Index',
  data() {
    return {
      activeName: 'first',
      familyData: [],
      manageData: []
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      Family.familyHomePageFind().then(res => {
        if (res.code === '000000' && res.data) {
          this.familyData = res.data.family.map((v, i) => {
            v.idx = i + 1
            return v
          })
          this.manageData = res.data.manage.map((v, i) => {
            v.idx = i + 1
            return v
          })
        }
      })
    }
  }
}
</script>

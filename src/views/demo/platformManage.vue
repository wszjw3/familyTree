<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="stretch">
      <el-tab-pane label="基金处理" name="first" class="table-item">
        <div class="tab-pane-tit">根深叶茂/ 基金处理</div>

        <jijin-table></jijin-table>
      </el-tab-pane>
      <el-tab-pane label="家谱树列表" name="second" class="table-item">家谱树列表</el-tab-pane>
      <el-tab-pane label="管理员列表" name="third" class="table-item">管理员列表</el-tab-pane>
      <el-tab-pane label="标签管理" name="fourth" class="table-item">标签管理</el-tab-pane>
      <el-tab-pane label="百家姓维护" name="fifth" class="table-item">百家姓维护</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import JijinTable from '@/components/table/jijintable'
export default {
  name: 'platformManage',
  components: {
    JijinTable
  },
  data() {
    return {
      activeName: 'second',
      stretch: false,
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="less" scoped>

.tab-pane-tit {
    font-family: '微软雅黑 Bold', '微软雅黑';
    font-weight: 700;
    font-style: normal;
    color: #363636;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #eee;
}
</style>

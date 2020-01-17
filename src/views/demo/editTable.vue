<template>
  <el-form>
    <el-table :data="tableData" border style="width:100%">
      <el-table-column prop="order1" label="内容1">
        <template slot-scope="scope">
          <el-input v-model="scope.row.order1" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="order2" label="内容2">
        <template slot-scope="scope">
          <el-input v-model="scope.row.order2" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click.native.prevent="del(scope.$index)" type="text" size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" style="margin:20px;" @click="add">添加</el-button>
    <el-button type="primary" style="margin:20px;" @click="submit">提交</el-button>
  </el-form>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          order1: '',
          order2: ''
        }, {
          order1: '',
          order2: ''
        }]
      }
    },
    methods: {
      add() {
        this.tableData.push({
          order1: '',
          order2: ''
        })
      },
      del(index) {
        this.tableData.splice(index, 1)
      },
      submit() {
        this.$message({
          message: this.tableData,
          type: 'success'
        })
      }
    }
  }

</script>

<style lang="less" scoped>

</style>

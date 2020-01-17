<template>
<base-table :headers='headers' :data='data' @view='msg' @selection-change="handleSelectionChange" @size-change="handleSizeChange" @current-change="handleCurrentChange" :pageSize="1" :currentPage="1" :total="data.length">
  <el-table-column prop='name' align="center" label="name"> </el-table-column>
  <el-table-column prop='age' align="center" label="age"> </el-table-column>
  <template slot="toolbar_button">
    <el-button type="primary" icon="el-icon-plus" @click="add()">新增子账户</el-button>
  </template>
</base-table>
</template>
<script>
import BaseTable from '@/components/layout/basetable'
export default {
  components: {
    BaseTable
  },
  data() {
    return {
      headers: {
        columns: [{
            type: 'selection'
          },
          {
            type: 'index',
          }, {
            title: '操作',
            type: 'operate',
            operates: [{
              name: '详情',
              emitKey: 'view',
              type: 'danger'
            }]
          }
        ]
      },
      data: [{
        name: 'xxxx',
        age: 12
      }, {
        name: 'xxxx',
        age: 17
      }, {
        name: 'xxxx',
        age: 42
      }]
    }
  },
  methods: {
    msg(rowdata) {
      console.log(rowdata)
    },
    //选中行改变时触发@selection-change
    //双击选中当前行
    handleSelectionChange(rowdata) {
      console.log(rowdata)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    add(){
      console.log('新增')
    }
  }
}
</script>
<style lang="css" scoped>
</style>

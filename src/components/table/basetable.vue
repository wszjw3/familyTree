<template>
<div>
  <el-table :data='data' ref="multipleTable" highlight-current-row :header-cell-style="{background:'#eef1f6',color:'#606266'}" v-loading="loading" @selection-change="handleSelectionChange" @row-dblclick="toggleSelection">
    <!--   -->
    <template v-for="(column, index) in headers.columns">
      <slot name="front-slot"> </slot>
      <!-- 序号 -->
      <el-table-column :key="index" align="center" v-if="column.type === 'selection'" type="selection" width="55"> </el-table-column>
      <!-- 复选框 -->
      <el-table-column :key="index" align="center" v-else-if="column.type === 'index'" type="index" width="50" :label="column.title"> </el-table-column>
      <!-- 具体内容 -->
      <el-table-column :key="index" align="center" fixed="right" v-else :label="column.title" :width="column.width">
        <template slot-scope="scope">
          <!-- 仅仅显示文字 -->
          <label v-if="!column.hidden">
            <!-- 如果hidden为true的时候 那么当前格可以不显示，可以选择显示自定义的slot-->
            <!-- 操作按钮 -->
            <label v-if="column.type === 'operate'">
              <el-button v-for="(operate, index) in column.operates" size="mini" :type="operate.type" :key="index" @click="handleClick(operate, scope.row)">{{operate.name}}</el-button>
            </label>
            <span v-else>
              {{scope.row[column.key]}}
            </span>
          </label>
          <!-- 使用slot的情况下 -->
          <label v-if="column.slot">
            <!-- 具名slot -->
            <slot v-if="column.slot" :name="column.slot" :scope="scope"></slot>
          </label>
        </template>
      </el-table-column>
    </template>
    <!--默认的slot -->
    <slot />
  </el-table>
  <el-col :span="24" class="toolbar">
    <slot name="toolbar_button"></slot>
    <el-pagination style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </el-col>
</div>
</template>

<script>
export default {
  name: 'base-table',
  data() {
    return {
      loading: false
    }
  },
  props: {
    headers: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
      columns: {
        type: Array,
        required: true,
        default: () => {
          return []
        }
      }
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    pageSize: {
      type: Number,
      required: true,
      default: () => {
        return 1
      }
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 20, 30, 40, 100]
      }
    },
    currentPage: {
      type: Number,
      required: true,
      default: () => {
        return 1
      }
    },
    total: {
      type: Number,
      required: true,
      default: () => {
        return 0
      }
    }
  },
  methods: {
    // 处理点击事件
    handleClick(action, data) {
      // emit事件
      this.$emit(`${action.emitKey}`, data)
    },
    toggleSelection(rows) {
      this.$refs.multipleTable.toggleRowSelection(rows)
    },
    handleSelectionChange(val) {
      this.$emit('selection-change', val)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.$emit('size-change', val)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.$emit('current-change', val)
    },
  }
}
</script>

<style lang="css">
</style>

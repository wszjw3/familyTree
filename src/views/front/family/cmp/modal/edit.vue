<template>
  <el-dialog title="成员信息变更：" :visible.sync="isShow" width="60%">
    <el-table :data="tableData" style="width: 100%; overflow: auto">
      <el-table-column align="center" prop="surname" min-width="90">
        <template slot="header">
          <span class="required">* </span>
          姓
        </template>
        <template slot-scope="scope">
          <el-input v-model="scope.row.surname"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="fame" min-width="90">
        <template slot="header">
          <span class="required">* </span>
          名
        </template>
        <template slot-scope="scope">
          <el-input v-model="scope.row.fame"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="character_name"
        label="字辈"
        min-width="90"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.character_name"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sex" min-width="120">
        <template slot="header">
          <span class="required">* </span>
          性别
        </template>
        <template slot-scope="scope">
          <el-select v-model="scope.row.sex" placeholder="请选择" disabled>
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="be_alive" min-width="150">
        <template slot="header">
          是否在世
          <span class="required">* </span>
        </template>
        <template slot-scope="scope">
          <el-radio v-model="scope.row.be_alive" label="1">是</el-radio>
          <el-radio v-model="scope.row.be_alive" label="2">否</el-radio>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="brith_time" min-width="150">
        <template slot="header">
          出生日期
        </template>
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.brith_time"
            type="date"
            style="width: 140px"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :picker-options="pickerOptions.brith_time"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="death_time"
        label="死亡日期"
        min-width="150"
      >
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.death_time"
            type="date"
            style="width: 140px"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :picker-options="pickerOptions.death_time"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="address" min-width="200">
        <template slot="header">
          地址
          <span class="required">* </span>
        </template>
        <template slot-scope="scope">
          <el-input v-model="scope.row.address"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="marry_time"
        label="结婚时间"
        min-width="150"
      >
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.marry_time"
            type="date"
            style="width: 140px"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          >
          </el-date-picker>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">申请修改</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Family } from '@/api'
export default {
  name: 'EditModal',
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    },
    userInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isShow: this.value,
      tableData: []
    }
  },
  computed: {
    sexOptions() {
      return [
        {
          label: '男',
          value: '1'
        },
        {
          label: '女',
          value: '2'
        }
      ]
    },
    pickerOptions() {
      return {
        brith_time: {
          disabledDate: time => {
            if (this.tableData[0].death_time != '') {
              return time.getTime() > this.tableData[0].death_time
            }
          }
        },
        death_time: {
          disabledDate: time => {
            if (this.tableData[0].brith_time != '') {
              return time.getTime() < this.tableData[0].brith_time
            }
          }
        }
      }
    }
  },
  watch: {
    value(val) {
      this.isShow = val
    },
    isShow(val) {
      this.$emit('input', val)
    },
    userInfo(val) {
      const obj = JSON.parse(JSON.stringify(val))
      this.tableData = [obj]
    }
  },
  methods: {
    reset() {
      this.isShow = false
      this.tableData = []
    },
    confirm() {
      if (this.validate()) {
        const params = this.tableData[0]
        Family.familyUpdateUser(params).then(res => {
          if (res.code === '000000') {
            this.$alert('保存成功')
            this.reset()
            this.$emit('success')
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    cancel() {
      this.reset()
    },
    validate() {
      const obj = this.tableData[0]
      let flag = true
      if (
        !obj.surname ||
        !obj.fame ||
        !obj.sex ||
        !obj.address ||
        !obj.be_alive
      ) {
        flag = false
      }
      flag === false && this.handleTip(obj)
      return flag
    },
    handleTip(obj) {
      if (!obj.surname) {
        this.$message.error('姓不能为空')
        return
      }
      if (!obj.fame) {
        this.$message.error('名不能为空')
        return
      }
      if (!obj.sex) {
        this.$message.error('性别不能为空')
        return
      }
      if (!obj.address) {
        this.$message.error('地址不能为空')
        return
      }
      if (!obj.be_alive) {
        this.$message.error('是否在世不能为空')
        return
      }
    }
  }
}
</script>

<style scoped lang="less">
.required {
  color: red;
}
</style>

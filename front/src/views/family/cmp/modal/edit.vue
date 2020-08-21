<template>
  <el-dialog title="成员信息变更：" :visible.sync="isShow" width="90%" center>
    <el-table :data="tableData" style="width: 100%; overflow: auto">
      <el-table-column align="center" prop="surname" min-width="90" label="姓">
        <template slot-scope="scope">
          <el-input v-model="scope.row.surname" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="fame" min-width="90" label="名">
        <template slot-scope="scope">
          <el-input v-model="scope.row.fame"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="old_character" min-width="90" label="字">
        <template slot-scope="scope">
          <el-input v-model="scope.row.old_character"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="family_name" min-width="90" label="谱名">
        <template slot-scope="scope">
          <el-input v-model="scope.row.family_name"></el-input>
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
      <el-table-column align="center" prop="sex" min-width="120" label="性别">
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
      <!-- <el-table-column align="center" prop="be_alive" min-width="150" label="是否在世">
        <template slot-scope="scope">
          <el-radio v-model="scope.row.be_alive" label="1">是</el-radio>
          <el-radio v-model="scope.row.be_alive" label="2">否</el-radio>
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="brith_time" min-width="150" label="出生日期">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.brith_time"
            type="date"
            editable
            style="width: 140px"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          >
          </el-date-picker>
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
            :disabled="scope.row.sex == '1'"
            v-model="scope.row.marry_time"
            type="date"
            editable
            style="width: 140px"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="address"
        label="出生地址"
        min-width="150"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.address"></el-input>
        </template>

      </el-table-column>
      <el-table-column
        align="center"
        prop="death_time"
        label="去世日期"
        min-width="150"
      >
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.death_time"
            type="date"
            editable
            style="width: 140px"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            @change="val => {handleDeathTimeChanged(val, scope.row)}"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="death_address"
        label="去世地址"
        min-width="150"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.death_address"></el-input>
        </template>

      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button class="ma-md" @click="cancel">取消</el-button>
      <el-button class="ma-md" type="primary" @click="confirm">{{isManager ? '确认' : '申请修改'}}</el-button>
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
    isManager () {
      return this.$store.getters.getToken.user_type === '3'
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
        let params = this.tableData[0]
        params.login_id = this.$store.getters.getToken.user_id
        Family.familyUpdateUser(params).then(res => {
          if (res.code === '000000') {
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
        !obj.sex ||
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
      // if (!obj.fame) {
      //   this.$message.error('名不能为空')
      //   return
      // }
      if (!obj.sex) {
        this.$message.error('性别不能为空')
        return
      }
      if (!obj.be_alive) {
        this.$message.error('是否在世不能为空')
        return
      }
    },
    handleDeathTimeChanged (val, row) {
      row.be_alive = new Date(val) < Date.now() && val ? '2' : '1'
    }
  }
}
</script>

<style scoped lang="less">
.required {
  color: red;
}
.ma-md {
  margin: 5px 20px
}
</style>

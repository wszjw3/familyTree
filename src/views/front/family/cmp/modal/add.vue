<template>
  <el-dialog title="添加家谱树成员" :visible.sync="isShow" width="80%" center>
    <el-table
      class="add-table"
      :data="tableData"
      style="width: 100%; overflow: auto"
    >
      <el-table-column align="center" prop="relation_desc" min-width="50">
      </el-table-column>
      <el-table-column align="center" prop="surname" min-width="90">
        <template slot="header">
          <span class="required">* </span>
          姓
        </template>
        <template slot-scope="scope">
          <el-input v-model="scope.row.surname" :disabled="scope.row.relation !== 'spouse' && scope.row.relation !== 'mother'"></el-input>
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
          <el-input
            v-model="scope.row.character_name"
            :disabled="
              scope.row.relation === 'mother' ||
              scope.row.relation === 'grandmother' ||
              scope.row.relation === 'spouse'
            "
            @input="val => {handleCharacterNameInput(val, scope.row.relation)}"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sex" min-width="120">
        <template slot="header">
          <span class="required">* </span>
          性别
        </template>
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.sex"
            placeholder="请选择"
            :disabled="
              scope.row.relation === 'current' ||
                scope.row.relation === 'father' ||
                scope.row.relation === 'mother' ||
                scope.row.relation === 'spouse'
            "
          >
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
      <el-table-column align="center" prop="brith_time" min-width="150">
        <template slot="header">
          <span class="required">* </span>
          是否在世
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
            @change="val => {handleDeathTimeChanged(val, scope.row)}"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="address" min-width="200">
        <template slot="header">
          <span class="required">* </span>
          通讯地址
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
            @change="val => {handleMarryTimeChanged(val, scope.row.relation)}"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="marry_time" min-width="150">
        <template slot-scope="scope" v-if="scope.row.relation === 'child'">
          <el-select v-model="scope.row.mother_id" placeholder="请选择母亲">
            <el-option
              v-for="item in motherOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.idx" @click="handleDeleteRow(scope.row.idx)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="operation">
      <span
        @click="handleAdd('father')"
        :class="userInfo.mother_id || hasFather || hasMother || userInfo.isWife ? 'disabled' : ''"
      >
        添加父母
      </span>
      <!-- <span
        @click="handleAdd('mother')"
        :class="userInfo.mother_id || hasMother || userInfo.isWife ? 'disabled' : ''"
      >
        添加母亲
      </span> -->
      <span @click="handleAdd('spouse')" :class="userInfo.isWife || spouseDisabled ? 'disabled' : ''">
        添加配偶
      </span>
      <span @click="handleAdd('brother')" :class="userInfo.isWife ? 'disabled' : ''">
        添加兄妹
      </span>
      <span @click="handleAdd('child')">
        添加子女
      </span>
    </div>
    <span slot="footer">
      <el-button class="ma-md" @click="cancel">取消</el-button>
      <el-button class="ma-md" type="primary" @click="confirm">提交审核</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Family } from '@/api'
export default {
  name: 'AddModal',
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
    },
    surName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: this.value,
      tableData: [],
      motherOptions: []
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
    },
    hasFather() {
      let flag = false
      this.tableData.forEach(item => {
        if (item.relation === 'father') {
          flag = true
        }
      })
      return flag
    },
    hasMother() {
      let flag = false
      this.tableData.forEach(item => {
        if (item.relation === 'mother') {
          flag = true
        }
      })
      return flag
    },
    spouseDisabled () {
      let flag = false
      this.tableData.forEach(item => {
        if (item.relation === 'spouse' && item.sex === '1' && this.userInfo.sex === '2') {
          flag = true
        }
      })
      return flag
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
      this.getMotherOptions()
      val.relation_desc = '当前人物'
      val.relation = 'current'
      this.tableData = [val]
      // let obj = {
      //   relation: '',
      //   relation_desc: '',
      //   surname: '',
      //   fame: '',
      //   character_name: '',
      //   family_name: '',
      //   sex: '',
      //   be_alive: '',
      //   brith_time: '',
      //   death_time: '',
      //   address: '',
      //   marry_time: ''
      // }
      // const relation = [
      //   {
      //     relation: 'spouse',
      //     relation_desc: '配偶'
      //   },
      //   {
      //     relation: 'spouse',
      //     relation_desc: '配偶'
      //   },
      //   {
      //     relation: 'brother',
      //     relation_desc: '兄妹'
      //   },
      //   {
      //     relation: 'brother',
      //     relation_desc: '兄妹'
      //   },
      //   {
      //     relation: 'child',
      //     relation_desc: '子女'
      //   }
      // ]
      // relation.forEach(item => {
      //   this.tableData.push(Object.assign({}, obj, item))
      // })
    }
  },
  methods: {
    getMotherOptions() {
      Family.familyQueryMother({ user_id: this.userInfo.user_id }).then(res => {
        if (res.data) {
          this.motherOptions = res.data.map(v => {
            return {
              label: v.mother_name,
              value: v.mother_id
            }
          })
        }
      })
    },
    reset() {
      this.isShow = false
      this.tableData = []
    },
    confirm() {
      if (this.validate()) {
        let params = {}
        params.user = {
          user_id: this.userInfo.user_id
        }
        params.father = {}
        params.mother = {}
        params.wife = []
        params.brother = []
        params.boy = []
        this.tableData.forEach(item => {
          switch (item.relation) {
            case 'father':
              params.father = item
              break
            case 'mother':
              params.mother = item
              break
            case 'spouse':
              params.wife.push(item)
              break
            case 'brother':
              params.brother.push(item)
              break
            case 'child':
              params.boy.push(item)
              break
          }
        })
        Family.familyAddUser(params).then(res => {
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
    handleAdd(type) {
      if (type === 'father' && (this.userInfo.mother_id || this.hasMother || this.hasFather)) {
        return
      }
      if (
        type === 'mother' && (this.userInfo.mother_id || this.hasMother)
      ) {
        return
      }
      if (type !== 'child' && this.userInfo.isWife) {
        return
      }
      if (this.spouseDisabled) {
        return
      }
      const relation = [
        'current',
        'father',
        'mother',
        'spouse',
        'brother',
        'child'
      ]
      let obj = {
        surname: type === 'spouse' || type === 'mother' ? '' : this.surName,
        fame: '',
        character_name: '',
        family_name: '',
        sex: '',
        be_alive: '',
        brith_time: '',
        death_time: '',
        address: this.userInfo.address,
        marry_time: ''
      }
      if (type === 'spouse') {
        obj.sex = this.userInfo.sex === '1' ? '2' : '1'
      }
      obj.relation = type
      let marry_time = ''
      this.tableData.forEach(item => {
        if (item.relation === 'mother' || item.relation === 'father') {
          marry_time = item.marry_time
        }
      })
      switch (type) {
        case 'father':
          obj.relation_desc = '父亲'
          obj.sex = '1'
          obj.marry_time = marry_time
          
          break
        case 'mother':
          obj.relation_desc = '母亲'
          obj.sex = '2'
          obj.marry_time = marry_time
          break
        case 'spouse':
          obj.relation_desc = '配偶'
          obj.marry_time = this.userInfo.marry_time
          break
        case 'brother':
          obj.relation_desc = '兄妹'
          obj.character_name = this.userInfo.character_name
          break
        case 'child':
          obj.relation_desc = '子女'
          this.tableData.forEach(item => {
            if (item.relation === 'child' && item.character_name !== '') {
              obj.character_name = item.character_name
            } 
          })
      }
      this.tableData.push(obj)
      this.tableData = this.tableData.sort((a, b) => {
        return relation.indexOf(a.relation) - relation.indexOf(b.relation)
      }).map((v, i) => {
        v.idx = i
        return v
      })
      if (type === 'father') {
        this.handleAdd('mother')
      }
    },
    validate() {
      let flag = true
      this.tableData.forEach(item => {
        if (!item.surname || !item.fame || !item.sex || !item.be_alive || !item.address) {
          flag = false
        }
        flag === false && this.handleTip(item)
      })

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
      if (!obj.be_alive) {
        this.$message.error('是否在世不能为空')
        return
      }
      if (!obj.address) {
        this.$message.error('地址不能为空')
        return
      }
    },
    handleDeleteRow (idx) {
      this.tableData = this.tableData.filter(v => {
        return v.idx !== idx
      })
    },
    handleMarryTimeChanged (val, relation) {
      if (relation === 'father') {
        this.tableData.forEach(item => {
          if (item.relation === 'mother') {
            item.marry_time = val
          }
        })
      }
      if (relation === 'current' || relation === 'spouse') {
        this.tableData.forEach(item => {
          if (item.relation === 'current' || item.relation === 'spouse') {
            item.marry_time = val
          }
        })
      }
    },
    handleCharacterNameInput (val, relation) {
      if (relation === 'current' || relation === 'brother') {
        this.tableData.forEach(item => {
          if (item.relation === 'current' || item.relation === 'brother') {
            item.character_name = val
          }
        })
      }
      if (relation === 'child') {
        this.tableData.forEach(item => {
          if (item.relation === 'child') {
            item.character_name = val
          }
        })
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
.disabled {
  background-color: #ddd;
  color: #fff;
  cursor: inherit;
}
.operation {
  width: 80%;
  margin: 40px auto;
  padding: 10px;
  text-align: center;
  border: 1px dashed #ddd;

  span {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px 8px;
    margin: 0 10px;
    display: inline-block;
    cursor: pointer;
  }
}
.ma-md {
  margin: 5px 20px
}
</style>

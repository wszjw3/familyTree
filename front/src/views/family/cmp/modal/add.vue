<template>
  <el-dialog title="添加家谱树成员" :visible.sync="isShow" width="95%" center>
    <el-table
      class="add-table"
      :data="tableData"
      :span-method="arraySpanMethod"
      style="width: 100%; overflow: auto"
    >
      <el-table-column prop="relation_desc" width="60"></el-table-column>
      <el-table-column align="center" prop="surname" min-width="90"  label="姓">
        <template slot="header">
          <span class="required">* </span>
          姓
        </template>
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.surname"
            :disabled="(scope.row.relation !== 'spouse' && scope.row.relation !== 'mother') || scope.row.saved"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="fame" min-width="90" label="名">
        <template slot="header">
          名
        </template>
        <template slot-scope="scope">
          <el-input v-model="scope.row.fame" :disabled="scope.row.saved"></el-input>
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
              scope.row.relation === 'spouse' ||
              (scope.row.relation === 'child' && userInfo.nextCharacterName !== '') ||
              scope.row.saved
            "
            @input="val => {handleCharacterNameInput(val, scope.row.relation)}"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sex" min-width="80" label="性别">
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
                scope.row.relation === 'spouse' ||
                scope.row.saved
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
      <!-- <el-table-column align="center" prop="brith_time" min-width="150">
        <template slot="header">
          <span class="required">* </span>
          是否在世
        </template>
        <template slot-scope="scope">
          <el-radio v-model="scope.row.be_alive" label="1">是</el-radio>
          <el-radio v-model="scope.row.be_alive" label="2">否</el-radio>
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="brith_time" min-width="150" label="出生日期">
        <template slot="header">
          出生日期
        </template>
        <template slot-scope="scope">
          <el-date-picker
           :disabled="scope.row.saved"
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
           :disabled="scope.row.saved"
            v-model="scope.row.marry_time"
            type="date"
            editable
            style="width: 140px"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            @change="val => {handleMarryTimeChanged(val, scope.row.relation)}"
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
          <el-input v-model="scope.row.address" :disabled="scope.row.saved"></el-input>
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
           :disabled="scope.row.saved"
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
      <el-table-column v-if="motherOptions.length > 0" align="center" prop="marry_time" width="110">
        <template slot-scope="scope" v-if="scope.row.relation === 'child'">
          <el-select  :disabled="scope.row.saved" v-model="scope.row.mother_id" placeholder="请选择母亲">
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
      <el-table-column align="center" width="150">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="12">
              <el-button size="small" class="save-btn" v-if="!scope.row.saved && scope.row.idx" @click="handleSaveRow(scope.row)">保存</el-button>
            </el-col>
            <el-col :span="12">

              <el-button size="small" v-if="!scope.row.saved && scope.row.idx" @click="handleDeleteRow(scope.row.idx)">取消</el-button>
            </el-col>
          </el-row>
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
      <!-- <span @click="handleAdd('brother')" :class="userInfo.isWife ? 'disabled' : ''">
        添加兄妹
      </span> -->
      <span @click="handleAdd('child')" :class="motherOptions.length > 0 ? '' : 'disabled'">
        添加子女
      </span>
    </div>
    <!-- <span slot="footer">
      <el-button class="ma-md" @click="cancel">取消</el-button>
      <el-button class="ma-md" type="primary" @click="confirm">{{this.isManager ? '确认' : '提交审核'}}</el-button>
    </span> -->
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
    isManager () {
      return this.$store.getters.getToken.user_type === '3'
    },
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
    },
    // childDisabled () {
    //   let res = false
    //   let spouseNum = 0
    //   this.tableData.forEach(item => {
    //     if (item.relation === 'spouse') {
    //       spouseNum++
    //     }
    //   })
    //   if (this.motherOptions.length === 0 && spouseNum === 0) {
    //     res = true
    //   }
    //   if (this.motherOptions.length === 0 && spouseNum > 1) {
    //     res = true
    //   }
    //   return res
    // }
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
      val.saved = true
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
      if (type === 'spouse' && this.spouseDisabled) {
        return
      }
      if (type === 'child' && this.motherOptions.length === 0) {
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
        marry_time: '',
        saved: false
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
          obj.character_name = this.userInfo.nextCharacterName
          obj.mother_id = this.motherOptions.length > 0 ? this.motherOptions[0].value : ''
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
    validate(row) {
      let flag = true
      if (!row.surname || !row.sex) {
        flag = false
      }
      if (row.relation === 'child' && row.mother_id === '') {
        flag = false
      }
      !flag && this.handleTip(row)

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
      
      if(obj.brith_time && obj.marry_time) {
        if (new Date(obj.brith_time).getTime() > new Date(obj.marry_time).getTime()){
          this.$message.error('结婚日期不能先于出生日期')
          return
        }
      }

      if(obj.death_time && obj.marry_time) {
        if (new Date(obj.marry_time).getTime() > new Date(obj.death_time).getTime()){
          this.$message.error('死亡日期不能先于出生日期')
          return
        }
      }

      if (!obj.sex) {
        this.$message.error('性别不能为空')
        return
      }
      if (!obj.mother_id && obj.relation === 'child') {
        this.$message.error('请选择母亲')
        return
      }
    },
    handleSaveRow (row) {
      if (this.validate(row)) {
        let params = {}
        params.user = {
          user_id: this.userInfo.user_id
        }
        params.father = {}
        params.mother = {}
        params.wife = []
        params.brother = []
        params.boy = []
        switch (row.relation) {
          case 'father':
            params.father = row
            this.tableData.forEach(v => {
              if (v.relation === 'mother') {
                params.mother = v
              }
            })
            break
          case 'mother':
            params.mother = row
            break
          case 'spouse':
            params.wife.push(row)
            break
          case 'brother':
            params.brother.push(row)
            break
          case 'child':
            params.boy.push(row)
            break
        }
        Family.familyAddUser(params).then(res => {
          if (res.code === '000000') {
            row.saved = true
            this.tableData.forEach(v => {
              if (v.relation === 'mother') {
                this.$set(v, 'saved', true)
              }
            })
            this.getMotherOptions()
            // this.reset()
            this.$emit('success')
            this.$forceUpdate()
          } else {
            this.$message.error(res.message)
          }
        })
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
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (row.relation === 'father' && columnIndex === 9 && !row.saved) {
        return {
          rowspan: 2,
          colspan: 1
        }
      }
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
  cursor: not-allowed!important;
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

.save-btn {
      background-color: #57D092;
      color: #fff;
      border: none;
    }
</style>

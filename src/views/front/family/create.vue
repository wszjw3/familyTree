<template>
  <div class="family-create-view">
    <statistics />
    <div class="container">
      <div class="title">
        创建新家谱：
        <span class="desc">
          将根据家庭地址自动生成家谱名称，请准确填写至城镇（农业户口填写至村）
        </span>
        <img class="close-icon" :src="closePng" @click="cancel"/>
      </div>
      <div class="content">
        <div class="header">
          <div class="location">
            <span class="required">*</span>
            所在地：
            <city-picker v-model="location" placeholder="请选择省市区"/>
          </div>
          <div class="tree-address">
            <span class="required">*</span>
            家谱树地址：
            <el-input class="input" v-model="family_tree_address" placeholder="请输入"/>
          </div>
        </div>
        <div class="body">
          <el-table
            :data="tableData"
            style="width: 100%; overflow: auto"
          >
            <el-table-column
              align="center"
              prop="relation_desc"
              min-width="50"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="firstname"
              min-width="90"
            >
              <template slot="header">
                <span class="required">* </span>
                姓
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.surname"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="surname"
              min-width="90"
            >
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
                <el-input v-model="scope.row.character_name" :disabled="scope.row.relation === 'mother' || scope.row.relation === 'grandmother'"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="sex"
              min-width="120"
            >
              <template slot="header">
                <span class="required">* </span>
                性别
              </template>
              <template slot-scope="scope">
                <el-select v-model="scope.row.sex" placeholder="请选择" :disabled="scope.row.relation_desc !== '孩子'" >
                  <el-option
                    v-for="item in sexOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="be_alive"
              min-width="150"
            >
              <template slot="header">
                是否在世
              </template>
              <template slot-scope="scope">
                  <el-radio v-model="scope.row.be_alive" label="1">是</el-radio>
                  <el-radio v-model="scope.row.be_alive" label="2">否</el-radio>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="brith_time"
              min-width="150"
            >
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
                    :picker-options="pickerOptions[scope.row.relation].brith_time"
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
                    :picker-options="pickerOptions[scope.row.relation].death_time"
                  >
                  </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="address"
              min-width="200"
            >
              <template slot="header">
                地址
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
                    @change="value => { handleChangeMarryTime(value, scope.row) }"
                  >
                  </el-date-picker>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="footer">
          <el-button class="cancel" @click="cancel">取消</el-button>
          <el-button class="confirm" type="primary" @click="handleSave">确认添加</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import closePng from '@/assets/imgs/close.png'
import CityPicker from '@/components/city-picker/index.vue'
import { Family } from '@/api'

export default {
  name: 'FamilyCreate',
  components: {
    CityPicker
  },
  data () {
    return {
      closePng,
      location: [],
      family_tree_address: '',
      tableData: [
        {
          relation: 'grandfather',
          relation_desc: '祖父',
          surname: '',
          character_name: '',
          fame: '',
          sex: '1',
          be_alive: '',
          brith_time: '',
          death_time: '',
          address: '',
          marry_time: '',
          family_name: ''
        },
        {
          relation: 'grandmother',
          relation_desc: '祖母',
          surname: '',
          character_name: '',
          fame: '',
          sex: '2',
          be_alive: '',
          brith_time: '',
          death_time: '',
          address: '',
          marry_time: '',
          family_name: ''
        },
        {
          relation: 'father',
          relation_desc: '父亲',
          surname: '',
          character_name: '',
          fame: '',
          sex: '1',
          be_alive: '',
          brith_time: '',
          death_time: '',
          address: '',
          marry_time: '',
          family_name: ''
        },
        {
          relation: 'mother',
          relation_desc: '母亲',
          surname: '',
          character_name: '',
          fame: '',
          sex: '2',
          be_alive: '',
          brith_time: '',
          death_time: '',
          address: '',
          marry_time: '',
          family_name: ''
        },
        {
          relation: 'boy',
          relation_desc: '孩子',
          surname: '',
          character_name: '',
          fame: '',
          sex: '',
          be_alive: '',
          brith_time: '',
          death_time: '',
          address: '',
          marry_time: '',
          family_name: ''
        }
      ]
    }
  },
  computed: {
    sexOptions () {
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
    pickerOptions () {
      return {
        grandfather: {
          brith_time: {
            disabledDate: time => {
              if (this.tableData[0].death_time != '') {
                  return time.getTime() > this.tableData[0].death_time
              }
            }
          },
          death_time: {
            disabledDate:  time => {
              if (this.tableData[0].brith_time != '') {
                  return time.getTime() < this.tableData[0].brith_time
              }
            }
          }
        },
        grandmother: {
          brith_time: {
            disabledDate: time => {
              if (this.tableData[1].death_time != '') {
                  return time.getTime() > this.tableData[1].death_time
              }
            }
          },
          death_time: {
            disabledDate:  time => {
              if (this.tableData[1].brith_time != '') {
                  return time.getTime() < this.tableData[1].brith_time
              }
            }
          }
        },
        father: {
          brith_time: {
            disabledDate: time => {
              if (this.tableData[2].death_time != '') {
                  return time.getTime() > this.tableData[2].death_time
              }
            }
          },
          death_time: {
            disabledDate:  time => {
              if (this.tableData[2].brith_time != '') {
                  return time.getTime() < this.tableData[2].brith_time
              }
            }
          }
        },
        mother: {
          brith_time: {
            disabledDate: time => {
              if (this.tableData[3].death_time != '') {
                  return time.getTime() > this.tableData[3].death_time
              }
            }
          },
          death_time: {
            disabledDate:  time => {
              if (this.tableData[3].brith_time != '') {
                  return time.getTime() < this.tableData[3].brith_time
              }
            }
          }
        },
        boy: {
          brith_time: {
            disabledDate: time => {
              if (this.tableData[4].death_time != '') {
                  return time.getTime() > this.tableData[4].death_time
              }
            }
          },
          death_time: {
            disabledDate:  time => {
              if (this.tableData[4].brith_time != '') {
                  return time.getTime() < this.tableData[4].brith_time
              }
            }
          }
        }
      }
    },
    userInfo () {
      return this.$store.getters.getToken
    }
  },
  methods: {
    handleChangeMarryTime (value, row) {
      if (row.relation === 'father') {
        this.tableData[3].marry_time = value
      }
      if (row.relation === 'grandfather') {
        this.tableData[1].marry_time = value
      }
    },
    cancel () {
      this.$router.back(-1)
    },
    handleSave () {
      if (this.validate()) {
        let params = {}
        params.user_id = this.userInfo.user_id
        params.create_user = this.userInfo.user_name
        params.manage_phone = this.userInfo.phone
        params.prov_code = this.location[0]
        params.city_code = this.location[1]
        params.area_code = this.location[2]
        params.family_tree_address = this.family_tree_address
        this.tableData.forEach(item => {
          params[item.relation] = {}
          for (let key in item) {
            params[item.relation][key] = item[key]
          }
          delete params[item.relation].relation
          delete params[item.relation].relation_desc
        })
        Family.familyCreate(params).then(res => {
          if (res.code === '000000') {
            this.$message('保存成功，即将跳转至详情页。。。')
            this.$store.dispatch('createSuccess')
            setTimeout(() => {
              this.$router.push({
                path: '/family/detail',
                query: {
                  familyId: res.data.family_id
                }
              })
            }, 1000)
          } else {
            this.$message.error(res.message)
            return
          }
        })
      }
    },
    validate () {
      let flag = true
      if (this.location.length === 0) {
        flag = false
        this.$message.error('所在地不能为空')
        return flag
      }
      if (this.family_tree_address === '') {
        flag = false
        this.$message.error('地址不能为空')
        return flag
      }
      try {
        this.tableData.forEach(item => {
          if (item.relation !== 'boy') {
            if (item.surname === '') {
              this.$message.error(item.relation_desc + '姓不能为空')
              flag = false
              throw new Error('抛出异常跳出')
            }
            if (item.fame === '') {
              this.$message.error(item.relation_desc + '名不能为空')
              flag = false
              throw new Error('抛出异常跳出')
            }
            if (item.sex === '') {
              this.$message.error(item.relation_desc + '性别不能为空')
              flag = false
              throw new Error('抛出异常跳出')
            }
          }
        })
      } catch(e) {
        console.log(e)
      }
      
      return flag
    }
  }

}
</script>

<style lang="less" scoped>
.family-create-view {
  background-color: rgba(242, 242, 242, 1);

  .container {
    padding: 10px;
    margin: 100px 50px;
    background-color: #ffffff;

    .title {
      position: relative;
      font-size: 18px;
      padding: 10px 0 20px 0;
      border-bottom: 1px solid #ddd;
      .desc {
        font-size: 20px
      }
      .close-icon {
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
        width: 21px;
        height: 21px;
      }
    }

    .content {
      .header {
        margin: 30px 0;

        .location,
        .tree-address {
          display: inline-block
        }

        .tree-address {
          margin-left: 100px;
          .input {
            display: inline-block;
            width: 220px
          }
        }
      }
      .footer {
        padding: 50px;
        text-align: center;

        .cancel,
        .confirm {
          margin: 0 20px;
          width: 140px;
        }
      }
    }

  }

  .required {
    color: red
  }
}

</style>

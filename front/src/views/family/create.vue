<template>
  <div class="family-create-view">
    <!-- <statistics /> -->
    <div class="container">
      <div class="create-header">
        <div class="title">
          创建新家谱
        </div>
        <div class="desc">
          家谱树的创建由爸爸，妈妈和孩子组成，更多家族成员可去家谱详情页面添加
        </div>

        <div class="location">
          <p>
            <span style="color: red">*</span>
            家谱树所在区域：
          </p>

          <city-picker
            class="input"
            v-model="location"
            placeholder="请选择省市区"
          />
        </div>
        <div class="tree-address">
          <p>
            <span style="color: red">*</span>
            家谱名称：
          </p>

          <el-input
            class="input"
            v-model="family_tree_address"
            placeholder="请输入"
          />
        </div>
      </div>
      <div class="content">
        <el-table :data="tableData">
          <el-table-column label="" prop="relation_desc" width="60"></el-table-column>
          <el-table-column width="100">
            <template slot="header">
              <span style="color: red">*</span>
              姓
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.surname"></el-input>
            </template>  
          </el-table-column>
          <el-table-column label="名" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fame"></el-input>
            </template> 
          </el-table-column>
          <el-table-column label="字辈" width="100">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.character_name"
                :disabled="scope.row.relation === 'mother' || scope.row.relation === 'grandmother'"
              />
            </template> 
          </el-table-column>
          <el-table-column width="120">
            <template slot="header">
              <span style="color: red">*</span>
              性别
            </template>
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.sex"
                placeholder="请选择"
                :disabled="scope.row.relation_desc !== '孩子'"
              >
                <el-option
                  v-for="sex in sexOptions"
                  :key="sex.value"
                  :label="sex.label"
                  :value="sex.value"
                >
                </el-option>
              </el-select>
            </template> 
          </el-table-column>
          <el-table-column label="出生日期">
            <template slot-scope="scope">
              <el-date-picker
                style="width: 90%"
                v-model="scope.row.brith_time"
                type="date"
                editable
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              />
            </template> 
          </el-table-column>
          <el-table-column label="结婚时间">
            <template slot-scope="scope">
              <el-date-picker
                style="width: 90%"
                v-model="scope.row.marry_time"
                type="date"
                editable
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                @change="
                  (value) => {
                    handleChangeMarryTime(value, scope.row)
                  }
                "
              />
            </template> 
          </el-table-column>
          <el-table-column label="死亡日期">
            <template slot-scope="scope">
              <el-date-picker
                style="width: 90%"
                v-model="scope.row.death_time"
                type="date"
                editable
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              />
            </template> 
          </el-table-column>
        </el-table>
        <div class="footer">
          <el-button class="cancel" @click="cancel">取消</el-button>
          <el-button class="confirm" type="primary" @click="handleSave"
            >确认添加</el-button
          >
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
    CityPicker,
  },
  data() {
    return {
      closePng,
      location: [],
      family_tree_address: '',
      tableData: [
        // {
        //   relation: 'grandfather',
        //   relation_desc: '祖父',
        //   surname: '',
        //   character_name: '',
        //   fame: '',
        //   sex: '1',
        //   // be_alive: '',
        //   brith_time: '',
        //   death_time: '',
        //   address: '',
        //   marry_time: '',
        //   family_name: '',
        // },
        // {
        //   relation: 'grandmother',
        //   relation_desc: '祖母',
        //   surname: '',
        //   character_name: '',
        //   fame: '',
        //   sex: '2',
        //   // be_alive: '',
        //   brith_time: '',
        //   death_time: '',
        //   address: '',
        //   marry_time: '',
        //   family_name: '',
        // },
        {
          relation: 'father',
          relation_desc: '父亲',
          surname: '',
          character_name: '',
          fame: '',
          sex: '1',
          // be_alive: '',
          brith_time: '',
          death_time: '',
          address: '',
          marry_time: '',
          family_name: '',
        },
        {
          relation: 'mother',
          relation_desc: '母亲',
          surname: '',
          character_name: '',
          fame: '',
          sex: '2',
          // be_alive: '',
          brith_time: '',
          death_time: '',
          address: '',
          marry_time: '',
          family_name: '',
        },
        {
          relation: 'boy',
          relation_desc: '孩子',
          surname: '',
          character_name: '',
          fame: '',
          sex: '',
          // be_alive: '',
          brith_time: '',
          death_time: '',
          address: '',
          marry_time: '',
          family_name: '',
        },
      ],
    }
  },
  computed: {
    sexOptions() {
      return [
        {
          label: '男',
          value: '1',
        },
        {
          label: '女',
          value: '2',
        },
      ]
    },
    userInfo() {
      return this.$store.getters.getToken
    },
  },
  methods: {
    handleChangeMarryTime(value, row) {
      if (row.relation === 'father') {
        this.tableData[1].marry_time = value
      }
      if (row.relation === 'mother') {
        this.tableData[0].marry_time = value
      }
    },
    cancel() {
      this.$router.back(-1)
    },
    handleSave() {
      if (this.validate()) {
        let params = {}
        params.user_id = this.userInfo.user_id
        params.create_user = this.userInfo.user_name
        params.manage_phone = this.userInfo.phone
        params.prov_code = this.location[0]
        params.city_code = this.location[1]
        params.area_code = this.location[2]
        params.family_tree_address = this.family_tree_address
        this.tableData.forEach((item) => {
          params[item.relation] = {}
          for (let key in item) {
            params[item.relation][key] = item[key]
          }
          delete params[item.relation].relation
          delete params[item.relation].relation_desc
        })
        Family.familyCreate(params).then((res) => {
          if (res.code === '000000') {
            this.$message('保存成功，即将跳转至详情页。。。')
            this.$store.dispatch('createSuccess')
            setTimeout(() => {
              this.$router.push({
                path: '/family/detail',
                query: {
                  familyId: res.data.family_id,
                },
              })
            }, 1000)
          } else {
            this.$message.error(res.message)
            return
          }
        })
      }
    },
    validate() {
      let flag = true
      if (this.location.length === 0) {
        flag = false
        this.$message.error('所在地不能为空')
        return flag
      }
      if (this.family_tree_address === '') {
        flag = false
        this.$message.error('家庭住址不能为空')
        return flag
      }
      try {
        this.tableData.forEach((item) => {
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
      } catch (e) {
        console.log(e)
      }

      return flag
    },
  },
}
</script>

<style lang="less" scoped>
.family-create-view {
  width: 1163px;
  .container {
    margin: 0 auto;
    padding: 20px 36px;
    background-color: #ffffff;

    .create-header {
      padding-bottom: 30px;
      border-bottom: 1px solid rgba(232, 235, 238, 1);
      .title {
        position: relative;
        font-size: 18px;
        font-weight: 600;
        // border: 1px dashed #333333;
        display: inline-block;
      }
      .desc {
        font-size: 14px;
        color: rgba(52, 73, 94, 1);
        line-height: 20px;
      }

      .location,
      .tree-address {
        margin-top: 11px;
        display: inline-block;

        p {
          font-size: 14px;
          font-weight: 600;
          color: rgba(52, 73, 94, 1);
          line-height: 20px;
        }

        .input {
          display: inline-block;
          width: 420px;
          height: 44px;
          background: rgba(252, 252, 254, 1);
        }
      }

      .tree-address {
        margin-left: 100px;
      }
    }

    .content {
      .column {
        padding: 20px 0;
      }
      .relation-desc{
        height:25px;
        font-size:18px;
        font-weight:600;
        color:rgba(52,73,94,1);
        line-height:25px;
      }
      .label {
        height:20px;
        font-size:14px;
        font-weight:600;
        color:rgba(52,73,94,1);
        line-height:20px;
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
    color: red;
  }
  .full-width {
    width: 100%;
  }
}
</style>

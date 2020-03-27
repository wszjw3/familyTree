<template>
  <div>
    <div class="banner">
      已收录全国共
      <span class="num">3000</span>
      棵家谱树，总计
      <span class="num">1111111</span>
      人
      <span class="normal">
        该地区还有6棵孔氏家族谱，
        <a>点击查看</a>
      </span>
    </div>
    <el-row>
      <el-col :span="18">
        <p>首页 > {{title}}</p>
        <family-tree :data="treeData" @onView="handleViewNode" @onEdit="handleEditNode" @onAdd="handleAddNode"></family-tree>
      </el-col>
      <el-col :span="6">
        <p>
          捐献记录
          <el-button type="success" size="small">捐赠</el-button>
          <el-button type="primary" size="small">导出家谱树</el-button>
          <el-button type="primary" size="small">分享</el-button>
        </p>
        <div v-if="!isShowNodeDetail">
          <h2 class="familytree-info-title">家谱树信息</h2>
          <div
            v-for="(item, idx) in familytreeInfo"
            :key="'familytreeInfo_' + idx"
            class="familytree-item"
          >
            <span>{{item.label + '： '}}</span>
            <span>{{item.name}}</span>
          </div>
        </div>
        <life-info v-else :info="nodeDetail" />
      </el-col>
    </el-row>
    <el-dialog
      title="成员信息变更："
      :visible.sync="show.editModal"
      width="60%"
    >
      <el-table
        :data="editData"
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
          prop="born_time"
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
          prop="born_time"
          min-width="150"
        >
          <template slot="header">
            出生日期
          </template>
          <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.born_time"
                type="date"
                style="width: 140px"
                placeholder="选择日期"
                :picker-options="pickerOptions[scope.row.relation].born_time"
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
              >
              </el-date-picker>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelEdit">取消</el-button>
        <el-button type="primary" @click="handleConfirmEdit">申请修改</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加家谱树成员"
      :visible.sync="show.addModal"
      width="60%"
    >
      <el-table
        class="add-table"
        :data="addData"
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
          prop="born_time"
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
          prop="born_time"
          min-width="150"
        >
          <template slot="header">
            出生日期
          </template>
          <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.born_time"
                type="date"
                style="width: 140px"
                placeholder="选择日期"
                :picker-options="pickerOptions[scope.row.relation].born_time"
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
              >
              </el-date-picker>
          </template>
        </el-table-column>
      </el-table>
      <div class="operation">
        <span @click="handleAdd('father')">
          添加父亲
        </span>
        <span @click="handleAdd('mother')">
          添加母亲
        </span>
        <span @click="handleAdd('spouse')">
          添加配偶
        </span>
        <span @click="handleAdd('brother')">
          添加兄妹
        </span>
        <span @click="handleAdd('child')">
          添加子女
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelAdd">取消</el-button>
        <el-button type="primary" @click="handleConfirmAdd">提交审核</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FamilyTree from '@/components/familytree/index'
import { Family } from '@/api'
import lifeInfo from './cmp/lifeInfo'
export default {
  name: 'Detail',
  components: {
    FamilyTree,
    lifeInfo
  },
  data() {
    return {
      treeData: [],
      familytreeInfo: [
        {
          label: '家谱名称',
          name: ''
        },
        {
          label: '创建日期',
          name: ''
        },
        {
          label: '代数',
          name: ''
        },
        {
          label: '激活人数/总人数',
          name: ''
        },
        {
          label: '始祖',
          name: ''
        },
        {
          label: '当前管理员/手机号',
          name: ''
        },
        {
          label: '历史管理员',
          name: ''
        },
        {
          label: '剩余修谱金额',
          name: ''
        }
      ],
      isShowNodeDetail: false,
      nodeDetail: {},
      show: {
        editModal: false,
        addModal: false
      },
      editData: [],
      AddData: [],
    }
  },
  computed: {
    title() {
      return this.familytreeInfo.length > 0 ? this.familytreeInfo[0].name : ''
    }
  },
  created() {
    this.getFamilyInfo()
    this.getTreeData()
  },
  methods: {
    getFamilyInfo() {
      Family.familyInfo({ user_id: '1003' }).then(res => {
        if (!res.data) {
          return
        }
        this.familytreeInfo = [
          {
            label: '家谱名称',
            name: res.data.family_name
          },
          {
            label: '创建日期',
            name: res.data.create_time
          },
          {
            label: '代数',
            name: res.data.level
          },
          {
            label: '激活人数/总人数',
            name: res.data.claim + '/' + res.data.total
          },
          {
            label: '始祖',
            name: res.data.ancestor
          },
          {
            label: '当前管理员/手机号',
            name: res.data.manage_name + '/' + res.data.manage_phone
          },
          {
            label: '历史管理员',
            name: res.data.his_manage_name
          },
          {
            label: '剩余修谱金额',
            name: res.data.balance_amt
          }
        ]
      })
    },
    getTreeData() {
      let id = 0
      Family.familyquery({ user_id: '1003' }).then(res => {
        if (!res.data) {
          return
        }
        let result = []
        res.data.forEach(item => {
          let obj = {}
          obj.level = item.character
          obj.children = []

          item.collection.forEach(c => {
            if (c.wife && c.wife.length && c.wife.length > 0) {
              c.wife.forEach((w, wi) => {
                let childrenObj = {
                  id: id,
                  current: []
                }
                if (wi === 0) {
                  if (c.landlord.mother_id) {
                    childrenObj.parent = ''
                  }
                  childrenObj.current.push(c.landlord)
                  childrenObj.current.push(w)
                } else {
                  childrenObj.current.push(w)
                }
                obj.children.push(childrenObj)
                id++
              })
            } else {
              let childrenObj = {
                id: id
              }
              if (c.landlord.mother_id) {
                childrenObj.parent = ''
              }
              childrenObj.current = []
              childrenObj.current.push(c.landlord)
              obj.children.push(childrenObj)
              id++
            }
          })

          result.push(obj)
        })
        let children = []
        result.forEach(r => {
          r.children.forEach(child => {
            if (child.parent === '') {
              children.push(child)
            }
          })
        })
        children.forEach(child => {
          child.current.forEach(cur => {
            if (cur.mother_id) {
              result.forEach(res => {
                res.children.forEach(child2 => {
                  child2.current.forEach(cur2 => {
                    if (cur2.user_id === Number(cur.mother_id)) {
                      child.parent = child2.id
                    }
                  })
                })
              })
            }
          })
        })
        console.log(result)
        this.treeData = result
      })
    },
    handleViewNode (prop) {
      const user_id = prop.user_id
      Family.familyNodeView({user_id: user_id}).then(res => {
        if (res.code !== '000000') {
          this.$alert(res.message)
          return
        }
        this.isShowNodeDetail = true
        this.nodeDetail = res.data
      })
    },
    handleEditNode (prop) {
      this.show.editModal = true
    },
    handleAddNode (prop) {
      this.show.addModal = true
    },
    handleCancelEdit () {},
    handelConfirmEdit () {},
    handleCancelAdd () {},
    handelConfirmAdd () {},
    handleAdd(type) {}
  }
}
</script>

<style lang="less" scoped>
.banner {
  padding: 20px 80px;
  background-color: #000;
  color: #fff;
  font-size: 24px;
  font-weight: 600;

  .num {
    font-size: 32px;
    color: #7fbc5d;
  }

  .normal {
    font-size: 14px;
    margin-left: 20px;
  }
}
.familytree-info-title {
  border-left: 3px solid red;
  padding: 5px;
}
.familytree-item {
  padding: 5px 0;
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
    cursor: pointer
  }
}

</style>

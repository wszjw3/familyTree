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
        <p>首页 > {{ title }}</p>
        <family-tree
          :data="treeData"
          @onView="handleViewNode"
          @onEdit="handleEditNode"
          @onAdd="handleAddNode"
          @onClaim="handleClaim"
        ></family-tree>
      </el-col>
      <el-col :span="6" class="family-info">
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
            <span>{{ item.label + '： ' }}</span>
            <span>{{ item.name }}</span>
          </div>
        </div>
        <life-info v-else :info="nodeDetail" />
      </el-col>
    </el-row>
    <edit-modal v-model="show.editModal" :userInfo="currentUser" />
    <add-modal v-model="show.addModal" :userInfo="currentUser" />
    <claim-modal v-model="show.claimModal" :userInfo="currentUser" />
  </div>
</template>

<script>
import FamilyTree from '@/components/familytree/index'
import { Family } from '@/api'
import lifeInfo from './cmp/lifeInfo'
import EditModal from './cmp/modal/edit'
import AddModal from './cmp/modal/add'
import ClaimModal from './cmp/modal/claim'
export default {
  name: 'Detail',
  components: {
    FamilyTree,
    lifeInfo,
    EditModal,
    AddModal,
    ClaimModal
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
      currentUser: {}
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
    handleViewNode(prop) {
      const user_id = prop.user_id
      Family.familyNodeView({ user_id: user_id }).then(res => {
        if (res.code !== '000000') {
          this.$alert(res.message)
          return
        }
        this.isShowNodeDetail = true
        this.nodeDetail = Object.assign({}, res.data, {user_id: user_id})
      })
    },
    handleEditNode(prop) {
      this.show.editModal = true
      this.getCurrentUser(prop)
    },
    handleAddNode(prop) {
      this.show.addModal = true
      this.getCurrentUser(prop)
    },
    handleClaim (prop, userType) {
      if (userType === '1') {
        this.$router.push('/login')
        return
      }
      this.show.claimModal = true
      this.getCurrentUser(prop)
    },
    getCurrentUser(prop) {
      Family.familyQueryUser({ user_id: prop.user_id }).then(res => {
        if (res.data) {
          this.currentUser = Object.assign({}, res.data, {
            mother_id: prop.mother_id
          })
        } else {
          this.$message.error(res.message)
        }
      })
    }
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

.required {
  color: red;
}
.family-info {
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>

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
      <el-col :span="16">
        <p>
          首页 > {{title}}
        </p>
        <family-tree :data="treeData"></family-tree>
      </el-col>
      <el-col :span="8">
        <p>
          捐献记录
          <el-button type="success" size="small">捐赠</el-button>
          <el-button type="primary" size="small">导出家谱树</el-button>
          <el-button type="primary" size="small">分享</el-button>
        </p>
        <h2 class="familytree-info-title">
          家谱树信息
        </h2>
        <div
          v-for="(item, idx) in familytreeInfo"
          :key="'familytreeInfo_' + idx"
          class="familytree-item"
        >
          <span>
            {{item.label + '： '}}
          </span>
          <span>
            {{item.name}}
          </span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import FamilyTree from '@/components/familytree/index'
import {
  Family
} from '@/api'
export default {
  name: 'Detail',
  components: {
    FamilyTree
  },
  data () {
    return {
      treeData: []
    }
  },
  computed: {
    title () {
      return '【孔】回山井塘孔氏'
    },
    familytreeInfo () {
      return [
        {
          label: '家谱名称',
          name: '[孔]回山井塘孔氏'
        },
        {
          label: '家谱名称',
          name: '[孔]回山井塘孔氏'
        },
        {
          label: '家谱名称',
          name: '[孔]回山井塘孔氏'
        },
        {
          label: '家谱名称',
          name: '[孔]回山井塘孔氏'
        },
        {
          label: '家谱名称',
          name: '[孔]回山井塘孔氏'
        }
      ]
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    getTreeData () {
      let id = 0
      Family.familyquery({user_id: '2'}).then(res => {
        let result = []
        res.data.forEach(item => {
          let obj = {}
          obj.level = item.character
          obj.children = []

          item.collection.forEach((c) => {
            if ( c.wife && c.wife.length && c.wife.length > 0 ) {
              c.wife.forEach((w, wi) => {
                let childrenObj = {
                  id: id,
                  current: []
                }
                if ( wi === 0 ) {
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
                    if (cur2.user_id === cur.mother_id) {
                      child.parent = child2.id
                    }
                  })
                })
              })
            }
          })
        })
        this.treeData = result
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
    color: #7FBC5D
  }

  .normal {
    font-size: 14px;
    margin-left: 20px
  }
}
.familytree-info-title {
  border-left: 3px solid red;
  padding: 5px;
}
.familytree-item {
  padding: 5px 0;
}
</style>

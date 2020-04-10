<template>
	<div>
    <statistics :detail="statistics"/>

		<el-row class="mt-lg">
			<el-col :span="18" style="position: relative">
				<el-breadcrumb class="header" separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="export"> 
          <p class="text-bold">{{title}}</p>
          <div class="desc">
            <div>
              ——&nbsp;&nbsp;&nbsp;&nbsp;健在
            </div>
            <div>
              ------&nbsp;&nbsp;&nbsp;&nbsp;已故
            </div>
            <div class="items-center">
              <img :src="sexImg" class="sex-img" />
              女儿
            </div>
            <div class="items-center" style="margin-top: -10px">
              <span class="required">*</span>
              已认领
            </div>
          </div>
          <family-tree
            :data="treeData"
            @onView="handleViewNode"
            @onEdit="handleEditNode"
            @onAdd="handleAddNode"
            @onClaim="handleClaim"
          ></family-tree>
        </div>
        
			</el-col>
			<el-col :span="6" class="family-info">
				<p>
					<el-button class="btn" size="small" @click="handleDonateHistroy"
						>捐献记录</el-button
					>
					<el-button class="btn" type="success" size="small" @click="handleDonate"
						>捐赠</el-button
					>
          <el-button class="btn" v-if="$router.currentRoute.query.from === 'manage'" type="success" size="small" @click="handleTransfor"
						>管理员转让</el-button
					>
					<el-button class="btn" type="primary" size="small" @click="exportToPDF">导出家谱树</el-button>
					<el-button class="btn" type="primary" size="small" @click="handleShare"
						>分享</el-button
					>
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
				<life-info v-else :info="nodeDetail" @success="handleLifeinfoSaved"/>
			</el-col>
		</el-row>
		<edit-modal v-model="show.editModal" :userInfo="currentUser" />
		<add-modal v-model="show.addModal" :userInfo="currentUser" />
		<claim-modal v-model="show.claimModal" :userInfo="currentUser" />
		<donate-modal v-model="show.donateModal" />
		<transfor-modal v-if="userType === '3'" v-model="show.transforModal" :info="treeInfo"/>
		<donate-histroy-modal v-model="show.donateHistroyModal" :info="treeInfo"/>
    <input class="hidden" id="hidden" type="text" v-model="href">
	</div>
</template>

<script>
import * as jsPDF from 'jspdf'
import FamilyTree from '@/components/familytree/index'
import { Family } from '@/api'
import lifeInfo from './cmp/lifeInfo'
import EditModal from './cmp/modal/edit'
import AddModal from './cmp/modal/add'
import ClaimModal from './cmp/modal/claim'
import DonateModal from './cmp/modal/donate'
import TransforModal from './cmp/modal/transfor'
import DonateHistroyModal from './cmp/modal/histroy'
import sexImg from '@/assets/imgs/sex.png'
export default {
  name: 'Detail',
  components: {
    FamilyTree,
    lifeInfo,
    EditModal,
    AddModal,
    ClaimModal,
    DonateModal,
    TransforModal,
    DonateHistroyModal
  },
  data() {
    return {
      sexImg,
      treeData: [],
      treeInfo: {},
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
        addModal: false,
        claimModal: false,
        donateModal: false,
        transforModal: false,
        donateHistroyModal: false
      },
      currentUser: {},
      currentNodeUser: '',
      href: window.location.href.split('&')[0],
      statistics: {
        isShow: true,
        count: 0,
        surname: '',
        areaCode: '',
        areaName: '',
        people: 0
      }
    }
  },
  computed: {
    title() {
      return this.familytreeInfo.length > 0 ? this.familytreeInfo[0].name : ''
    },
    userInfo () {
      return this.$store.getters.getToken
    },
    userType () {
      return this.userInfo.user_type
    }
  },
  mounted() {
    this.$router.currentRoute.query && this.$router.currentRoute.query.familyId && this.getFamilyInfo(this.$router.currentRoute.query.familyId)
    this.getTreeData()
    this.queryUserTree()
  },
  methods: {
    queryUserTree () {
      Family.queryUserTree({tree_user_id: this.userInfo.tree_user_id}).then(res => {
        this.statistics.count = res.data.countTree
        this.statistics.surname = res.data.surname
        this.statistics.area_code = res.data.area_code
        this.statistics.areaName = res.data.areaName
        this.statistics.people = res.data.people
        this.statistics.prov_code = res.data.prov_code
        this.statistics.city_code = res.data.city_code
      })
    },
    getFamilyInfo(familyId) {
      let params = {
        family_id: familyId
      }
      Family.familyInfo(params).then(res => {
        if (!res.data) {
          return
        }
        this.treeInfo = res.data
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
      let params = {}
      if (this.$router.currentRoute.query && this.$router.currentRoute.query.familyId) {
        params.family_id = this.$router.currentRoute.query.familyId
        params.isMyTree = false
      } else {
        params.tree_user_id = this.userInfo.tree_user_id
        params.isMyTree = true
      }
      Family.familyTreeQuery(params).then(res => {
        if (!res.data) {
          return
        }
        if (!this.$router.currentRoute.query.familyId) {
          this.getFamilyInfo(res.data[0].family_id)
        }
        let result = []
        res.data.forEach(item => {
          let obj = {}
          obj.level = item.character
          obj.children = []

          item.collection.forEach(c => {
            if (c.wife && c.wife.length && c.wife.length > 0) {
              c.wife.forEach((w, wi) => {
                w.isWife = true
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
      this.currentNodeUser = prop.user_id
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
      if (userType === '0') {
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
            mother_id: prop.mother_id,
            isWife: prop.isWife
          })
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleDonate () {
      this.show.donateModal = true
    },
    handleDonateHistroy () {
      this.show.donateHistroyModal = true
    },
    handleShare () {
      if (!document.execCommand('copy')) {
          this.$alert('sorry, 手动复制吧')
      } else {
          let inputEle = document.getElementById('hidden')
          inputEle.select()
          document.execCommand('copy')
          this.$alert('网页链接已复制，快去粘贴分享')
      }
    },
    handleTransfor () {
      this.show.transforModal = true
      this.getFamilyInfo()
    },
    handleLifeinfoSaved () {
      this.handleViewNode({user_id: this.currentNodeUser})
    },
    exportToPDF () {
      html2canvas(
        document.getElementById('export')
        ).then(canvas => {
            var contentWidth = canvas.width
            var contentHeight = canvas.height

            //一页pdf显示html页面生成的canvas高度
            var pageHeight = contentWidth / 592.28 * 841.89
            //未生成pdf的html页面高度
            var leftHeight = contentHeight
            //pdf页面偏移
            var position = 0
            //html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）
            var imgWidth = 595.28
            var imgHeight = 592.28 / contentWidth * contentHeight

            var pageData = canvas.toDataURL('image/jpeg', 1.0)
            var pdf = new jsPDF('', 'pt', 'a4')

            //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
            //当内容未超过pdf一页显示的范围，无需分页
            if (leftHeight < pageHeight) {
                pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
            } else {
                while (leftHeight > 0) {
                    pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                    leftHeight -= pageHeight
                    position -= 841.89
                    //避免添加空白页
                    if (leftHeight > 0) {
                        pdf.addPage()
                    }
                }
            }
          const name = this.familytreeInfo[0].name
            pdf.save(name + '.pdf')
        })
      }
  }
}
</script>

<style lang="less" scoped>
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
.text-bold {
  font-weight: 600
}

.desc {
  display: inline-block;
  position: absolute;
  right: 20px;
  top: 20px;
  border: 1px solid #000;
  padding: 10px 10px 0 10px;
  .sex-img {
    width: 26px;
    height: 26px;
    margin-right: 14px;
  }
}
.required {
  color: red;
  font-size: 30px;
  margin: 0 18px 0 10px;
  display: inline-block;
  padding-top: 10px;
}
.items-center {
  display: flex;
  align-items: center;
}
.btn {
  margin: 5px;
}
.hidden {
  z-index: -1;
  position: fixed;
  top: 0;
  left: 0
}
.mt-lg {
  margin-top: 20px;
}
</style>

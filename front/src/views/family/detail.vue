<template>
	<div>
		<el-row :gutter="20" style="margin-bottom: 50px">
			<el-col :span="18" id="export">
				<div class="elcol">
					<div class="relative">
						<p class="title">{{ title }}</p>
						<div class="absolute-right">
							<span class="desc">
								<img src="@/assets/imgs/alive.png" />
								健在
							</span>
							<span class="desc">
								<img src="@/assets/imgs/dead.png" />
								已故
							</span>
							<span class="desc">
								<img src="@/assets/imgs/man.png" />
								男
							</span>
							<span class="desc">
								<img src="@/assets/imgs/girl.png" />
								女
							</span>
							<span class="desc">
								<img src="@/assets/imgs/claim.png" />
								已认领
							</span>
						</div>
					</div>

					<!-- <el-breadcrumb class="header" separator=">">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
          </el-breadcrumb> -->
					<div>
						<family-tree
							ref="tree"
							style="overflow: auto"
							:data="treeData"
							@onView="handleViewNode"
							@onEdit="handleEditNode"
							@onAdd="handleAddNode"
							@onClaim="handleClaim"
						></family-tree>
					</div>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="elcol">
					<div v-if="!isShowNodeDetail">
						<h2 class="familytree-info-title">家谱树信息</h2>
						<div
							v-for="(item, idx) in familytreeInfo"
							:key="'familytreeInfo_' + idx"
							class="familytree-item"
						>
							<span class="label">{{ item.label + '： ' }}</span>
							<span class="name">{{ item.name }}</span>
						</div>
					</div>
					<life-info v-else :info="nodeDetail" @success="handleLifeinfoSaved" />

					<p v-if="!isShowNodeDetail" class="no-margin">
						<el-button class="btn history" @click="handleDonateHistroy"
							>捐献记录</el-button
						>
						<el-button class="btn donate" @click="handleDonate">捐赠</el-button>
						<el-button
							class="btn transfor"
							v-if="$router.currentRoute.query.from === 'manage'"
							@click="handleTransfor"
							>管理员转让</el-button
						>
						<el-button class="btn export" @click="exportToPDF"
							>导出家谱树</el-button
						>
						<el-button class="btn share" @click="handleShare">分享</el-button>
					</p>
				</div>
			</el-col>
		</el-row>
		<edit-modal
			v-model="show.editModal"
			:userInfo="currentUser"
			@success="reload()"
		/>
		<add-modal
			v-model="show.addModal"
			:userInfo="currentUser"
			:surName="title.charAt(1, 1)"
			@success="reload()"
		/>
		<claim-modal
			v-model="show.claimModal"
			:userInfo="currentUser"
			@success="reload()"
		/>
		<donate-modal v-model="show.donateModal" :familyId="this.familyId" />
		<transfor-modal
			v-if="userType === '3'"
			v-model="show.transforModal"
			:info="treeInfo"
			:familyId="this.familyId"
		/>
		<donate-histroy-modal
			v-model="show.donateHistroyModal"
			:info="treeInfo"
			:familyId="this.familyId"
		/>
	</div>
</template>

<script>
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
		DonateHistroyModal,
	},
	data() {
		return {
			sexImg,
			treeData: [],
			treeInfo: {},
			familytreeInfo: [
				{
					label: '家谱名称',
					name: '',
				},
				{
					label: '创建日期',
					name: '',
				},
				{
					label: '代数',
					name: '',
				},
				{
					label: '激活人数/总人数',
					name: '',
				},
				{
					label: '始祖',
					name: '',
				},
				{
					label: '当前管理员/手机号',
					name: '',
				},
				{
					label: '历史管理员',
					name: '',
				},
				{
					label: '剩余修谱金额',
					name: '',
				},
			],
			isShowNodeDetail: false,
			nodeDetail: {},
			show: {
				editModal: false,
				addModal: false,
				claimModal: false,
				donateModal: false,
				transforModal: false,
				donateHistroyModal: false,
			},
			currentUser: {},
			currentNodeUser: '',
			statistics: {
				isShow: true,
				count: 0,
				surname: '',
				area_code: '',
				city_code: '',
				prov_code: '',
				city_name: '',
				area_name: '',
				prov_name: '',
				people: 0,
			},
			familyId: '',
		}
	},
	computed: {
		title() {
			return this.familytreeInfo.length > 0 ? this.familytreeInfo[0].name : ''
		},
		userInfo() {
			return this.$store.getters.getToken
		},
		userType() {
			return this.userInfo.user_type
		},
	},
	mounted() {
		this.$router.currentRoute.query &&
			this.$router.currentRoute.query.familyId &&
			this.getFamilyInfo(this.$router.currentRoute.query.familyId)
		this.getTreeData()
		this.queryUserTree()
	},
	methods: {
		queryUserTree() {
			Family.queryUserTree({
				family_id: this.familyId || this.$router.currentRoute.query.familyId,
			}).then((res) => {
				if (res.code === '000000' && res.data) {
					this.statistics.count = res.data.countTree
					this.statistics.surname = res.data.surname
					this.statistics.area_code = res.data.area_code
					this.statistics.area_name = res.data.area_name
					this.statistics.prov_name = res.data.prov_name
					this.statistics.city_name = res.data.city_name
					this.statistics.userCount = res.data.userCount
					this.statistics.prov_code = res.data.prov_code
					this.statistics.city_code = res.data.city_code
				}
			})
		},
		getFamilyInfo(familyId) {
			let params = {
				family_id: familyId,
			}
			Family.familyInfo(params).then((res) => {
				if (!res.data) {
					return
				}
				this.treeInfo = res.data
				this.familytreeInfo = [
					{
						label: '家谱名称',
						name: res.data.family_name,
					},
					{
						label: '创建日期',
						name: res.data.create_time,
					},
					{
						label: '代数',
						name: res.data.level,
					},
					{
						label: '激活人数/总人数',
						name: res.data.claim + '/' + res.data.total,
					},
					{
						label: '始祖',
						name: res.data.ancestor,
					},
					{
						label: '当前管理员/手机号',
						name: res.data.manage_name + '/' + res.data.manage_phone,
					},
					{
						label: '历史管理员',
						name: res.data.his_manage_name,
					},
					{
						label: '剩余修谱金额',
						name: res.data.balance_amt,
					},
				]
			})
		},
		getTreeData() {
			let id = 0
			let params = {}
			if (
				this.$router.currentRoute.query &&
				this.$router.currentRoute.query.familyId
			) {
				params.family_id = this.$router.currentRoute.query.familyId
				params.isMyTree = false
			} else {
				params.tree_user_id = this.userInfo.tree_user_id
				params.isMyTree = true
			}
			Family.familyTreeQuery(params).then((res) => {
				if (!res.data) {
					return
				}
				this.familyId = res.data[0].family_id
				this.$emit('loaded', res.data)
				if (!this.$router.currentRoute.query.familyId) {
					this.getFamilyInfo(res.data[0].family_id)
				}
				let result = []
				res.data.forEach((item) => {
					let obj = {}
					obj.level = item.character
					obj.children = []

					item.collection.forEach((c) => {
						let arr = []
						if (c.wife && c.wife.length && c.wife.length > 0) {
							c.wife.forEach((w, wi) => {
								w.isWife = true
								let childrenObj = {
									related: c.landlord.user_id,
									id: id,
									current: [],
								}
								if (c.landlord.mother_id) {
									childrenObj.parent = ''
								}
								if (wi === 0) {
									childrenObj.current.push(c.landlord)
									childrenObj.current.push(w)
								} else {
									childrenObj.current.push(w)
									childrenObj.husband = c.landlord.user_id
									childrenObj.related = c.landlord.user_id
								}
								// obj.children.push(childrenObj)
								arr.push(childrenObj)
								id++
							})
						} else {
							let childrenObj = {
								id: id,
							}
							if (c.landlord.mother_id) {
								childrenObj.parent = ''
							}
							childrenObj.current = []
							childrenObj.current.push(c.landlord)
							// obj.children.push(childrenObj)
							arr.push(childrenObj)
							id++
						}
						obj.children.push(arr)
					})

					result.push(obj)
				})
				let children = []
				result.forEach((r) => {
					r.children.forEach((child) => {
						child.forEach((c1) => {
							if (c1.parent === '') {
								children.push(child)
							}
						})
					})
				})
				children.forEach((child) => {
					child.forEach((c1) => {
						c1.current.forEach((cur) => {
							if (cur.mother_id) {
								result.forEach((res) => {
									res.children.forEach((child2) => {
										child2.forEach((c2Item) => {
											c2Item.current.forEach((cur2) => {
												if (Number(cur2.user_id) === Number(cur.mother_id)) {
													c1.parent = c2Item.id
												}
											})
										})
									})
								})
							}
						})
					})
				})
				console.log(result)
				this.treeData = result
			})
		},
		handleViewNode(prop) {
			this.currentNodeUser = prop.user_id
			const user_id = prop.user_id
			Family.familyNodeView({ user_id: user_id }).then((res) => {
				if (res.code !== '000000') {
					this.$alert(res.message)
					return
				}
				this.isShowNodeDetail = true
				this.nodeDetail = Object.assign({}, res.data, {
					user_id: user_id,
					sex: prop.sex,
				})
			})
		},
		handleEditNode(prop) {
			this.show.editModal = true
			this.getCurrentUser(prop)
		},
		handleAddNode(prop, nextCharacterName) {
			this.show.addModal = true
			this.getCurrentUser(prop, nextCharacterName)
		},
		handleClaim(prop, userType) {
			if (userType === '0') {
				this.$router.push('/login')
				return
			}
			this.show.claimModal = true
			this.getCurrentUser(prop)
		},
		getCurrentUser(prop, nextCharacterName) {
			Family.familyQueryUser({ user_id: prop.user_id }).then((res) => {
				if (res.data) {
					this.currentUser = Object.assign({}, res.data, {
						mother_id: prop.mother_id,
						isWife: prop.isWife,
						nextCharacterName: nextCharacterName,
					})
				} else {
					this.$message.error(res.message)
				}
			})
		},
		handleDonate() {
			this.show.donateModal = true
		},
		handleDonateHistroy() {
			this.show.donateHistroyModal = true
		},
		handleShare() {
			// if (!document.execCommand('copy')) {
			//   this.$alert('sorry, 手动复制吧')
			// } else {
			//   let inputEle = document.getElementById('hidden')
			//   inputEle.select()
			//   document.execCommand('copy')
			//   this.$alert('网页链接已复制，快去粘贴分享')
			// }
			const self = this
			navigator.clipboard.writeText(window.location.href.split('&')[0]).then(
				function() {
					self.$alert('网页链接已复制，快去粘贴分享')
				},
				function() {
					self.$alert('sorry, 手动复制吧')
				}
			)
		},
		handleTransfor() {
			this.show.transforModal = true
			this.getFamilyInfo()
		},
		handleLifeinfoSaved() {
			this.handleViewNode({ user_id: this.currentNodeUser })
		},
		exportToPDF() {
			window.open('#/export?familyId=' + this.$router.currentRoute.query.familyId)
		},
		reload() {
			this.$router.currentRoute.query &&
				this.$router.currentRoute.query.familyId &&
				this.getFamilyInfo(this.$router.currentRoute.query.familyId)
			this.getTreeData()
			this.queryUserTree()
			this.$refs.tree.interval()
		},
	},
}
</script>

<style lang="less" scoped>
.familytree-info-title {
	padding: 5px 0;
	font-size: 20px;
	font-weight: 600;
}
.familytree-item {
	padding: 5px 0;
	display: flex;

	.label {
		color: #000;
		flex: 1;
	}

	.name {
		text-align: right;
	}
}

.required {
	color: red;
}
.family-info {
	// max-height: 80vh;
	// overflow-y: auto;
	// overflow-x: hidden;
}

.elcol {
	background: rgba(255, 255, 255, 1);
	box-shadow: -2px 4px 10px 0px rgba(0, 0, 0, 0.08);
	border-radius: 4px;
	padding: 5px 8px;
}
.title {
	font-size: 20px;
	font-weight: 600;
	// border: 1px dashed #333333;
	display: inline-block;
}
.text-bold {
	font-weight: 600;
}

.desc {
	font-size: 12px;
	font-weight: 500;
	color: rgba(52, 73, 94, 1);
	margin: 0 10px;

	img {
		width: 12px;
		height: 12px;
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
	width: 120px;
	height: 34px;
	border-radius: 4px;
	font-size: 14px;
	font-weight: 500;
	border: none;
}

.history,
.donate {
	background: rgba(34, 187, 35, 0.2);
	color: rgba(87, 208, 146, 1);
}

.export,
.transfor,
.share {
	background: rgba(87, 208, 146, 1);
	color: #fff;
}

.hidden {
	z-index: -1;
	position: fixed;
	top: 0;
	left: 0;
	display: none;
}
.mt-lg {
	margin-top: 20px;
}

.relative {
	position: relative;
}

.absolute-right {
	top: 30px;
	position: absolute;
	right: 10px;
}

.no-margin {
	margin: 0;
}
</style>

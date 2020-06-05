<template>
	<section>
		<el-col :span="24" class="toolbar relative" style="padding-bottom: 0px;">
			<div class="btn-wrapper">
				<el-button type="primary" @click="handleShowModal('wave')">工资支出</el-button>
				<el-button type="primary" @click="handleShowModal('familytree')">修谱支出</el-button>
			</div>
			<el-form inline :model="searchForm">
				<el-row type="flex" class="row-bg" justify="end" label-width="80px">
					
					<el-form-item label="家谱名称：">
						<el-select v-model="searchForm.family_id" clearable filterable placeholder="请选择" style="width: 150px">
							<el-option
								v-for="item in familyOpts"
								:key="item.family_id"
								:label="item.family_name"
								:value="item.family_id"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="姓名：">
						<el-select v-model="searchForm.manage_id" clearable filterable placeholder="请选择" style="width: 150px">
							<el-option
								v-for="item in manageOpts"
								:key="item.manage_id"
								:label="item.manage_name"
								:value="item.manage_id"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="选择日期：">
						<el-date-picker
							v-model="searchForm.date"
							type="daterange"
							range-separator="-"
							format="yyyy-MM-dd"
							value-format="yyyy-MM-dd"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							style="width: 300px"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleSearch()">搜索</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="" @click="reset()">重置</el-button>
					</el-form-item>
				</el-row>
			</el-form>
		</el-col>
		<el-table
			:data="tableData"
			border
			highlight-current-row
			:header-cell-style="{ background: '#eef1f6', color: '#606266' }"
			v-loading="loading"
		>
			<el-table-column property="commit_time" label="提交时间" align="center">
			</el-table-column>
			<el-table-column property="type_desc" label="类型" align="center">
			</el-table-column>
			<el-table-column
				property="family_name"
				label="所属家谱树名称"
				align="center"
			>
			</el-table-column>
			<el-table-column property="name" label="管理员姓名" align="center">
			</el-table-column>
			<el-table-column property="phone" label="手机号码" align="center">
			</el-table-column>
			<el-table-column property="trans_amt" label="金额（元）" align="center">
			</el-table-column>
			<el-table-column property="status_desc" label="状态" align="center">
			</el-table-column>
			<el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <span class="action" v-if="scope.row.status === '2'">——</span>
                    <span class="action" v-if="scope.row.status === '0'" @click="cancel(scope.row, '2')">取消</span>
                    <span class="action confirm" v-if="scope.row.status === '0'" @click="cancel(scope.row, '1')">确认</span>
                </template>
            </el-table-column>
		</el-table>
		<el-col :span="24" class="toolbar">
			<el-pagination
				style="float:right"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				layout="prev, pager, next"
				:total="records"
			>
			</el-pagination>
		</el-col>
		<el-dialog title="工资支出" :visible.sync="show.wave" width="60%">
			<el-form :model="waveForm" :rules="waveRules" ref="waveForm" label-width="100px">
				<el-form-item label="管理员名称" prop="manage">
					<el-select v-model="waveForm.manage_id" filterable @change="handleWaveManageChange">
						<el-option
							v-for="item in manageOpts"
							:key="item.manage_id"
							:label="item.manage_name"
							:value="item.manage_id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="家谱树名称" prop="family">
					<el-select v-model="waveForm.family_id" filterable @change="handleWaveFailyChange">
						<el-option
							v-for="item in familyOpts"
							:key="item.family_id"
							:label="item.family_name"
							:value="item.family_id"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="银行名称" prop="bank">
					<el-input v-model="waveForm.bank" disabled/>
				</el-form-item>
				<el-form-item label="银行卡号" prop="card">
					<el-input v-model="waveForm.card" disabled/>
				</el-form-item>
				<el-form-item label="工资金额" prop="trans_amt">
					<el-input v-model="waveForm.trans_amt" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="confirmWaveOut">确定</el-button>
			</span>
		</el-dialog>
		<el-dialog title="修谱支出" :visible.sync="show.familytree" width="60%">
			<el-form :model="familyForm" :rules="familyRules" ref="familyForm" label-width="100px">
				<el-form-item label="家谱树名称" prop="family">
					<el-select v-model="familyForm.family_id" filterable @change="handleFamilyFamilyChange">
						<el-option
							v-for="item in familyOpts"
							:key="item.family_id"
							:label="item.family_name"
							:value="item.family_id"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="修谱金额" prop="bank">
					<el-input v-model="familyForm.repair_amt"/>
				</el-form-item>
				<el-form-item label="修谱描述" prop="card">
					<el-input v-model="familyForm.repair_desc"/>
				</el-form-item>
				<el-form-item label="操作者" prop="trans_amt">
					<el-input v-model="userInfo.user_name" :readonly="true"/>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="confirmFamilyOut">确定</el-button>
			</span>
		</el-dialog>
	</section>
</template>
<script>
import { Manage } from '@/api'
export default {
	name: 'foundout-table',
	data() {
		return {
			familyOpts: [],
			searchForm: {
				family_id: '',
				date: [],
				manage_id: ''
			},
			tableData: [],
			loading: false,
			currentPage: 1,
			records: 0,
			show: {
				wave: false,
				familytree: false
			},
			waveForm: {
				manage_id: '',
				manage_name: '',
				family_id: '',
				family_name: '',
				bank: '',
				card: '',
				trans_amt: ''
			},
			familyForm: {
				family_name: '',
				family_id: '',
				repair_amt: '',
				repair_desc: ''
			},
			waveRules: {},
			familyRules: {},
			manageOpts: []
		}
	},
	computed: {
		userInfo() {
			return this.$store.getters.getBackToken || {}
		}
	},
	mounted() {
		this.getDefaultDateRange()
		this.getFamilyOpts()
		this.getTableData()
		this.getManageOpts()
	},
	methods: {
		
		getDefaultDateRange() {
			this.searchForm.date = []
			var date = new Date()
			var seperator1 = '-'
			var year = date.getFullYear()
			var month = date.getMonth() + 1
			var strDate = date.getDate()
			if (month >= 1 && month <= 9) {
				month = '0' + month
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = '0' + strDate
			}
			this.searchForm.date.push(
				year + seperator1 + month + seperator1 + strDate
			)

			date.setDate(date.getDate() - 7)
			year = date.getFullYear()
			month = date.getMonth() + 1
			strDate = date.getDate()
			if (month >= 1 && month <= 9) {
				month = '0' + month
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = '0' + strDate
			}
			this.searchForm.date.unshift(
				year + seperator1 + month + seperator1 + strDate
			)
		},
		getManageOpts () {
			Manage.familyManagePpeopleFind({operation_type: '2'}).then(res => {
				if (res.code === '000000' && res.data) {
					this.manageOpts = res.data
				} 
			})
		},
		getFamilyOpts() {
			Manage.familyTreeDropDownFind().then(res => {
				if (res.data) {
					this.familyOpts = res.data
				}
			})
		},
		getTableData() {
			this.records = 0
			this.loading = true
			const params = {
				family_id: this.searchForm.family_id,
				manage_id: this.searchForm.manage_id,
				begin_time: this.searchForm.date[0],
				end_time: this.searchForm.date[1],
				page: this.currentPage,
				// manage_id: ''
			}
			Manage.fundHandleFundAmountFind(params).then(res => {
				if (res.data && res.code === '000000') {
					this.tableData = res.data.map(v => {
						if (v.type === '0') {
							v.type_desc = '修谱支出'
						} else if (v.type === '1') {
							v.type_desc = '工资支出'
						} else {
							v.type_desc = '捐献'
						}
						if (v.status === '0') {
							v.status_desc = '初始'
						} else if (v.status === '1') {
							v.status_desc = '已处理'
						} else {
							v.status_desc = '已取消'
						}
						return v
					})
					this.records = parseInt(res.pageContent)
				} else {
					this.$message.error(res.message)
				}
				this.loading = false
			})
		},
		handleCurrentChange(val) {
			this.currentPage = val
			this.getTableData()
		},
		handleSearch() {
			this.currentPage = 1
			this.getTableData()
		},
		reset() {
			this.currentPage = 1
			this.records = 0
			this.searchForm.family_id = ''
			this.searchForm.manage_id = ''
			this.getDefaultDateRange()
			this.getTableData()
        },
        cancel (row, type) {
            const params = {
                account_id: row.account_id,
                operation: type
            }
            Manage.fundAmountDetailOperation(params).then(res => {
                if (res.code === '000000') {
                    this.$alert('操作成功')
                    this.reset()
                } else {
                    this.$message.error(res.message)
                }
            })
		},
		handleShowModal (type) {
			this.show[type] = true
		},
		handleWaveManageChange (v) {
			this.manageOpts.forEach(item => {
				if (v === item.manage_id) {
					this.waveForm.bank = item.bank_name
					this.waveForm.card = item.bank_no
					this.waveForm.manage_name = item.manage_name
					this.waveForm.manage_phone = item.manage_phone
				}
			})
		},
		handleWaveFailyChange (v) {
			this.familyOpts.forEach(item => {
				if (v === item.family_id) {
					this.waveForm.family_name = item.family_name
				}
			})
		},
		handleFamilyFamilyChange (v) {
			this.familyOpts.forEach(item => {
				if (v === item.family_id) {
					this.familyForm.family_name = item.family_name
				}
			})
		},
		confirmWaveOut () {
			Manage.fundHandleAmount(this.waveForm).then(res => {
				if (res.code === '000000') {
					this.$alert('保存成功')
					this.show.wave = false
					this.waveForm = {
						manage_id: '',
						manage_name: '',
						family_id: '',
						family_name: '',
						bank: '',
						card: '',
						trans_amt: ''
					}
					this.currentPage = 1
					this.getTableData()
				} else {
					this.$message.error(res.message)
				}
			})
		},
		confirmFamilyOut () {
			const params = Object.assign({}, this.familyForm, {
				opertion_people: this.userInfo.user_name
			})
			Manage.repairSpectrumAmount(params).then(res => {
				if (res.code === '000000') {
					this.$alert('保存成功')
					this.show.familytree = false
					this.familyForm = {
						family_name: '',
						family_id: '',
						repair_amt: '',
						repair_desc: '',
						opertion_people: ''
					}
					this.currentPage = 1
					this.getTableData()
				} else {
					this.$message.error(res.message)
				}
			})
		}
	}
}
</script>
<style lang="less" scoped>
// .title {
//     padding: 0.5rem;
//     box-shadow: 0.1rem 0.1rem 0.4rem rgba(210, 210, 210, 0.97);
//     border-radius: 0.5rem;
//     color: #6e6e6e;
// }
/deep/.dialog {
	width: 30%;
	min-width: 20rem;
}
.action {
    cursor: pointer;
    padding: 5px 18px;
}
.confirm {
    color: rgb(24, 144, 255)
}
.btn-wrapper {
	display: inline-block;
	position: absolute;
	z-index: 2;
}
.relative {
	position: relative;
}
</style>

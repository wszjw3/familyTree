<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form inline :model="searchForm">
				<el-row type="flex" class="row-bg" justify="end">
					<el-form-item label="家谱名称：">
						<el-select
							v-model="searchForm.family_id"
							filterable
							placeholder="请选择"
							clearable
						>
							<el-option
								v-for="item in familyOpts"
								:key="item.value"
								:label="item.label"
								:value="item.value"
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
							clearable
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleSearch()">搜索</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="" @click="reset()">重置</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="exportData()">导出数据</el-button>
					</el-form-item>
					<!-- <el-form-item>
          <el-button @click="resetSearchForm">重置</el-button>
        </el-form-item> -->
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
			<el-table-column
				prop="time"
				label="时间"
				min-width="150"
				align="center"
			>
			</el-table-column>
			<!-- <el-table-column prop="appCode" label="应用代码" min-width="80" align="center">
    </el-table-column> -->
			<el-table-column
				prop="family_name"
				label="家谱树名称"
				min-width="150"
				align="center"
			>
			</el-table-column>
			<el-table-column
				prop="name"
				label="姓名"
				min-width="120"
				align="center"
			>
			</el-table-column>
			<el-table-column
				prop="phone"
				label="手机号码"
				min-width="120"
				align="center"
			>
			</el-table-column>
			<el-table-column prop="type_desc" label="类型" min-width="120" align="center">
			</el-table-column>
			<el-table-column prop="pay_mode_desc" label="支付方式" min-width="120" align="center">
			</el-table-column>
			<el-table-column prop="tans_amt" label="金额（元）" min-width="120" align="center">
			</el-table-column>
			<el-table-column
				prop="surplus_amt"
				label="剩余修谱基金（元）"
				min-width="120"
				align="center"
			>
			</el-table-column>
			<el-table-column prop="commission" label="本次抽成（元）" min-width="120" align="center">
			</el-table-column>
			<el-table-column
				label="平台抽成总额（元）"
				min-width="120"
				align="center"
				prop="platform_amt"
			>
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
	</section>
</template>
<script>
import { Manage } from '@/api'
import axios from 'axios'
export default {
	name: 'income-table',
	data() {
		return {
			familyOpts: [],
			searchForm: {
				family_id: '',
				date: []
			},
			tableData: [],
			loading: false,
			currentPage: 1,
			records: 0
		}
	},
	created() {
		this.getDefaultDateRange()
		this.getFamilyOpts()
		this.getTableData()
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
		getFamilyOpts() {
			Manage.familyTreeDropDownFind().then(res => {
				if (res.data) {
					this.familyOpts = res.data.map(v => {
						return {
							label: v.family_name,
							value: v.family_id
						}
					})
				}
			})
		},
		getTableData() {
			this.tableData = []
			const params = {
				family_id: this.searchForm.family_id,
				begin_time: this.searchForm.date[0],
				end_time: this.searchForm.date[1],
				page: this.currentPage
			}
			Manage.fundHandleBudgetDetaileFind(params).then(res => {
				if (res.data && res.code === '000000') {
					this.tableData = res.data.map(v => {
						v.type_desc = ''
						if (v.type === '0') {
							v.type_desc = '修谱支出'
						} else if (v.type === '1') {
							v.type_desc = '工资支出'
						} else {
							v.type_desc = '捐献'
						}
						v.pay_mode_desc = v.pay_mode === '0' ? '支付宝' : '微信'
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
			this.records = 0
			this.getTableData()
		},
		reset() {
			this.currentPage = 1
			this.records = 0
			this.searchForm.family_id = ''
			this.getDefaultDateRange()
			this.getTableData()
		},
		exportData() {
			const params = {
				family_id: this.searchForm.family_id,
				begin_time: this.searchForm.date[0],
				end_time: this.searchForm.date[1]
			}
			let URL = ''
			if ('true' !== process.env.VUE_APP_USE_MOCK) {
				URL = process.env.VUE_APP_BASE_MANAGE
			}
			axios({
				method: 'post',
				baseURL: URL,
				url: '/Backend/fundDetaileExportExcelFile',
				responseType: 'blob',
				data: params,
			})
				.then((response) => {
					if (!response) {
						this.$message.error('导出失败，请点击重试')
					} else {
						const filename = '收支明细'
						const blob = new Blob([response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
						if (window.navigator.msSaveOrOpenBlob) {
							navigator.msSaveBlob(blob, filename)
						} else {
							const node = document.createElement('a')
							node.download = filename
							node.href = window.URL.createObjectURL(blob)
							node.click()
						}
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
</style>

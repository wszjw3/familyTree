<template>
	<el-dialog title="身份认领提示" :visible.sync="isShow" width="50%">
		<p style="color: red; margin: 10px;">认领申请将由家谱管理员进行确认</p>
		<el-form ref="form" :model="form" :rules="rules" label-width="80px">
			<el-form-item label="姓名" prop="name">
				<el-input type="text" v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="手机号码" prop="phone">
				<el-input type="text" v-model="form.phone"></el-input>
			</el-form-item>
			<el-form-item label="认领理由" prop="remark">
				<el-input
					type="textarea"
					:autosize="{ minRows: 2, maxRows: 4 }"
					v-model="form.remark"
				>
				</el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="cancel">取消</el-button>
			<el-button type="primary" @click="confirm">提交审核</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { Family } from '@/api'
export default {
	name: 'ClaimModal',
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
		}
	},
	data() {
		return {
			isShow: this.value,
			form: {
				name: '',
				phone: '',
				remark: ''
			},
			rules: {
				name: [{ required: true, message: '姓名', trigger: 'blur' }],
				phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
				remark: [{ required: true, message: '请输入理由', trigger: 'blur' }]
			}
		}
	},
	watch: {
		value(val) {
			this.isShow = val
		},
		isShow(val) {
			this.$emit('input', val)
		}
	},
	methods: {
		reset() {
            this.isShow = false
            this.form = {
                name: '',
				phone: '',
				remark: ''
            }
            this.$refs.form.resetFields()
		},
		confirm() {
			this.$refs.form.validate(valid => {
				if (valid) {
					const params = {
						user_id: this.userInfo.user_id,
						login_id: this.$store.state.user.token.id,
						name: this.form.name,
						phone: this.form.phone,
						remark: this.form.name
					}
					Family.familyClaim(params).then(res => {
						if (res.code === '000000') {
							this.$alert('保存成功')
							this.reset()
							this.$emit('success')
						} else {
							this.$message.error(res.message)
						}
					})
				} else {
					console.log('error submit!!')
				}
			})
		},
		cancel() {
			this.reset()
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
	cursor: inherit;
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
</style>

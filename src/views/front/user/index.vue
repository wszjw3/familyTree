<template>
	<el-tabs v-model="activeName">
		<el-tab-pane label="基本资料" name="first" class="table-item">
			<el-form
				ref="basicForm"
				:model="basicForm"
				:rules="basicFormRules"
				label-width="150px"
			>
				<el-form-item label="姓：" prop="user_surname">
					<el-input type="text" v-model="basicForm.user_surname"></el-input>
				</el-form-item>
				<el-form-item label="名：" prop="user_fame">
					<el-input type="text" v-model="basicForm.user_fame"></el-input>
				</el-form-item>
				<el-form-item label="性别：" prop="sex">
					<el-radio v-model="basicForm.sex" label="1">男</el-radio>
					<el-radio v-model="basicForm.sex" label="2">女</el-radio>
				</el-form-item>
				<el-form-item label="所在地区：" prop="area">
					<city-picker v-model="basicForm.area" placeholder="请选择省市区" />
				</el-form-item>
				<el-form-item label="详细地址：" prop="address">
					<el-input type="textarea" v-model="basicForm.address"></el-input>
				</el-form-item>
			</el-form>
			<div class="operation">
				<el-button class="saveBtn" type="primary" @click="handleSave('basic')"
					>保存</el-button
				>
				<el-button class="resetBtn" @click="reset('basic')">重置</el-button>
			</div>
		</el-tab-pane>
		<el-tab-pane v-if="userType === '3'" label="银行卡号" name="second" class="table-item">
			<el-form
				ref="bankForm"
				:model="bankForm"
				:rules="bankFormRules"
				label-width="150px"
			>
				<el-form-item label="银行卡号：" prop="bank_code">
					<el-input type="text" v-model="bankForm.bank_code"></el-input>
				</el-form-item>
				<el-form-item label="银行名称：" prop="bank_name">
					<el-input type="text" v-model="bankForm.bank_name"></el-input>
				</el-form-item>
			</el-form>
			<div class="operation">
				<el-button class="saveBtn" type="primary" @click="handleSave('bank')"
					>保存</el-button
				>
				<el-button class="resetBtn" @click="reset('bank')">重置</el-button>
			</div>
		</el-tab-pane>
		<el-tab-pane label="联系方式" name="thired" class="table-item">
			<el-form
				ref="contactForm"
				:model="contactForm"
				:rules="contactFormRules"
				label-width="150px"
			>
				<el-form-item label="手机号码：" prop="phone">
					<el-input type="text" v-model="contactForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="邮箱：" prop="email">
					<el-input type="text" v-model="contactForm.email"></el-input>
				</el-form-item>
				<el-form-item label="微信" prop="wechart">
					<el-input type="text" v-model="contactForm.wechart"></el-input>
				</el-form-item>
				<el-form-item label="QQ" prop="qq">
					<el-input type="text" v-model="contactForm.qq"></el-input>
				</el-form-item>
			</el-form>
			<div class="operation">
				<el-button class="saveBtn" type="primary" @click="handleSave('contact')"
					>保存</el-button
				>
				<el-button class="resetBtn" @click="reset('contact')">重置</el-button>
			</div>
		</el-tab-pane>
		<el-tab-pane label="密码设置" name="fourth" class="table-item">
			<el-form
				ref="passwdForm"
				:model="passwdForm"
				:rules="passwdFormRules"
				label-width="150px"
			>
				<el-form-item label="原密码：" prop="passwd">
					<el-input type="password" v-model="passwdForm.passwd" show-password></el-input>
				</el-form-item>
				<el-form-item label="新密码：" prop="new_passwd">
					<el-input type="password" v-model="passwdForm.new_passwd" show-password></el-input>
				</el-form-item>
				<el-form-item label="确认密码：" prop="new_passwd_confirm">
					<el-input
						type="password"
						v-model="passwdForm.new_passwd_confirm"
						show-password
					></el-input>
				</el-form-item>
			</el-form>
			<div class="operation">
				<el-button class="saveBtn" type="primary" @click="handleSave('passwd')"
					>保存</el-button
				>
				<el-button class="resetBtn" @click="reset('passwd')">重置</el-button>
			</div>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import { Family } from '@/api'
import CityPicker from '@/components/city-picker/index.vue'
const validatePassword = (rule, value, callback) => {
		if (value === '') {
			callback(new Error('请输入密码'))
		} else if (rule.field === 'new_passwd_conform' && this.passwdForm.new_passwd !== value) {
			callback(new Error('两次密码不一致'))
		} else {
			callback()
		}
	}
export default {
	name: 'UserInfo',
	components: {
		CityPicker,
	},
	data() {
		return {
			activeName: 'first',
			basicForm: {
				user_surname: '',
				user_fame: '',
				sex: '',
				area: [],
				address: '',
			},
			basicFormRules: {
				user_surname: [
					{
						required: true,
						trigger: 'blur',
						message: '请输入姓'
					}
				],
				user_fame: [
					{
						required: true,
						trigger: 'blur',
						message: '请输入名'
					}
				],
				sex: [
					{
						required: true,
						trigger: 'blur',
						message: '请选择性别'
					}
				]
			},
			contactForm: {
				phone: '',
				email: '',
				wechart: '',
				qq: '',
			},
			contactFormRules: {},
			passwdForm: {
				passwd: '',
				new_passwd: '',
				new_passwd_confirm: '',
			},
			passwdFormRules: {
				passwd: [
					{
						required: true,
						trigger: 'blur',
						message: '请输入原密码'
					}
				],
				new_passwd: [
					{
						required: true,
						trigger: 'blur',
						validator: validatePassword
					}
				],
				new_passwd_confirm: [
					{
						required: true,
						trigger: 'blur',
						validator: validatePassword
					}
				]
			},
			bankForm: {
				bank_code: '',
				bank_name: '',
			},
			bankFormRules: {
				bank_code: [
					{
						required: true,
						trigger: 'blur',
						message: '请输入银行卡号'
					}
				],
				bank_name: [
					{
						required: true,
						trigger: 'blur',
						message: '请输入银行名称'
					}
				]
			},
		}
	},
	created() {
		this.getUserInfo()
	},
	computed: {
		userId() {
			return this.$store.getters.getToken.user_id
		},
		userType () {
			return this.$store.getters.getToken.user_type
		}
	},
	methods: {
		getUserInfo() {
			Family.findUserMessage({ user_id: this.userId }).then((res) => {
				const data = res.data
				this.basicForm = {
					user_surname: data.user_surname,
					user_fame: data.user_fame,
					sex: data.sex,
					area: [data.province, data.city, data.county],
					address: data.address,
				}
				this.bankForm = {
					bank_code: data.bank_code,
					bank_name: data.bank_name,
				}
				this.contactForm = {
					phone: data.phone || '',
					email: data.email || '',
					wechart: data.wechart || '',
					qq: data.qq || '',
				}
			})
		},
		handleSave(type) {
			this.$refs[type + 'Form'].validate(valid => {
				if (valid) {
					switch (type) {
						case 'basic':
							Family.baseDataHandle({
								user_id: this.userId,
								surname: this.basicForm.user_surname,
								name: this.basicForm.user_fame,
								sex: this.basicForm.sex,
								province: this.basicForm.area[0] ? this.basicForm.area[0] : '',
								city: this.basicForm.area[1] ? this.basicForm.area[1] : '',
								county: this.basicForm.area[2] ? this.basicForm.area[2] : '',
								address: this.basicForm.address,
							}).then((res) => {
								if (res.code === '000000') {
									this.$alert('保存成功')
								} else {
									this.$message.error(res.message)
								}
							})
							break
						case 'passwd':
							if (this.passwdForm.new_passwd !== this.passwdForm.new_passwd_confirm) {
								this.$message.error('两次输入的密码不一致')
								return
							}
							Family.passwdHandle({
								user_id: this.userId,
								passwd: this.passwdForm.passwd,
								new_passwd: this.passwdForm.new_passwd,
							}).then((res) => {
								if (res.code === '000000') {
									this.$alert('保存成功')
								} else {
									this.$message.error(res.message)
								}
							})
							break
						case 'contact':
							// eslint-disable-next-line no-case-declarations
							const val = Object.values(this.contactForm).filter(v => {
								return v !== ''
							})
							if (val.length > 0) {
								Family.contactHandle({
									user_id: this.userId,
									phone: this.contactForm.phone,
									email: this.contactForm.email,
									wechart: this.contactForm.wechart,
									qq: this.contactForm.qq,
								}).then((res) => {
									if (res.code === '000000') {
										this.$alert('保存成功')
									} else {
										this.$message.error(res.message)
									}
								})
							} else {
								this.$message.error('请填写至少一项后再保存')
							}
							break
						case 'bank':
							Family.baseBankDataHandle({
								user_id: this.userId,
								bank_no: this.bankForm.bank_code,
								bank_name: this.bankForm.bank_name
							}).then((res) => {
								if (res.code === '000000') {
									this.$alert('保存成功')
								} else {
									this.$message.error(res.message)
								}
							})
					}
				}
			})
		},
		reset(type) {
			switch (type) {
				case 'basic':
					this.basicForm = {
						user_surname: '',
						user_fame: '',
						sex: '',
						area: [],
						address: '',
					}
					break
				case 'passwd':
					this.passwdForm = {
						passwd: '',
						new_passwd: '',
						new_passwd_confirm: '',
					}
					break
				case 'contact':
					this.contactForm = {
						phone: '',
						email: '',
						wechart: '',
						qq: '',
					}
					break
				case 'bank':
					this.bankForm = {
						bank_code: '',
						bank_name: '',
					}
			}
		},
	},
}
</script>

<style scoped lang="less">
.operation {
	text-align: center;

	.saveBtn,
	.resetBtn {
		padding: 10px 50px;
		margin: 0 20px;
	}
}
</style>

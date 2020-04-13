<template>
  <div>
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
    </el-form>
    <div class="operation">
      <el-button class="saveBtn" type="primary" @click="handleSave()"
        >保存</el-button
      >
      <el-button class="resetBtn" @click="reset()">重置</el-button>
    </div>
  </div>
</template>

<script>
import {Manage} from '@/api'
import md5 from 'md5'
export default {
  name: 'changePasswd',
  data () {
    return {
      passwdForm: {
				passwd: '',
				new_passwd: ''
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
						message: '请输入新密码'
					}
				]
			},
    }
  },
  created () {
    const token = JSON.parse(localStorage.getItem('backToken'))
    if (token) {
      this.$store.dispatch('setBackToken', token)
    } else {
      this.$router.push('/login')
    }
  },
  methods: {
    handleSave() {
			this.$refs['passwdForm'].validate(valid => {
				if (valid) {
					Manage.manageLoginPasswdUpd({
            login_passwd: md5(this.passwdForm.passwd),
            new_passwd: md5(this.passwdForm.new_passwd),
          }).then((res) => {
            if (res.code === '000000') {
              this.$alert('保存成功')
              this.$store.dispatch('removeBackToken')
              this.$router.push('/login')
            } else {
              this.$message.error(res.message)
            }
          })
				}
			})
		},
		reset() {
			this.passwdForm = {
        passwd: '',
        new_passwd: '',
        new_passwd_confirm: '',
      }
		},
  }
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
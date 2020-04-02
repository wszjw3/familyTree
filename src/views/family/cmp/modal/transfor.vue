<template>
	<el-dialog title="管理员转让" :visible.sync="isShow" width="60%">
        <div>
            待转让家谱树
            <span style="magrin-left: 20px;">
                {{info.family_name}}
            </span>
        </div>
        <div class="mt-lg">
            接收方管理员帐号：
            <el-input class="mt-md" v-model="account" placeholder="请输入"></el-input>
        </div>
        <div class="mt-lg">
            接收方管理员姓名：
            <el-input class="mt-md" v-model="name" placeholder="请输入"></el-input>
        </div>
		<span slot="footer" class="dialog-footer">
            <el-button @click="reset">取消</el-button>
			<el-button type="primary" @click="confirm">确认转让</el-button>
		</span>
	</el-dialog>
</template>

<script>
export default {
	name: 'TransforModal',
	props: {
		value: {
			type: Boolean,
			default() {
				return false
			}
        },
        info: {
            type: Object,
            default () {
                return {}
            }
        }
	},
	data() {
		return {
            isShow: this.value,
            account: '',
            name: ''
		}
	},
	computed: {
		userInfo () {
            return this.$store.state.user.token
        }
	},
	watch: {
        value (val) {
            this.isShow = val
        }
	},
	methods: {
		reset() {
			this.isShow = false
            this.account = ''
            this.name = ''
		},
		confirm() {
		}
	}
}
</script>

<style scoped lang="less">
.mt-lg {
    margin-top: 30px
}
.mt-md {
    margin-top: 16px
}
</style>

<template>
	<el-dialog title="基金捐赠" :visible.sync="isShow" width="60%">
        <div v-if="!showQr">
            <div class="item">
                <div class="label">
                    捐献人：
                </div>
                <div class="content">
                    {{userInfo.user_name || '111'}}
                </div>
            </div>
            <div class="item">
                <div class="label">
                    手机号码：
                </div>
                <div class="content">
                    {{userInfo.phone || '111'}}
                </div>
            </div>
            <div class="item">
                <div class="label">
                    捐献金额：
                </div>
                <div class="content">
                    <div>
                        <div
                            v-for="item in moneyOpts"
                            :key="item"
                            :class="['opt-item', item === money ? 'active' : '']"
                            @click="handleChoose(item)"
                        >
                            {{item}}元
                            <span class="icon">
                                ￥
                            </span>
                        </div>
                    </div>
                    <div class="input-money">
                        自定义金额： 
                        <el-input class="input" v-model="money" placeholder="请输入指定金额"></el-input>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="label">
                    支付方式：
                </div>
                <div class="content">
                    <el-select v-model="payType">
                        <el-option label="微信" value="wepay"></el-option>
                        <el-option label="支付宝" value="alipay"></el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <div v-if="showQr" class="qr-code">
            <div class="back" @click="back">返回</div>
            <img :src="qrCode" >
        </div>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="confirm">去支付</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { Family } from '@/api'
export default {
	name: 'DonateModal',
	props: {
		value: {
			type: Boolean,
			default() {
				return false
			}
		}
	},
	data() {
		return {
            isShow: this.value,
            payType: 'wepay',
            money: '',
            showQr: false,
            qrCode: ''
		}
	},
	computed: {
		userInfo () {
            return this.$store.state.user.token
        },
        moneyOpts () {
            return [
                50, 100, 200, 500, 1000
            ]
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
            this.money = ''
            this.payType = 'wepay'
		},
		confirm() {
            const params = {
                user_name: this.userInfo.user_name || '游客',
                phone: this.userInfo.user_name || '1',
                donation_amt: this.money
            }
            Family.familyWeChartPayLink(params).then(res => {
                if (res.data) {
                    this.qrCode = res.data.payUrl
                    this.showQr = true
                } else {
                    this.$message.error(res.message)
                }
            })
		},
        handleChoose (v) {
            this.money = v
        },
        back () {
            this.showQr = false
        }
	}
}
</script>

<style scoped lang="less">
.item {
    display: flex;
    margin-top: 30px;
    margin-left: 100px;

    .label {
        width: 150px;
    }

    .content {
        flex: 1;
        
        .opt-item {
            width: 70px;
            height: 70px;
            line-height: 70px;
            text-align: center;
            margin-right: 20px;
            cursor: pointer;
            border: 1px solid #ddd;
            display: inline-block;
            position: relative;

            .icon {
                position: absolute;
                top: 0;
                right: 0;
                color: red;
                font-size: 20px;
                display: inline-block;
                height: 20px;
                line-height: 20px;
            }
        }
        .active {
            border: 1px solid red
        }

        .input-money {
            margin-top: 20px;

            .input {
                width: auto
            }
        }
    }
}

.qr-code {
    text-align: center;
    position: relative;

    .back {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 5px 8px;
        border: 1px solid #ddd
    }
}
</style>

<template>
	<el-dialog title="基金捐赠" :visible.sync="isShow" width="60%">
		<div v-show="!showQr">
			<div class="item">
				<div class="label">
					捐献人：
				</div>
				<div class="content">
					{{ userInfo.user_name || '111' }}
				</div>
			</div>
			<div class="item">
				<div class="label">
					手机号码：
				</div>
				<div class="content">
					{{ userInfo.phone || '111' }}
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
							{{ item }}元
							<span class="icon">
								￥
							</span>
						</div>
					</div>
					<div class="input-money">
						自定义金额：
						<el-input
							class="input"
							v-model="money"
							placeholder="请输入指定金额"
						></el-input>
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
		<div v-show="showQr" class="qr-code">
			<div class="back" @click="back">返回</div>
			<img v-if="reqQrSuccess" :src="qrCode" />
			<div v-else class="qr-img-error" @click="confirm">
				二维码请求失败，点击重新请求
			</div>
		</div>
		<span v-show="!showQr" slot="footer" class="dialog-footer">
			<el-button type="primary" @click="confirm">去支付</el-button>
		</span>
	</el-dialog>
</template>

<script>
import axios from 'axios'
import { Family } from '@/api'
export default {
	name: 'DonateModal',
	props: {
		value: {
			type: Boolean,
			default() {
				return false
			},
		},
	},
	data() {
		return {
			isShow: this.value,
			payType: 'wepay',
			money: '',
			showQr: false,
			qrCode: '',
			reqQrSuccess: false,
			orderId: '',
			qrCodeTime: '',
			timingInterval: null,
			queryInterval: null,
		}
	},
	computed: {
		userInfo() {
			return this.$store.getters.getToken
		},
		moneyOpts() {
			return [50, 100, 200, 500, 1000]
		},
	},
	watch: {
		value(val) {
			this.isShow = val
		},
		isShow(val) {
			!val && this.reset()
		},
	},
	destroyed() {
		clearInterval(this.timingInterval)
		clearInterval(this.queryInterval)
	},
	methods: {
		reset() {
			this.isShow = false
			this.payType = 'wepay'
			this.money = ''
			this.showQr = false
			this.qrCode = ''
			this.reqQrSuccess = false
			this.orderId = ''
			clearInterval(this.timingInterval)
			clearInterval(this.queryInterval)
		},
		confirm() {
			clearInterval(this.timingInterval)
			const params = {
				user_name: this.userInfo.user_name || '游客',
				phone: this.userInfo.user_name || '1',
				donation_amt: this.money,
			}
			let URL = ''
			if ('true' !== process.env.VUE_APP_USE_MOCK) {
				URL = process.env.VUE_APP_BASE_FAMILY
			}
			axios({
				method: 'post',
				baseURL: URL,
				url: '/currency/familyWeChartPayLink',
				responseType: 'arraybuffer',
				data: params,
			})
				.then((response) => {
					if (!response) {
						this.reqQrSuccess = false
						return null
					} else {
						this.orderId = response.header.order_id
						return (
							'data:image/png;base64,' +
							btoa(
								new Uint8Array(response).reduce(
									(data, byte) => data + String.fromCharCode(byte),
									''
								)
							)
						)
					}
				})
				.then((data) => {
					this.qrCode = data
					this.reqQrSuccess = true
					this.showQr = true
					this.qrCodeTime = Date.now()
					this.handleTiming()
					this.queryOrderStatus()
				})
			// Family.familyWeChartPayLink(params).then(res => {
			// 	this.showQr = true
			// 	const img = document.createElement('img')
			// 	const blob = new window.Blob([res], { type: 'image/jpeg' })
			// 	const url = window.URL.createObjectURL(blob)
			// 	img.src = url
			// 	img.onload = function() {
			// 		window.URL.revokeObjectURL(url)
			// 	}
			// 	const qr = document.querySelector('.qr-code')
			// 	qr.appendChild(img)
			// })
		},
		handleChoose(v) {
			this.money = v
		},
		back() {
			this.showQr = false
			this.reqQrSuccess = false
			this.qrCode = ''
		},
		handleTiming() {
			this.timingInterval = setInterval(() => {
				if (Date.now() - this.qrCodeTime > 5 * 1000) {
					this.confirm()
				}
			}, 1000)
		},
		queryOrderStatus() {
			this.queryInterval = setInterval(() => {
				Family.familyWeChartPayFind({ order_id: this.orderId }).then((res) => {
					if (res.code === '000') {
						this.$alert('支付成功')
						this.reset()
					}
				})
			}, 1000)
		},
	},
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
			border: 1px solid red;
		}

		.input-money {
			margin-top: 20px;

			.input {
				width: auto;
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
		border: 1px solid #ddd;
	}

	img {
		width: 200px;
		height: 200px;
		margin-top: 50px;
	}

	.qr-img-error {
		width: 200px;
		height: 200px;
		line-height: 200px;
		margin-top: 50px;
		cursor: pointer;
		text-align: center;
	}
}
</style>

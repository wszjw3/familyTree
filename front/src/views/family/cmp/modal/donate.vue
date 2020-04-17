<template>
  <el-dialog title="基金捐赠" :visible.sync="isShow" width="50%">
    <div v-show="!showQr" style="margin-top: -20px">
      <div class="item">
        <p class="label">
          捐献人
        </p>
        <el-input v-model="userInfo.user_name" disabled></el-input>
      </div>
      <div class="item">
        <p class="label">
          手机号码
        </p>
        <el-input v-model="userInfo.phone" disabled></el-input>
      </div>
      <div class="item">
        <p class="label">
          捐献金额
        </p>
        <div class="content">
          <div>
            <div
              v-for="item in moneyOpts"
              :key="item"
              :class="['opt-item', item === money ? 'active' : '']"
              @click="handleChoose(item)"
            >
              {{ item }}元
            </div>
          </div>
          <p class="input-money">
            自定义金额
          </p>
          <el-input
            class="input"
            v-model="money"
            placeholder="请输入指定金额"
          ></el-input>
        </div>
      </div>
      <div class="item">
        <p class="label">
          支付方式：
        </p>
        <div class="content">
          <el-select v-model="payType" readonly style="width: 100%">
            <el-option label="微信" value="wepay"></el-option>
            <!-- <el-option label="支付宝" value="alipay"></el-option> -->
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
      <el-button class="btn" @click="confirm">去支付</el-button>
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
    familyId: {
      type: String,
      default: '',
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
      this.$emit('input', val)
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
        phone: this.userInfo.phone,
        donation_amt: this.money,
        family_id: this.familyId,
        user_id: this.userInfo.user_id,
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
            this.orderId = response.headers.order_id
            return (
              'data:image/png;base64,' +
              btoa(
                new Uint8Array(response.data).reduce(
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
        if (Date.now() - this.qrCodeTime > 30 * 1000) {
          this.confirm()
        }
      }, 1000)
    },
    queryOrderStatus() {
      this.queryInterval = setInterval(() => {
        Family.familyWeChartPayFind({ order_id: this.orderId }).then((res) => {
          if (res.code === '000000') {
            this.$alert('支付成功')
            this.reset()
          }
        })
      }, 3000)
    },
  },
}
</script>

<style scoped lang="less">
.item {
  margin: 0 50px;
  .content {
    .opt-item {
      width: 70px;
      height: 70px;
      line-height: 70px;
      text-align: center;
      margin-right: 20px;
      cursor: pointer;
      display: inline-block;
      background: rgba(239, 243, 245, 1);
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      color: rgba(87, 208, 146, 1);
    }
    .active {
      background-color: rgba(87, 208, 146, 1);
      color: #fff;
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
    cursor: pointer;
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
.btn {
  margin-right: 50px;
  width: 120px;
  height: 34px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  background: rgba(87, 208, 146, 1);
  color: #fff;
}
</style>

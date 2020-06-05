<template>
  <el-dialog title="管理员转让" :visible.sync="isShow" width="60%">
    <p style="margin-top: -20px">
      待转让家谱树
      <span style="magrin-left: 20px;">
        {{ info.family_name }}
      </span>
    </p>
    <div class="mt-lg">
      接收方管理员手机号：
      <el-input class="mt-md" v-model="account" placeholder="请输入"></el-input>
    </div>
    <div class="mt-lg">
      接收方管理员姓名：
      <el-input class="mt-md" v-model="name" placeholder="请输入"></el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button class="btn cancel" @click="reset">取消</el-button>
      <el-button class="btn confirm" @click="confirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Family } from '@/api'
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
      default() {
        return {}
      }
    },
    familyId: {
      type: String,
      default: ''
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
    userId() {
      return this.$store.getters.getToken.user_id
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
      this.account = ''
      this.name = ''
    },
    confirm() {
      let params = {
        user_id: this.userId,
        family_id: this.$router.currentRoute.query.familyId || this.familyId,
        phone: this.account,
        new_manage_name: this.name
      }
      Family.familyManageTransfer(params).then(res => {
        if (res.code === '000000') {
          this.$alert('转让成功，即将跳转页面。。。')
          this.reset()
          setTimeout(() => {
            this.$router.back(-1)
          }, 2000)
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.mt-lg {
  margin-top: 30px;
}
.mt-md {
  margin-top: 16px;
}
.btn {
  border-radius:4px;
  font-weight: 600px;
  background:rgba(87,208,146,1);
  border: 1px solid rgba(87,208,146,1);
  color: #fff;
  font-size: 16px;
}
.confirm {
  background:rgba(87,208,146,1);
  border: 1px solid rgba(87,208,146,1);
  color: #fff;
}

.cancel {
  background:rgba(232,235,238,1);
  border: 1px solid transparent;
  color: rgba(87,208,146,1);;
}
</style>

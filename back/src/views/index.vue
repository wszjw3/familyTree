<template>
  <div>
    <el-tabs v-model="activeName" :stretch="stretch">
      <el-tab-pane lazy label="基金处理" name="first" class="table-item">
        <el-tabs type="border-card">
          <el-tab-pane lazy label="收支明细">
            <income-table />
          </el-tab-pane>
          <el-tab-pane lazy label="资金支出">
            <foundout-table />
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane lazy label="家谱树列表" name="second" class="table-item">

        <family-table></family-table>
      </el-tab-pane>
      <el-tab-pane lazy label="管理员列表" name="third" class="table-item">

        <familymanage-table></familymanage-table>
      </el-tab-pane>
      <el-tab-pane lazy label="标签管理" name="fourth" class="table-item">

        <tag-table></tag-table>
      </el-tab-pane>
      <el-tab-pane lazy label="百家姓维护" name="fifth" class="table-item">

        <surname-table></surname-table>
      </el-tab-pane>
      <el-tab-pane label="基础设置" name="sixth" class="table-item">
        <div style="width:400px;margin:50px;">
          <el-form
            :model="baseForm"
            :rules="baseFormRules"
            ref="baseForm"
            label-width="150px"
            label-position="left"
          >
            <el-form-item label="抽成比例：" prop="scale">
              <el-input
                type="number"
                v-model="baseForm.scale"
                placeholder="请输入"
                clearable
              >
                <template slot="append">
                  %
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="抽成银行卡名称:" prop="bank_name">
              <el-input
                type="text"
                v-model="baseForm.bank_name"
                placeholder="请填写至支行"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="抽成银行卡账号:" prop="bank_no">
              <el-input
                type="text"
                v-model="baseForm.bank_no"
                placeholder="请填写至支行"
                clearable
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="handleQueryBaseSetup">取消</el-button>
            <el-button type="primary" @click.native="handleBaseSetupSubmit"
              >保存</el-button
            >
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FamilyTable from '@/components/table/familytable'
import TagTable from '@/components/table/tagtable'
import SurnameTable from '@/components/table/surnametable'
import FamilymanageTable from '@/components/table/familymanagetable'
import IncomeTable from '@/components/table/incometable'
import FoundoutTable from '@/components/table/foundouttable'
import { Manage } from '@/api'
export default {
  name: 'platformManage',
  components: {
    FamilyTable,
    TagTable,
    SurnameTable,
    FamilymanageTable,
    IncomeTable,
    FoundoutTable
  },
  data() {
    return {
      activeName: this.$router.currentRoute.query.active || 'second',
      stretch: false,
      baseForm: {
        scale: '',
        bank_name: '',
        bank_no: '',
        operation: '0'
      },
      baseFormRules: {
        scale: [{ required: true, message: '抽成比例', trigger: 'blur' }],
        bank_name: [{ required: true, message: '银行卡名称', trigger: 'blur' }],
        bank_no: [{ required: true, message: '银行卡账号', trigger: 'blur' }]
      }
    }
  },
  watch: {
    $router(val) {
      this.activeName = val.currentRoute.query.active
    },
    activeName(val, oldVal) {
      val !== oldVal &&
        this.$router.push({
          path: '/',
          query: {
            active: val
          }
        })
    }
  },
  computed: {
    userName() {
      return this.$store.getters.getBackToken.FAMILY_USER
    }
  },
  created() {
    const token = JSON.parse(localStorage.getItem('backToken'))
    if (token) {
      this.$store.dispatch('setBackToken', token)
    } else {
      this.$router.push('/login')
    }
    this.handleQueryBaseSetup()
  },
  methods: {
    handleQueryBaseSetup() {
      Manage.baseSetupFind({
        login_name: this.userName
      }).then(content => {
        if (content.code && content.code === '000000') {
          this.baseForm = {
            scale: content.data.SCALE,
            bank_name: content.data.BANK_NAME,
            bank_no: content.data.BANK_NO
          }
        } else {
          this.$message.error({
            message: `${content.message ? ',' + content.message : ''}`
          })
        }
      })
    },
    handleBaseSetupSubmit() {
      console.log(this.baseForm)
      this.$refs['baseForm'].validate(valid => {
        console.log(valid)
        if (valid) {
          var params = Object.assign({}, this.baseForm, {
            login_name: this.userName
          })
          Manage.baseSetup(params).then(content => {
            console.log(content)
            if (content.code && content.code === '000000') {
              this.handleQueryBaseSetup()
            } else {
              this.$message.error({
                message: `${content.message ? ',' + content.message : ''}`
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
.tab-pane-tit {
  font-family: '微软雅黑 Bold', '微软雅黑';
  font-weight: 700;
  font-style: normal;
  color: #363636;
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #eee;
}
.el-table .warning-row {
  background-color: #f2f2f2;
}
</style>

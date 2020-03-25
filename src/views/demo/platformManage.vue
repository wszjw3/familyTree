<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="stretch">
      <el-tab-pane label="基金处理" name="first" class="table-item">
        <div class="tab-pane-tit">根深叶茂/ 基金处理</div>

        <jijin-table></jijin-table>
      </el-tab-pane>
      <el-tab-pane label="家谱树列表" name="second" class="table-item">
        <div class="tab-pane-tit">根深叶茂/ 家谱列表</div>

        <family-table></family-table>
      </el-tab-pane>
      <el-tab-pane label="管理员列表" name="third" class="table-item">
        <div class="tab-pane-tit">根深叶茂/ 家谱列表</div>

        <familymanage-table></familymanage-table>
      </el-tab-pane>
      <el-tab-pane label="标签管理" name="fourth" class="table-item">
        <div class="tab-pane-tit">根深叶茂/ 标签管理</div>

        <tag-table></tag-table>
      </el-tab-pane>
      <el-tab-pane label="百家姓维护" name="fifth" class="table-item">
        <div class="tab-pane-tit">根深叶茂/ 百家姓维护</div>

        <surname-table></surname-table>
      </el-tab-pane>
      <el-tab-pane label="基础设置" name="sixth" class="table-item">
        <div class="tab-pane-tit">根深叶茂/ 基础设置</div>
        <div style="width:400px;margin:50px 0;">
          <el-form :model="baseForm" :rules="baseFormRules" ref="baseForm" label-width="150px" label-position="left">
            <el-form-item label="抽成比例：" prop="scale">
              <el-input type="text" v-model="baseForm.scale" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="抽成银行卡名称:" prop="bank_name">
              <el-input type="text" v-model="baseForm.bank_name" placeholder="请填写至支行" clearable></el-input>
            </el-form-item>
            <el-form-item label="抽成银行卡账号:" prop="bank_no">
              <el-input type="text" v-model="baseForm.bank_no" placeholder="请填写至支行" clearable></el-input>
            </el-form-item>
          </el-form>   
          <div slot="footer" class="dialog-footer">
              <el-button @click.native="handleQueryBaseSetup">取消</el-button>
              <el-button type="primary" @click.native="handleBaseSetupSubmit">保存</el-button>
            </div>   
        </div>
        
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import JijinTable from '@/components/table/jijintable'
import FamilyTable from '@/components/table/familytable'
import TagTable from '@/components/table/tagtable'
import SurnameTable from '@/components/table/surnametable'
import FamilymanageTable from '@/components/table/familymanagetable'
import {
  Manage
} from '@/api'
export default {
  name: 'platformManage',
  components: {
    JijinTable,
    FamilyTable,
    TagTable,
    SurnameTable,
    FamilymanageTable
  },
  data() {
    return {
      activeName: 'second',
      stretch: false,
      baseForm: {
        scale:'',
        bank_name: '',
        bank_no: ''
      },
      baseFormRules:{
        scale:[{ required: true, message: '抽成比例', trigger: 'blur' }],
        bank_name:[{ required: true, message: '银行卡名称', trigger: 'blur' }],
        bank_no:[{ required: true, message: '银行卡账号', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
      if(tab.name === 'sixth') {
        this.handleQueryBaseSetup()
      }
    },
    handleQueryBaseSetup() {
      Manage.baseSetupFind().then(content => {
        if(content.code && content.code === '000000') {
            this.baseForm = content.data
        } else {
          this.$message.error({
            message: `${content.message?','+content.message:''}`
          })
        }
      })
    },
    handleBaseSetupSubmit() {
      console.log(this.baseForm)
      this.$refs['baseForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          var params = this.baseForm
          Manage.baseSetup(params).then(content => {
            console.log(content)
            if(content.code && content.code === '000000') {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.handleQueryBaseSetup()
            } else {
              this.$message.error({
                message: `${content.message?','+content.message:''}`
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

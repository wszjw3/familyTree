<template>
<section>
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form inline  ref="searchForm">
      <el-row type="flex" class="row-bg" justify="begin">
        <el-form-item>
          <el-button type="primary"  @click="addDialogVisible=!addDialogVisible">新增</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-col>

  <div class="name-table" v-for="names in subList" :key="names.initials">
    <div class="name-left">{{names.initials}}</div>
    <div class="name-right">
      <span v-for="sur in names.initials_data" :key="sur.surname">{{sur.surname}}</span>
    </div>
  </div>
  
  <!-- 新增弹窗 -->
  <el-dialog title="新增百家姓：" :visible.sync="addDialogVisible" custom-class="dialog" center>
    <el-form :model="addForm" :rules="addTagRules" ref="addForm" label-width="6rem">
      
      <el-form-item label="请输入：" prop="surname">
        <el-input type="text" v-model="addForm.surname" placeholder="标签描述" clearable></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="addDialogVisible = false">取消</el-button>
      <el-button type="primary" @click.native="addSubmit">提交</el-button>
    </div>
  </el-dialog>
  <!-- 新增弹窗 -->
</section>
</template>
<script>
import {
  Manage
} from '@/api'
export default {
  name: 'surname-table',
  data() {
    
    return {
      addDialogVisible: false,
      loading: false,
      timeout:  null,
      
      subList: [{
        initials:'',
        initials_data: [{
          surname: '',
          number: ''
        }]
      }],
      addForm: {
        surname: '',
      },
      addTagRules: {
        surname: [{ required: true, message: '姓氏', trigger: 'blur' }],
      },
    }
  },
  watch: {
    
  },
  created: function() {
    this.searchFormSubmit()
  },
  methods: {
    //查询子账户列表
    searchFormSubmit() {
      this.loading = true
      Manage.surnameFind().then(content => {
        console.log(content)
        this.subList = []
        if (content && content.data && content.data.length > 0) {
          this.subList = content.data ? content.data : []
        } else {
          this.subList = []
        }
      }).then(() => {
        this.loading = false
      })
    },
    addSubmit() {
      console.log(this.addForm)
      this.$refs['addForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          var params = {
            surname: this.addForm.surname
          }
          Manage.surnameOpertion(params).then(content => {
            console.log(content)
            if(content.code && content.code === '000000') {
              this.addDialogVisible = false
              this.$message({
                type: 'success',
                message: '新增姓氏成功'
              })
              this.searchFormSubmit()
            } else {
              this.$message.error({
                message: `新标签失败${content.message?','+content.message:''}`
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
<style lang="less" scoped>
// .title {
//     padding: 0.5rem;
//     box-shadow: 0.1rem 0.1rem 0.4rem rgba(210, 210, 210, 0.97);
//     border-radius: 0.5rem;
//     color: #6e6e6e;
// }
/deep/.dialog {
    width: 30%;
    min-width: 20rem;

}
.name-table {
  display: flex;
  border-bottom:1px solid #eee;
  margin:auto;
  width:100%;
  padding: 20px;
  
  .name-left {
    color:#000;
    font-size:36px;
    margin:auto 20px;
  }
  .name-right {
    display:flex;
    color:#333;
    font-size:18px;
    flex-wrap:wrap;
    margin:auto 0;
    width:800px;
    span {
      margin:10px;
    }
  }
}
</style>

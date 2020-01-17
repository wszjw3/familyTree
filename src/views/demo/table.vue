<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form inline :model="filters">
        <el-row>
          <el-form-item>
            <el-input v-model="filters.name" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker type="date" placeholder="生日" v-model="filters.birth"></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">新增</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="users" highlight-current-row :header-cell-style="{background:'#eef1f6',color:'#606266'}" v-loading="listLoading"
      @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="100" :formatter="formatSex">
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="100">
      </el-table-column>
      <el-table-column prop="birth" label="生日" width="120">
      </el-table-column>
      <el-table-column prop="addr" label="地址" min-width="180">
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" @click="handleRule(scope.$index, scope.row)">权限</el-button>
          <el-button type="danger" size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total"
        style="float:right;">
      </el-pagination>
    </el-col>

    <el-dialog title="编辑" :visible.sync="editFormShow" :close-on-click-modal="false" width="30%">
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="editForm.age" :min="0" :max="200" style="width:220px"></el-input-number>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="editForm.addr" style="width:400px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormShow = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="权限" :visible.sync="ruleFormShow" :close-on-click-modal="false" width="30%">
      <el-tree ref="ruleTree" :data="ruleData" show-checkbox node-key="id" :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]" :props="ruleProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="ruleFormShow = false">取消</el-button>
        <el-button type="primary" @click.native="ruleSubmit">提交</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
  import {
    User
  } from '@/api'

  export default {

    data() {
      return {
        filters: {
          name: '',
          birth: ''
        },
        users: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [], // 列表选中列
        editFormShow: false,
        ruleFormShow: false,
        delConfirmShow: false,
        editloading: false,
        editForm: {
          id: 0,
          name: '',
          sex: 1,
          birth: '',
          addr: ''
        },
        editFormRules: {
          name: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }]
        },
        ruleData: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        ruleProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    mounted() {
      this.$np.done()
      this.getUsers()
    },
    methods: {
      // 性别显示转换
      formatSex(row) {
        return row.sex === 1 ? '男' : row.sex === 0 ? '女' : '未知'
      },
      handleCurrentChange(val) {
        this.page = val
        this.getUsers()
      },
      handleQuery() {
        this.page = 1
        this.getUsers()
      },
      selsChange() {

      },
      // 获取用户列表
      getUsers() {
        const para = {
          page: this.page,
          name: this.filters.name
        }
        this.listLoading = true
        User.getUserList(para).then((res) => {
          console.log(res)
          this.total = res.total
          this.users = res.users
          this.listLoading = false
        })
      },
      // 显示编辑界面
      handleEdit(index, row) {
        this.editFormShow = true
        this.editForm = Object.assign({}, row)
      },
      editSubmit() {
        this.editFormShow = false
      },
      // 删除
      handleDel() {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 显示权限界面
      handleRule() {
        this.ruleFormShow = true
      },
      ruleSubmit() {
        this.ruleFormShow = false
        this.$message({
          message: '设置权限：' + this.$refs.ruleTree.getCheckedKeys(),
          type: 'success'
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-tree {
    border: 1px solid #d1dae5;
  }
</style>

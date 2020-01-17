<template>
<section>
  <!--工具条-->
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form inline :model="querySubRoleInfo">
      <el-row>
        <el-form-item>
          <el-input v-model="querySubRoleInfo.code" placeholder="角色代码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="querySubRoleInfo.name" placeholder="角色名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model='querySubRoleInfo.status' placeholder='请选择状态' clearable>
            <el-option label='有效' value='0'></el-option>
            <el-option label='无效' value='1'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery()">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-col>

  <!--列表-->
  <el-table :data="subRoleList" highlight-current-row :header-cell-style="{background:'#eef1f6',color:'#606266'}" v-loading="listLoading" style="width: 100%;">
    <el-table-column prop="code" label="角色代码" min-width="120" align="center">
    </el-table-column>
    <el-table-column prop="name" label="角色名称" min-width="120" align="center">
    </el-table-column>
    <el-table-column prop="status" label="状态" min-width="120" :formatter='formatterStatus' align="center">
    </el-table-column>
    <el-table-column prop="modifiedUser" label="修改用户" min-width="120" align="center">
    </el-table-column>
    <el-table-column prop="modifiedDate" label="修改时间" min-width="180" :formatter='formatterTime' align="center">
    </el-table-column>
    <el-table-column label="操作" width="250" fixed="right" align="center">
      <template slot-scope="scope">
        <el-button size="mini" @click="updateRole(scope.$index, scope.row)">修改</el-button>
        <el-button size="mini" @click="grantAuthority(scope.$index, scope.row)">权限</el-button>
        <el-button type="danger" size="mini" @click="stopRole(scope.$index, scope.row)">停用</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!--工具条-->
  <el-col :span="24" class="toolbar">
    <el-button type="primary" icon="el-icon-plus" @click='addNewRole'>新增子角色</el-button>
    <el-pagination :page-sizes="[10, 20, 30,40,100]" :pager-count="5" @size-change="handleSizeChange" @current-change='handleCurrentChange' :page-size='pageSize' layout='total, sizes, prev, pager, next, jumper' :total='currentTotal' style="float:right;">
    </el-pagination>
  </el-col>

  <el-dialog title="编辑" :visible.sync="updateFormShow" :close-on-click-modal="false" custom-class="dialog">
    <el-form label-width="120px">
      <el-form-item label="角色代码" >
        <el-input v-model="subRoleInfo.code" style="width:220px" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色名称">
        <el-input v-model="subRoleInfo.name" style="width:220px" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色状态">
        <el-select v-model='subRoleInfo.status' style="width:220px" clearable>
          <el-option label='有效' value='0'></el-option>
          <el-option label='无效' value='1'></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="updateFormShow = false">取消</el-button>
      <el-button type="primary" @click.native="updateSubmit">提交</el-button>
    </div>
  </el-dialog>
  <!--新建角色  -->
  <el-dialog title="新建" :visible.sync="addFormShow" :close-on-click-modal="false" custom-class="dialog">
    <el-form label-width="120px">
      <el-form-item label="角色代码">
        <el-input v-model="addRoleData.code" style="width:220px" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色名称">
        <el-input v-model="addRoleData.name" style="width:220px" clearable></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="addFormShow = false">取消</el-button>
      <el-button type="primary" @click.native="addRole">提交</el-button>
    </div>
  </el-dialog>
  <!--权限  -->
  <el-dialog title="权限" :visible.sync="resourceFormShow" :close-on-click-modal="false" custom-class="dialog">
    <el-tree ref="resourceTree" :data="resourceData" :props="resourceProps"  node-key="resourceId"
    :default-expanded-keys="resIds" :default-checked-keys="resIds"  show-checkbox>
      <!-- :default-expanded-keys="resIds" :default-checked-keys="resIds" check-strictly show-checkbox node-key="roleId"-->
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="resourceFormShow = false">取消</el-button>
      <el-button type="primary" @click.native="resourceSubmit">提交</el-button>
    </div>
  </el-dialog>
</section>
</template>
<script>
import {
  Account
} from '@/api'

export default {
  data() {
    return {
      listLoading: false,
      stopRoleTipFlag: false,
      updateFormShow: false,
      addFormShow: false,
      resourceFormShow: false,
      subRoleList: null,
      resIds: [],
      roleId: '',
      resourceData: [],
      resourceProps: {
        children: 'children',
        label: 'resourceName'
      },
      currentTotal: 0,
      currentPage: 1,
      pageSize: 10,
      addRoleData: {
        code: '',
        name: '',
        resourceList: ''
      },
      subRoleInfo: '',
      querySubRoleInfo: {
        roleId: '',
        code: '',
        name: '',
        status: ''
      }
    }
  },
  methods: {
    //修改子角色（弹出修改框）
    updateRole(index, row) {
      this.updateFormShow = true
      var param = {
        roleId: row.roleId
      }
      Account.getSubRoleDetail(param).then((res) => {
        this.subRoleInfo = res.subRoleInfo
      })
    },
    //提交修改
    updateSubmit() {
      var param = {
        'roleId': this.subRoleInfo.roleId,
        'code': this.subRoleInfo.code,
        'name': this.subRoleInfo.name,
        'status': this.subRoleInfo.status
      }
      if (this.subRoleInfo.code == null || this.subRoleInfo.code == '' || this.subRoleInfo.code == undefined) {
        this.$message({
          type: 'info',
          message: 'code不可为空'
        })
        return
      }
      if (this.subRoleInfo.name == null || this.subRoleInfo.name == '' || this.subRoleInfo.name == undefined) {
        this.$message({
          type: 'info',
          message: '名称不可为空'
        })
        return
      }
      Account.updateSubRole(param).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.updateFormShow = false
        this.handleQuery()
      })
    },
    //删除子角色
    stopRole(index, row) {
      this.$confirm('是否删除该角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          'roleId': row.roleId
        }
        Account.deleteSubRole(params).then((res) => {
          if (res.result == 1) {
            this.$message({
              type: 'error',
              message: res.resultMessage + '!'
            })
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.handleQuery()
          }
        })
      }).catch(() => {

      })
    },
    //页码变换后根据页码查询
    handleCurrentChange(val) {
      this.currentPage = val
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        roleId: this.querySubRoleInfo.roleId,
        code: this.querySubRoleInfo.code,
        name: this.querySubRoleInfo.name,
        status: this.querySubRoleInfo.status
      }
      this.handleQuery(params)
    },
    handleSizeChange(val) {
      this.pageSize = val
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        roleId: this.querySubRoleInfo.roleId,
        code: this.querySubRoleInfo.code,
        name: this.querySubRoleInfo.name,
        status: this.querySubRoleInfo.status
      }
      this.handleQuery(params)
    },
    //添加子角色
    addNewRole() {
      this.addRoleData.code = ''
      this.addRoleData.name = ''
      this.addFormShow = true
    },
    addRole() {
      const para = {
        'code': this.addRoleData.code,
        'name': this.addRoleData.name
      }
      if (this.addRoleData.code == null || this.addRoleData.code == '' || this.addRoleData.code == undefined) {
        this.$message({
          type: 'info',
          message: 'code不可为空'
        })
        return
      }
      if (this.addRoleData.name == null || this.addRoleData.name == '' || this.addRoleData.name == undefined) {
        this.$message({
          type: 'info',
          message: '名称不可为空'
        })
        return
      }
      Account.addNewSubRole(para).then((res) => {
        if (res.result == 0) {
          this.handleQuery()
          this.addFormShow = false
        }
      })
    },
    handleQuery(params) {
      this.listLoading = true
      var data = {
        roleId: this.querySubRoleInfo.roleId,
        code: this.querySubRoleInfo.code,
        name: this.querySubRoleInfo.name,
        status: this.querySubRoleInfo.status,
        pageSize: this.pageSize
      }
      data.currentPage = 1
      data = params || data
      Account.getSubRoleList(data).then((res) => {
        if (res&&res.subRoleList&&res.subRoleList.length>0) {
          this.subRoleList = res.subRoleList
          this.currentTotal = res.records
          this.listLoading = false
        }else {
          this.subRoleList=[]
          this.listLoading = false
        }
      })
    },
    formatterTime(row, column) {
      var date = row[column.property]
      if (date === undefined) {
        return ''
      }
      var now = new Date(date)
      var year = now.getFullYear()
      var month = now.getMonth() + 1
      if (month < 10) {
        month = '0' + month

      }
      var date2 = now.getDate()
      if (date2 < 10) {
        date2 = '0' + date2
      }
      var hour = now.getHours()
      if (hour < 10) {
        hour = '0' + hour
      }
      var minute = now.getMinutes()
      if (minute < 10) {
        minute = '0' + minute
      }
      var second = now.getSeconds()

      if (second < 10) {
        second = '0' + second
      }
      return year + '-' + month + '-' + date2 + ' ' + hour + ':' + minute
    },
    formatterStatus(row, column) {
      var status = row[column.property]
      if (status == 1) {
        return '无效'
      } else if (status == 0) {
        return '有效'
      }

    },
    //权限设置
    //权限设置index, row
    grantAuthority(index, row) {
      var para = {
        roleId : row.roleId
      }
      this.roleId = row.roleId
      Account.getResourceList(para).then((res) => {
        this.resourceData = res.resourceList

        res.resIds.forEach((id, index)=> {
          res.resourceList.forEach((value)=>{
            if(id === value.resourceId && value.children && value.children.length > 0){
              res.resIds.splice(index, 1)
            }
          })
        })

        this.resIds = res.resIds
        this.resourceFormShow = true
      })
    },
    //资源修改
    resourceSubmit() {
      console.log(this.$refs.resourceTree.getHalfCheckedKeys().concat(this.$refs.resourceTree.getCheckedKeys()))
      console.log(this.$refs.resourceTree.getCheckedKeys())
      let s = new Set()
      s = this.checkParendId(this.$refs.resourceTree.getCheckedKeys(),s)
      console.log(s)
      var para = {
        roleId : this.roleId,
        resourceList : s
      }
      Account.updateSubRoleAndResource(para).then((res) =>{
        console.log(res)
        if(res.result==0){
          this.roleId = ''
          this.resourceData = []
          this.resIds = []
          this.resourceFormShow = false
        }
      })
    },
    checkParendId(list, s) {
      list.forEach((value) => {
        s.add(value)
        console.log(this.resourceData)
        this.resourceData.forEach((v) => {
          if(value === v.resourceId && v.parentId !== '0'){
            s.add(v.parentId)
          }

          if(v.children){
             v.children.forEach((child) => {
               if(value === child.resourceId && child.parentId !== '0'){
                s.add(child.parentId)
              }
             })
          }
        })

      })

      return s
    }
  },
  created: function() {
    this.handleQuery()
  },
}
</script>
<style lang="less" scoped>
/deep/.dialog {
    width: 30%;
    min-width: 20rem;
}
</style>

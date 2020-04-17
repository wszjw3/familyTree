<template>
  <div>
    <el-breadcrumb class="header" separator="/">
      <el-breadcrumb-item class="el-breadcrumb" :to="{ path: '/myManage' }">我管理的家谱</el-breadcrumb-item>
      <el-breadcrumb-item class="el-breadcrumb">{{familyName}}</el-breadcrumb-item>
      <el-breadcrumb-item class="el-breadcrumb">任务列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div>
        <span :class="['tab', activeTab === '1' ? 'tab-active' : '']" @click="handleTabChange('1')">未处理</span>
        <span :class="['tab', activeTab === '2' ? 'tab-active' : '']" @click="handleTabChange('2')">已处理</span>
      </div>
      <div class="bg-white" v-show="activeTab === '1'">
        <div class="flex">
          <div class="inline-block flex-1">
            <div class="inline-block">
              <el-select v-model="unProcess.apply_type" placeholder="申请事项">
                <el-option label="成员信息变更" value="2"></el-option>
                <el-option label="成员认领" value="1"></el-option>
              </el-select>
            </div>
            <div class="inline-block ml-md">
              <el-date-picker
                  v-model="unProcess.date"
                  type="daterange"
                  range-separator="~"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
              />
            </div>
            <div class="inline-block ml-md">
              <el-button class="btn search" @click="handleSearch('no')">搜索</el-button>
              <el-button class="btn reset" @click="reset('no')">重置</el-button>
            </div>
          </div>
          <el-button class="btn confirm" @click="confirm">同意</el-button>
          <el-button class="btn refuse" @click="refuse">拒绝</el-button>
        </div>
        <div class="mt-md">
          <el-table
            :data="unProcess.tableData"
            highlight-current-row
            @current-change="handleSelectionChange"
            :header-cell-style="{backgroundColor: 'rgba(248,250,252,1)', color: 'rgba(52,73,94,1)'}"
          >
            <el-table-column width="50">
              <template slot-scope="scope">
                <img class="checkbox" :src="selection === scope.row.task_id ? checkboxSelectedImg : checkboxImg">
              </template>
            </el-table-column>
            <el-table-column prop="apply_name" label="申请人姓名"></el-table-column>
            <el-table-column prop="apply_task_type_desc" label="申请事项"></el-table-column>
            <el-table-column prop="apply_change_content" label="申请内容"></el-table-column>
            <el-table-column prop="apply_time" label="申请时间"></el-table-column>
            <el-table-column prop="status_desc" label="状态"></el-table-column>
          </el-table>
          <el-pagination
            style="float:right"
            @current-change="val => {handleCurrentChange(val, 'no')}"
            :current-page="unProcess.page"
            layout="prev, pager, next"
            :total="unProcess.records"
          >
          </el-pagination>
        </div>
      </div>
      <div class="bg-white" v-show="activeTab === '2'">
        <div class="mt-md flex">
          <div class="inline-block flex-1">
            <div class="inline-block">
              <el-select v-model="processed.apply_type" placeholder="申请事项">
                <el-option label="成员信息变更" value="2"></el-option>
                <el-option label="成员认领" value="1"></el-option>
              </el-select>
            </div>
            <div class="inline-block ml-md">
              <el-date-picker
                  v-model="processed.date"
                  type="daterange"
                  range-separator="~"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
              />
            </div>
          </div>
          <el-button class="btn search" @click="handleSearch('yes')">搜索</el-button>
          <el-button class="btn reset" @click="reset('yes')">重置</el-button>
        </div>
        <div class="mt-md">
          <el-table
            :data="processed.tableData"
            :header-cell-style="{backgroundColor: 'rgba(248,250,252,1)', color: 'rgba(52,73,94,1)'}"
          >
            <el-table-column prop="apply_name" label="申请人姓名"></el-table-column>
            <el-table-column prop="apply_task_type_desc" label="申请事项"></el-table-column>
            <el-table-column prop="apply_change_content" label="申请内容"></el-table-column>
            <el-table-column prop="apply_time" label="申请时间"></el-table-column>
            <el-table-column prop="status_desc" label="状态"></el-table-column>
          </el-table>
          <el-pagination
            style="float:right"
            @current-change="val => {handleCurrentChange(val, 'yes')}"
            :current-page="processed.page"
            layout="prev, pager, next"
            :total="processed.records"
          >
          </el-pagination>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Family } from '@/api'
import checkboxSelectedImg from '@/assets/imgs/checkbox_selected.png'
import checkboxImg from '@/assets/imgs/checkbox.png'
export default {
  name: 'Task',
  data () {
    return {
      checkboxSelectedImg,
      checkboxImg,
      activeTab: '1',
      unProcess: {
        apply_type: '',
        date: [],
        status: 0,
        page: 1,
        records: 0,
        tableData: []
      },
      processed: {
        apply_type: '',
        date: [],
        status: 1,
        page: 1,
        records: 0,
        tableData: []
      },
      selection: ''

    }
  },
  created () {
    this.getDefaultDateRange('all')
    this.handleSearch('no')
    this.handleSearch('yes')
  },
  computed: {
    familyName () {
      return this.$router.currentRoute.query.familyName
    },
    userId () {
      return this.$store.getters.getToken.user_id
    }
  },
  methods: {
    handleTabChange (tab) {
      this.activeTab = tab
    },
    getDefaultDateRange(type) {
      if (type === 'all') {
        this.unProcess.date = []
        this.processed.date = []
      } else if (type === 'no') {
        this.unProcess.date = []
      } else {
        this.processed.date = []
      }
			this.unProcess.date = []
			this.processed.date = []
			var date = new Date()
			var seperator1 = '-'
			var year = date.getFullYear()
			var month = date.getMonth() + 1
			var strDate = date.getDate()
			if (month >= 1 && month <= 9) {
				month = '0' + month
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = '0' + strDate
      }
      if (type === 'all') {
        this.unProcess.date.push(
          year + seperator1 + month + seperator1 + strDate
        )
        this.processed.date.push(
          year + seperator1 + month + seperator1 + strDate
        )
      } else if (type === 'no') {
        this.unProcess.date.push(
          year + seperator1 + month + seperator1 + strDate
        )
      } else {
        this.processed.date.push(
          year + seperator1 + month + seperator1 + strDate
        )
      }

			date.setDate(date.getDate() - 7)
			year = date.getFullYear()
			month = date.getMonth() + 1
			strDate = date.getDate()
			if (month >= 1 && month <= 9) {
				month = '0' + month
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = '0' + strDate
      }

      if (type === 'all') {
        this.unProcess.date.unshift(
          year + seperator1 + month + seperator1 + strDate
        )
        this.processed.date.unshift(
          year + seperator1 + month + seperator1 + strDate
        )
      } else if (type === 'no') {
        this.unProcess.date.unshift(
          year + seperator1 + month + seperator1 + strDate
        )
      } else {
        this.processed.date.unshift(
          year + seperator1 + month + seperator1 + strDate
        )
      }
		},
    handleSearch (type) {
      let params = {}
      params = type === 'no' ? this.unProcess : this.processed
      params.user_id = this.userId
      params.start_time = type === 'no' ? this.unProcess.date[0] : this.processed.date[0]
      params.end_time = type === 'no' ? this.unProcess.date[1] : this.processed.date[1]
      params.page = type === 'no' ? this.unProcess.page : this.processed.page
      Family.checkTaskList(params).then(res => {
        if (res.code === '000000') {
          if (type === 'no') {
            this.unProcess.tableData = res.data.taskList.map(v => {
              v.apply_task_type_desc = v.apply_task_type === '2' ? '成员信息变更' : '成员认领'
              v.status_desc = '未处理'
              return v
            })
            this.unProcess.records = res.data.count
          } else {
            this.processed.tableData = res.data.taskList.map(v => {
              v.apply_task_type_desc = v.apply_task_type === '2' ? '成员信息变更' : '成员认领'
              v.status_desc = v.status === '1' ? '审核通过' : '审核拒绝'
              return v
            })
            this.processed.records = res.data.count
          }
        }
      })
    },
    handleCurrentChange (val, type) {
      if (type === 'no') {
        this.unProcess.page = val
      } else {
        this.processed.page = val
      }
      this.handleSearch(type)
    },
    refuse () {
      const params = {
        task_id: this.selection
      }
      Family.auditRefusedTask(params).then(res => {
        if (res.code === '000000') {
          this.$alert('操作成功')
          this.unProcess.page = 1
          this.selection = []
          this.handleSearch('no')
          this.handleSearch('yes')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    confirm () {
      const params = {
        task_id: this.selection
      }
      Family.auditPassTask(params).then(res => {
        if (res.code === '000000') {
          this.$alert('操作成功')
          this.unProcess.page = 1
          this.selection = []
          this.handleSearch('no')
          this.handleSearch('yes')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    reset (type) {
      if (type === 'no') {
        this.unProcess = {
          apply_type: '',
          date: [],
          status: 0,
          page: 1,
          records: 0,
          tableData: []
        }
        this.selection = []
        this.getDefaultDateRange('no')
      } else {
        this.processed = {
          apply_type: '',
          date: [],
          status: 1,
          page: 1,
          records: 0,
          tableData: []
        }
        this.getDefaultDateRange('yes')
      }
    },
    handleSelectionChange (val) {
      this.selection = val.task_id
    }
  }
}
</script>

<style scoped lang="less">
.el-breadcrumb {
  font-size:20px;
  font-weight:500;
  color:rgba(52,73,94,1);
  line-height:28px;
}
.tab {
  width:110px;
  height:40px;
  line-height:40px;
  text-align: center;
  background:rgba(232,235,238,1);
  border-radius:4px;
  margin-right: 10px;
  display: inline-block;
  font-size:14px;
  font-weight:500;
  color: rgba(52,73,94,1);
  cursor: pointer;
}
.tab-active {
  border:2px solid rgba(52,152,219,1);
  color:rgba(52,152,219,1);
}
.header {
  font-size: 18px;
  padding: 0 0 20px 0;
  margin: 0;
}
.desc {
  display: inline-block;
  width: 23%;
  border-right: 5px solid #000;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
}
.mt-md {
  margin-top: 20px
}
.ml-md {
  margin-left: 20px
}
.text-red {
  color: red;
  margin-left: 20px
}
.inline-block {
  display: inline-block;
}
.align-right {
  text-align: right;
}
.flex {
  display: flex;

  .flex-1 {
    flex: 1
  }
}
.refuse {
  color: red;
  border: 1px solid red;
  background-color: #fff;
}
.checkbox {
  cursor: pointer;
  margin-top: 5px;
}
.bg-white {
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

.btn {
  width:78px;
  height:40px;
  border-radius:4px;
  font-weight: 600px;
}
.search {
  background:rgba(87,208,146,1);
  border: 1px solid rgba(87,208,146,1);
  color: #fff;
}

.reset {
  background:#fff;
  border: 1px solid rgba(87,208,146,1);
  color: rgba(87,208,146,1);;
}

.confirm {
  background:rgba(87,208,146,1);
  border: 1px solid rgba(87,208,146,1);
  color: #fff;
}

.refuse {
  background:#fff;
  border: 1px solid rgba(255,109,51,1);
  color: rgba(255,109,51,1);;
}
</style>

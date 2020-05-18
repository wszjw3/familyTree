<template>
  <div class="node-detail">
    <div class="toolbar-wrapper">
      <div class="title">生平信息</div>
      <el-button size="small" @click="handleEdit()">编辑</el-button>
    </div>
    <div class="content">
      <div class="desc">
        <img :src="info.tree_user_img ? info.tree_user_img : avatar" style="cursor:pointer" @click="handleChooseImage" />
        <div>
          <span>{{ info.name }}</span>

        </div>
        <div class="mt-md">
          <span v-if="info.brith_time">生于{{ info.brith_time }}</span>
          <span v-if="info.death_time">死于{{ info.death_time }}</span>
          <p>出生地址：{{ info.address }}</p>
        </div>
      </div>
      <div class="mt-md">
        {{info.labelName}}
      </div>
      <div class="clear-both">
        <template v-if="status === 'view'">
          <div
            v-for="(item, idx) in info.familyLifeTimeHisList"
            :key="idx"
            class="mt-md"
          >
            {{
              item.age
                ? item.age + '岁 ' + item.userTime + ' ' + item.lifeDescription
                : item.userTime + ' ' + item.lifeDescription
            }}
          </div>
        </template>
        <template v-else>
          <div class="mt-md">
            我的标签：
          </div>
          <div class="tag-wrapper">
            <div
              v-for="(item, idx) in tags"
              :key="idx"
              class="tag"
              :class="selectTag.includes(item.label_id) ? 'active' : ''"
              @click="handleChooseTag(item)"
            >
              {{ item.label_name }}
            </div>
          </div>
          <div class="mt-md">
            <p>教育经历</p>
            <div
              v-for="(item, idx) in tableData"
              :key="idx"
              class="flex"
            >
              <div style="width: 33%">{{item.record_date}}</div>
              <div style="width: 33%; text-align: center">{{item.academic}}</div>
              <div style="width: 33%; text-align: right">
                {{item.school_name}}
                <img :src="closePng" style="cursor: pointer;margin-left: 5px" @click="handleDelete(item)">
              </div>
            </div>

            <div class="add-cloumn" @click="handleShowModal">
              继续添加
            </div>
          </div>
          <!-- <div class="card">
            <span class="float-left">个人照片：</span>
            <div class="img-upload" @click="handleChooseImage">
              <template v-if="!uploadImg">
                +
              </template>
              <img v-else :src="uploadImg" alt="" class="fit" />
            </div>
          </div> -->
          <div class="operation">
            <el-button
              type="primary"
              @click="handleConfirm"
              :disabled="confirming"
              >确认修改</el-button
            >
            <el-button  @click="handleCancel"
              >取消</el-button
            >
          </div>
        </template>
      </div>
    </div>
    <input
      class="hidden"
      type="file"
      accept="image/*"
      id="file"
      @input="getImage"
    />
    <el-dialog title="编辑教育经历" :visible.sync="academicModal" width="90%" center>

          <el-table :data="addRowData" class="table" style="width: 100%">
            <el-table-column align="left" prop="record_date" label="日期">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.record_date"
                  type="date"
                  editable
                  placeholder="选择日期"
                  class="input"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column align="left" prop="academic" label="学历">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.academic"
                  placeholder="请选择"
                  class="input"
                  allow-create
                  filterable
                  default-first-option
                >
                  <el-option
                    v-for="item in education"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="left" prop="school_name" label="学校">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.school_name"
                  class="input"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot-scope="scope">
                <el-button class="btn donate" @click="handleDeleteModalColumn(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div style="text-align: center; margin-top: 20px">
            <el-button class="btn" @click="handleCancelAddColumn">取消</el-button>
            <el-button class="btn donate" @click="handleAddColumn">继续添加</el-button>
            <el-button class="btn donate" @click="handleSaveModal">保存</el-button>
          </div>
    </el-dialog>
  </div>
</template>

<script>
import closePng from '@/assets/imgs/close_red.png'
import { Family } from '@/api'
import man from '@/assets/imgs/avatar_man.png'
import women from '@/assets/imgs/avatar_women.png'

export default {
  name: 'lifeInfo',
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      closePng,
      avatar: man,
      status: 'view',
      tags: [],
      selectTag: [],
      idx: 0,
      tableData: [],
      addRowData: [],
      education: [
        {
          label: '小学',
          value: '小学'
        },
        {
          label: '初中',
          value: '初中'
        },
        {
          label: '高中',
          value: '高中'
        },
        {
          label: '本科',
          value: '本科'
        },
        {
          label: '硕士',
          value: '硕士'
        },
        {
          label: '博士',
          value: '博士'
        },
        {
          label: '博士后',
          value: '博士后'
        }
      ],
      uploadImg: this.info.tree_user_img ? this.info.tree_user_img : '',
      confirming: false,
      academicModal: false
    }
  },
  watch: {
    info() {
      this.avatar = this.info.sex === '1' ? man : women
      this.handleCancel()
    }
  },
  computed () {
    
  },
  created() {
    this.getLabel()
  },
  methods: {
    handleEdit() {
      if (this.status === 'view') {
        this.status = 'edit'
        this.getEducation()
        this.selectTag = this.info.labelId.split(',')
      }
    },
    getLabel() {
      Family.familyQueryLabel().then(res => {
        if (!res.data) {
          return
        }
        this.tags = res.data
      })
    },
    getEducation() {
      const params = {
        user_id: this.info.user_id
      }
      Family.familyQueryEducation(params).then(res => {
        if (res.data) {
          let idx = 0
          this.tableData = res.data.map(v => {
            idx = idx + 1
            v.idx = idx
            v.record_date = v.date
            delete v.date
            return v
          })
          this.idx = idx + 1
        }
      })
    },
    handleChooseTag(value) {
      this.selectTag.indexOf(value.label_id) < 0
        ? this.selectTag.push(value.label_id)
        : (this.selectTag = this.selectTag.filter(v => {
            return v !== value.label_id
          }))
    },
    handleDelete(row) {
      if (row.curriculum_id) {
        Family.deleteEducation({
          user_id: this.info.user_id,
          curriculum_id: row.curriculum_id
        }).then(res => {
          if (res.code === '000000') {
            this.$alert('删除成功')
            this.handleCancel()
            this.$emit('success')
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.tableData = this.tableData.filter(v => {
          return v.idx !== row.idx
        })
      }
    },
    handleShowModal () {
      this.addRowData = [
        {
          record_date: '',
          academic: '',
          school_name: ''
        }
      ]
      this.academicModal = true
    },
    handleAddColumn () {
      this.addRowData.push({
          record_date: '',
          academic: '',
          school_name: ''
        })
    },
    handleDeleteModalColumn (scope) {
      this.addRowData.splice(scope.$index, 1)
    },
    handleSaveModal() {
      this.tableData = this.tableData.concat(this.addRowData)
      this.idx++
      this.academicModal = false
    },
    handleCancelAddColumn () {
      this.academicModal = false
      this.addRowData = [
        {
          record_date: '',
          academic: '',
          school_name: ''
        }
      ]
    },
    handleConfirm() {
      this.confirming = true
      let params = {}
      let label_list = []
      this.selectTag.forEach(item => {
        this.tags.forEach(key => {
          if (item === key.label_id) {
            label_list.push(key)
          }
        })
      })
      params.label_list = label_list
      // params.tree_user_img = this.uploadImg
      params.record_list = this.tableData
      params.user_id = this.info.user_id
      // params.user_id = '1019'
      Family.familyAddRecord(params).then(res => {
        if (res.code === '000000') {
          this.$alert('保存成功')
          this.handleCancel()
          this.$emit('success')
          this.confirming = false
        } else {
          this.$message.error(res.message)
          this.confirming = false
        }
      })
    },
    handleCancel() {
      this.status = 'view'
      this.selectTag = []
      this.tableData = [
        {
          record_date: '',
          education: '',
          school_name: '',
          idx: 0
        },
        {
          record_date: '',
          education: '',
          school_name: '',
          idx: 1
        }
      ]
      this.uploadImg = ''
      var file = document.getElementById('file')
      file.value = ''
    },
    handleChooseImage() {
      const file = document.getElementById('file')
      var e = document.createEvent('MouseEvents')
      e.initEvent('click', true, true)
      file.dispatchEvent(e)
    },
    getImage() {
      const reads = new FileReader()
      const f = document.getElementById('file').files[0]
      // const size = f.size / 1024
      // if (size > 1) {
      // 	alert('文件大小不能大于1M！')
      // 	f.value = ''
      // 	return false
      // } else if (size <= 0) {
      // 	alert('文件大小不能为0M！')
      // 	f.value = ''
      // 	return false
      // }
      reads.readAsDataURL(f)
      const self = this
      reads.onload = function() {
        self.uploadImg = this.result
        Family.addUserImg({
          user_id: self.info.user_id,
          tree_user_img: self.uploadImg
        }).then(res => {
          if (res.code === '000000') {
            self.info.tree_user_img = self.uploadImg
            self.uploadImg = ''
            self.$message('上传成功')
          }
        })
      }
      
    }
  }
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
}
.space-between {
  justify-content: space-between;
}
.node-detail {
  .toolbar-wrapper {
    border-bottom: 1px solid #ddd;
    height: 30px;
    line-height: 30px;
    display: flex;
    margin: 10px 0;
    padding: 10px 0;
    .title {
      flex: 1;
      font-weight: 650;
      font-size: 24px;
      height: 24px;
      line-height: 24px;
      padding-left: 10px;
    }
  }

  .content {
    .desc {
      height: 100px;

      img {
        float: left;
        width: 100px;
        height: 100px;
        margin-right: 20px;
      }
    }

    .clear-float {
      clear: both;
    }
    .mt-sm {
      margin-top: 8px;
    }
    .mt-md {
      margin-top: 20px;
    }
    .mb-md {
      margin-bottom: 20px;
    }
  }
  .tag-wrapper {
    .tag {
      width: 65px;
      height: 33px;
      line-height: 33px;
      text-align: center;
      background-color: rgba(242, 242, 242, 1);
      border: 1px solid transparent;
      display: inline-block;
      margin: 10px;
      cursor: pointer;
    }
    .active {
      border: 1px solid rgba(24, 144, 255, 1);
    }
  }

  .table {
    margin-top: 20px;

    .action {
      color: rgba(24, 144, 255, 1);
      cursor: pointer;
    }

    .input {
      max-width: 100%;
    }
  }
  .add-cloumn {
    margin-top: 10px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px dashed #ddd;
    cursor: pointer;
  }

  .card {
    margin-top: 20px;
    .img-upload {
      width: 98px;
      height: 94px;
      line-height: 94px;
      border: 1px dashed #2491fc;
      color: #2491fc;
      text-align: center;
      font-size: 26px;
      cursor: pointer;
      display: inline-block;
      margin-top: 20px;
    }
  }
  .operation {
    margin-top: 40px;
    text-align: center;
  }
}
.hidden {
  visibility: hidden;
}
.float-left {
  float: left;
}
.fit {
  width: 100%;
  height: 100%;
}

.text-center {
  text-align: center
}
.btn {
	margin: 5px;
	width: 120px;
	height: 34px;
	border-radius: 4px;
	font-size: 14px;
	font-weight: 500;
	border: none;
}

.donate {
	background: rgba(87, 208, 146, 1);
	color: #fff;
}
</style>

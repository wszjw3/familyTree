<template>
  <div class="search-view">
    <div class="header">
      <div class="name-wrapper">
        <div
          v-for="(item, idx) in nameArray"
          :key="idx"
          :class="idx % 2 === 0 ? 'name-faded' : 'name-white'"
        >
          {{item}}
        </div>
        <div class="statistics">
          已收录全国共
          {{statistics.tree}}
          棵家谱树，总计
          {{statistics.people}}
          人
        </div>
      </div>
      <div class="bg-wrapper">
        <img :src="bgImage"/>
      </div>
      <div class="search-container">
        <div class="title">
          <p>开始您的寻根问祖之旅 </p>
          <p>请按条件进行筛选后，输入姓名搜索</p>
        </div>
        <div class="search-form">
          <p>
            按姓氏
          </p>
          <el-select
            v-model="search.surname"
            style="width: 379px"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option-group
              v-for="group in surnameOpts"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
          <p>
            按地区
          </p>
          <city-picker
            class="input"
            style="width: 379px"
            v-model="search.area"
            placeholder="地区"
          />
          <el-input
            v-model="search.text"
            placeholder="请输入姓名"
            @keydown.enter="handleQuery"
            style="width: 379px; margin-top: 20px"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="handleQuery"
            ></i>
          </el-input>
          <el-button class="search-btn" @click="handleQuery">搜索</el-button>
        </div>
      </div>
    </div>
    
    <div class="result">
      <div v-if="result.length === 0 && searched" class="no-result">
        <span @click="handleCreate" class="routerLink">
          家族谱还未创建，请创建管理
          <a>立即创建</a>
        </span>
      </div>
      <div v-else>
        <h3 v-if="searched">
          搜索结果：共包含 {{ treeCount }} 棵家谱树、{{ totalPeople }} 人
        </h3>
        <result-cmp :data="result" class="mt-md"></result-cmp>
      </div>
    </div>
  </div>
</template>

<script>
import { Family } from '@/api'
import CityPicker from '@/components/city-picker/index.vue'
import ResultCmp from './result'
import bgImage from '@/assets/imgs/family_index_bg.png'
export default {
  name: 'search',
  components: {
    ResultCmp,
    CityPicker
  },
  data() {
    return {
      bgImage,
      nameDis: '',
      areaDis: '',
      search: {
        surname: '',
        area: [],
        text: ''
      },
      result: [],
      searched: false,
      surnameOpts: [],
      statistics: {
        tree: '',
        people: ''
      }
    }
  },
  computed: {
    nameArray() {
      return [
        '赵','周','吴','郑','王','冯','钱','孙','陈','褚','卫','蒋'
      ]
    },
    treeCount() {
      return this.result.length
    },
    totalPeople() {
      let count = 0
      this.result.forEach(item => {
        count += parseInt(item.total)
      })
      return count
    }
  },
  created () {
    this.getSurnameOpts()
    this.getStatistics()
  },
  methods: {
    getStatistics () {
      Family.familyTreeStatistics().then(res => {
        if (res.data) {
          this.statistics.tree = res.data.statistics_number
          this.statistics.people = res.data.people_number
        }
      })
    },
    getSurnameOpts () {
      Family.surnameFind().then(res => {
        if (res.data) {
          this.surnameOpts = res.data.map(v => {
            let obj = {}
            obj.label = v.initials
            obj.options = v.initials_data.map(v => {
              return {
                label: v.surname,
                value: v.surname
              }
            })
            return obj
          })
        }
      })
    },
    handleQuery() {
      let params = {}
      // params.eldest_son_flag = this.$router.query ? this.$router.query.eldest_son_flag : '1'
      params.surname = this.search.surname
      params.prov_code = this.search.area[0] || ''
      params.city_code = this.search.area[1] || ''
      params.area_code = this.search.area[2] || ''
      params.user_name = this.search.text || ''
      Family.familyQuery(params).then(res => {
        this.searched = true
        if (res.data && res.code === '000000') {
          this.result = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleNameChange (item, key) {
      this.nameDis = key
    },
    handleAreaChange (key, item) {
      this.areaDis = item.label + ' - ' + key.label
    },
    handleCreate () {
      if (this.$store.getters.getToken.user_id) {
        this.$router.push('/family/create')
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-view {
  width: 1163px;
  margin: auto;
  .header {
    position: relative;
    height: 500px;

    .name-wrapper {
      width: 474px;
      height: 234px;
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      .name-faded,
      .name-white {
        width: 79px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 50px;
        display: inline-block;
      }
      .name-faded {
        color: #EFF3F5;
        background:rgba(255,255,255,1);
      }

      .name-white {
        color: #fff;
        background: rgba(239,243,245,1);
      }
    }

    .bg-wrapper {
      width:689px;
      height:500px;
      display: inline-block;
      position: absolute;
      top: 0;
      right: 0
    }

    .search-container {
      width:454px;
      height:440px;
      padding-left: 20px;
      background:rgba(255,255,255,1);
      z-index: 2;
      position: absolute;
      left: 0;
      // bottom: -32px;
      top: 150px;
      .title {
        height:66px;
        line-height:33px;
        p {
          font-size:24px;
          font-weight:600;
          color:rgba(52,73,94,1);
        }
      }

      .search-form {
        margin-top: 50px;
        p {
          height:20px;
          font-size:14px;
          font-weight:600;
          color:rgba(52,73,94,1);
          line-height:20px;
        }
        .search-btn {
          width:376px;
          height:44px;
          background:rgba(87,208,146,1);
          border: none;
          border-radius:4px;
          color: #fff;
          margin-top: 20px;
          font-size: 16px;
        }
      }
    }
  }
  .inline-block {
    display: inline-block;
  }
  .ml-md {
    margin-left: 10px;
  }
  .mt-md {
    margin-top: 10px;
  }
  .search-block {
    display: flex;
  }
  .border-bottom-ddd {
    border-bottom: 1px solid #ddd;
  }

  .statistics {
    width:100%;
    height:50px;
    text-align: center;
    line-height: 50px;
    background:rgba(87,208,146,1);
    color: #fff;
    font-size: 24px;
    font-weight: 600;
  }
  .result {
    margin-top: 130px;
    margin-bottom: 100px;
    .no-result {
      text-align: center;
      .routerLink {
        cursor: pointer;
        font-size: 14px;
        color: #000;
        text-decoration: none;
        a {
          color: #169bd5;
          text-decoration: underline;
        }
      }
    }
  }
  .celebrity {
    color: #000;
    text-decoration: none;
  }
  .border {
    border: 1px solid rgba(201, 201, 201, 1);
    width: 200px;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    border-radius: 4px;
  }
  .text-faded {
    color: #AEAEAE;
    margin-right: 10px;
  }
}
</style>

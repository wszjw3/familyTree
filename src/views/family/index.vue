<template>
  <div>
    <!-- <div class="header">
      <div class="header-title">
        <h2>
          根深叶茂
        </h2>
      </div>
      <el-button type="success">创建新家谱</el-button>
      <div v-if="isLogin" class="user-container">
        <span class="username">{{userName}}</span>
        <span class="exit">[退出]</span>
      </div>
    </div> -->

    <div class="search-container">
      <h3>开始您的寻根问祖之旅 请按条件进行筛选后，输入姓名搜索</h3>
      <div class="search-block">
        按条件选择：
        <div class="inline-block ml-md border">
          <span class="text-faded">
            按姓氏：
          </span>
          {{nameDis}}
        </div>
        <div class="inline-block ml-md border">
          <span class="text-faded">
            按地区：
          </span>
          {{areaDis}}
        </div>
        <div class="inline-block ml-md">
          <el-input v-model="search.text" @keydown.enter="handleQuery">
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="handleQuery"
            ></i>
          </el-input>
        </div>
      </div>
      <div class="search-block border-bottom-ddd">
        <div style="height: 30px;line-height: 30px">
          按姓氏选择：
        </div>
        <div class="ml-md inline-block" style="flex: 1">
          <LetterCmp v-model="search.surname" @input="handleQuery" @change="handleNameChange" />
        </div>
      </div>
      <div class="search-block">
        <div style="height: 50px;line-height: 50px">
          按地区选择：
        </div>
        <div class="ml-md inline-block" style="flex: 1">
          <AreaCmp v-model="search.area" @input="handleQuery" @change="handleAreaChange"/>
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
import LetterCmp from '@/components/search/letter'
import AreaCmp from '@/components/search/area'
import ResultCmp from './result'
export default {
  name: 'search',
  components: {
    LetterCmp,
    AreaCmp,
    ResultCmp
  },
  data() {
    return {
      nameDis: '',
      areaDis: '',
      search: {
        surname: '',
        area: [],
        text: ''
      },
      result: [],
      searched: false
    }
  },
  computed: {
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
  methods: {
    handleQuery() {
      let params = {}
      params.eldest_son_flag = this.$router.query ? this.$router.query.eldest_son_flag : '1'
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
.header {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  overflow: hidden;
  position: relative;
  min-height: 35px;

  .header-title {
    flex: 1;
    min-width: 1px;
    max-width: 100%;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
  }
}
.user-container {
  .username {
    font-size: 14px;
    margin-left: 20px;
  }
  .exit {
    margin-left: 20px;
  }
}
.banner {
  padding: 20px 80px;
  background-color: #000;
  color: #fff;
  font-size: 24px;
  font-weight: 600;

  .num {
    font-size: 32px;
    color: #7fbc5d;
  }
}
.search-container {
  .search-block {
    margin: 20px 0;
    display: flex;
    align-items: center;
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
.result {
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
</style>

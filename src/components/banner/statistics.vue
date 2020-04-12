<template>
  <div class="banner-statistics">
      <template v-if="!statistics.isShow">
        已收录全国共
        <span class="num">{{tree}}</span>
        棵家谱树，总计
        <span class="num">{{people}}</span>
        人
      </template>
      <template v-if="statistics.isShow">
        当前家谱树枝繁叶茂，已收录 
        <span class="num">{{statistics.family_number}}</span>
        人，近3个月 死亡
        <span class="num">{{statistics.death_number}}</span>
        人，新增
        <span class="num">{{statistics.beath_number}}</span>
        人。
      </template>
      <span v-if="detail.isShow && detail.count > 0" class="detail">
        该地区还有{{detail.count}}棵{{detail.surname}}氏家谱树，
        <a class="link" @click="handleViewModal">点击查看</a>
      </span>
      <el-dialog :title="title" :visible.sync="isShow" width="80%">
        <result-cmp :data="result" class="mt-md"></result-cmp>
      </el-dialog>
    </div>
</template>

<script>
import { Family } from '@/api'
import ResultCmp from '@/views/front/family/result'
export default {
  name: 'Statistics',
  components: {
    ResultCmp
  },
  props: {
    detail: {
      type: Object,
      default () {
        return {
          isShow: false,
          count: 0,
          surname: '',
          area_code: '',
          city_code: '',
          prov_code: '',
          city_name: '',
          area_name: '',
          prov_name: '',
          areaName: '',
          people: 0
        }
      }
    },
    statistics: {
      type: Object,
      default () {
        return {
          isShow: false,
          family_number: '',
          death_number: '',
          beath_number: '',
        }
      }
    }
  },
  data () {
    return {
      tree: 0,
      people: 0,
      isShow: false,
      result: []
    }
  },
  computed: {
    title () {
      return '搜索结果：' + this.detail.prov_name + this.detail.city_name + this.detail.area_name + ' 包含其他' + this.detail.count + '棵“' + this.detail.surname + '”姓家谱树 、' + this.detail.userCount + ' 人'
    }
  },
  created () {
    Family.familyTreeStatistics().then(res => {
      if (res.data) {
        this.tree = res.data.statistics_number
        this.people = res.data.people_number
      }
    })
  },
  methods: {
    handleQuery() {
      let params = {}
      params.surname = this.detail.surname
      params.area_code = this.detail.area_code
      params.city_code = this.detail.city_code
      params.prov_code = this.detail.prov_code
      Family.familyQuery(params).then(res => {
        if (res.data && res.code === '000000') {
          this.result = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleViewModal () {
      this.isShow = true
      this.handleQuery()
    }
  }
}
</script>

<style scoped lang="less">
.banner-statistics {
    padding: 20px 250px;
    background-color: #000;
    color: #fff;
    font-size: 24px;
    font-weight: 600;

    .num {
      font-size: 32px;
      color: #7fbc5d;
    }

    .normal {
      font-size: 14px;
      margin-left: 20px;
    }
  }
.detail {
  font-size: 16px;
  font-weight: normal;
  margin-left: 30px;

  .link {
    cursor: pointer;
    color: #2491FC;
    text-decoration: underline;
  }
}
</style>
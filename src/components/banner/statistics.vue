<template>
  <div class="banner-statistics">
      已收录全国共
      <span class="num">{{tree}}</span>
      棵家谱树，总计
      <span class="num">{{people}}</span>
      人
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
          areaName: '',
          people: 0
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
      return '搜索结果：' + this.detail.areaName + ' 包含其他' + this.detail.count + '棵“' + this.detail.surname + '”姓家谱树 、' + this.detail.people + ' 人'
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
      params.eldest_son_flag = '0'
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
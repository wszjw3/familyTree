<template>
  <el-row :gutter="20">
    <div class="statistics">
      已收录全国共
      {{statistics.tree}}
      棵家谱树，总计
      {{statistics.people}}
      人
    </div>
    <el-col :span="12" class="pa-md">
      <p class="title">
        家谱繁荣度排名TOP10
      </p>
      <div
        v-for="(item, idx) in familyData"
        :key="idx"
        class="table-item"
      >
        <div :class="['rank', idx < 3 ? 'bg-orange' : '']">
          {{item.idx}}
        </div>
        <div class="name">
          {{item.family_name}}
        </div>
        <div class="score">
          {{item.family_score}}
        </div>
      </div>
    </el-col>
    <el-col :span="12" class="pa-md">
      <p class="title">
        个人捐献排名TOP10
      </p>
      <div
        v-for="(item, idx) in manageData"
        :key="idx"
        class="table-item"
      >
        <div :class="['rank', idx <=3 ? 'bg-orange' : '']">
          {{item.idx}}
        </div>
        <div class="name">
          {{item.manage_name}}
        </div>
        <div class="score">
          {{item.manage_number}}
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { Family } from '@/api'
export default {
  name: 'Rank',
  data() {
    return {
      familyData: [],
      manageData: [],
      statistics: {
        tree: '',
        people: ''
      }
    }
  },
  created() {
    this.getStatistics()
    this.getTableData()
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
    getTableData() {
      Family.familyHomePageFind().then((res) => {
        if (res.code === '000000' && res.data) {
          this.familyData = res.data.family.map((v, i) => {
            v.idx = i + 1
            return v
          })
          this.manageData = res.data.manage.map((v, i) => {
            v.idx = i + 1
            return v
          })
        }
      })
    },
  },
}
</script>

<style scoped lang="less">
.statistics {
  width:100%;
  height:58px;
  line-height:58px;
  background:rgba(79,198,124, 0.25);
  border-radius:4px;
  text-align: center;
  font-size: 14px;
  color: rgba(79,198,124,1);
}
.title {
  font-size:20px;
  font-weight:bold;
  color:rgba(52,73,94,1);
  line-height:24px;
}

.pa-md {
  padding: 10px 40px;
}

.table-item {
  height: 50px;
  line-height: 50px;
  background: #fff;
  margin: 5px 0;
  display: flex;
  align-items: center;
  position: relative;

  .rank {
    width:50px;
    height:50px;
    background:rgba(87,208,146,1);
    border-radius:4px;
    font-size:28px;
    font-weight:bold;
    color:rgba(255,255,255,1);
    text-align: center;
  }

  .name {
    font-size:16px;
    font-weight:500;
    color:rgba(52,73,94,1);
    line-height:22px;
    margin-left: 20px;
  }

  .score {
    font-size:16px;
    font-weight:500;
    color:rgba(79,198,124,1);
    line-height:22px;
    position: absolute;
    right: 20px;
  }

  .bg-orange {
    background: rgba(252,100,45,1);
  }
}
</style>

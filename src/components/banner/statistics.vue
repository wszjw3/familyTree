<template>
  <div class="banner">
      已收录全国共
      <span class="num">{{tree}}</span>
      棵家谱树，总计
      <span class="num">{{people}}</span>
      人
    </div>
</template>

<script>
import { Family } from '@/api'
export default {
  name: 'Statistics',
  data () {
    return {
      tree: 0,
      people: 0
    }
  },
  created () {
    Family.familyTreeStatistics().then(res => {
      if (res.data) {
        this.tree = res.data.statistics_number
        this.people = res.data.people_number
      }
    })
  }
}
</script>

<style scoped lang="less">
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

    .normal {
      font-size: 14px;
      margin-left: 20px;
    }
  }
</style>
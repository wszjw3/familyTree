<template>
  <div>
    <div class="banner">
      已收录全国共
      <span class="num">3000</span>
      棵家谱树，总计
      <span class="num">1111111</span>
      人
      <span class="normal">
        该地区还有6棵孔氏家族谱，
        <a>点击查看</a>
      </span>
    </div>
    <el-row>
      <el-col :span="16">
        <p>
          首页 > {{title}}
        </p>
        <family-tree :title="title" :data="familyTreeData"/>
      </el-col>
      <el-col :span="8">
        <p>
          捐献记录
          <el-button type="success" size="small">捐赠</el-button>
          <el-button type="primary" size="small">导出家谱树</el-button>
          <el-button type="primary" size="small">分享</el-button>
        </p>
        <h2 class="familytree-info-title">
          家谱树信息
        </h2>
        <div
          v-for="(item, idx) in familytreeInfo"
          :key="'familytreeInfo_' + idx"
          class="familytree-item"
        >
          <span>
            {{item.label + '： '}}
          </span>
          <span>
            {{item.name}}
          </span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import FamilyTree from '@/components/familytree/index'
export default {
  name: 'Detail',
  components: {
    FamilyTree
  },
  computed: {
    title () {
      return '【孔】回山井塘孔氏'
    },
    familytreeInfo () {
      return [
        {
          label: '家谱名称',
          name: '[孔]回山井塘孔氏'
        },
        {
          label: '家谱名称',
          name: '[孔]回山井塘孔氏'
        },
        {
          label: '家谱名称',
          name: '[孔]回山井塘孔氏'
        },
        {
          label: '家谱名称',
          name: '[孔]回山井塘孔氏'
        },
        {
          label: '家谱名称',
          name: '[孔]回山井塘孔氏'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.banner {
  padding: 20px 80px;
  background-color: #000;
  color: #fff;
  font-size: 24px;
  font-weight: 600;

  .num {
    font-size: 32px;
    color: #7FBC5D
  }

  .normal {
    font-size: 14px;
    margin-left: 20px
  }
}
.familytree-info-title {
  border-left: 3px solid red;
  padding: 5px;
}
.familytree-item {
  padding: 5px 0;
}
</style>
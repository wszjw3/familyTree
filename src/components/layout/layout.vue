<template>
  <el-container :style="{height: winHeight}" ref="container">
    <el-header>
      <layout-header></layout-header>
    </el-header>
    <el-container>
      <el-aside width="auto" :style="{height: mainHeight}">
        <layout-sidebar></layout-sidebar>
      </el-aside>
      <el-main :style="{height: mainHeight}">
        <!--  style="background: #f0f2f5;" -->
        <layout-breadcrumb></layout-breadcrumb>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import LayoutHeader from '@/components/layout/header'
  import LayoutSidebar from '@/components/layout/sidebar'
  import LayoutBreadcrumb from '@/components/layout/breadcrumb'

  export default {
    components: {
      LayoutHeader,
      LayoutSidebar,
      LayoutBreadcrumb
    },
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }
      return {
        tableData: Array(20).fill(item),
        winHeight:  window.innerHeight + 'px',
        mainHeight: (window.innerHeight - 60) + 'px'
      }
    },
    mounted() {
      window.onresize = () => {
        
        let height = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight)
        //document.body.parentNode.style.overflowY = 'hidden'
        this.winHeight = height + 'px'
        this.mainHeight = (height-60) + 'px'
      }
      document.body.parentNode.style.overflowY = 'hidden'
    }
  }

</script>

<style lang="less">
  .el-header {
    background-color: #fff;
  }

  .el-aside {
    background-color: #eee;
  }

  .cur-pointer {
    cursor: pointer !important;
  }

  .toolbar {
    // background: #f2f2f2;
    padding: 10px;
    margin: 10px 0;
  }

  .toolbar .el-form-item {
    margin-bottom: 10px;
  }

</style>

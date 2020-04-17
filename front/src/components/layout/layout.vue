<template>
  <div>
    <layout-header></layout-header>
    <!--  style="background: #f0f2f5;" -->
    <!-- <layout-breadcrumb></layout-breadcrumb> -->
    <div class="body">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
  import LayoutHeader from '@/components/layout/header'
  // import LayoutSidebar from '@/components/layout/sidebar'
  // import LayoutBreadcrumb from '@/components/layout/breadcrumb'

  export default {
    components: {
      LayoutHeader,
      // LayoutSidebar,
      // LayoutBreadcrumb
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

<style lang="less" scoped>

.body {
  padding-top: 80px;
}

</style>

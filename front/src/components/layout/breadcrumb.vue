<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="item in list" :key="item.code" :to="item.path">{{item.name}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    data() {
      return {
        list: []
      }
    },

    created() {
      this.getList()
    },

    computed: {
      name() {
        return this.$route.name
      }
    },

    methods: {
      getList() {
        let matched = this.$route.matched.filter(item => item.name)
        // const first = matched[0]
        // if (first && (first.name !== '首页' || first.path !== '/')) {
        //   matched = [{
        //     name: '首页',
        //     path: '/',
        //     code: 'Hello'
        //   }].concat(matched)
        // }
        this.list = matched
      },

      isCurrent(item) {
        return item.path === this.$route.path
      }
    },

    watch: {
      $route() {
        this.getList()
      }
    }
  }

</script>

<style scoped>
  .el-breadcrumb {
    font-size: 14px;
    margin-bottom: 10px;
    padding-bottom: 20px !important;
    border-bottom: 1px solid #eee;
    color: #333;
  }

</style>

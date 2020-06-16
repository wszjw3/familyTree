<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'app',
  created () {
    const token = JSON.parse(sessionStorage.getItem('token'))
    token && this.$store.dispatch('setToken', token)
  }
}
</script>

<style lang="less">
html {
  overflow-y: auto!important;
}
body {
    margin: 0;
    padding: 0 40px;
    color: #333;
    //min-width: 1200px;
    //height: 100%;
    /*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    font-size: 12px;
    background:rgba(239,243,245,1);
    //overflow: hidden;

}
</style>

<template>
<transition name="fade" mode="out-in">
  <router-view></router-view>
</transition>
</template>

<script>
export default {
  name: 'app',
  created () {
    const token = JSON.parse(localStorage.getItem('token'))
    token && this.$store.dispatch('setToken', token)
  }
}
</script>

<style lang="less">
body {
    margin: 0;
    padding: 0;
    color: #333;
    min-width: inherit;
    height: 100%;
    //min-width: 1200px;
    //height: 100%;
    /*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    //overflow: hidden;

}
</style>

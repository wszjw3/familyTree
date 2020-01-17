<template>
<div class="box">
  <div class="box-left">
    <div class="box-bg"></div>
  </div>
  <div class="box-right">
    <h1>404</h1>
    <p>抱歉，你访问的页面不存在</p>
    <el-button type="primary" @click="toindex()">返回首页</el-button>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {},
  methods: {
    toindex(){
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box {
    display: flex;
    align-items: center;
    height: 80%;
    min-height: 500px;
    .box-left {
        flex: 0 0 50%;
        padding-right: 102px;
        zoom: 1;
        .box-bg {
            height: 360px;
            width: 100%;
            max-width: 430px;
            float: right;
            background-image: url("../assets/imgs/404.svg");
            background-repeat: no-repeat;
            background-position: 50% 50%;
            background-size: contain;
        }
    }
    .box-right {
        flex: auto;
        h1 {
            color: #434e59;
            font-size: 72px;
            font-weight: 600;
            line-height: 72px;
            margin-bottom: 24px;
        }
        p {
            color: rgba(0,0,0,.45);
            font-size: 20px;
            line-height: 28px;
            margin-bottom: 16px;
        }
    }
}
</style>

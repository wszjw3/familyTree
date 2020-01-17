<template>
<section class="clearfix">
  <div class="box clearfix">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>人员人数</span>
      </div>
      <div>
        <span class="text">1000</span><b>人</b>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>承保清单件数</span>
      </div>
      <div>
        <span class="text">1000</span><b>件</b>
      </div>
    </el-card>
  </div>
  <el-row>
    <div>
      <el-button plain>承保订单</el-button>
      <el-button plain>出单订单</el-button>
      <el-button plain>人员管理</el-button>
    </div>
  </el-row>
</section>
</template>
<script>
export default {
  data() {
    return {

    }
  }
}
</script>
<style lang="less" scoped>
.text {
    font-size: 4rem;
}

.item {
    margin-bottom: 18px;
}

.clearfix:after,
.clearfix:before {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both;
}
section{
  // background-image: url("../assets/imgs/index.jpg");
  // background-size: cover;
  // background-repeat: no-repeat;
}
.box {
    width: max-content;
    margin: auto;
}
.box-card {
    width: 35%;
    min-width: 15rem;
    text-align: center;
    float: left;
    margin: 2rem;

}
.el-row {
    width: 100%;
    div {
        width: max-content;
        margin: 20% auto auto;
        .el-button {
            margin: 0 1rem;
        }
    }
}
</style>

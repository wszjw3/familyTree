<template>
  <section>
    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <div class="info">
            <span>账户余额</span>
            <p>2400.00</p>
            <em></em>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <span>累计资产</span>
            <p>500000.00</p>
            <em></em>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <span>当月提现</span>
            <p>3000.00</p>
          </div>
        </el-col>
      </el-row>
    </el-card>
      <el-table highlight-current-row header-cell-style="background:#eef1f6;color:#606266;" v-loading="listLoading"
        style="width: 100%;margin-top: 24px;">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="100">
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="100">
        </el-table-column>
        <el-table-column prop="birth" label="生日" width="120">
        </el-table-column>
        <el-table-column prop="addr" label="地址" min-width="180">
        </el-table-column>
      </el-table>
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
  .box-card {
    .info {
      position: relative;
      text-align: center;
      padding: 0 32px;

      span {
        color: rgba(0, 0, 0, .45);
        display: inline-block;
        font-size: 14px;
        line-height: 22px;
        margin-bottom: 4px;
      }

      p {
        color: rgba(0, 0, 0, .85);
        font-size: 24px;
        line-height: 32px;
        margin: 0;
      }
    }

    em {
      background-color: #e8e8e8;
      position: absolute;
      height: 56px;
      width: 1px;
      top: 0;
      right: 0;
    }
  }

</style>

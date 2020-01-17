<template>
  <el-card class="box-card">
    <el-steps :active="active" finish-status="wait" process-status="finish" >
      <el-step title="填写信息"></el-step>
      <el-step title="确认信息"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <el-form :model="form" label-width="100px" v-show="currentShow==='input'" style="margin:20px auto 20px;width:60%;min-width:600px;max-width:600px;">
      <el-form-item label="活动名称：">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动区域：">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="特殊资源：">
        <el-radio-group v-model="form.resource">
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式：">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="goConfirm">提交</el-button>
      </el-form-item>
    </el-form>

    <el-form :model="form" label-width="100px" v-show="currentShow==='confirm'" style="margin:20px auto 20px;width:60%;min-width:600px;max-width:600px;">
      <el-form-item label="活动名称：">
        {{form.name}}
      </el-form-item>
      <el-form-item label="活动区域：">
        {{form.region}}
      </el-form-item>
      <el-form-item label="特殊资源：">
        {{form.resource}}
      </el-form-item>
      <el-form-item label="活动形式：">
        {{form.desc}}
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">下一步</el-button>
        <el-button @click="goInput">上一步</el-button>
      </el-form-item>
    </el-form>

    <div class="result" v-show="currentShow==='result'">
      <i class="el-icon-success success icon"></i>
      <div class="content">提交完成</div>
    </div>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          name: '活动名称AAA',
          region: 'shanghai',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        active: 0,
        currentShow: 'input'
      }
    },
    methods: {
      onSubmit() {
        this.active = 2
        this.currentShow = 'result'
      },
      goConfirm() {
        this.active = 1
        this.currentShow = 'confirm'
      },
      goInput() {
        this.active = 0
        this.currentShow = 'input'
      },
      next() {
        if (this.active++ > 2) this.active = 0
      }
    }
  }

</script>

<style lang="less" scoped>
  .el-steps {
    max-width: 800px;
    margin: 16px auto;
  }

  .result {
    text-align: center;
    width: 72%;
    margin: 60px auto;

    .content {
      font-size: 30px;
      color: rgba(0, 0, 0, .85);
      font-weight: 500;
      line-height: 32px;
      margin-bottom: 16px;
    }

    .icon {
      font-size: 90px;
      line-height: 90px;
      margin-bottom: 24px;
    }
  }

  .success {
    color: green;
  }

</style>

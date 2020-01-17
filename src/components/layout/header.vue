<template>
<div class="page-header clearfix">
  <div class="page-logo">
    <!-- <img src="../../assets/imgs/guohua_logo.png" class="logo">国华人寿经代机构管理平台 -->
  </div>
  <div class="page-nav">

  </div>
  <div class="fr">
    <ul class="nav-bar">
      <li class="nav-bar-item">
        <el-dropdown @command="handleCommand">
          <a class="nav-bar-item-link">我的账户</a>
          <el-dropdown-menu slot="dropdown" style="margin-top: -2px;transform-origin: center top 0px;">
            <el-dropdown-item command="accountInfo">查看账户信息</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
    </ul>
  </div>
  <div style="float: right;color:#fff">
    <span>您好：{{userInfo.userName}}({{userInfo.companyName}})</span>
  </div>
</div>
</template>

<script>
import {
  Account
} from '@/api'
export default {
  data() {
    return {
      userInfo: {}
    }
  },
  created() {
    Account.getUserInfo().then((res) => {
      this.userInfo = res.userInfo
    })
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        this.$store.dispatch('removeToken')
        this.$store.dispatch('removeRoutes')
        this.$router.push('/login')
      }
      if (command === 'accountInfo') {
        this.$router.push('/account/accountInfo')
      }
    }
  }

}
</script>

<style lang="less" scoped>
.page-header {
  background-color: #262a36;
  height: 60px;
  line-height: 60px;
  width: 100%;
  z-index: 10;
}

.page-header .page-logo {
  float: left;
  color: #fff;
  padding-left: 20px;
  font-size: 18px;
  .logo {
    width: 1.5rem;
    vertical-align: middle;
    margin-right: 0.6rem;
  }
}

.page-header .page-nav {
  float: left;
  height: 60px;
}

.page-header .fr {
  float: right;
}

.page-header .nav-bar {
  height: 60px;
  margin: 0px;
}

.page-header .nav-bar .nav-bar-item {
  display: inline-block;
  margin-right: 30px !important;
}

.page-header .nav-bar .nav-bar-item .nav-bar-item-link {
  color: rgb(255, 255, 255);
  display: block;
  padding: 0 20px;
  height: 60px;
  line-height: 60px;
  cursor: pointer;
}

.page-header .nav-bar .nav-bar-item .nav-bar-item-link:hover {
  background-color: #435060;
}
</style>

<template>
<div>
  <div class="page-header clearfix">
    <div class="page-logo" @click="$router.push('/')">
      <img src="@/assets/imgs/ancestry.png" class="logo">家谱管理系统
    </div>
    <div class="page-nav">

    </div>
    <div class="fr">
      <ul class="nav-bar">
        <li class="nav-bar-item" style="display:flex;justify-content: space-between;align-items:center;">
          <div class="cursor-pointer" @click="navigateToChangeOPasswd">
            <span>[修改密码]</span>
          </div>
          <div class="cursor-pointer" @click="handleLogOut">
            <span>[退出]</span>
          </div>




          <!-- <el-dropdown @command="handleCommand">
            <a class="nav-bar-item-link">我的账户</a>
            <el-dropdown-menu slot="dropdown" style="margin-top: -2px;transform-origin: center top 0px;">
              <el-dropdown-item command="accountInfo">查看账户信息</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {}
    }
  },
  computed: {
    userName () {
      return this.$store.getters.getBackToken.user_name
    }
  },
  methods: {
    navigateToChangeOPasswd () {
      this.$router.push('changepasswd')
    },
    handleLogOut () {
      this.$store.dispatch('removeBackToken')
      this.$router.push('/login')
    }
  }

}
</script>

<style lang="less" scoped>
.page-header {
  background-color: #fff;
  height: 60px;
  line-height: 60px;
  width: 100%;
  z-index: 10;
  border-bottom: 1px solid rgba(204, 204, 204, 1);
}

.page-header .page-logo {
  float: left;
  font-weight: 650;
  font-style: normal;
  font-size: 28px;
  padding-left: 20px;
  cursor: pointer;
  .logo {
    width: 3.5rem;
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
  .nav-desc {
    width: 143px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 30px;
    text-decoration: none;
    color: #000
  }
   .userIcon {
     color:#409EFF;
     font-size: 30px;
   }
}

.page-header .nav-bar .nav-bar-item .nav-bar-item-link {
  display: block;
  padding: 0 20px;
  height: 60px;
  line-height: 60px;
  cursor: pointer;
}

.page-header .nav-bar .nav-bar-item .nav-bar-item-link:hover {
  background-color: #435060;
}

.cursor-pointer {
  cursor: pointer;
}
</style>

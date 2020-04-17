<template>
<div class="fixed">
  <div class="page-header clearfix">
    <div class="flex">
      <router-link class="page-logo" :to="{path: '/'}">
        <img src="@/assets/imgs/family-logo.png" class="logo">
      </router-link>
      <div class="router-area">
        <router-link :class="['link', currentPath === '/' ? 'active' : '']" :to="{path: '/'}">首页</router-link>
        <router-link :class="['link', currentPath === '/rank' ? 'active' : '']" :to="{path: '/rank'}">排名</router-link>
        <router-link v-if="userType === '3'" :class="['link', currentPath === '/myManage' ? 'active' : '']" :to="{path: '/myManage'}">我管理的家谱</router-link>
        <router-link v-if="userType === '2'" :class="['link', currentPath === '/myFamily' ? 'active' : '']" :to="{path: '/myFamily'}"我的家谱</router-link>
      </div>
    </div>
    <div class="user-info">
      <el-button class="create-btn" @click="navigateToCreate">创建新家谱</el-button>

      <router-link v-if="userName" class="link" to="/user/index">
        {{userName}}
      </router-link>
      <a v-if="!userName" class="link cursor-pointer" @click="handleLogin">
        登录
      </a>
      <a v-else class="link cursor-pointer" @click="handleLogOut">
        退出
      </a>
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
      return this.$store.getters.getToken.user_name
    },
    userType () {
      return this.$store.getters.getToken.user_type
    },
    currentPath () {
      return this.$route.path
    }
  },
  methods: {
    navigateToCreate () {
      const id = this.$store.getters.getToken.user_type
      this.$router.push(id === '0' ? '/login' : '/family/create')
    },
    handleLogOut () {
      this.$store.dispatch('removeToken')
      this.$router.push(this.$router.currentRoute.path === '/platform/manage' ? '/platform/login' : '/login')
    },
    handleLogin () {
      this.$router.push('/login')
    }
  }

}
</script>

<style lang="less" scoped>
.fixed {
  background-color: rgba(239,243,245,1);
  position: fixed;
  z-index: 9;
  width: 100%;
}
.page-header {
  height: 60px;
  line-height: 60px;
  width: 100%;
  display: flex;
  position: relative;

  .page-logo {
    height: 100%;
    cursor: pointer;
  }

  .flex {
    flex: 1;
    display: flex;
  }

  .router-area {
    margin-left: 70px;
  }

  .user-info {
    position: absolute;
    right: 90px;

    .create-btn {
      margin-right: 31px;
      width:110px;
      height:40px;
      background-color: #57D092;
      color: #fff;
      border: none;
    }
  }

  .link {
    font-size:16px;
    font-weight:600;
    color:rgba(52,73,94,1);
    line-height:22px;
    margin-right: 31px;
    text-decoration: none;
  }

  .active {
    color: rgba(87,208,146,1);
  }
}
</style>

<template>
  <div class="page-left" :class="{'menu-collapsed':collapsed}">
    <div class="page-nav-toggle cur-pointer" @click="collapseMenu">
      <i v-show="!collapsed" class="el-icon-d-arrow-left"></i>
      <i v-show="collapsed" class="el-icon-d-arrow-right"></i>
    </div>
    <el-menu :default-active="$route.path" background-color="#304156" text-color="#fefefe" active-text-color="#409EFF"
      :collapse="collapsed" router class="page-menu">
      <template v-for="(menu, index) in menus">
        <el-submenu v-if="menu.children" :index="!menu.path ? 'sub' + index : menu.path" :key="index">
          <template slot="title">
            <i v-if="menu && menu.icon" :class="[menu.icon,'iconfont']"></i>
            <span slot="title">{{menu.name}}</span>
          </template>
          <div v-for="child in menu.children" :key="child.path">
            <el-menu-item :index="child.path">{{child.name}}</el-menu-item>
          </div>
        </el-submenu>
        <el-menu-item v-else :index="!menu.path? 'sub' + index : menu.path" :key="index">
          <i v-if="menu && menu.icon" :class="[menu.icon,'iconfont']"></i>
          <span slot="title">{{menu.name}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        collapsed: false
      }
    },

    created() {
      //  this.getMenus()
    },
    computed: {
      menus() {
        return this.$store.getters.getMenus
      }
    },
    methods: {
      collapseMenu() {
        this.collapsed = !this.collapsed
      }
    }
  }

</script>

<style lang="less" scoped>
  .page-left {
    display: table-cell;
    vertical-align: top;
    width: 200px;
    background-color: #304156;
    height: 100%;
    transition: width .3s ease-out;

    .page-nav-toggle {
      text-align: right;
      padding: 15px;
      color: #bfcbd9;
      text-align: center;
      border-bottom: 1px solid rgb(67, 80, 96);
    }

    .page-menu {
      border-right: 0px;
      .iconfont{
        color: #e6e6e6;
      }
      .iconfont:hover{
        color: #ffffff;
      }
    }

    .page-menu:not(.el-menu--collapse) {
      width: 200px;
    }
  }

  .menu-collapsed {
    width: 64px;
    flex: 0 0 64px;
  }

</style>

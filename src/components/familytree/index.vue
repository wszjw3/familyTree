<template>
  <div>
    <h2 class="title">
      {{title + '家谱树'}}
    </h2>
  </div>
</template>

<script>
export default {
  name: 'FamilyTree',
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  border-left: 3px solid red;
  padding: 5px;
}
</style>
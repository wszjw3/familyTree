<template>
  <div>
    <div
      v-for="(item, idx) in data"
      :key="'tr_' + idx"
      class="result-item"
      @click="handleClick(item)"
    >
      <span class="name">
        {{item.family_name}}
      </span>
      <span class="faded">
        {{item.level + '世/' + item.total + '人'}}
      </span>
      <span class="faded">
        {{item.fame}}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchResult',
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    handleClick (item) {
      this.$router.push({
        path: '/family/detail',
        query: {familyId: item.family_id}
      })
      this.$emit('jump')
    }
  },
}
</script>

<style lang="less" scoped>
.result-item {
  height:44px;
  line-height: 44px;
  background:rgba(239,243,245,1);
  border-radius:4px;
  padding: 0 20px;
  font-size: 14px;
  display: inline-block;
  margin: 10px;
  cursor: pointer;
  max-width: 100%;
  overflow: hidden;
  text-overflow: hidden;

  .name {
    color: #57D092
  }

  .faded {
    color: #B7C4CE;
    margin-left: 10px;
  }
}
</style>

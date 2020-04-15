<template>
  <div>
    <table>
      <tbody>
        <tr
          v-for="(item, idx) in data"
          :key="'tr_' + idx"
        >
          <td style="width: 60px">
            {{item.level}}
          </td>
          <td style="width: 150px;">
            {{item.family_name}}
          </td>
          <td style="width: 100px">
            （{{item.level + '世/' + item.total + '人'}}）
          </td>
          <td>
            {{item.fame}}
          </td>
          <td style="width: 100px">
            <a class="link" @click="handleClick(item)">查看</a>
          </td>
        </tr>
      </tbody>
    </table>
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
table {
  width: 100%;
  td {
    padding: 5px 8px;
  }
}
.link {
    cursor: pointer;
    color: #2491FC;
    text-decoration: underline;
  }
</style>

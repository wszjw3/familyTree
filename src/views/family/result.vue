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
            <router-link :to="{path: '/family/detail', query: {familyId: item.family_id}}">查看</router-link>
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
  }
}
</script>

<style lang="less" scoped>
table {
  width: 100%;
  td {
    padding: 5px 8px;
  }
}
</style>

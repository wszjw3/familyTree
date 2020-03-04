<template>
  <div>
    <table>
      <tbody>
        <tr
          v-for="(item, idx) in data"
          :key="'tr_' + idx"
        >
          <td>
            {{idx + 1}}
          </td>
          <td>
            {{item.a}}
          </td>
          <td>
            （{{item.b}}）
          </td>
          <td>
            {{item.c}}
          </td>
          <td>
            （{{item.d}}）
          </td>
          <td>
            <router-link :to="{path: '/detail'}">查看</router-link>
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
<template>
  <div>
    <family-tree></family-tree>
  </div>
</template>

<script>
import FamilyTree from '@/components/familytree/index'
import {
  Family
} from '@/api'
export default {
  name: 'DemoTree',
  components: {
    FamilyTree
  },
  mounted() {
      Family.familyquery({"user_id":"2"}).then(res => {
        console.log(res.data)
      })
  },
}
</script>

<style>

</style>

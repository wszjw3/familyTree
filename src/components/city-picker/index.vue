<template>
  <el-cascader v-model="selection" :options="options" @change="handleChange"></el-cascader>
</template>

<script>
import json from './city.js'
export default {
  name: 'CityPicker',
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      options: json,
      selection: this.value
    }
  },
  methods: {
    handleChange (v) {
      this.$emit('input', v)
    }
  }

}
</script>

<style>

</style>

<template>
  <el-cascader v-model="selection" :options="options" @change="handleChange" :placeholder="placeholder"></el-cascader>
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
    },
    placeholder: {
      type: String,
      default: '请输入'
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

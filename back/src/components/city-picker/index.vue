<template>
  <el-cascader v-model="selection" :options="options" @change="handleChange"></el-cascader>
</template>

<script>
import { Family } from '@/api'
// import json from './city.js'
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
      options: [],
      selection: this.value
    }
  },
  created () {
    this.load()
  },
  watch: {
    value (val) {
      this.selection = val
    }
  },
  methods: {
    load () {
      Family.familyDistrictFind().then(res => {
				if (res.data) {
					let city = res.data.filter(v => {
            return v.rc_pid === '1'
          }).map(v => {
						return {
							label: v.district,
							value: v.rc_id,
							children: []
						}
          })
          city.forEach(item => {
            item.children = []
            res.data.forEach(key => {
              if (item.value === key.rc_pid) {
                item.children.push({
                  label: key.district,
                  value: key.rc_id
                })
              }
            })
          })
          city.forEach(c => {
            c.children.forEach(item => {
              item.children = []
              res.data.forEach(key => {
                if (item.value === key.rc_pid) {
                  item.children.push({
                    label: key.district,
                    value: key.rc_id
                  })
                }
              })
            })
          })
          this.options = city
				}
			})
    },
    handleChange (v) {
      this.$emit('input', v)
    }
  }

}
</script>

<style>

</style>

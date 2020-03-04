<template>
  <div>
    <a
      v-for="item in _area"
      :key="'area_' + item.name"
      class="area"
      :class="item.children.includes(select) ? 'active' : ''"
    >
      {{item.name}}
      <div class="detail">
        <a
          v-for="key in item.children"
          :key="'area_detail_' + item.name + key"
          class="detail-item"
          :class="select === key ? 'active' : ''"
          @click="handleSelect(key)"
        >
          {{key}}
        </a>
      </div>
    </a>
  </div>
</template>

<script>
import json from './province.js'
export default {
  name: 'Area',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      json,
      select: this.value
    }
  },
  watch: {
    value (val) {
      this.select = val
    }
  },
  computed: {
    _area () {
      let arr = []
      this.json.forEach(item => {
        let obj = {}
        obj.name = item.name.replace( /省|市/g, '')
        obj.children = item.city.map(v => {
          return v.name.replace('市', '')
        })
        arr.push(obj)
      })
      return arr
    }
  },
  methods: {
    handleSelect (val) {
      this.select = val
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less" scoped>
.area {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #000;
  cursor: pointer;
  border: 1px solid transparent;
  &:hover {
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid transparent;
    .detail {
      display: block
    }
  }
}
.active {
  color: #1890FF!important
}
.detail {
  z-index: 10;
  display: none;
  position: absolute;
  top: 50px;
  left: -1px;
  width: 30vw;
  text-align: left;
  border: 1px solid #ddd;
  border-top: none;
  background-color: #fff;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50px;
    width: calc(30vw - 50px);
    height: 1px;
    background-color: #ddd
  }
  .detail-item {
    display: inline-block;
    padding: 5px;
    color: #000;
    cursor: pointer;
  }
}
</style>
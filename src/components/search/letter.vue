<template>
  <div>
    <a
      v-for="item in enLetter"
      :key="'letter_' + item"
      class="letter"
      :class="item.children.includes(select) ? 'active' : ''"
    >
      {{item.name}}
      <div class="detail">
        <a
          v-for="key in item.children"
          :key="'letter_detail_' + key"
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
export default {
  name: 'Letter',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      select: this.value,
    }
  },
  watch: {
    value (val) {
      this.select = val
    }
  },
  computed: {
    enLetter () {
      let arr = []
      for(var i = 65; i < 91; i++){
        let obj = {}
        obj.name = String.fromCharCode(i)
        obj.children = ['a', 'b', 'c']
        arr.push(obj)
      }
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
.letter {
  z-index: 9;
  position: relative;
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
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
  top: 30px;
  left: -1px;
  width: 150px;
  text-align: left;
  border: 1px solid #ddd;
  border-top: none;
  background-color: #fff;
  &:before {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: 120px;
    height: 1px;
    background-color: #ddd
  }
  .detail-item {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #000;
    cursor: pointer;
  }
}
</style>
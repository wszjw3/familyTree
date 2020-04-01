<template>
  <div>
    <a
      v-for="(item, idx) in enLetter"
      :key="'letter_' + idx"
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
          @click="handleSelect(key, item)"
        >
          {{key}}
        </a>
      </div>
    </a>
  </div>
</template>

<script>
import { Manage } from '@/api'
export default {
  name: 'Letter',
  props: {
    value: {
      type: String,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      select: this.value,
      enLetter: []
    }
  },
  watch: {
    value (val) {
      this.select = val
    }
  },
  created () {
    this.getOpts()
  },
  methods: {
    getOpts () {
      Manage.surnameFind().then(res => {
        if (res.data) {
          this.enLetter = res.data.map(v => {
            let obj = {}
            obj.name = v.initials
            obj.children = v.initials_data.map(v => {
              return v.surname
            })
            return obj
          })
        }
      })
    },
    handleSelect (key, item) {
      this.select = key
      this.$emit('input', key)
      this.$emit('change', item, key)
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

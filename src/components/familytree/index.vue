<template>
  <div class="tree">
    <div
      v-for="(item, idx) in treeData"
      :key="idx"
      class="tree-item"
    >
      <div class="level">
        {{item.level}}
      </div>
      <div
        class="wrapper"
        :class="idx === 0 ? 'justify-center' : 'justify-between'"
      >
        <div
          v-for="(key, kdx) in item.children"
          :key="kdx"
          :ref="key.id + '-' + (key.parent ? key.parent : '' )"
          :class="[
            idx !== 0 ? 'px-sm' : '',
            key.id + '-' + (key.parent ? key.parent : '' )
          ]"
          :id="key.id.toString()"
        >
          <div
            v-for="(ele, edx) in key.current"
            :key="edx"
            class="leaf"
            :class="[
              ele.male === 1 && idx !== treeData.length - 1 && findChildWidthId(key.id) ? 'tree-after' : '',
              (ele.male === 0 && idx !== 0) || (key.parent && key.current.length === 1) || (key.current.length === 1 && idx !== 0) ? 'tree-before' : '',
              key.current.length === 1 && idx !== 0 ? 'no-border' : '',
              ele.dead ? 'dashed' : 'solid'
            ]"
          >
            {{ele.name}}{{ele.male === 1 ? '(女)' : ''}}

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import json from './example.json'
export default {
  name: 'FamilyTree',
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    treeData () {
      // return this.calcData(json)
      return json
    }
  },
  mounted () {
    const _self = this
    window.onresize = () => {
      _self.handleDrawConnect()
    }
    this.handleDrawConnect()
  },
  destroyed () {
    window.onresize = null
  },
  methods: {
    handleDrawConnect () {
      const element = document.querySelectorAll('.draw')
      element.forEach(item => {
        document.body.removeChild(item)
      })
      this.$nextTick(() => {
        for (let i in this.$refs) {
          if (i.split('-')[1] !== '') {
            const fromId = i.split('-')[0]
            const toId = i.split('-')[1]
            const from = document.getElementById(fromId).firstChild
            const fromRect = from.getBoundingClientRect()
            const to = document.getElementById(toId).lastChild
            const toRect = to.getBoundingClientRect()
            // 计算起点的after末端坐标
            const fromX = fromRect.left + fromRect.width / 2
            const fromY = fromRect.top - 30
            const toX = toRect.left + toRect.width / 2
            const toY = toRect.top + toRect.height + 30
            let div = document.createElement('div')
            div.className = 'draw'
            div.style.position = 'fixed'
            div.style.left = fromX > toX ? toX + 'px' : fromX + 'px'
            div.style.top = fromY + 'px'
            div.style.width = fromX > toX ? fromX - toX + 'px' :toX - fromX + 'px'
            div.style.height = '1px'
            div.style.borderTop = '1px solid #000'
            document.body.appendChild(div)
          }
        }
      })
    },
    findChildWidthId (id) {
      let flag = false
      this.treeData.forEach(item => {
        item.children.forEach(key => {
          if (key.parent === id) {
            flag = true
          }
        })
      })
      return flag
    }
  }
}
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box
}
.tree {
  width: 100%;
  .tree-item {
    display: flex;
    padding: 30px 10px;
    align-items: center;

    .level {
      width: 120px;
      flex: 1;
    }

    .wrapper {
      width: 90%;
      display: flex;
    }

    .leaf {
      padding: 10px 20px;
      display: inline-block;
    }

    .tree-key {
      display: inline-block;
      padding: 10px 30px;
      border-bottom: 1px solid #000;
    }
  }
  .tree-after {
    position: relative;
    &:after {
      content: '';
      height: 30px;
      width: 1px;
      position: absolute;
      left: 50%;
      top: 100%;
      border-left: 1px solid #000;
    }
  }
  .tree-before {
    position: relative;
    &:before {
      content: '';
      height: 30px;
      width: 1px;
      position: absolute;
      left: 50%;
      bottom: 100%;
      border-left: 1px solid #000;
    }
  }
  .tree-child {
    margin-top: 20px;
  }
  .no-border {
    border: none!important
  }
  .px-sm {
    padding-left: 10px;
    padding-right: 10px;
  }
  .pl-md {
    padding-left: 50px!important
  }
  .justify-center {
    justify-content: center
  }
  .justify-between {
    justify-content: space-between;
  }
  .dashed {
    border-bottom: 1px dashed #000
  }
  .solid {
    border-bottom: 1px solid #000
  }
}
// .tree {
//   .tree-item {
//     width: 100%;
//     height: 100%;
//     display: inline-block;
//     border-bottom: 1px solid #000;
//     .tree-item-key {
//       display: inline-block;
//       position: relative;
//       height: 100%;
//       &:after {
//         content: '';
//         height: 20px;
//         width: 1px;
//         position: absolute;
//         left: 50%;
//         top: 100%;
//         border-left: 1px solid #000;
//       }
//       .tree-item-key-ele {
//         height: 100%;
//         padding: 5px 8px;
//         display: inline-block;
//         text-align: center
//       }
//     }
//   }
// }
</style>

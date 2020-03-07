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
          v-for="(t, tdx) in item.test"
          :key="tdx"
          style="display: flex; justify-content: space-between"
        >
          <div
            v-for="(key, kdx) in t"
            :key="kdx"
            :data-node="key.id + '-' + (key.parent !== undefined ? key.parent : '' )"
            :class="[
              idx !== 0 ? 'px-sm' : '',
              'tree-node'
            ]"
            :id="key.id.toString()"
          >
            <div
              v-for="(ele, edx) in key.current"
              :key="edx"
              class="leaf"
              :class="[
                ele.sex === '2' && idx !== treeData.length - 1 && findChildWidthId(key.id) ? 'tree-after' : '',
                (ele.sex === '1' && idx !== 0) || (key.parent !== undefined && key.current.length === 1) || (key.current.length === 1 && idx !== 0) ? 'tree-before' : '',
                key.current.length === 1 && idx !== 0 && ele.be_alive !== '2' ? 'no-border' : '',
                ele.be_alive === '2' ? 'dashed' : 'solid'
              ]"
            >
              {{ele.user_name}}{{ele.sex === '2' ? '(女)' : ''}}

            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
// import json from './example.json'
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
      let res = []
      this.data.forEach(item => {
        let parent = []
        item.children.forEach(key => {
          if (key.parent !== undefined && parent.indexOf(key.parent) === -1) {
            parent.push(key.parent)
          }
        })
        item.test = []
        if (parent.length === 0) {
          item.test = [item.children]
        } else {
          parent.forEach(p => {
            let arr = []
            item.children.forEach(key => {
              if (key.parent === p) {
                arr.push(key)
              }
            })
            item.test.push(arr)
          })
        }
        res.push(item)
      })
      return res
    }
  },
  mounted () {
    this.$nextTick(() => {

      window.onresize = () => {
        this.interval()
      }
      this.interval()
    })
  },
  destroyed () {
    window.onresize = null
    this.clearConnectLine()
  },
  methods: {
    clearConnectLine () {
      const element = document.querySelectorAll('.line')
      element.forEach(item => {
        document.body.removeChild(item)
      })
    },
    interval () {
      const _this = this
      const fn = setInterval(() => {
        const node = document.querySelectorAll('.tree-node')
        if (node.length === 0) {
          _this.interval()
        } else {
          _this.handleDrawConnectLine()
          clearInterval(fn)
        }
      }, 300)
    },

    handleDrawConnectLine () {
      this.clearConnectLine()
      this.$nextTick(() => {
        const node = document.querySelectorAll('.tree-node')
        let dataset = []
        node.forEach(v => {
          dataset.push(v.dataset.node)
        })
        for (let i in dataset) {
          const val = dataset[i]
          if (val.split('-')[1]) {
            const fromId = val.split('-')[0]
            const toId = val.split('-')[1]
            const from = document.getElementById(fromId).firstChild
            const fromRect = from.getBoundingClientRect()
            const to = document.getElementById(toId).lastChild
            const toRect = to.getBoundingClientRect()
            // 计算起点的after末端坐标
            const fromX = fromRect.left + fromRect.width / 2
            const fromY = fromRect.top - 30
            const toX = toRect.left + toRect.width / 2
            // const toY = toRect.top + toRect.height + 30
            let div = document.createElement('div')
            div.className = 'line'
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

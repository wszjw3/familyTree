<template>
  <div id="tree" class="tree">
    <div v-for="(item, idx) in treeData" :key="idx" class="tree-item">
      <div class="level">
        {{ item.level }}
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
            :data-node="
              key.id + '-' + (key.parent !== undefined ? key.parent : '')
            "
            :class="[idx !== 0 ? 'px-sm' : '', 'tree-node']"
            :id="key.id.toString()"
          >
            <div
              v-for="(ele, edx) in key.current"
              :key="edx"
              class="leaf"
              :class="[
                ele.sex === '2' &&
                idx !== treeData.length - 1 &&
                findChildWidthId(key.id)
                  ? 'tree-after'
                  : '',
                (ele.sex === '1' && idx !== 0) ||
                (key.parent !== undefined && key.current.length === 1) ||
                (key.current.length === 1 && idx !== 0)
                  ? 'tree-before'
                  : '',
                key.current.length === 1 && idx !== 0 && ele.be_alive !== '2'
                  ? 'no-border'
                  : '',
                ele.be_alive === '2' ? 'dashed' : 'solid'
              ]"
            >
              {{ ele.user_name }}
              <div
                v-if="ele.sex === '2' || ele.claim === '1'"
                class="icon-wrapper"
              >
                <img v-if="ele.sex === '2'" :src="sexImg" class="sex-img" />
                <span v-if="ele.claim === '1'" class="required">*</span>
              </div>
              <div
                class="action-wrapper"
                :style="{
                  marginTop:
                    key.current.length === 1 &&
                    idx !== 0 &&
                    ele.be_alive !== '2'
                      ? '-1px'
                      : ''
                }"
              >
                <div
                  v-if="userType === '2' || userType === '3' || userType === '4'"
                  class="pie"
                >
                  <div class="line1"></div>
                  <div class="line2"></div>
                  <div class="line3"></div>
                  <div class="first" @click="handleViewDetail(ele)">
                    详情
                  </div>
                  <div class="second" @click="handleEdit(ele)">
                    编辑
                  </div>
                  <div class="thired" @click="handleAdd(ele)">
                    添加
                  </div>
                </div>
                <div
                  v-if="userType === '0' || userType === '1'"
                  class="claim"
                  @click="handleClaim(ele)"
                >
                  认领
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import json from './example.json'
import sexImg from '@/assets/imgs/sex.png'
export default {
  name: 'FamilyTree',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      sexImg,
      hoverNode: {}
    }
  },
  computed: {
    userType () {
      return this.$store.getters.getToken.user_type || '2'
    },
    treeData() {
      if (this.data.length === 0) {
        return []
      }
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
  mounted() {
    this.$nextTick(() => {
      window.onresize = () => {
        this.interval()
      }
      this.interval()
    })
  },
  destroyed() {
    window.onresize = null
    this.clearConnectLine()
  },
  methods: {
    clearConnectLine() {
      const element = document.querySelectorAll('.line')
      element.forEach(item => {
        document.getElementById('tree').removeChild(item)
      })
    },
    interval() {
      const _this = this
      const fn = setInterval(() => {
        const node = document.querySelectorAll('.tree-node')
        if (node.length === 0 && this.data.length !== 0) {
          _this.interval()
        } else {
          _this.handleDrawConnectLine()
          clearInterval(fn)
        }
      }, 300)
    },

    handleDrawConnectLine() {
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
            // const fromRect = from.getBoundingClientRect()
            const to = document.getElementById(toId).lastChild
            // const toRect = to.getBoundingClientRect()
            // 计算起点的after末端坐标
            const fromX = from.offsetLeft + from.offsetWidth / 2
            const fromY = from.offsetTop - 30
            const toX = to.offsetLeft + to.offsetWidth / 2
            // const toY = toRect.top + toRect.height + 30
            let div = document.createElement('div')
            div.className = 'line'
            div.style.position = 'absolute'
            div.style.left = fromX > toX ? toX + 'px' : fromX + 'px'
            div.style.top = fromY + 'px'
            div.style.width =
              fromX > toX ? fromX - toX + 'px' : toX - fromX + 'px'
            div.style.height = '1px'
            div.style.borderTop = '1px solid #000'
            document.getElementById('tree').appendChild(div)
          }
        }
      })
    },
    findChildWidthId(id) {
      let flag = false
      this.treeData.forEach(item => {
        item.children.forEach(key => {
          if (key.parent === id) {
            flag = true
          }
        })
      })
      return flag
    },
    handleViewDetail(ele) {
      this.$emit('onView', ele)
    },
    handleEdit(ele) {
      this.$emit('onEdit', ele)
    },
    handleAdd(ele) {
      this.$emit('onAdd', ele)
    },
    handleClaim (ele) {
      this.$emit('onClaim', ele, this.userType)
    }
  }
}
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.tree {
  width: 100%;
  position: relative;
  padding-bottom: 100px;
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
      width: 100px;
      display: inline-block;
      position: relative;

      .icon-wrapper {
        display: inline-block;
        position: absolute;
        min-width: 40px;
        margin-top: -5px;
        .required {
          color: red;
          font-size: 30px;
        }
        .sex-img {
          width: 26px;
          height: 26px;
        }
      }

      &:hover {
        .action-wrapper {
          display: block;
        }
      }

      .action-wrapper {
        display: none;
        position: absolute;
        z-index: 99;
        background-color: #fff;
        top: 40px;
        left: 0;
        .pie {
          border: 1px solid #000;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          position: relative;

          .line1 {
            width: 1px;
            height: 40px;
            position: absolute;
            top: 0;
            left: 39px;
            background-color: #000;
          }

          .line2 {
            width: 1px;
            height: 40px;
            position: absolute;
            top: 30px;
            left: 23px;
            transform: rotate(55deg);
            background-color: #000;
          }

          .line3 {
            width: 1px;
            height: 40px;
            position: absolute;
            top: 30px;
            left: 57px;
            background-color: #000;
            transform: rotate(125deg);
          }
          .first {
            position: absolute;
            cursor: pointer;
            left: 5px;
            top: 20px;
          }

          .second {
            position: absolute;
            cursor: pointer;
            right: 5px;
            top: 20px;
            color: red;
          }

          .thired {
            position: absolute;
            cursor: pointer;
            left: 25px;
            bottom: 10px;
            color: #1890ff;
          }
        }
        .claim {
          margin-left: 20px;
          color: #1890FF;
          cursor: pointer;
        }
      }
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
    border: none !important;
  }
  .px-sm {
    padding-left: 10px;
    padding-right: 10px;
  }
  .pl-md {
    padding-left: 50px !important;
  }
  .justify-center {
    justify-content: center;
  }
  .justify-between {
    justify-content: space-between;
  }
  .dashed {
    border-bottom: 1px dashed #000;
  }
  .solid {
    border-bottom: 1px solid #000;
  }
}
</style>

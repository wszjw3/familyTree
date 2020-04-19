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
          style="display: flex; justify-content: space-between;"
        >
          <div
            v-for="(t1, t1dx) in t"
            :key="t1dx"
            style="display: flex; justify-content: space-between;"
          >
            <div
              v-for="(key, kdx) in t1"
              :key="kdx"
              :data-node="
                key.id + '-' + (key.parent !== undefined ? key.parent : '')
              "
              :class="['tree-node']"
              :id="key.id"
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
                  (ele.sex === '1' && idx !== 0) || (!ele.isWife && idx !== 0)
                    ? 'tree-before'
                    : '',
                  ele.isWife &&
                  kdx + 1 < t1.length &&
                  t1[kdx + 1].current.length === 2
                    ? 'mr-sm'
                    : '',
                  ele.be_alive === '2' ? 'bg-grey' : 'border-green'
                ]"
              >
                <img
                  v-if="ele.sex === '2' && !ele.isWife"
                  src="@/assets/imgs/girl.png"
                />
                <img
                  v-if="ele.claim === '1'"
                  src="@/assets/imgs/claim.png"
                />
                {{ ele.user_name }}
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
                    v-if="
                      userType === '2' || userType === '3' || userType === '4'
                    "
                  >
                    <div class="action-item" @click="handleViewDetail(ele)">
                      详情
                    </div>
                    <div class="action-item" @click="handleEdit(ele)">
                      编辑
                    </div>
                    <div class="action-item" @click="handleAdd(ele, idx)">
                      {{ ele.sex === '1' ? '添加' : '' }}
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
    userType() {
      return this.$store.getters.getToken.user_type
    },
    treeData() {
      if (this.data.length === 0) {
        return []
      }
      let res = []
      this.data.forEach(item => {
        let parent = []
        item.children.forEach(key => {
          key.forEach(ele => {
            if (ele.parent !== undefined && parent.indexOf(ele.parent) === -1) {
              parent.push(ele.parent)
            }
          })
        })
        parent = parent.filter(v => {
          return v !== ''
        })
        item.test = []
        if (parent.length === 0) {
          item.test = [item.children]
        } else {
          item.children.forEach(key => {
            let arr = []
            parent.forEach(p => {
              key.forEach(ele => {
                if (ele.parent === p) {
                  arr.push(ele)
                }
              })
            })
            item.test.push([arr])
          })
        }
        item.children.forEach(c1 => {
          c1.forEach(c2 => {
            if (c2.husband) {
              item.test.forEach(t1 => {
                t1.forEach(t2 => {
                  t2.forEach(t3 => {
                    t3.current.forEach(cur1 => {
                      if (
                        cur1.user_id === c2.husband &&
                        item.test.length !== 1
                      ) {
                        t2.push(c2)
                      }
                    })
                  })
                })
              })
            }
          })
        })
        res.push(item)
      })
      return res
    }
  },
  mounted() {
    NodeList.prototype.forEach = Array.prototype.forEach
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
      // this.clearConnectLine()
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
            div.style.borderTop = '1px dashed #000'
            document.getElementById('tree').appendChild(div)
          }
        }
      })
    },
    findChildWidthId(id) {
      let flag = false
      this.treeData.forEach(item => {
        item.children.forEach(key => {
          key.forEach(ele => {
            if (ele.parent === id) {
              flag = true
            }
          })
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
    handleAdd(ele, idx) {
      if (ele.sex === '2') {
        return
      }
      let nextCharacterName = ''
      if (idx + 1 < this.treeData.length) {
        nextCharacterName = this.treeData[idx + 1].level
      }
      console.log(nextCharacterName)
      this.$emit('onAdd', ele, nextCharacterName)
    },
    handleClaim(ele) {
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
      width:30px;
      height:30px;
      margin-right: 30px;
      line-height:30px;
      background:rgba(52,73,94,1);
      border-radius: 50%;
      color: #fff;
      font-size: 14px;
      text-align: center;
    }

    .wrapper {
      width: 95%;
      display: flex;
    }

    .tree-node {
      background:rgba(255,255,255,1);
      box-shadow:-2px 4px 10px 0px rgba(51, 36, 36, 0.08);
      border-radius:4px;
      padding: 3px 2px;
    }
    .leaf {
      height: 40px;
      line-height: 40px;
      width: 100px;
      display: inline-block;
      position: relative;
      text-align: center;
      margin: 0 2px;
      border-radius: 4px;

      img {
        width: 14px;
        height: 14px;
      }

      .icon-wrapper {
        display: inline-block;
        position: absolute;
        top: 5px;
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
        top: 40px;
        left: 0;
        width: 100%;
        background:rgba(25,43,61,1);
        box-shadow:-2px 4px 10px 0px rgba(0,0,0,0.08);
        border-radius:4px;
        color: #fff;

        .action-item {
          cursor: pointer
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
      top: calc(100% + 8px);
      border-left: 1px dashed #000;
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
      border-left: 1px dashed #000;
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
.mr-sm {
  margin-right: 10px;
}
.bg-grey {
  background:rgba(239,243,245,1);
}
.border-green {
  border:1px solid rgba(34,187,35,1);
}
</style>

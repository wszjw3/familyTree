<template>
  <div id="tree" class="tree">
    <div
      v-for="(item, idx) in treeData"
      :key="idx"
      class="tree-item"
      :style="{
        width: maxWidth + 'px'
      }"
    >
      <div v-if="idx !== 0" class="level">{{ item.level }}</div>
      <div
        class="wrapper"
        :class="idx === 0 ? 'justify-center' : 'justify-between'"
      >
        <div
          v-for="(t, tdx) in item.arr"
          :key="tdx"
          style="display: flex; justify-content: space-between;"
        >
          <div
            v-for="(t0, t0dx) in t"
            :key="t0dx"
          >

            <div
              v-for="(t1, t1dx) in t0"
              :key="t1dx"
              class="mx-md"
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
                :style="{
                  marginRight: key.childCount * 100 + 'px'
                }"
                :data-child="key.childCount"
                :data-t1dx="kdx + '-' + t1.length"
                :data-next="key.nextHasChild ? 'you' : 'wu'"
              >
                <div
                  v-if="idx === 0"
                  class="leaf tree-after bg-grey border-green"
                  style="width: auto; padding: 0 5px"
                >
                  {{familyName}}
                </div>
                <template v-else>
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
                    <img v-if="ele.sex === '2'" src="@/assets/imgs/girl.png" />
                    <img v-if="ele.sex === '1'" src="@/assets/imgs/man.png" />
                    <img
                      v-if="ele.claim === '1'"
                      style="margin-left: 5px"
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
                        <div class="action-item" @click="handleViewDetail(ele)">详情</div>
                        <div class="action-item" @click="handleEdit(ele)">编辑</div>
                        <div
                          class="action-item"
                          @click="handleAdd(ele, idx)"
                        >{{ ele.sex === '1' ? '添加' : '' }}</div>
                        <div
                          class="action-item"
                          @click="handleDelete(ele, idx)"
                        >{{ idTheaf(ele, idx) ? '删除' : '' }}</div>
                      </div>
                      <div v-if="ele.claim === '0'" class="claim" @click="handleClaim(ele)">认领</div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as jsPDF from 'jspdf'
export default {
  name: 'FamilyTree',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    manageId: {
      type: String
    },
    familyName:{
      type: String
    }
  },
  data() {
    return {
      hoverNode: {},
      maxWidth: 0
    }
  },
  computed: {
    userType() {
      return this.$store.getters.getToken.user_type
    },
    userId() {
      return this.$store.getters.getToken.user_id
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
                        item.test.length !== 0
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
      res.forEach(item => {
        item.test.forEach((t, tidx) => {
          t.forEach((t1, t1idx) => {
            t1.forEach((key, kdx) => {
              this.setChildCount(res, key, kdx, t1, t1idx, t, tidx, item.test)
            })
          })
        })
      })

      res.forEach((item, idx) => {
        if (idx === 0) {
          item.arr = [item.test]
        } else {

          let parent = []
          item.test.forEach(t1 => {
            const parentId = t1[0][0].parent
            parent.push(parentId)
          })
          parent = Array.from(new Set(parent))
          let arr = []
          parent.forEach(p => {
            let arr1 = []
            item.test.forEach(t1 => {
              const parentId = t1[0][0].parent
              p === parentId && arr1.push(t1)
            })
            arr.push(arr1)
          })
          item.arr = arr
        }
      })
      console.log(res)
      return res
    }
  },
  mounted() {
    NodeList.prototype.forEach = Array.prototype.forEach
    
    this.$nextTick(() => {
      setTimeout(() => {
        const wrapper = document.querySelectorAll('.tree-item')
        let maxWidth = document.querySelector('.tree').getBoundingClientRect().width
        wrapper.forEach(v => {
            console.log(v.scrollWidth)
          if (parseInt(v.scrollWidth) > maxWidth) {
            maxWidth = parseInt(v.scrollWidth)
          }
        })
        this.maxWidth = maxWidth

        window.onresize = () => {
          this.interval()
        }
        this.interval()
      }, 200)
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
            div.style.position = 'absolute'
            div.style.left = fromX > toX ? toX + 'px' : fromX + 'px'
            div.style.top = fromY + 'px'
            div.style.width =
              fromX > toX ? fromX - toX + 'px' : toX - fromX + 'px'
            div.style.height = '1px'
            div.style.borderTopWidth = '1px'
            div.style.borderTopStyle = 'dashed'
            div.style.borderTopColor = '#000'
            div.dataset['connect'] = fromId + '-' + toId
            document.getElementById('tree').appendChild(div)
          }
        }
      })
    },
    setChildCount (res, key, kdx, t1, t1idx, t, tidx, test) {
      key.nextHasChild = true
      key.childCount = 0
      if (key.current.length === 1 && key.current[0].boy_count) {
        key.childCount = parseInt(key.current[0].boy_count)
      }
      if (key.current.length === 2 && key.current[1].boy_count) {
        key.childCount = parseInt(key.current[1].boy_count)
      }
      if (key.childCount === 0 && kdx !== 0) {
        t1[kdx - 1].nextHasChild = false
      }
      // if (key.childCount === 0 && kdx === 0 && tidx === 1) {
      //   test[tidx - 1][0][0].nextHasChild = false
      // }


      // key.nextHasChild = true
      // // let count = 0
      // // res.forEach(item => {
      // //   item.test.forEach(t => {
      // //     t.forEach(tc => {
      // //       tc.forEach(node => {
      // //         if (node.parent === key.id) {
      // //           count++
      // //         }
      // //       })
      // //     })
      // //   })
      // // })
      // // key.childCount = count
      // if (key.childCount === 0 && kdx !== 0) {
      //   t1[kdx -1].nextHasChild = false
      // }
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
    },
    handleDelete(ele) {
      this.$emit('onDelete', ele, this.userId)
    },
    idTheaf() {
      console.log('manageId', this.manageId)
      return this.userId === this.manageId
      // let istheaf = true
      // this.treeData.forEach(item => {
      //   if(item.children) {
      //     item.children.forEach(childs => {
      //       childs.forEach(child => {
      //         if (child.husband && child.husband == ele.user_id) {
      //           istheaf = false
      //         }
      //         child.current.forEach(key => {
      //           if(key.mother_id && key.mother_id == ele.user_id) {
      //             istheaf = false
      //           }
      //         })
      //       })
      //     })
      //   }
      // } )
      // return istheaf
    }
  }
}
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.mx-md {
  margin: 0 20px;
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
      min-width: 30px;
      width: 30px;
      height: 30px;
      margin-right: 30px;
      line-height: 30px;
      background: #57d092;
      border-radius: 50%;
      color: #fff;
      font-size: 14px;
      text-align: center;
    }

    .wrapper {
      // width: 95%;
      display: flex;
      flex: 1;
    }

    .tree-node {
      background: rgba(255, 255, 255, 1);
      box-shadow: -2px 4px 10px 0px rgba(51, 36, 36, 0.08);
      border-radius: 4px;
      padding: 3px 2px;
      white-space: nowrap;
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
        background: #57d092;
        box-shadow: -2px 4px 10px 0px rgba(0, 0, 0, 0.08);
        border-radius: 4px;
        color: #fff;

        .action-item {
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
      content: "";
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
      content: "";
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
  .justify-around {
    justify-content: space-around;
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

  .mr-sm {
    margin-right: 10px;
  }
  .bg-grey {
    background: rgba(239, 243, 245, 1);
  }
  .border-green {
    border: 1px solid rgba(34, 187, 35, 1);
  }

  .color-black {
    border-color: #027be3;
    &:before {
      border-color: #027be3;
    }
    &:after {
      border-color: #027be3;
    }
  }
  .color-primary {
    border-color: #027be3;
    &:before {
      border-color: #027be3;
    }
    &:after {
      border-color: #027be3;
    }
  }
  .color-secondary {
    border-color: #26a69a;
    &:before {
      border-color: #26a69a;
    }
    &:after {
      border-color: #26a69a;
    }
  }
  .color-accent {
    border-color: #9c27b0;
    &:before {
      border-color: #9c27b0;
    }
    &:after {
      border-color: #9c27b0;
    }
  }
  .color-positive {
    border-color: #21ba45;
    &:before {
      border-color: #21ba45;
    }
    &:after {
      border-color: #21ba45;
    }
  }
  .color-negative {
    border-color: #c10015;
    &:before {
      border-color: #c10015;
    }
    &:after {
      border-color: #c10015;
    }
  }
  .color-info {
    border-color: #31ccec;
    &:before {
      border-color: #31ccec;
    }
    &:after {
      border-color: #31ccec;
    }
  }
  .color-warning {
    border-color: #f2c037;
    &:before {
      border-color: #f2c037;
    }
    &:after {
      border-color: #f2c037;
    }
  }
  .color-dark {
    border-color: #1d1d1d;
    &:before {
      border-color: #1d1d1d;
    }
    &:after {
      border-color: #1d1d1d;
    }
  }
}
</style>

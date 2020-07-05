<template>
  <div ref="tree">
    <h2 class="center">{{this.$router.currentRoute.query.family_name}}</h2>
    <p class="center">
      创建人：{{this.$router.currentRoute.query.manage_name}}
		</p>
		<p class="center">
      创建时间：{{this.$router.currentRoute.query.create_time}}
    </p>
    <family-tree :data="treeData" :familyName="this.$router.currentRoute.query.family_name"></family-tree>
  </div>
</template>

<script>
import * as jsPDF from 'jspdf'
import FamilyTree from '@/components/familytree/index'
import { Family } from '@/api'
export default {
  name: 'export',
  components: {
    FamilyTree
  },
  data() {
    return {
      treeData: []
    }
  },
  mounted() {
    this.getTreeData()
  },
  methods: {
    getTreeData() {
      let id = 0
      let params = {}
      if (
        this.$router.currentRoute.query &&
        this.$router.currentRoute.query.familyId
      ) {
        params.family_id = this.$router.currentRoute.query.familyId
        params.isMyTree = false
      } else {
        params.tree_user_id = this.userInfo.tree_user_id
        params.isMyTree = true
      }
      Family.familyTreeQuery(params).then(res => {
        if (!res.data) {
          return
        }
        this.familyId = res.data[0].family_id
        this.$emit('loaded', res.data)
        if (!this.$router.currentRoute.query.familyId) {
          this.getFamilyInfo(res.data[0].family_id)
        }
        const rootId = parseInt(Math.random() * 100000000000000000)

				res.data.unshift({
					"character": "",
					"family_id": res.data[0].family_id,
					"manage_id": res.data[0].manage_id,
					"collection": [
						{
							"landlord": {
								"user_id": rootId,
								"user_name": "",
								"sex": "1",
								"be_alive": "1",
								"claim": "0",
								"mother_id": "",
								"isroot": true
							},
							"wife": [
								{
									"user_id": rootId + 1,
									"user_name": this.$router.currentRoute.query.family_name,
									"sex": "",
									"be_alive": "",
									"claim": "",
									"isroot": true
								}
							]
						}
					]
				})
				res.data[1].collection.forEach(col => {
					col.landlord.mother_id = rootId + 1
				})
        let result = []
        res.data.forEach(item => {
          let obj = {}
          obj.level = item.character
          obj.children = []

          item.collection.forEach(c => {
            let arr = []
            if (c.wife && c.wife.length && c.wife.length > 0) {
              c.wife.forEach((w, wi) => {
                w.isWife = true
                let childrenObj = {
                  related: c.landlord.user_id,
                  id: id,
                  current: []
                }
                if (c.landlord.mother_id) {
                  childrenObj.parent = ''
                }
                if (wi === 0) {
                  childrenObj.current.push(c.landlord)
                  childrenObj.current.push(w)
                } else {
                  childrenObj.current.push(w)
                  childrenObj.husband = c.landlord.user_id
                  childrenObj.related = c.landlord.user_id
                }
                // obj.children.push(childrenObj)
                arr.push(childrenObj)
                id++
              })
            } else {
              let childrenObj = {
                id: id
              }
              if (c.landlord.mother_id) {
                childrenObj.parent = ''
              }
              childrenObj.current = []
              childrenObj.current.push(c.landlord)
              // obj.children.push(childrenObj)
              arr.push(childrenObj)
              id++
            }
            obj.children.push(arr)
          })

          result.push(obj)
        })
        let children = []
        result.forEach(r => {
          r.children.forEach(child => {
            child.forEach(c1 => {
              if (c1.parent === '') {
                children.push(child)
              }
            })
          })
        })
        children.forEach(child => {
          child.forEach(c1 => {
            c1.current.forEach(cur => {
              if (cur.mother_id) {
                result.forEach(res => {
                  res.children.forEach(child2 => {
                    child2.forEach(c2Item => {
                      c2Item.current.forEach(cur2 => {
                        if (Number(cur2.user_id) === Number(cur.mother_id)) {
                          c1.parent = c2Item.id
                        }
                      })
                    })
                  })
                })
              }
            })
          })
        })
        this.treeData = result
        this.$message('下载中，请稍等...')
        setTimeout(() => {
          this.download()
        }, 3000)
      })
    },
    download() {
      const ele = this.$refs.tree
      // eslint-disable-next-line no-undef
      html2canvas(ele, {
        width: ele.scrollWidth
      }).then(canvas => {
        var contentWidth = canvas.width
        var contentHeight = canvas.height

        //一页pdf显示html页面生成的canvas高度
        var pageHeight = (contentWidth / 592.28) * 841.89
        //未生成pdf的html页面高度
        var leftHeight = contentHeight
        //pdf页面偏移
        var position = 0
        //html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）
        var imgWidth = 595.28
        var imgHeight = (592.28 / contentWidth) * contentHeight

        var pageData = canvas.toDataURL('image/jpeg', 1.0)
        var pdf = new jsPDF('', 'pt', 'a4')

        //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
          pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            //避免添加空白页
            if (leftHeight > 0) {
              pdf.addPage()
            }
          }
        }
        pdf.save('家谱.pdf')
        this.$message('下载成功')
      })
    }
  }
}
</script>

<style scoped>
.center {
  text-align: center;
}
</style>

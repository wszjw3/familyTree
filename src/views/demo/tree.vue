<template>
  <div>
    <family-tree :data="treeData"></family-tree>
  </div>
</template>

<script>
import FamilyTree from '@/components/familytree/index'
import {
  Family
} from '@/api'
export default {
  name: 'DemoTree',
  components: {
    FamilyTree
  },
  data () {
    return {
      treeData: []
    }
  },
  created () {
      let id = 0
      Family.familyquery({user_id: '2'}).then(res => {
        let result = []
        res.data.forEach(item => {
          let obj = {}
          obj.level = item.character
          obj.children = []

          item.collection.forEach((c) => {
            if ( c.wife && c.wife.length && c.wife.length > 0 ) {
              c.wife.forEach((w, wi) => {
                let childrenObj = {
                  id: id,
                  current: []
                }
                if ( wi === 0 ) {
                  if (c.landlord.mother_id) {
                    childrenObj.parent = ''
                  }
                  childrenObj.current.push(c.landlord)
                  childrenObj.current.push(w)
                } else {
                  childrenObj.current.push(w)
                }
                obj.children.push(childrenObj)
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
              obj.children.push(childrenObj)
              id++
            }

          })

          result.push(obj)
        })
        let children = []
        result.forEach(r => {
          r.children.forEach(child => {
            if (child.parent === '') {
              children.push(child)
            }
          })
        })
        children.forEach(child => {
          child.current.forEach(cur => {
            if (cur.mother_id) {
              result.forEach(res => {
                res.children.forEach(child2 => {
                  child2.current.forEach(cur2 => {
                    if (cur2.user_id === cur.mother_id) {
                      child.parent = child2.id
                    }
                  })
                })
              })
            }
          })
        })
        this.treeData = result
      })
  }
}
</script>

<style>

</style>

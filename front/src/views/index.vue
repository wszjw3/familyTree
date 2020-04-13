<template>
  <div>
    <statistics :detail="myFmilyDetail" :statistics="myFmilyStatistics"/>

    <el-tabs v-model="activeName">
      <el-tab-pane label="首页" name="first" class="table-item">
        <el-row>
          <el-col :span="12" class="pa-md">
            <p class="title">
              家谱繁荣度排名
              <span class="text-red">TOP10</span>
            </p>
            <el-table border :data="familyData">
              <el-table-column prop="idx" label="排名"></el-table-column>
              <el-table-column prop="family_name" label="家谱树名称"></el-table-column>
              <el-table-column prop="family_score" label="家谱树繁荣得分"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="12" class="pa-md">
            <p class="title">
              个人捐献排名
              <span class="text-red">TOP10</span>
            </p>
            <el-table border :data="manageData">
              <el-table-column prop="idx" label="排名"></el-table-column>
              <el-table-column prop="manage_name" label="管理员姓名"></el-table-column>
              <el-table-column prop="manage_number" label="管理员得分"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="家谱查询" lazy name="second" class="table-item">
        <family-index style="min-height: 100vh"/>
      </el-tab-pane>
      <el-tab-pane v-if="userType === '2'" lazy label="我的家谱" name="thired" class="table-item">
        <family-detail ref="detail" @loaded="handleTreeLoaded"/>
      </el-tab-pane>
      <el-tab-pane v-if="userType === '3'" label="我管理的家谱" name="fourth" class="table-item">
        <el-table :data="myManage">
          <el-table-column prop="idx" label="序号"></el-table-column>
          <el-table-column prop="family_name" label="家谱名称">
            <template slot-scope="scope">
              <router-link :to="{path: '/family/detail', query: {familyId: scope.row.family_id, from: 'manage'}}">{{scope.row.family_name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="family_stay" label="待办事项">
            <template slot-scope="scope">
              <router-link :to="{
                path: '/user/task',
                query: {
                  familyName: scope.row.family_name
                }
              }">{{scope.row.family_stay}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="fund_total" label="基金总额">
            <template slot-scope="scope">
              <router-link :to="{
                path: '/user/fund',
                query: {
                  familyName: scope.row.family_name,
                  familyId: scope.row.family_id
                }
              }">{{scope.row.fund_total}}</router-link>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { Family } from '@/api'
import FamilyIndex from '@/views/family/index'
import FamilyDetail from '@/views/family/detail'
export default {
  name: 'Index',
  components: {
    FamilyIndex,
    FamilyDetail
  },
  data() {
    return {
      activeName: this.$router.currentRoute.query.active || 'first',
      familyData: [],
      manageData: [],
      myManage: [],
      myFmilyDetail: {
        isShow: false,
        count: 0,
        surname: '',
        area_code: '',
        city_code: '',
        prov_code: '',
        city_name: '',
        area_name: '',
        prov_name: '',
        people: 0
      },
      myFmilyStatistics: {
        isShow: false,
        family_number: '',
        death_number: '',
        beath_number: '',
      }
    }
  },
  watch: {
    $router (val) {
      this.activeName = val.currentRoute.query.active
		},
		activeName (val, oldVal) {
			val !== oldVal && this.$router.push({
				path: '/',
				query: {
					active: val
				}
      })
      this.myFmilyStatistics.isShow = val === 'thired'
      this.myFmilyDetail.isShow = val === 'thired'
		}
  },
  created () {
    this.getTableData()
    this.userType === '3' && this.getMyManage()
  },
  computed: {
    userType () {
      return this.$store.getters.getToken.user_type
    },
    userId () {
      return this.$store.getters.getToken.user_id
    },
    treeUserId () {
      return this.$store.getters.getToken.tree_user_id
    }
  },
  methods: {
    getTableData () {
      Family.familyHomePageFind().then(res => {
        if (res.code === '000000' && res.data) {
          this.familyData = res.data.family.map((v, i) => {
            v.idx = i + 1
            return v
          })
          this.manageData = res.data.manage.map((v, i) => {
            v.idx = i + 1
            return v
          })
        }
      })
    },
    getMyManage () {
      Family.familyManageFind({user_id: this.userId}).then(res => {
        this.myManage = res.data.family.map((v, i) => {
          v.idx = i + 1
          return v
        })
      })
    },
    handleTreeLoaded (data) {
      this.getMyFmaily({family_id: data[0].family_id})
    },
    getMyFmaily (prop) {
      Family.familyStatisticsFind({family_id: prop.family_id}).then(res => {
        if (res.code === '000000' && res.data) {
          this.myFmilyStatistics = {
              isShow: true,
              family_number: res.data.family_number,
              death_number: res.data.death_number,
              beath_number: res.data.beath_number
          }
        }
      })
      Family.queryUserTree({tree_user_id: this.treeUserId}).then(res => {
        this.myFmilyDetail.isShow = true
        this.myFmilyDetail.count = res.data.countTree
        this.myFmilyDetail.surname = res.data.surname
        this.myFmilyDetail.area_code = res.data.area_code
        this.myFmilyDetail.area_name = res.data.area_name
        this.myFmilyDetail.prov_name = res.data.prov_name
        this.myFmilyDetail.city_name = res.data.city_name
        this.myFmilyDetail.userCount = res.data.userCount
        this.myFmilyDetail.prov_code = res.data.prov_code
        this.myFmilyDetail.city_code = res.data.city_code
      })
    }
  }
}
</script>

<style scoped lang="less">
.title {
  border-left: 4px solid #409eff;
  padding-left: 10px;
}

.pa-md {
  padding: 10px 40px;
}

.text-red {
  color: red
}
</style>
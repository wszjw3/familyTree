<template>
  <div class="family-create-view">
    <div class="banner">
      已收录全国共
      <span class="num">3000</span>
      棵家谱树，总计
      <span class="num">1111111</span>
      人
      <span class="normal">
        该地区还有6棵孔氏家族谱，
        <a>点击查看</a>
      </span>
    </div>
    <div class="container">
      <div class="title">
        创建新家谱：
        <img class="close-icon" :src="closePng" />
      </div>
      <div class="content">
        <div class="header">
          <p class="desc">
            家谱树的创建，从“爸爸”，“妈妈” 和 “孩子” 开始
          </p>
          <p class="desc">
            将根据家庭地址自动生成家谱名称，请准确填写至城镇（农业户口填写至村）
          </p>
        </div>
        <div class="body">
          <el-table
            :data="tableData"
            style="width: 100%; overflow: auto"
          >
            <el-table-column
              align="center"
              prop="relation"
              min-width="50"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="firstname"
              min-width="90"
            >
              <template slot="header">
                <span class="required">* </span>
                姓
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.firstname"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="lastname"
              min-width="90"
            >
              <template slot="header">
                <span class="required">* </span>
                名
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.lastname"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="character"
              label="字辈"
              min-width="90"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.character" :disabled="scope.row.relation === '母亲'"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="lastname2"
              label="名"
              min-width="90"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.lastname2" :disabled="scope.row.relation === '母亲'"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="sex"
              min-width="90"
            >
              <template slot="header">
                <span class="required">* </span>
                性别
              </template>
              <template slot-scope="scope">
                <el-select v-model="scope.row.sex" placeholder="请选择" :disabled="scope.row.relation !== '孩子'" >
                  <el-option
                    v-for="item in sexOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="borndate"
              min-width="150"
            >
              <template slot="header">
                <span class="required">* </span>
                出生日期
              </template>
              <template slot-scope="scope">
                  <el-date-picker
                    v-model="scope.row.borndate"
                    type="date"
                    style="width: 140px"
                    placeholder="选择日期">
                  </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="deaddate"
              label="死亡日期"
              min-width="150"
            >
              <template slot-scope="scope">
                  <el-date-picker
                    v-model="scope.row.deaddate"
                    type="date"
                    style="width: 140px"
                    placeholder="选择日期">
                  </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="address"
              min-width="250"
            >
              <template slot="header">
                <span class="required">* </span>
                地址
              </template>
              <template slot-scope="scope">
                <city-picker v-model="scope.row.address"/>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="detailAddress"
              min-width="200"
            >
              <template slot="header">
                <span class="required">* </span>
                详细地址
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.detailAddress"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="weddingDate"
              label="结婚时间"
              min-width="150"
            >
              <template slot-scope="scope">
                  <el-date-picker
                    v-model="scope.row.weddingDate"
                    type="date"
                    style="width: 140px"
                    placeholder="选择日期">
                  </el-date-picker>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="footer">
          <el-button class="cancel" @click="handleCancel">取消</el-button>
          <el-button class="confirm" type="primary" @click="handleSave">确认添加</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import closePng from '@/assets/imgs/close.png'
import CityPicker from '@/components/city-picker/index.vue'
export default {
  name: 'FamilyCreate',
  components: {
    CityPicker
  },
  data () {
    return {
      closePng,
      tableData: [
        {
          relation: '父亲',
          firstname: '1',
          lastname: '',
          character: '',
          lastname2: '',
          sex: '1',
          borndate: '',
          deaddata: '',
          address: [],
          detailAddress: '',
          weddingDate: ''
        },
        {
          relation: '母亲',
          firstname: '',
          lastname: '',
          character: '',
          lastname2: '',
          sex: '2',
          borndate: '',
          deaddata: '',
          address: [],
          detailAddress: '',
          weddingDate: ''
        },
        {
          relation: '孩子',
          firstname: '',
          lastname: '',
          character: '',
          lastname2: '',
          sex: '',
          borndate: '',
          deaddata: '',
          address: [],
          detailAddress: '',
          weddingDate: ''
        }
      ]
    }
  },
  computed: {
    sexOptions () {
      return [
        {
          label: '男',
          value: '1'
        },
        {
          label: '女',
          value: '2'
        }
      ]
    }
  },
  methods: {
    handleCancel () {},
    handleSave () {}
  }

}
</script>

<style lang="less" scoped>
.family-create-view {
  background-color: rgba(242, 242, 242, 1);

  .banner {
    padding: 20px 80px;
    background-color: #000;
    color: #fff;
    font-size: 24px;
    font-weight: 600;

    .num {
      font-size: 32px;
      color: #7fbc5d;
    }

    .normal {
      font-size: 14px;
      margin-left: 20px;
    }
  }

  .container {
    padding: 10px;
    width: 1164px;
    margin: 100px auto;
    background-color: #ffffff;

    .title {
      position: relative;
      font-size: 18px;
      padding: 10px 0 20px 0;
      border-bottom: 1px solid #ddd;

      .close-icon {
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
        width: 21px;
        height: 21px;
      }
    }

    .content {

      .header {

        .desc {
          text-align: center;
          font-size: 20px
        }
      }

      .footer {
        padding: 50px;
        text-align: center;

        .cancel,
        .confirm {
          margin: 0 20px;
          width: 140px;
        }
      }
    }

  }

  .required {
    color: red
  }
}

</style>

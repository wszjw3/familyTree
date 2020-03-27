<template>
    <div class="node-detail">
        <div class="toolbar-wrapper">
            <div class="title">生平信息</div>
            <el-button size="small" @click="handleEdit">编辑</el-button>
        </div>
        <div class="content">
            <div class="desc">
                <img :src="info.img ? info.img : avatar" />
                <div>
                    <span>生于{{info.brith_time}}</span>
                    <span>死于{{info.death_time}}</span>
                    <p>{{info.address}}</p>
                </div>
            </div>
            <div class="clear-both">
                <template v-if="status === 'view'">
                    <div class="mt-sm mb-md">{{info.labelName ? info.labelName + '：' + info.name : info.name}}</div>
                    <div class="mt-md mb-md">{{info.family_tree_name}}</div>
                    <div
                        v-for="(item, idx) in info.familyLifeTimeHisList"
                        :key="idx"
                        class="mt-md"
                    >
                        {{item.age + '岁 ' + item.userTime + ' ' + item.lifeDescription}}
                    </div>
                </template>
                <template v-else>
                    <div class="mt-sm mb-md">{{info.name}}</div>
                    <div>
                        我的标签：
                    </div>
                    <div class="tag-wrapper">
                        <div
                            v-for="(item, idx) in tags"
                            :key="idx"
                            class="tag"
                            :class="selectTag.includes(item.label_id) ? 'active' : ''"
                            @click="handleChooseTag(item)"
                        >
                            {{item.label_name}}
                        </div>
                    </div>
                    <el-table
                        :data="tableData"
                        class="table"
                        style="width: 100%"
                    >
                        <el-table-column
                            align="left"
                            prop="date"
                            label="日期"
                        >
                            <template slot-scope="scope">
                                <el-date-picker
                                    v-model="scope.row.date"
                                    type="date"
                                    placeholder="选择日期"
                                    class="input"
                                >
                                </el-date-picker>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="left"
                            prop="education"
                            label="学历"
                        >
                            <template slot-scope="scope">
                                <el-select
                                    v-model="scope.row.education"
                                    placeholder="请选择"
                                    class="input"
                                >
                                    <el-option
                                        v-for="item in education"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="left"
                            prop="school_name"
                            label="学校"
                        >
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.school_name" class="input"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="left"
                            prop="action"
                            label="操作"
                            width="60"
                        >
                            <template slot-scope="scope">
                                <span class="action" @click="handleDelete(scope.row)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="add-cloumn" @click="handleAddColumn">
                        继续添加
                    </div>
                    <div class="card">
                        <span class="float-left">个人名片：</span>
                        <div class="img-upload" @click="handleChooseImage">
                            <template v-if="!uploadImg">
                                +
                            </template>
                            <img v-else :src="uploadImg" alt="" class="fit">
                        </div>
                    </div>
                    <div class="operation">
                        <el-button style="width: 140px" type="primary" @click="handleConfirm">确认修改</el-button>
                        <el-button style="width: 140px" @click="handleCancel">取消</el-button>
                    </div>
                </template>
            </div>
        </div>
        <input class="hidden" type="file" accept="image/*" id="file" @input="getImage">
    </div>
</template>

<script>
import avatar from '@/assets/imgs/avatar.png'
import { Family } from '@/api'

export default {
    name: 'lifeInfo',
    props: {
        info: {
            type: Object
        }
    },
    data() {
        return {
            avatar,
            status: 'view',
            tags: [],
            selectTag: [],
            idx: 0,
            tableData: [],
            education: [
                {
                    label: '本科',
                    value: '本科'
                },
                {
                    label: '硕士',
                    value: '硕士'
                }
            ],
            uploadImg: this.info.img ? this.info.img : ''
        }
    },
    created () {
        this.getLabel()
    },
    methods: {
        handleEdit() {
            this.status = 'edit'
            this.getEducation()
        },
        getLabel() {
            Family.familyQueryLabel().then(res => {
                if (!res.data) {
                    return
                }
                this.tags = res.data
            })
        },
        getEducation() {},
        handleChooseTag (value) {
            this.selectTag.indexOf(value.label_id) < 0 ? this.selectTag.push(value.label_id) : this.selectTag = this.selectTag.filter(v => {
                return v!== value.label_id
            })
        },
        handleDelete (row) {
            this.tableData = this.tableData.filter(v => {
                return v.idx !== row.idx
            })
        },
        handleAddColumn () {
            this.tableData.push({
                date: '',
                education: '',
                school_name: '',
                idx: this.idx
            })
            this.idx++
        },
        handleConfirm () {
            let params = {}
            let label_list = []
            this.selectTag.forEach(item => {
                this.tags.forEach(key => {
                    if (item === key.label_id) {
                        label_list.push(key)
                    }
                })
            })
            params.label_list = label_list
            params.tree_user_img = this.uploadImg
            params.record_list = this.tableData
        },
        handleCancel () {
            this.status = 'view'
            this.selectTag = []
            this.tableData = [
                {
                    date: '',
                    education: '',
                    school_name: '',
                    idx: 0
                },
                {
                    date: '',
                    education: '',
                    school_name: '',
                    idx: 1
                }
            ]
            var file = document.getElementById('file')
            file.select()
            document.selection.clear()
        },
        handleChooseImage () {
            const file = document.getElementById('file')
            var e = document.createEvent('MouseEvents')
            e.initEvent('click', true, true)
            file.dispatchEvent(e)
        },
        getImage () {
            const reads = new FileReader()
            const f = document.getElementById('file').files[0]
            reads.readAsDataURL(f)
            const self = this
            reads.onload = function() {
                self.uploadImg = this.result
            }
        }
    }
}
</script>

<style lang="less" scoped>
.node-detail {
    .toolbar-wrapper {
        border-bottom: 1px solid #ddd;
        height: 30px;
        line-height: 30px;
        display: flex;
        margin: 10px 0;
        padding: 10px 0;
        .title {
        flex: 1;
        font-weight: 650;
        font-size: 24px;
        height: 24px;
        line-height: 24px;
        padding-left: 10px;
        border-left: 4px solid red;
        }
    }

    .content {
        .desc {
            height: 100px;

            img {
                float: left;
                width: 100px;
                height: 100px;
                margin-right: 20px;
            }
        }

        .clear-float {
            clear: both;
        }
        .mt-sm {
            margin-top: 8px;
        }
        .mt-md {
            margin-top: 20px;
        }
        .mb-md {
            margin-bottom: 20px;
        }
    }
    .tag-wrapper {
        margin-left: 60px;
        .tag {
            width: 75px;
            height: 33px;
            line-height: 33px;
            text-align: center;
            background-color: rgba(242, 242, 242, 1);
            border: 1px solid transparent;
            display: inline-block;
            margin: 10px;
            cursor: pointer;
        }
        .active {
            border: 1px solid rgba(24, 144, 255, 1)
        }
    }

    .table {
        margin-top: 20px;

        .action {
            color:rgba(24, 144, 255, 1);
            cursor: pointer;
        }

        .input {
            max-width: 100%;
        }
    }
    .add-cloumn {
        margin-top: 10px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border: 1px dashed #ddd;
        cursor: pointer
    }

    .card {
        margin-top: 20px;
        .img-upload {
            width: 98px;
            height: 94px;
            line-height: 94px;
            border: 1px dashed #2491FC;
            color: #2491FC;
            text-align: center;
            font-size: 26px;
            cursor: pointer;
            display: inline-block;
            margin-top: 20px
        }
    }
    .operation {
        margin-top: 40px;
        text-align: center;
    }
}
.hidden {
    visibility: hidden;
}
.float-left {
    float: left
}
.fit {
    width: 100%;
    height: 100%
}
</style>
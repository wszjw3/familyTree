<template>
  <el-upload class="upload-demo" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :file-list="fileList"
    :auto-upload="false" :show-file-list="false" :on-change="handleChange" :on-success="uploadSuccess" :on-error="uploadError">
    <el-input slot="trigger" readonly placeholder="请选择需要上传的文件" :value='fileName' :disabled="uploadLoading" style="width: 400px;" />
    <el-button style="margin-left: 10px;" type="primary" @click="submitUpload" :disabled="fileName===''" :loading="uploadLoading">
      <template v-if="!uploadLoading"><i class="el-icon-upload el-icon--left"></i>上传</template>
      <template v-else>上传处理中</template>
    </el-button>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
  </el-upload>
</template>
<script>
  export default {
    data() {
      return {
        fileList: [],
        fileName: '',
        uploadLoading: false
      }
    },
    methods: {
      submitUpload() {
        this.uploadLoading = true
        this.$refs.upload.submit()
      },
      handleChange(file, fileList) {
        if (file.status === 'ready') {
          this.fileName = file.name
          fileList.forEach((lfile, i) => {
            if (file.uid !== lfile.uid) {
              fileList.splice(i, 1)
            }
          })
          console.log(file, fileList)
        }
      },
      uploadSuccess(response, file, fileList) {
        console.log(response, file, fileList)
        this.uploadLoading = false
        this.fileName = ''
        this.$message({
          message: '文件上传成功！',
          type: 'success'
        })
      },
      uploadError(err, file, fileList) {
        console.log(err, file, fileList)
        this.uploadLoading = false
        this.fileName = ''
        this.$message.error('文件上传失败！')
      }
    }
  }

</script>

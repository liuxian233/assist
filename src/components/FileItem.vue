<template>
<div>

<el-row>
    <el-col :span="24" style="text-align: left;"><div>
        <el-tooltip class="item" effect="dark" content="返回上层" placement="top">
            <a href="#"><i class="el-icon-back"/></a>
        </el-tooltip>
        当前路径：{{fileCurPath}}
    </div></el-col>
</el-row>


<el-table
    :data="tableData"
    style="width: 100%"
    :show-header="false"
    max-height="250">

    <el-table-column
      fixed
      prop="name"
      label="文件"
      width="300">
      <template slot-scope="scope">
        <b v-if='scope.row.isFile'>{{ scope.row.name }}</b>
        <a v-else href='#' @click="getDir(scope.$index, scope.row)">{{ scope.row.name }}</a>
      </template>
    </el-table-column>
    <el-table-column
      fixed
      prop="modifyDate"
      label="修改时间"
      width="150">
      <template slot-scope="scope">
       {{ dateformate(new Date(scope.row.modifyDate)) }}
      </template>
    </el-table-column>
    <el-table-column
      fixed
      label="操作"
      width="50">
      <template slot-scope="scope">
       <a href='#' @click="del(scope.$index, scope.row)"><i class="el-icon-delete"></i></a>
      </template>
    </el-table-column>
</el-table>

<el-form :inline="true" :model="formInline" class="demo-form-inline" style="text-align: left;">
  <el-form-item label="上传文件至当前目录">
    <input type="file" />
  </el-form-item>
  <el-form-item>
    <i v-if='bFileSending' class="el-icon-loading"/>
  </el-form-item>
</el-form>

</div>
</template>

<script>
export default {
    name: 'FileItem',
    data: function () {
        return {
            tableData: [{ name: 'auth.apk', isFile: true, absPath: '/auth.apk', modifyDate: 1530513380000 },
            { name: 'system', isFile: false, absPath: '/system', modifyDate: 1530513380000 },
            { name: 'auth.apk', isFile: true, absPath: '/auth.apk', modifyDate: 1530513380000 },
            { name: 'system', isFile: false, absPath: '/system', modifyDate: 1530513380000 },
            { name: 'auth.apk', isFile: true, absPath: '/auth.apk', modifyDate: 1530513380000 },
            { name: 'system', isFile: false, absPath: '/system', modifyDate: 1530513380000 },
            { name: 'auth20180618-230121v20283.apk', isFile: true, absPath: '/auth.apk', modifyDate: 1530513380000 },
            { name: 'system', isFile: false, absPath: '/system', modifyDate: 1530513380000 },
            { name: 'auth.apk', isFile: true, absPath: '/auth.apk', modifyDate: 1530513380000 },
            { name: 'system', isFile: false, absPath: '/system', modifyDate: 1530513380000 },
            { name: 'auth.apk', isFile: true, absPath: '/auth.apk', modifyDate: 1530513380000 },
            { name: 'system', isFile: false, absPath: '/system', modifyDate: 1530513380000 }],
            bFileSending: true,
            fileCurPath: '/sdcard/data/org.zx.AuthComp/lib/arm64',
            fileParentPath: null
        };
    },
    methods: {
        getDir(index, item) {
            console.log('getDir...')
            console.log(item.absPath)
        },
        del(index, item) {
            console.log('delete...')
            console.log(item.absPath)
        },
        dateformate(d) {
            return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        }
    }
};
</script>


<style scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
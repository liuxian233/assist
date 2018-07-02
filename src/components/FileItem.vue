<template>
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
      align='left'
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
            { name: 'system', isFile: false, absPath: '/system', modifyDate: 1530513380000 }]
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
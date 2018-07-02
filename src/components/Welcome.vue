<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <h2>欢迎使用远程测试系统 Demo版</h2><br/>
        <el-form ref="form" :model="form">
          <el-form-item label="测试人员姓名">
            <el-input v-model="form.room_name" placeholder="请输入测试人员的姓名"/>
          </el-form-item>
            <br/>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <br/>
    <div class="row" style="padding-top: 30px">
      <div class="col-md-6 col-md-offset-3">
        <h4 style="text-align: left">在线测试人员: </h4>
        <el-table :data="tableData">
          <el-table-column
            prop="roomId"
            label="测试人员"
            width="180">
          </el-table-column>
          <el-table-column
            prop="roomClientSize"
            label="用户数"
            width="180">
          </el-table-column>
          <!-- <tbody>
            <tr v-for="(room, index) in rooms">
              <td>
                <router-link :to="{name: 'room', params: {room: index}}">
                    {{ index }}
                </router-link>
              </td>
              <td>{{ room.join(', ') }}</td>
            </tr>
          </tbody> -->
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/api'
export default {
  name: 'Welcome',
  data() {
    return {
      form: {
        room_name: ''
      },
      rooms: '',
      tableData: []
    };
  },
  created() {
    // socket.emit('message', JSON.stringify({
    //     "event": "get_room_info",
    // }));
  },
  mounted() {
    // socket.on('message', function (data) {
    //   var data = JSON.parse(data);
    //   switch (data.event) {
    //     case "show":
    //       this.rooms = data.allUser;
    //       break;
    //     default:
    //       break;
    //   }
    // }.bind(this));
    var that = this;
    api.online_room(null).then(function (res) {
      that.tableData = res.data
      // console.log(res.data);
    }).catch(function (error) {
      console.log(error)
    })
  },
  methods: {
    onSubmit() {
      // this.$router.push({name: 'AssRtc', params: {room: this.form.room_name}});
      this.$router.push({path: 'assist', query: {room: this.form.room_name}});
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

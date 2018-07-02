<template>
  <div class="container">
    <el-form :model="info" novalidate @submit.stop.prevent="login">
      <el-form-item label="用户名">
        <el-input v-model="info.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="info.password"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="login">登录</el-button>

    <p class="msg">{{LoginInfo.msg}}</p>
  </div>
</template>

<script type="application/ecmascript">
  import {mapState} from 'vuex'
  import * as types from '../store/mutation-types'

  export default {
    name: '',
    data () {
      return {
        info: {
          password: '',
          username: ''
        }
      }
    },
    mounted(){
      // this.$store.commit(types.TITLE, 'Login');
    },
    computed: {
      ...mapState({
        token: state => state.data.token,
        LoginInfo: state => state.data.LoginInfo
      })
    },
    methods: {
      login() {
        console.log(JSON.stringify(this.token))
        if (this.token || localStorage.getItem("token")) {
          // this.$store.commit(types.LOGIN, this.token)
          let redirect = decodeURIComponent(this.$route.query.redirect || '/');
          this.$router.push({
            path: redirect
          })
        } else {
          this.$store.dispatch(types.FECTH_LOGIN, this.info);
          //console.log(JSON.stringify(this.LoginInfo));
        }
      },
      isLogin: function () {
        if (this.token || localStorage.getItem("token")) {

        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped lang='scss' rel="stylesheet/scss" type="text/css">
  .login-form{
    width: 400px;
    margin: 50px auto;
  }
</style> -->
<style type="text/css">
</style>
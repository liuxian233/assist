/* eslint-disable */

<template>
  <div v-if='isAuthOk' class='container'>
    <div id='controll'>
      <h1>测试人员{{ msg }}在线</h1>

      

      <el-table :data='phoneData' border>
        <el-table-column prop='key' label='参数名' width='100'/>
        <el-table-column prop='value' label='参数'/>
      </el-table>
      <!-- <div>iceState</div> -->
      <el-input
        type='textarea'
        :rows='2'
        placeholder='请输入内容'
        v-model='iceState'>
      </el-input>

      <div>
        <h4>文件管理</h4>
        
<el-row>
    <el-col :span="24" style="text-align: left;"><div>
        <el-tooltip class="item" effect="dark" content="返回上层" placement="top">
            <a @click="getDir(0, fileParentPath)" href="#" ><i class="el-icon-back"/></a>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <a @click="getDir(0, fileCurPath)" href="#" ><i class="el-icon-refresh"/></a>
        </el-tooltip>
        当前路径：{{fileCurPath}}
    </div></el-col>
</el-row>


<el-table :data="fileList" style="text-align: left;width: 100%" :show-header="false"  max-height="250">

    <el-table-column  fixed  prop="name"  label="文件"  width="300">
      <template slot-scope="scope">
        <b v-if='scope.row.isFile'>{{ scope.row.name }}</b>
        <a v-else href='#' @click="getDir(scope.$index, scope.row.absolutePath)">{{ scope.row.name }}</a>
      </template>
    </el-table-column>
    <el-table-column  fixed  prop="modifyDate"  label="修改时间"  width="150">
      <template slot-scope="scope">
       {{ dateformate(new Date(scope.row.lastModifed)) }}
      </template>
    </el-table-column>
    <el-table-column  fixed  label="操作"  width="50">
      <template slot-scope="scope">
       <a href='#' @click="del(scope.$index, scope.row.absolutePath)"><i class="el-icon-delete"></i></a>
      </template>
    </el-table-column>
</el-table>

<el-form :inline="true"  class="demo-form-inline" style="text-align: left;">
  <el-form-item label="上传文件至当前目录">
    <input  @change="sendFile"  type="file" />
  </el-form-item>
  <el-form-item>
    <i v-if='bFileSending' class="el-icon-loading"/>
  </el-form-item>
</el-form>

      </div>

      <div id='phonebutton'>
        <el-button style='width: 120px;' type='primary' v-bind:disabled='hangupDisabled' @click='hangup'>Hang Up</el-button>
      </div>
    </div>

    <div id='showvideo-inner'>
      <div id='cellphone-top'>
        <div id='cellphone-top-speaker'>
          <div class='dot'></div>
          <div class='dot'></div>
          <div class='dot'></div>
        </div>
        <div id='circles'>
          <div id='cellphone-top-small-circle'></div>
          <div id='cellphone-top-big-circle'></div>
        </div>
      </div>
      <video id='remoteVideo' :src='remote_video'
             @mousedown='downFunction'
             @mousemove='moveFunction'
             @mouseup='upFunction' autoplay></video>
      <div id='cellphone-bottom'>
        <div @click='ctlBack' id='cellphone-bot-back-button'></div>
        <div @click='ctlHome' id='cellphone-bot-home-button'></div>
        <div @click='ctlMenu' id='cellphone-bot-menu-button'></div>
      </div>
    </div>
    <div class='phonebutton' id='cellphone-voicePlus-button'>
      <div id='voice-buttonDown-div' @click='ctlVDown'></div>
    </div>
    <div class='phonebutton' id='cellphone-voicereduce-button'>
      <div id='voice-buttonUp-div' @click='ctlVUp'></div>
    </div>
    <div class='phonebutton' id='cellphone-power-button'>
      <div id='power-button-div' @click='ctlPower'></div>
    </div>
  </div>
</template>

<script>
// import '../../static/css/wmain.css'
// import '../../static/css/main.css'
// import Vue from 'vue'

// import VueWebsocket from 'vue-websocket'

// import VueSocketio from 'vue-socket.io'
// import socketio from 'socket.io-client'
import remote from '../util/remote';
import stats from '../util/stats';
import api from '../api/api';
// Vue.use(VueWebsocket, 'ws://assist.ztems.com:8080/sig/ws')
// Vue.use(VueWebsocket, 'ws://pcs.ztems.com/pcconn')
// Vue.use(VueSocketio, socketio('http://172.16.20.148:3000/'), store)
// Vue.use(VueSocketio, 'http://172.16.20.148:3000/')

// const socket = io.connect('http://localhost')
// import Webrtc from 'webrtc-adapter'
// var audio2 = document.querySelector('localAudio');
// var stream
var peerConn = null;
var dataChannel;
// var connectedUser = null
var servers = {
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302']
    },
    {
      urls: ['stun:121.199.14.193:3478']
    },
    {
      urls: ['turn:115.28.170.217:3478'], // 这个服务器是人家的，有不确定性，我们需要自己搭建
      credential: 'zmecust',
      username: 'zmecust'
    } /*,
    {
      urls: ['turn:121.199.14.193:3478'], // 这个服务器是自己搭建的
      credential: 'nQkMpV12rzXzHdp9WnqW7jtI/og=',
      username: '1520988010:zteassist'
    } */
  ]
};
var constraints = {
  audio: true,
  video: false
};
// var localStream;
// var startTime
var offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};
var pcConstraints = {};
var wsTimeout;

export default {
  name: 'AssRtc',
  data() {
    return {
      msg: 'Welcome to Assist Rtc',
      // <el-select id='codec'>
      //   <!-- Codec values are matched with how they appear in the SDP.
      //   For instance, opus matches opus/48000/2 in Chrome, and ISAC/16000
      //   matches 16K iSAC (but not 32K iSAC). -->
      // </el-select>
      options: [
        {
          value: 'Opus',
          label: 'opus'
        },
        {
          value: 'iSAC 16K',
          label: 'ISAC'
        },
        {
          value: 'G722',
          label: 'G722'
        },
        {
          value: 'PCMU',
          label: 'PCMU'
        }
      ],
      roomid: '',
      value: '',
      ctlBtnDisabled: true,
      hangupDisabled: true,
      remote_video: '',
      local_audio: '',
      remote_audio: '',
      websock: null,
      iceState: '',
      state: '',
      phoneData: [],
      isAuthOk: false,
      fileList: [{ name: '/', isFile: false, absolutePath: '/', lastModifed: 0 }],
      bFileSending: false,
      fileCurPath: '/',
      fileParentPath: '/'
    };
  },
  created() {
    // console.log('实例已经创建,msg变量还未渲染到模板')
    this.roomid = this.$route.query.room
    this.msg = this.roomid;
    console.log('roomid: ' + this.roomid);
    /* for debug */
    /*   this.authSession(
        this.roomid,
        this.$route.query.timestamp,
        this.$route.query.sign
      ); */
    this.isAuthOk = true
    this.initWebSocket();
  },
  mounted() {
    // console.log('已经挂载到模板上:msg变量渲染到模板')
    // socket.on('message', function (data) {
    //   console.log(data)
    //  this.processMsg(redata)
    // }.bind(this))

    // this.initWebSocket();
  },
  updated: function () {
    // console.log('实例更新啦')
    if (this.roomid === null || this.roomid === '') {
      this.$router.push({ name: 'Welcome111' });
    }
  },
  destroyed: function () {
    // console.log('销毁啦')
    this.hangup();
  },
  methods: {
    sendFile(event) {
      var files = event.target.files
      if (!files || !files[0]) {
        return
      }

      var file = files[0]
      console.log('sendFile dataChannel.readyState:' + dataChannel.readyState);
      console.log('sendFile ' + [file.name, file.size, file.type, file.lastModifiedDate].join(','));

      if (file.size === 0) {
        this.$message({ showClose: true, type: 'error', message: '文件为空' });
        return;
      }

      // 以下代码大部分参考 https://webrtc.github.io/samples/src/content/datachannel/filetransfer/
      if (this.bFileSending) {
        this.$message({ showClose: true, type: 'error', message: '前一次的文件发送尚未完成，请稍后再试' });
        return;
      }
      this.bFileSending = true

      var fileListReq = { type: 22, absolutePath: this.fileCurPath + '/' + file.name, size: file.size };
      dataChannel.binaryType = 'arraybuffer';

      try {
        dataChannel.send(JSON.stringify(fileListReq));
        console.log('sendFile signal:' + JSON.stringify(fileListReq))
      } catch (error) {
        this.bFileSending = false
        console.log('sendFile send signal error:' + error + ' bFileSending:' + this.bFileSending)
        this.$message({ showClose: true, type: 'error', message: '文件发送失败。' });
        return
      }

      var that = this
      var chunkSize = 8192;
      // var chunkSize = 16384;
      var sliceFile = function (offset) {
        var reader = new window.FileReader();
        reader.onload = (function () {
          return function (e) {
            try {
              dataChannel.send(e.target.result);
              console.log('sendFile send slice')
            } catch (error) {
              that.bFileSending = false
              console.log('sendFile error:' + error + ' bFileSending:' + that.bFileSending)
              that.$message({ showClose: true, type: 'error', message: '文件发送失败。' });
              return
            }

            if (file.size > offset + e.target.result.byteLength) {
              window.setTimeout(sliceFile, 0, offset + chunkSize);
            } else {
              that.bFileSending = false
              console.log('sendFile finish bFileSending:' + that.bFileSending)
              that.$message({ showClose: true, type: 'success', message: '文件发送完成，对端接收可能会存在一段延时。' });
            }
          };
        })(file);
        reader.onerror = function (e) {
          that.bFileSending = false
          console.log('sendFile read file onerror bFileSending:' + that.bFileSending)
          that.$message({ showClose: true, type: 'error', message: '文件发送失败。' });
        }

        var slice = file.slice(offset, offset + chunkSize);
        reader.readAsArrayBuffer(slice);
      };
      sliceFile(0);
    },
    getDir(index, path) {
      console.log('getDir...' + path)
      var fileListReq = { type: 21, showpath: path };
      dataChannel.binaryType = 'arraybuffer';
      dataChannel.send(JSON.stringify(fileListReq));
    },
    del(index, path) {
      console.log('delete...')
      console.log(path)
    },
    dateformate(d) {
      return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    },
    authSession(roomid, timestamp, sign) {
      console.log('authSession send req');
      var that = this;
      var param = { roomid: roomid, timestamp: timestamp, sign: sign };
      api
        .authSession(param)
        .then(function (resp) {
          console.log('authSession resp');
          if (resp.data) {
            console.log(resp.data);
            that.isAuthOk = (resp.data.status === 'ok');
          }
          console.log('that.isAuthOk:' + that.isAuthOk);
          if (that.isAuthOk) {
            that.initWebSocket();
          } else {
            console.log('oops');
            window.alert('无效的会话');
          }
        })
        .catch(function (error) {
          console.log(error);
          window.alert('会话鉴权失败');
        });
    },
    // 这里使用methods
    createRtcConn() {
      let self = this;
      peerConn = new RTCPeerConnection(servers, pcConstraints);
      // trace('Created local peer connection object pc1')
      peerConn.onaddstream = function (e) {
        // console.log('zwb onaddstream' + e);
        console.log('zwb remote AudioTracks', e.stream.getAudioTracks());
        console.log('zwb remote VideoTracks', e.stream.getVideoTracks());
        // self.remote_video = window.URL.createObjectURL(e.stream);
        var video = document.getElementById('remoteVideo');
        video.srcObject = e.stream;
      };
      peerConn.ontrack = function (e) {
        console.log('zwb onaddstream' + e);
        // self.remote_video = window.URL.createObjectURL(e.stream);
      };
      peerConn.onicecandidate = function (event) {
        console.log('zwb candidate st:' + event.target.iceGatheringState);

        if (event.candidate) {
          var c = self.parseCandidate(event.candidate.candidate);
          // appendCell(row, c.component);
          // appendCell(row, c.type);
          // appendCell(row, c.foundation);
          console.log(
            'zwb local candidate got:' +
            c.protocol +
            '-' +
            c.address +
            '-' +
            c.port
          );
          // appendCell(row, formatPriority(c.priority));
          // candidates.push(c);
        }

        setTimeout(function () {
          if (event.candidate) {
            self.send({
              event: 'candidate',
              candidate: event.candidate
            });
            // console.log('zwb send local candidate suc');
          }
        });
      };
      peerConn.onicegatheringstatechange = function (event) { };
      peerConn.ondatachannel = function (evt) {
        self.addDataChannel(evt.channel);
      };
      this.iceState = peerConn.iceConnectionState;
      peerConn.oniceconnectionstatechange = function (e) {
        // console.log('zwb ICE state change event: ', e);
        var iceState = peerConn.iceConnectionState;
        self.iceState += ' => ' + iceState;
      };
      this.state = peerConn.signalingState || peerConn.readyState;
      peerConn.onsignalingstatechange = function (e) {
        // console.log('zwb ICE state change event: ', e);
        var state = peerConn.signalingState || peerConn.readyState;
        self.state += ' => ' + state;
      };
      self.createDataChannel('sendControlDataChannel');
    },
    initCreate: function () {
      window.trace('Requesting local stream');
      let self = this;
      this.ctlBtnDisabled = true;
      this.createRtcConn();

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          // displaying local video stream on the page
          // self.local_video = window.URL.createObjectURL(stream)
          // self.remote_video = window.URL.createObjectURL(stream)
          // localStream = stream;
          self.hangupDisabled = false;
          peerConn.addStream(stream);

          // var audioTracks = stream.getAudioTracks();
          // console.log('Using audio device: ' + audioTracks[0].label);
          // self.local_audio = window.URL.createObjectURL(stream);
          // self.local_audio = stream;

          // var audio2 = document.getElementById('localAudio');
          // audio2.srcObject = stream
          // audio2.onloadedmetadata = function(e) {
          //   // console.log('Label: ' + stream.label);
          //   console.log('zwb local AudioTracks', stream.getAudioTracks());
          //   console.log('zwb local VideoTracks', stream.getVideoTracks());
          // };
        })
        .catch(function (e) {
          self.hangupDisabled = false;
          // alert('zwb getUserMedia() error: ' + e.name);
        });
      window.trace('Starting call');
      // startTime = window.performance.now()
      // localStream.getTracks().forEach(function(track) {
      //   peerConn.addTrack(track, localStream);
      // });
    },
    send(message) {
      // if (connectedUser != null) {
      //   message.connectedUser = connectedUser
      // }
      // socket.send(JSON.stringify(message))
      var data = JSON.stringify(message);
      this.sendSafe(JSON.stringify({ cmd: 'send', msg: data }));
    },
    handleCall(data) {
      // connectedUser = data.name
      this.$confirm('您有视频邀请，是否接受?', '提示', {
        confirmButtonText: '接受',
        cancelButtonText: '拒绝',
        type: 'warning'
      })
        .then(() => {
          this.send({
            event: 'accept',
            accept: true
          });
          this.ctlBtnDisabled = false;
        })
        .catch(() => {
          this.send({
            event: 'accept',
            accept: false
          });
        });
    },
    handleAccept(data) {
      if (data.accept) {
        var self = this;
        // create an offer
        peerConn.createOffer(offerOptions).then(
          function (offer) {
            self.send({
              event: 'offer',
              offer: offer
            });
            peerConn.setLocalDescription(offer);
          },
          function (error) {
            alert('Error when creating an offer' + error.toString());
          }
        );
      } else {
        alert('对方已拒绝');
      }
    },
    handleOffer(data) {
      var self = this;
      const offer = JSON.parse(data.offer);
      // connectedUser = data.name
      // peerConn.setRemoteDescription(new RTCSessionDescription(data.offer));
      peerConn.setRemoteDescription(offer).then(
        function () {
          // create an answer to an offer
          peerConn.createAnswer(
            function (answer) {
              peerConn.setLocalDescription(answer);
              self.send({
                event: 'answer',
                answer: answer
              });
              console.log('zwb set Local RDP and send to remote suc');
            },
            function (error) {
              alert('Error when creating an answer' + error.toString());
            }
          );
          console.log('zwb set Remote RDP suc');
        },
        function (error) {
          console.log('setRemot RDP error:' + error);
        }
      );
    },
    handleMsg(data) {
      console.log(data.message);
    },
    handleAnswer(data) {
      peerConn.setRemoteDescription(new RTCSessionDescription(data.answer));
    },
    handleCandidate(data) {
      var self = this;
      // ClientB通过PeerConnection的AddIceCandidate方法保存起来
      // peerConn.addIceCandidate(new RTCIceCandidate(data.candidate));
      // const candidate = JSON.parse(data.candidate);
      if (data.candidate) {
        var c = self.parseCandidate(data.candidate.candidate);
        console.log(
          'zwb remote candidate got:' +
          c.protocol +
          '-' +
          c.address +
          '-' +
          c.port
        );
      }
      const candidate = data.candidate;
      peerConn.addIceCandidate(candidate).then(function () {
        // self.send({
        //   event: 'candidate',
        //   answer: savedCandidate
        // });
        // console.log('zwb add remote candidate suc');
      });
    },
    handleRemoveCandidates(data) {
      console.log('zwb remote remove candidates');
      // var self = this
      // const candidates = data.candidates;
      // peerConn.removeCandidate(candidates)
      stats.enumerateStats();
    },
    hangup() {
      this.send({
        event: 'leave'
      });
      if (this.websock.readyState === this.websock.OPEN) {
        this.websock.close();
      }
      this.handleLeave();
    },
    handleLeave() {
      // alert('通话已结束');
      // connectedUser = null
      this.remote_video = '';
      this.local_audio = '';
      peerConn.close();
      peerConn.onicecandidate = null;
      peerConn.oniceconnectionstatechange = null;
      peerConn.onsignalingstatechange = null;
      peerConn.onaddstream = null;
      if (peerConn.signalingState === 'closed') {
        peerConn = null;
        this.initWebSocket();
      }
    },
    sendSafe(strData) {
      let that = this; // 保存当前对象this
      // 若是ws开启状态
      if (this.websock.readyState === this.websock.OPEN) {
        this.websock.send(strData);
      } else if (this.websock.readyState === this.websock.CONNECTING) {
        // 若是 正在开启状态，则等待300毫秒
        setTimeout(function () {
          that.websock.send(strData);
        }, 300);
      } else {
        // 若未开启 ，则等待500毫秒
        this.initWebSocket();
        setTimeout(function () {
          that.websock.send(strData);
        }, 500);
      }
    },
    initWebSocket() {
      let self = this;
      // ws地址
      // const wsuri = 'ws://assist.ztems.com:8080' + '/sig/ws';
      const wsuri = 'wss://assistwss.ztems.com' + '/sig/ws';
      // const wsuri = 'ws://127.0.0.1:8080' + '/sig/ws';
      this.websock = new WebSocket(wsuri);
      this.websock.onopen = function () {
        console.log('zwb websock.onopen');
        // if (peerConn === null) {
        self.initCreate();
        // }
        setTimeout(function () {
          var data = JSON.stringify({
            cmd: 'register',
            roomid: self.roomid,
            clientid: 'kefu1_001'
          });
          self.sendSafe(data);
          console.log('zwb register suc');
        }, 100);
      };
      this.websock.onmessage = function (e) {
        const redata = JSON.parse(e.data); // {}
        const error = redata.error;
        if (error) {
          window.trace('error:' + error);
          return;
        }
        const msg = JSON.parse(redata.msg);
        // console.log(redata.value)
        self.processMsg(msg);
      };
      this.websock.onclose = function (e) {
        console.log('zwb connection closed (' + e.code + ')');
        // self.handleLeave();
      };
      clearTimeout(wsTimeout);
      wsTimeout = setTimeout(this.initWebSocket, 45000);
    },
    processMsg(data) {
      switch (data.event) {
        case 'show':
          // this.users = data.allUsers
          break;
        case 'join':
          // this.handleLogin(data)
          break;
        case 'heart':
          console.log('zwb heart');
          clearTimeout(wsTimeout);
          wsTimeout = setTimeout(this.initWebSocket, 45000);
          break;
        case 'call':
          this.handleCall(data);
          break;
        case 'accept':
          this.handleAccept(data);
          break;
        case 'offer':
          this.handleOffer(data);
          break;
        case 'candidate':
          this.handleCandidate(data);
          break;
        case 'remove-candidates':
          this.handleRemoveCandidates(data);
          break;
        case 'msg':
          this.handleMsg(data);
          break;
        case 'answer':
          this.handleAnswer(data);
          break;
        case 'leave':
          this.websock.close();
          this.handleLeave();
          break;
        default:
          break;
      }
    },
    createDataChannel(label) {
      try {
        dataChannel = peerConn.createDataChannel(label);
      } catch (error) {
        // this.emit('data_channel_create_error', socketId, error);
      }
      this.addDataChannel(dataChannel);
    },
    addDataChannel(channel) {
      var that = this;
      channel.onopen = function () {
        // that.emit('data_channel_opened', channel, socketId);
      };
      channel.onclose = function (event) {
        console.log('dataChannel onclose!!!')
        window.trace('datachannel error:' + event);
        // delete that.dataChannels[socketId];
        // that.emit('data_channel_closed', channel, socketId);
        that.phoneData = [];
      };
      channel.onmessage = function (message) {
        console.log('datachannel onMessage:' + message.data)
        var json = JSON.parse(message.data);
        console.log('datachannel type:' + json.type)
        if (json.type === '__file') {
          /* that.receiveFileChunk(json); */
          // that.parseFilePacket(json, socketId);
        } else {
          // that.emit('data_channel_message', channel, socketId, json.data);
        }
        if (json === null) {
          return
        }
        if (json.type === 31) {
          that.phoneData = json;
        } else if (json.type === 32) {
          if (json.data != null && json.data.list != null && json.data.curPath != null) {
            that.fileList = json.data.list
            that.fileCurPath = json.data.curPath
            that.fileParentPath = (json.data.partntPath === undefined || json.data.partntPath === null) ? '/' : json.data.partntPath
            console.log('file list updated')
          }
        }

        // todo lx
        // that.phoneData = json;
      };
      channel.onerror = function (err) {
        // that.emit('data_channel_error', channel, socketId, err);
        window.trace('datachannel error:' + err);
        that.phoneData = [];
      };
    },
    dataChannelAvailable() {
      if (this.bFileSending) {
        this.$message({ showClose: true, type: 'info', message: '文件传送过程中暂时不可控制手机', duration: 2000 });
        return false;
      }

      if (this.dataChannel.readyState !== 'open') {
        console.log('dataChannel.readyState: ' + this.dataChannel.readyState);
        this.$message({ showClose: true, type: 'warning', message: '暂时不能控制手机，通道当前状态:' + this.dataChannel.readyState, duration: 2000 });
        return false;
      }
      return true;
    },
    sendKeyEvent(key) {
      if (!this.dataChannelAvailable()) {
        return;
      }

      var VoicePlusMessage = { type: 3, code: key };
      dataChannel.binaryType = 'arraybuffer';
      dataChannel.send(JSON.stringify(VoicePlusMessage));
    },
    ctlVUp() {
      this.sendKeyEvent(24);
      // var VoicePlusMessage = { type: 3, code: 24 };
      // dataChannel.binaryType = 'arraybuffer';
      // dataChannel.send(JSON.stringify(VoicePlusMessage));
    },
    ctlVDown() {
      this.sendKeyEvent(25);
      // var VoiceReduceMessage = { type: 3, code: 25 };
      // dataChannel.binaryType = 'arraybuffer';
      // dataChannel.send(JSON.stringify(VoiceReduceMessage));
    },
    ctlPower() {
      this.sendKeyEvent(26);
      // var PowerMessage = { type: 3, code: 26 };
      // dataChannel.binaryType = 'arraybuffer';
      // dataChannel.send(JSON.stringify(PowerMessage));
    },
    ctlHome() {
      this.sendKeyEvent(3);
      // var HOMEMessage = { type: 3, code: 3 };
      // dataChannel.binaryType = 'arraybuffer';
      // dataChannel.send(JSON.stringify(HOMEMessage));
    },
    ctlBack() {
      this.sendKeyEvent(4);
      // var backMessage = { type: 3, code: 4 };
      // dataChannel.binaryType = 'arraybuffer';
      // dataChannel.send(JSON.stringify(backMessage));
    },
    ctlMenu() {
      this.sendKeyEvent(28);
      // var menuMessage = { type: 3, code: 28 };
      // dataChannel.binaryType = 'arraybuffer';
      // dataChannel.send(JSON.stringify(menuMessage));
    },
    // Parse a candidate:foo string into an object, for easier use by other methods.
    parseCandidate(text) {
      var candidateStr = 'candidate:';
      var pos = text.indexOf(candidateStr) + candidateStr.length;
      var [
        foundation,
        component,
        protocol,
        priority,
        address,
        port,
        ,
        type
      ] = text.substr(pos).split(' ');
      return {
        component: component,
        type: type,
        foundation: foundation,
        protocol: protocol,
        address: address,
        port: port,
        priority: priority
      };
    },
    downFunction(event) {
      if (!this.dataChannelAvailable()) {
        return;
      }
      remote.dataChannel = dataChannel;
      remote.mouseDown(event);
    },
    moveFunction(event) {
      if (!this.dataChannelAvailable()) {
        return;
      }
      remote.mouseMove(event);
    },
    upFunction(event) {
      if (!this.dataChannelAvailable()) {
        return;
      }
      var sendMessage = remote.mouseUp(event);
      dataChannel.binaryType = 'arraybuffer';
      dataChannel.send(JSON.stringify(sendMessage));
    }
  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
/* h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
} */
/* li {
  display: inline-block;
  margin: 0 10px;
} */
a {
  color: #42b983;
}

.container {
  position: relative;
}

#controll {
  position: absolute;
  z-index: 1000;
  width: 50%;
  background-color: #fff;
  right: 0;
  top: 30px;
}

#showvideo-inner {
  position: absolute;
  z-index: 1000;
  /*width: 360px;*/
  background-color: #fff;
  top: 10px;
  border: 1px solid black;
  border-radius: 114px/55px;
  margin: 4px 4px 6px 4px;
  padding-left: 17px;
  padding-right: 17px;
}

#cellphone-top {
  padding-top: 11px;
  margin-bottom: 8px;
}

#circles {
  margin-left: 60%;
}

#cellphone-top-small-circle {
  width: 16px;
  height: 16px;
  border-radius: 10px;
  border: 1px solid black;
  display: inline-block;
  margin-bottom: 3px;
}

#cellphone-bottom {
  height: 54px;
  padding-top: 15px;
  text-align: center;
}

#cellphone-top-big-circle {
  width: 25px;
  height: 25px;
  border-radius: 15px;
  border: 1px solid black;
  display: inline-block;
  margin-left: 15%;
}

#cellphone-top-speaker {
  border: 1px solid black;
  margin: 0 auto;
  width: 96px;
  height: 10px;
  border-radius: 11px/10px;
}

#cellphone-bot-back-button {
  width: 20px;
  height: 20px;
  display: inline-block;
  cursor: pointer;
  border: 2px solid black;
  border-radius: 1em 0em 0em 1em;
}

#cellphone-bot-home-button {
  border: 2px solid black;
  width: 20px;
  height: 20px;
  border-radius: 1em 1em 1em 1em;
  display: inline-block;
  cursor: pointer;
  margin-left: 50px;
  margin-right: 50px;
}

#cellphone-bot-menu-button {
  margin: 0 auto;
  width: 20px;
  height: 20px;
  display: inline-block;
  border: 2px solid black;
  cursor: pointer;
}

#cellphone-power-button {
  display: inline-block;
  border: 0px solid red;
  position: absolute;
  left: 392px;
  margin: 320px 20px 20px -1px;
}

#power-button-div {
  float: right;
  border: 1px solid black;
  border-radius: 0em 5em 5em 0em;
  width: 8px;
  height: 62px;
  cursor: pointer;
}

#cellphone-voicePlus-button {
  display: inline-block;
  border: 0px solid red;
  position: absolute;
  left: 392px;
  margin: 180px 20px 20px -1px;
}

#cellphone-voicereduce-button {
  display: inline-block;
  border: 0px solid red;
  position: absolute;
  left: 392px;
  margin: 120px 20px 20px -1px;
}

#voice-buttonDown-div {
  float: right;
  border: 1px solid black;
  border-radius: 0em 5em 5em 0em;
  width: 8px;
  height: 36px;
  cursor: pointer;
}

#voice-buttonUp-div {
  float: right;
  border: 1px solid black;
  border-radius: 0em 5em 5em 0em;
  width: 8px;
  height: 36px;
  cursor: pointer;
}

#phonebutton {
  margin-top: 30px;
}

audio {
  display: inline-block;
  position: relative;
  top: 10px;
  width: calc(100% - 120px);
}

div#audio {
  margin: 0 0 29px 0;
}

div#audio > div {
  margin: 0 0 20px 0;
}

div.label {
  display: inline-block;
  font-weight: 400;
  width: 120px;
}

div.graph-container {
  float: left;
  margin: 0.5em;
  width: calc(50% - 1em);
}

a#viewSource {
  clear: both;
}

video {
  width: 337.5px;
  height: 600px;
  margin: 0 0 2px 0;
  vertical-align: top;
  cursor: pointer;
  /* width: calc(50% - 12px); */
}

video#localVideo {
  margin: 0 20px 20px 0;
}
</style>

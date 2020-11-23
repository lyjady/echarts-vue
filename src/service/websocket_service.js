export default class WebsocketServer {
  static instance = null

  static get Instance() {
    if (this.instance == null) {
      this.instance = new WebsocketServer();
    }
    return this.instance
  }

  ws = null

  callbackMapping = {}

  connected = false

  sendRetryCount = 0

  connectRetryCount = 0

  connect() {
    this.ws = new WebSocket('ws://localhost:9888')
    this.ws.onopen = () => {
      console.log('连接服务器成功')
      this.connected = true
      this.sendRetryCount = 0
    }
    this.ws.onclose = () => {
      console.log('与服务器断开连接')
      this.connected = false
      this.connectRetryCount++
      setTimeout(() => this.connect(), this.connectRetryCount * 500)
    }
    this.ws.onmessage = e => {
      const recvData = JSON.parse(e.data)
      const socketType = recvData.socketType
      if (this.callbackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          console.log(this.callbackMapping)
          this.callbackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {
          this.callbackMapping[socketType].call(this, recvData)
        } else if (action === 'themeChange') {
          this.callbackMapping[socketType].call(this, recvData)
        }
      }
    }
  }

  registerCallbackMapping(socketType, callback) {
    this.callbackMapping[socketType] = callback
  }

  unRegisterCallBack(socketType) {
    this.callbackMapping[socketType] = null
  }

  send(data) {
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++
      setTimeout(() => this.send(data), this.sendRetryCount * 500)
    }
  }
}

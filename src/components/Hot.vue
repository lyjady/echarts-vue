<template>
  <div class="com-container">
    <div class="com-charts" ref="hotRef"></div>
    <span class="iconfont arrow arrow-left" @click="prev">&#xe6ef;</span>
    <span class="iconfont arrow arrow-right" @click="next">&#xe6ed;</span>
  </div>
</template>

<script>
export default {
  name: 'Hot',
  data() {
    return {
      chartsInstance: null,
      data: null,
      currentIndex: 0,
      fontSize: 0
    }
  },
  created() {
    this.$socket.registerCallbackMapping('hotData', this.getData)
  },
  mounted() {
    this.$socket.send({
      action: 'getData',
      socketType: 'hotData',
      chartName: 'hotproduct',
      value: ''
    })
    this.initCharts()
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.unRegisterCallBack('mapData')
  },
  methods: {
    initCharts() {
      this.chartsInstance = this.$echarts.init(this.$refs.hotRef, 'chalk')
      const initOption = {
        title: {
          text: '▎ 热销商品的占比',
          left: 20,
          top: 20
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          formatter: args => {
            const thirdCategory = args.data.children
            let count = 0
            thirdCategory.forEach(item => count += item.value)
            let returnStr = ''
            thirdCategory.forEach(item => {
              returnStr += `
              ${item.name}:${parseInt(item.value / count * 100 + '') + '%'}
              <br/>
              `
            })
            return returnStr
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
      }
      this.chartsInstance.setOption(initOption)
      window.addEventListener('resize', () => this.screenAdapter())
      this.getData()
    },
    getData(res) {
      this.data = res
      this.updateData()
    },
    updateData() {
      if (this.data) {
        const legends = this.data[this.currentIndex].children.map(item => item.name)
        const showData = this.data[this.currentIndex].children.map(item => {
          return {
            name: item.name,
            value: item.value,
            children: item.children
          }
        })
        const dataOption = {
          legend: {
            data: legends
          },
          series: [
            {
              data: showData
            }
          ]
        }
        this.chartsInstance.setOption(dataOption)
      }

    },
    screenAdapter() {
      this.fontSize = this.$refs.hotRef.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          fontSize: this.fontSize
        },
        legend: {
          itemWidth: this.fontSize,
          itemHeight: this.fontSize,
          itemGap: this.fontSize / 2,
          textStyle: {
            fontSize: this.fontSize / 2
          }
        },
        series: [
          {
            radius: this.fontSize * 4.5,
            center: ['50%', '60%']
          }
        ]
      }
      this.chartsInstance.setOption(adapterOption)
      this.chartsInstance.resize()

    },
    prev() {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.data.length - 1
      }
      this.updateData()
    },
    next() {
      this.currentIndex++
      if (this.currentIndex > this.data.length - 1) {
        this.currentIndex = 0
      }
      this.updateData()
    }
  }
}
</script>

<style scoped>
.arrow {
  position: absolute;
  color: white;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.arrow-left {
  left: 10%;
}

.arrow-right {
  right: 10%;
}
</style>

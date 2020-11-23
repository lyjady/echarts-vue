<template>
  <div class="com-container">
    <div class="com-charts" ref="rankRef">

    </div>
  </div>
</template>

<script>
export default {
  name: 'Rank',
  data() {
    return {
      chartsInstance: null,
      data: null,
      timer: null,
      startValue: 0,
      endValue: 9
    }
  },
  created() {
    this.$socket.registerCallbackMapping('rankData', this.getData)
  },
  mounted() {
    this.initCharts()
    this.$socket.send({
      action: 'getData',
      socketType: 'rankData',
      chartName: 'rank',
      value: ''
    })
    this.startInternal()
    addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    this.unRegisterCallBack('rankData')
    removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timer)
  },
  methods: {
    initCharts() {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      this.chartsInstance = this.$echarts.init(this.$refs.rankRef, 'chalk')
      const initOption = {
        title: {
          text: '▎ 地区销售排行',
          top: 20,
          left: 20
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category'
        },
        tooltip: {
          show: true
        },
        dataZoom: {
          startValue: this.startValue,
          endValue: this.endValue,
          show: false
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              color: arg => {
                let barColor
                if (arg.value > 300) {
                  barColor = colorArr[0]
                } else if (arg.value > 200) {
                  barColor = colorArr[1]
                } else {
                  barColor = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: barColor[0]
                  },
                  {
                    offset: 1,
                    color: barColor[1]
                  }
                ])
              }
            }
          }
        ]
      }
      this.chartsInstance.setOption(initOption)

    },
    getData(res) {
      console.log(res)
      this.data = res
      this.updateData()
    },
    updateData() {
      this.data = this.data.sort((o1, o2) => o2.value - o1.value)
      const categories = this.data.map(item => item.name)
      const values = this.data.map(item => item.value)
      const dataOption = {
        xAxis: {
          data: categories
        },
        series: [
          {
            data: values,
          }
        ]
      }
      this.chartsInstance.setOption(dataOption)
    },
    screenAdapter() {
      const offsetWidth = this.$refs.rankRef.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: offsetWidth
          }
        },
        series: [
          {
            barWidth: offsetWidth,
            itemStyle: {
              barBorderRadius: [offsetWidth / 2, offsetWidth / 2, 0, 0]
            }
          }
        ]
      }
      this.chartsInstance.setOption(adapterOption)
      this.chartsInstance.resize()
    },
    startInternal() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue >= this.data.length) {
          this.startValue = 0
          this.endValue = 9
        }
        const dataZoomOption = {
          dataZoom: {
            startValue: this.startValue,
            endValue: this.endValue
          }
        }
        this.chartsInstance.setOption(dataZoomOption)
      }, 2000)
    }
  }
}
</script>

<style scoped>

</style>

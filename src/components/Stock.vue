<template>
  <div class="com-container">
    <div class="com-charts" ref="stockRef"></div>
  </div>
</template>

<script>
export default {
  name: 'Stock',
  data() {
    return {
      chartsInstance: null,
      data: null,
      startIndex: 0,
      timer: null
    }
  },
  created() {
    this.$socket.registerCallbackMapping('stockData', this.getData)
  },
  mounted() {
    this.initCharts()
    this.$socket.send({
      action: 'getData',
      socketType: 'stockData',
      chartName: 'stock',
      value: ''
    })
    this.screenAdapter()
    this.startInterval()
    addEventListener('resize', this.screenAdapter)
  },
  destroyed() {
    this.$socket.unRegisterCallBack('stockData')
    clearInterval(this.timer)
    removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    initCharts() {
      this.chartsInstance = this.$echarts.init(this.$refs.stockRef, 'chalk')
      const initOption = {
        title: {
          text: '▎库存和销量分析',
          left: 20,
          top: 20
        }
      }
      this.chartsInstance.setOption(initOption)
      this.chartsInstance.on('mouseover', () => clearInterval(this.timer))
      this.chartsInstance.on('mouseout', () => this.startInterval())
    },
    getData(res) {
      this.data = res
      this.updateData()
    },
    updateData() {
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const start = this.startIndex * 5
      const end = (this.startIndex + 1) * 5
      const seriesData = this.data.slice(start, end).map((item, index) => {
        return {
          type: 'pie',
          center: centerArr[index],
          hoverAnimation: false,
          labelLine: {
            show: false
          },
          label: {
            position: 'center',
            color: colorArr[index][0]
          },
          data: [
            {
              name: `${item.name}\n\n${item.sales}`,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              }
            },
            {
              value: item.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ]
        }
      })
      const updateOption = {
        series: seriesData
      }
      this.chartsInstance.setOption(updateOption)
    },
    screenAdapter() {
      const titleFontSize = this.$refs.stockRef.offsetWidth / 100 * 3.6
      const innerRadius = titleFontSize * 2.8
      const outterRadius = innerRadius * 1.125
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          }
        ]
      }
      this.chartsInstance.setOption(adapterOption)
      this.chartsInstance.resize()
    },
    startInterval() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.startIndex++
        if (this.startIndex > 1) {
          this.startIndex = 0
        }
        this.updateData()
      }, 3000)
    }
  }
}
</script>

<style scoped>

</style>

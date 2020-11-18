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
  mounted() {
    this.initCharts()
    addEventListener('resize', this.screenAdapter)
  },
  destroyed() {
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
      this.getData()
    },
    getData() {
      this.$http.get('stock').then(response => {
        if (response.status === 200) {
          this.data = response.data
          this.updateData()
          this.startInterval()
        }
      })
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
          radius: [110, 100],
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

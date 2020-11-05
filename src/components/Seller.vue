<template>
  <div class="com-container">
    <div class="com-charts" ref="sellerCharts">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Seller',
  data() {
    return {
      chartsInstance: null,
      sellerData: [],
      currentPage: 1,
      pageSize: 5,
      totalPage: 0,
      timer: null
    }
  },
  mounted() {
    this.initCharts()
    this.getData()
    window.addEventListener('resize', () => this.screenAdapter())
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    initCharts() {
      this.chartsInstance = this.$echarts.init(this.$refs.sellerCharts, 'chalk')
      const initOption = {
        title: {
          text: '▎商家销售统计',
          top: 20,
          left: 20
        },
        grid: {
          top: '20%',
          bottom: '3%',
          left: '3%',
          right: '6%',
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443',
            }
          }
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#5052EE'
                },
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      }
      this.chartsInstance.setOption(initOption)
      this.chartsInstance.on('mouseover', () => clearInterval(this.timer))
      this.chartsInstance.on('mouseout', () => this.startInternal())
    },
    async getData() {
      const res = await this.$http('seller')
      if (res.status === 200) {
        this.sellerData = res.data
        this.totalPage = this.sellerData.length % this.pageSize === 0 ? this.sellerData.length / this.pageSize : Math.ceil(this.sellerData.length / this.pageSize)
        this.sellerData.sort((a, b) => a.value - b.value)
        this.updateData()
        this.startInternal()
      }
    },
    updateData() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
      const spliceData = this.sellerData.slice(start, end)
      const categories = spliceData.map(item => item.name)
      const values = spliceData.map(item => item.value)
      const option = {
        yAxis: {
          data: categories
        },
        series: [
          {
            data: values,
          }
        ]
      }
      this.chartsInstance.setOption(option)
    },
    startInternal() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        if (this.currentPage > this.totalPage - 1) {
          this.currentPage = 1
          this.updateData()
          return
        }
        this.currentPage = this.currentPage + 1
        this.updateData()
      }, 3000)
    },
    screenAdapter() {
      const offsetWidth = this.$refs.sellerCharts.offsetWidth
      const titleSize = offsetWidth / 100 * 3.6
      console.log(titleSize)
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleSize
            }
          }
        },
        series: [
          {
            barWidth: titleSize,
            itemStyle: {
              barBorderRadius: [0, titleSize / 2, titleSize / 2, 0]
            }
          }
        ]
      }
      this.chartsInstance.setOption(adapterOption)
      this.chartsInstance.resize()
    }
  }
}
</script>

<style scoped>

</style>

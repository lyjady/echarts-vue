<template>
  <div class="com-container">
    <div class="com-charts" ref="trendCharts"></div>
  </div>
</template>

<script>
export default {
  name: 'Trend',
  data() {
    return {
      chartsInstance: null,
      data: null
    }
  },
  mounted() {
    this.initCharts()
    this.getData()
    window.addEventListener('resize', () => this.screenAdapter())
    this.screenAdapter()
  },
  methods: {
    initCharts() {
      this.chartsInstance = this.$echarts.init(this.$refs.trendCharts)
      const initOption = {
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartsInstance.setOption(initOption)
    },
    async getData() {
      const {data} = await this.$http.get('trend')
      this.data = data
      this.updateData()
    },
    updateData()  {
      const categories = this.data.common.month
      const values = this.data.map.data.map(item => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: 'map',
          smooth: true
        }
      })
      const legends = this.data.map.data.map(item => item.name)
      const dataOption = {
        xAxis: {
          data: categories
        },
        legend: {
          data: legends
        },
        series: values
      }
      this.chartsInstance.setOption(dataOption)
    },
    screenAdapter() {
      this.chartsInstance.resize()
    }
  }
}
</script>

<style scoped>

</style>

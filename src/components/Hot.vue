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
      currentIndex: 0
    }
  },
  mounted() {
    this.initCharts()
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
          top: '5%',
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
      this.getData()
    },
    getData() {
      this.$http.get('hotproduct').then(response => {
        if (response.status === 200) {
          this.data = response.data
          this.updateData()
        }
      })
    },
    updateData() {
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
    },
    screenAdapter() {},
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

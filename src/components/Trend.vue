<template>
  <div class="com-container">
    <div class="title" :style="titleSize">
      <span>{{ '▎ ' + showTitle }}</span>
      <span class="iconfont title-icon" :style="titleSize" @click="isShowSelect = !isShowSelect">&#xe6eb;</span>
      <div class="title-select" v-show="isShowSelect" :style="optionMargin">
        <div class="title-option" v-for="option in selectTypes" :key="option.key" @click="clickType(option.key)">
          {{ option.text }}
        </div>
      </div>
    </div>
    <div class="com-charts" ref="trendCharts"></div>
  </div>
</template>

<script>
export default {
  name: 'Trend',
  data() {
    return {
      chartsInstance: null,
      data: null,
      isShowSelect: false,
      currentTitle: 'map',
      fontSize: 0,
    }
  },
  mounted() {
    this.initCharts()
    this.getData()
    window.addEventListener('resize', () => this.screenAdapter())
    this.screenAdapter()
  },
  computed: {
    selectTypes() {
      if (!this.data) {
        return []
      } else {
        return this.data.type.filter(item => item.key !== this.currentTitle)
      }
    },
    showTitle() {
      if (!this.data) {
        return ''
      } else {
        return this.data[this.currentTitle].title
      }
    },
    titleSize() {
      return {
        fontSize: this.fontSize + 'px'
      }
    },
    optionMargin() {
      return {
        marginLeft: this.fontSize * 1.3 + 'px'
      }
    }
  },
  methods: {
    initCharts() {
      this.chartsInstance = this.$echarts.init(this.$refs.trendCharts, 'chalk')
      const initOption = {
        grid: {
          top: '35%',
          bottom: '1%',
          right: '4%',
          left: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
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
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      const categories = this.data.common.month
      const values = this.data[this.currentTitle].data.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: this.currentTitle,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              },
              {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      const legends = this.data[this.currentTitle].data.map(item => item.name)
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
      this.fontSize = this.$refs.trendCharts.offsetWidth / 100 * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.fontSize,
          itemHeight: this.fontSize,
          itemGap: this.fontSize,
          textStyle: {
            fontSize: this.fontSize / 2
          }
        }
      }
      this.chartsInstance.setOption(adapterOption)
      this.chartsInstance.resize()
    },
    clickType(key) {
      this.currentTitle = key
      this.updateData()
      this.isShowSelect = !this.isShowSelect
    }
  }
}
</script>

<style scoped lang="less">
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 1;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .title-select {
    margin-top: 5px;
    background-color: #222733;
    .title-option {
      margin: 2px 0;
      cursor: pointer;
    }
  }
}
</style>

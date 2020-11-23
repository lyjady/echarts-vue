<template>
  <div class="com-container">
    <div class="com-charts" ref="mapRef" @dblclick="revertMap"></div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import {getProvinceMapInfo} from '../utils/map_utils'
import axios from 'axios'

export default {
  name: 'Map',
  data() {
    return {
      chartInstance: null,
      data: null,
      provinceData: {}
    }
  },
  created() {
    this.$socket.registerCallbackMapping('mapData', this.getData)
  },
  mounted() {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: ''
    })
    window.addEventListener('resize', () => this.screenAdapter())
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('mapData')
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.mapRef, 'chalk')
      const {data: map} = await axios.get('http://localhost:8080/static/map/china.json')
      this.$echarts.registerMap('china', map)
      const initOption = {
        title: {
          text: '▎ 商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            border: '#333333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', arg => this.clickProvince(arg))
      await this.getData()
    },
    getData(res) {
      console.log(res)
      this.data = res
      this.updateChart()
    },
    updateChart() {
      if (this.data) {
        const legend = this.data.map(item => item.name)
        const series = this.data.map(item => {
          return {
            type: 'effectScatter',
            rippleEffect: {
              scale: 5,
              brushStyle: 'stroke'
            },
            name: item.name,
            data: item.children,
            coordinateSystem: 'geo'
          }
        })
        const dataOption = {
          legend: {
            data: legend
          },
          series
        }
        this.chartInstance.setOption(dataOption)
      }
    },
    screenAdapter() {
      const fontSize = this.$refs.mapRef.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize
          }
        },
        legend: {
          itemWidth: fontSize / 2,
          itemHeight: fontSize / 2,
          itemGap: fontSize / 2,
          textStyle: {
            fontSize: fontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize();
    },
    async clickProvince(arg) {
      const provinceInfo = getProvinceMapInfo(arg.name)
      if (!this.provinceData[provinceInfo.key]) {
        const response = await axios.get(`http://localhost:8080${provinceInfo.path}`)
        if (response.status === 200) {
          this.$echarts.registerMap(provinceInfo.key, response.data)
          this.provinceData[provinceInfo.key] = response.data
        }
      }
      const provinceOption = {
        geo: {
          map: provinceInfo.key
        }
      }
      this.chartInstance.setOption(provinceOption)
    },
    revertMap() {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    }
  }
}
</script>

<style scoped>

</style>

import { useRef,useEffect } from "react"
import { createChart, CrosshairMode } from "lightweight-charts";
import axios from "axios";
import dateFormat from 'dateformat'

export default function AreaSeries({title,url,seriesType}){
  const chartRef = useRef(null);

  const initChart = () => {
    const rect = document.querySelector('.info-chart').getBoundingClientRect()
    const chart = createChart(chartRef.current, { 
      // localization : {
      //   timeFormatter : businessDayOrTimestamp => {
      //     return dateFormat(businessDayOrTimestamp,'yyyy-mm-dd HH:MM')
      //   },
      // },
      timeScale: {
        rightOffset : 3,
        timeVisible : true,
        borderColor : '#fff',
        borderVisible :  false,
        tickMarkFormatter: (time, tickMarkType, locale) => {
          const format = 'yyyy-mm-dd'
          return dateFormat(time,format)
        },
      },
      width: 510,
      height: rect.height,
      priceScale: {
        borderColor: '#fff',
        mode: 1,
        borderVisible : false,
      },
      crosshair: {
        mode: CrosshairMode.Normal,    
        vertLine: {
          color: '#fff',
          labelBackgroundColor : '#569bda'
        },
        horzLine: {
          color: '#fff',
          labelBackgroundColor : '#569bda'
        },
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
      layout: {
        backgroundColor: '#212327',
        textColor: '#aaa',
        fontSize: 12
      },
    });
    // chart.subscribeCrosshairMove(handleCrosshairMoved);
    return chart;
  }

  const addAreaSeries = async(chart) => {
    const areaSeries = chart.addAreaSeries({
      topColor: 'rgba(0, 101, 159, 0.5)',
      bottomColor: 'rgba(0, 101, 159, 0)',
      lineColor: 'rgba(0, 101, 159, 1)'
    })
    
    const res = await axios.get(url)
    if(res.status === 200 && Array.isArray(res.data.data)){
      areaSeries.setData(res.data.data.map(d => ({time : d.timestamp * 1000,value : d.liquidity})))
    }
  }

  const addHistogramSeries = async (chart) => {
    const histogramSeries = chart.addHistogramSeries({
      color: '#00659f'
    })
    const res = await axios.get(url)
    if(res.status === 200 && Array.isArray(res.data.data)){
      histogramSeries.setData(res.data.data.map(d => ({time : d.timestamp * 1000,value : d.liquidity})))
    }
  }

  useEffect(() => {
    const chart = initChart();
    const series = []
    if(seriesType === 'area'){
      series.push(addAreaSeries(chart))
    }
    if(seriesType === 'histogram'){
      series.push(addHistogramSeries(chart))
    }
    return () => {
      series.forEach(s => s && chart.removeSeries(s));
      chart.remove();
    }
  }, [url,seriesType])

  return(
    <div className='info-chart'>
      <div title={title}></div>
      <div className='series' ref={chartRef}></div>
    </div>
  )
}

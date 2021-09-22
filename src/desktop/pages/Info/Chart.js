import { useRef,useEffect,useState } from "react"
import { createChart, CrosshairMode } from "lightweight-charts";
import axios from "axios";
import dateFormat from 'dateformat'
import { convertToInternationalCurrencySystem } from "../../../utils/utils";

export default function AreaSeries({title,url,seriesType}){
  const chartRef = useRef(null);
  const series = useRef(null)
  const [curValue, setCurValue] = useState(0)
  const [curDate, setCurDate] = useState('')

  const initChart = () => {
    const rect = document.querySelector('.info-chart').getBoundingClientRect()
    const chart = createChart(chartRef.current, { 
      localization : {
        priceFormatter: price => '$ ' + convertToInternationalCurrencySystem(price)
      },
      timeScale: {
        rightOffset : 0,
        leftOffset : 5,
        timeVisible : true,
        borderColor : '#fff',
        borderVisible :  false
      },
      width: rect.width,
      height: rect.height,
      priceScale: {
        position: 'none',
        borderColor: '#fff',
        borderVisible : false,
        scaleMargins: {
          top: 0.3,
          bottom: 0
        },
      },

      handleScroll: false,
      handleScale: false,
      crosshair: {
        mode: CrosshairMode.Normal,  
        vertLine: {
          color: '#fff',
          labelBackgroundColor : '#569bda',
          labelVisible : false,  
          visible : false
        },
        horzLine: {
          color: '#fff',
          labelBackgroundColor : '#569bda',
          labelVisible : false,  
          visible : false
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
        textColor: '#fff',
        fontSize: 12
      },
    });
    chart.subscribeCrosshairMove((param) => {
      if (!param.point) {
        return;
      }
      param.seriesPrices.forEach(item => {
        if(item){
          setCurValue(item)
        }
      })
      param.time && setCurDate(`${param.time.year}-${param.time.month}-${param.time.day}`)
    });
    return chart;
  }

  const addAreaSeries = async(chart) => {
    const areaSeries = chart.addAreaSeries({
      priceLineVisible : false,
      lastValueVisible: false,
      // crosshairMarkerVisible : false,
      topColor: 'RGBA(62,191,56,.5)',
      bottomColor: 'RGBA(62,191,56,0)',
      lineColor: 'RGB(62,191,56)'
    })
  
    
    const res = await axios.get(url)
    if(res.status === 200 && Array.isArray(res.data.data)){
      const data = res.data.data.map(d => ({time : dateFormat(new Date(d.timestamp * 1000),'yyyy-mm-dd'),value : d.value}))
      areaSeries.setData(data)
      const last = data[data.length -1]
      setCurValue(last.value)
      const time = `${last.time.year}-${last.time.month}-${last.time.day}`
      setCurDate(time)
    }
    series.current = areaSeries
    chart.timeScale().fitContent();
    return areaSeries;
  }

  const addHistogramSeries = async (chart) => {
    const histogramSeries = chart.addHistogramSeries({
      color: '#3EBF38',
      priceLineVisible : false,
      lastValueVisible: false,
      // lineWidth: 2,
      priceFormat: {
        type: "volume",
        priceFormatter: price => '$ ' + price
      },
      scaleMargins: {
        top: 0.2,
        bottom: 0
      }
    })
    const res = await axios.get(url)
    if(res.status === 200 && Array.isArray(res.data.data)){
      const data = res.data.data.sort((item1,item2) => {
        if(item1.timestamp > item2.timestamp) {
          return 1
        } else if(item1.timestamp < item2.timestamp){
          return -1
        } else {
          return 0
        }
      }).map(d => ({time : dateFormat(new Date(d.timestamp * 1000),'yyyy-mm-dd'),value : Number(d.value)}))
      
      histogramSeries.setData(data)
      const last = data[data.length -1]
      setCurValue(last.value)
      const time = `${last.time.year}-${last.time.month}-${last.time.day}`
      setCurDate(time)
    }
    series.current = histogramSeries
    chart.timeScale().fitContent();
    return histogramSeries;
  }

  useEffect(() => {
    const chart = initChart();
    if(seriesType === 'area'){
      addAreaSeries(chart)
    }
    if(seriesType === 'histogram'){
      addHistogramSeries(chart)
    }

    return () => {
      if(chart){
        chart.removeSeries(series.current);
        chart.remove();
      }
    }
  }, [url,seriesType])

  return(
    <div className='info-chart'>
      <div className='chart-title'>
        <div className='title-label'>{title}</div>
        <div className='title-value'>${convertToInternationalCurrencySystem(curValue)} </div>
        <div>{curDate}</div>
        </div>
      <div className='series' ref={chartRef}></div>
    </div>
  )
}

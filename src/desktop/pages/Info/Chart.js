import { useRef,useEffect,useState } from "react"
import { createChart, CrosshairMode } from "lightweight-charts";
import axios from "axios";
import dateFormat from 'dateformat'
import { convertToInternationalCurrencySystem } from "../../../utils/utils";

export default function AreaSeries({title,url,seriesType}){
  const chartRef = useRef(null);
  const series = useRef(null)
  const [curValue, setCurValue] = useState('')
  const [curDate, setCurDate] = useState('')
  const lastDataRef = useRef()

  const initChart = () => {
    const rect = document.querySelector('.info-chart').getBoundingClientRect()
    const chart = createChart(chartRef.current, { 
      localization : {
        priceFormatter: price => '$ ' + convertToInternationalCurrencySystem(price),
        locale: 'en-US'
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
        mode: 0,
        scaleMargins: {
          top: 0.3,
          bottom: 0.01
        },
      },

      handleScroll: false,
      handleScale: false,
      crosshair: {
        mode: CrosshairMode.Normal,  
        vertLine: {
          labelVisible : false,  
          visible : false
        },
        horzLine: {
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
    return chart;
  }

  const crosshairMove = param => {
      if (!param.point) {
        setCurDate('')
        if(lastDataRef.current){
          setCurValue(lastDataRef.current)
        }
        return;
      }
      param.seriesPrices.forEach(item => {
        if(item){
          setCurValue(item)
        }
      })
      param.time && setCurDate(`${param.time.year}-${param.time.month}-${param.time.day} (UTC)`)
  }

  const addAreaSeries = async(chart) => {
    const areaSeries = chart.addAreaSeries({
      priceLineVisible : false,
      lastValueVisible: false,
      topColor: 'RGBA(0,101,159,.5)',
      bottomColor: 'RGBA(0,101,159,0)',
      lineColor: 'RGB(0,101,159)',
      priceFormat: {        
        precision: 1,
        minMove : '1000',
      }
    })
  
    
    const res = await axios.get(url)
    if(res.status === 200 && Array.isArray(res.data.data)){
      let data = res.data.data.sort((item1,item2) => {
        if(item1.timestamp > item2.timestamp) {
          return 1
        } else if(item1.timestamp < item2.timestamp){
          return -1
        } else {
          return 0
        }
      })
      data = data.map(d => ({time : dateFormat(new Date(d.timestamp * 1000),'yyyy-mm-dd'),value : d.value}))
      areaSeries.setData(data)
      const last = data[data.length -1].value
      setCurValue(last)
      lastDataRef.current = last
    }
    series.current = areaSeries
    chart.timeScale().fitContent();
    return areaSeries;
  }

  const addHistogramSeries = async (chart) => {
    const histogramSeries = chart.addHistogramSeries({
      color: '#00659F',
      priceLineVisible : false,
      lastValueVisible: false,
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
      const last = res.data.last_24h ? res.data.last_24h : data[data.length -1].value
      setCurValue(last)
      lastDataRef.current = last
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
    chart.subscribeCrosshairMove(crosshairMove);
    return () => {
      if(chart){
        chart.unsubscribeCrosshairMove(crosshairMove)
        if(series.current){
          chart.removeSeries(series.current);
        }
        chart.remove();
      }
    }
  }, [url,seriesType])

  return(
    <div className='info-chart'>
      <div className='chart-title'>
        <div className='title-label'>{title}</div>
        <div className='title-value'>{curValue ? `$${convertToInternationalCurrencySystem(curValue)}` : ''} </div>
        <div className='title-date'>{curDate} </div>
        </div>
      <div className='series' ref={chartRef}></div>
    </div>
  )
}

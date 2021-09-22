import { useRef,useEffect,useState } from "react"
import { createChart, CrosshairMode } from "lightweight-charts";
import axios from "axios";
import dateFormat from 'dateformat'
import { reaction } from "mobx";
import { convertToInternationalCurrencySystem } from "../../../utils/utils";

export default function AreaSeries({title,url,seriesType}){
  const chartRef = useRef(null);
  const series = useRef(null)
  const [curValue, setCurValue] = useState(0)

  const initChart = () => {
    const rect = document.querySelector('.info-chart').getBoundingClientRect()
    const chart = createChart(chartRef.current, { 
      localization : {
        // timeFormatter : businessDayOrTimestamp => {
        //   return dateFormat(businessDayOrTimestamp,'dd')
        // },
        priceFormatter: price => '$ ' + convertToInternationalCurrencySystem(price)
      },
      timeScale: {
        rightOffset : 1,
        timeVisible : true,
        borderColor : '#fff',
        borderVisible :  false,
        fixLeftEdge : true,
        tickMarkFormatter: (time, tickMarkType, locale) => {
          const format = 'dd'
          return dateFormat(time,format)
        },
      },
      width: rect.width,
      height: rect.height,
      priceScale: {
        position: 'none',
        borderColor: '#fff',
        mode: 1,
        borderVisible : false,
        scaleMargins: {
          top: 0.60,
          bottom: 0,
        },
      },

      // handleScroll: true,
      // handleScale: false,
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
    // chart.subscribeCrosshairMove(handleCrosshairMoved);
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
      const data = res.data.data.map(d => ({time : d.timestamp * 1000,value : d.value}))
      areaSeries.setData(data)
      setCurValue(data[data.length -1].value)
    }
    series.current = areaSeries
    chart.timeScale().fitContent();
    return areaSeries;
  }

  const addHistogramSeries = async (chart) => {
    const histogramSeries = chart.addHistogramSeries({
      priceLineVisible : false,
      lastValueVisible: false,
      color: '#3EBF38',
      base : 0
    })
    const res = await axios.get(url)
    if(res.status === 200 && Array.isArray(res.data.data)){
      const data = res.data.data.map(d => ({time : d.timestamp * 1000,value : d.value}))
      histogramSeries.setData(data)
      setCurValue(data[data.length -1].value)
    }
    series.current = histogramSeries
    histogramSeries.applyOptions({
      priceFormat: {
          type: 'volume',
          // precision: 2,
          minMove: 1,
      },
    });
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
        <div className='title-value'>${convertToInternationalCurrencySystem(curValue)}</div>
        </div>
      <div className='series' ref={chartRef}></div>
    </div>
  )
}

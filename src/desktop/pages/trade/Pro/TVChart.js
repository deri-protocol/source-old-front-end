import React, { useState, useEffect } from 'react'

import { DataFeed } from "tradingview-api"
import { getFormatSymbol, intervalRange, calcRange } from '../../../../utils/utils';
import axios from 'axios';

const supported_resolutions = ["1","5","15","30","60","240","1D","5D","1W","1M"];

export default class TVChart extends React.Component{
  queryParams = {}
  lastQueryParams = {}
  datafeed = new DataFeed({
    getBars: params => this.getBars(params),
    fetchResolveSymbol: () => this.resolveSymbol(),
    fetchConfiguration: () => {
      return new Promise((resolve) => {
        resolve({
          supported_resolutions: supported_resolutions,
        });
      });
    },
  })

  async getBars({symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest}){
    this.queryParams = {symbol : getFormatSymbol(symbolInfo.name),interval : intervalRange[resolution]}
    const url = `${process.env.REACT_APP_HTTP_URL}/get_kline?symbol=${this.queryParams.symbol}&time_type=${this.queryParams.interval}&from=${from}&to=${to}`
    const res = await axios.get(url);
    let noData = false
    if(res && res.data && res.data.data){
      noData = !res.data.data instanceof Array || res.data.data.length === 0
    }
    return {
      bars : res.data.data,
      meta : {noData}
    }
  }

  resolveSymbol(){
    return new Promise((resolve) => {
      const {symbol} = this.props
      resolve({
        name: symbol,
        pricescale: 100,
        ticker: symbol,
        minmov: 1,
        type: "crypto",
        has_intraday: true,
        intraday_multipliers: ["1","2","5","15","30","60","240","1D","7D","1W","1M"],
        has_weekly_and_monthly: true,
        has_no_volume: true,
        pro_name: symbol,
        has_daily: true,
        timezone : 'UTC',
        session: "24x7",
        exchange: "Deri",
        supported_resolutions : supported_resolutions
      })
    })
  }

  render(){
    return (
      <div id='tv-container'></div>
    )
  }
}
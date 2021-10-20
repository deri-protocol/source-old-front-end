/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import DeriNumberFormat from '../../utils/DeriNumberFormat'
import useConfig from '../../hooks/useConfig';
import pancake from './img/pancake.svg'
import sushi from './img/sushi.svg'
import gate from './img/gate.png'
import mexc from './img/mexc.png'
function Token({ wallet = {}, lang,loading }) {
    const [deriTokenAddress, setDeriTokenAddress] = useState()
    const [deriInfo, setDeriInfo] = useState()
    const config = useConfig();
    const addToken = async () => {
        if (deriTokenAddress) {
            const tokenSymbol = 'DERI';
            const tokenDecimals = 18;
            try {
                const wasAdded = await window.ethereum.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20', // Initially only supports ERC20, but eventually more!
                        options: {
                            address: deriTokenAddress, // The address that the token is at.
                            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                            decimals: tokenDecimals, // The number of decimals in the token
                        },
                    },
                });

                if (wasAdded) {
                    console.log('Thanks for your interest!');
                } else {
                    console.log('Your loss!');
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    const getDeriInfo = async () => {
        let path = 'https://infoapi.deri.finance/stats_for_token'
        let resp = await fetch(path);
        let res = await resp.json();
        if (res) {
            let obj = {}
            obj.price = res.data.price
            obj.market_cap = res.data.market_cap
            obj.circulating_supply = parseInt(res.data.circulating_supply)
            obj.total_supply = parseInt(res.data.total_supply)
            setDeriInfo(obj)
        }

    }
    const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account
    
    const sushiBuy = async ()=> {
        if(hasConnectWallet()){
            await wallet.switchNetwork(config[1])
            window.open("https://app.sushi.com/swap?inputCurrency=&outputCurrency=0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9")
        }else{
            window.open("https://app.sushi.com/swap?inputCurrency=&outputCurrency=0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9")
        }
    }

    const pancakeBuy = async ()=> {
        if(hasConnectWallet()){
            await wallet.switchNetwork(config[56])
            window.open("https://exchange.pancakeswap.finance/#/swap?inputCurrency=0xe60eaf5a997dfae83739e035b005a33afdcc6df5")
        }else{
            window.open("https://exchange.pancakeswap.finance/#/swap?inputCurrency=0xe60eaf5a997dfae83739e035b005a33afdcc6df5")
        }
    }

    useEffect(()=>{
        loading.loading()
        if(deriInfo){
            loading.loaded() 
        }
    },[deriInfo])

    useEffect(() => {
        if (hasConnectWallet()) {
            let address;
            if (+wallet.detail.chainId === 56) {
                address = '0xe60eaf5A997DFAe83739e035b005A33AfdCc6df5'
            } else if (+wallet.detail.chainId === 1) {
                address = '0xa487bf43cf3b10dffc97a9a744cbb7036965d3b9'
            } else if (+wallet.detail.chainId === 128) {
                address = '0x2bdA3e331Cf735D9420e41567ab843441980C4B8'
            } else if (+wallet.detail.chainId === 137) {
                address = '0x3d1d2afd191b165d140e3e8329e634665ffb0e5e'
            }
            setDeriTokenAddress(address)
        }

    }, [wallet.detail])
    useEffect(() => {
        let interval = null;
        //计数器
        interval = window.setInterval(() => {
            getDeriInfo()
        }, 1000);
        return () => {
            interval && clearInterval(interval);
        };
    }, [])
    return (
        <div className='token-info'>
            <div className='title'>
                {lang['the-deri-token']}
            </div>
            <div className='add-to-matemask'>
                <button onClick={addToken}>
                    {lang['add-deri-to-matemask']}
                </button>
            </div>
            <div className='buy-deri'>
                <a target='_blank' onClick={pancakeBuy}>
                    <div className='pancake-buy'>
                        <div>
                            <img src={pancake} />
                        </div>
                        <span>
                            {lang['buy-deri']}
                        </span>
                    </div>
                </a>
                <a target='_blank' onClick={sushiBuy}>
                    <div className='sushi-buy'>
                        <div>
                            <img src={sushi} />
                        </div>
                        <span>
                            {lang['buy-deri']}
                        </span>
                    </div>
                </a>

                
            </div>
            <div className='buy-deri'>
            <a target='_blank' href='https://www.gate.io/tradepro/DERI_USDT'>
                    <div className='pancake-buy'>
                        <div>
                            <img src={gate} />
                        </div>
                        <span>
                            {lang['buy-deri']}
                        </span>
                    </div>
                </a>
                <a target='_blank' href='https://www.mexc.com/zh-CN/exchange/DERI_USDT'>
                    <div className='sushi-buy'>
                        <div>
                            <img src={mexc} />
                        </div>
                        <span>
                            {lang['buy-deri']}
                        </span>
                    </div>
                </a>
            </div>
            <div className='deri-info'>
                <div className='bottom-square'></div>
                <div className='line-of-box'>
                    <div className='box'>
                        <div className='num'>
                            $ {deriInfo ? <DeriNumberFormat value={deriInfo.price} displayType='text' thousandSeparator={true} decimalScale='4' /> : '--'}
                        </div>
                        <div className='text'>
                            {lang['price']}
                        </div>
                    </div>
                    <div className='box'>
                        <div className='num'>
                            $ {deriInfo ? <DeriNumberFormat value={deriInfo.market_cap} displayType='text' thousandSeparator={true} decimalScale='0' /> : '--'}
                        </div>
                        <div className='text'>
                            {lang['market-cap']}
                        </div>
                    </div>
                </div>
                <div className='line-of-box'>
                    <div className='box'>
                        <div className='num'>
                            {deriInfo ? <DeriNumberFormat value={deriInfo.circulating_supply} displayType='text' thousandSeparator={true} decimalScale='0' /> : '--'}
                        </div>
                        <div className='text'>
                            {lang['circulating-supply']}
                        </div>
                    </div>
                    <div className='box'>
                        <div className='num'>
                            {deriInfo ? <DeriNumberFormat value={deriInfo.total_supply} displayType='text' thousandSeparator={true} decimalScale='0' /> : '--'}
                        </div>
                        <div className='text'>
                            {lang['total-supply']}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default inject('wallet','loading')(observer(Token))
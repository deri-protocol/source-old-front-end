/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import config from '../../config.json'
import { DeriEnv, getUserInfoAllForAirDrop, connectWallet, mintAirdrop, isUnlocked, unlock } from '../../lib/web3js/indexV2';
import DeriNumberFormat from '../../utils/DeriNumberFormat';
import { inject, observer } from 'mobx-react';
import Button from '../Button/Button.js';
import { eqInNumber, addParam } from '../../utils/utils.js';
import classNames from 'classnames';
import TipWrapper from '../TipWrapper/TipWrapper.js';
import { version } from '@babel/core';
import zusd from '../../assets/img/zUSD.png'
import errorimg from '../../assets/img/ErrorImg.png'
const chainConfig = config[DeriEnv.get()]['chainInfo'];

function PoolBox({ wallet, group = {}, lang }) {
  const { pool, list } = group

  const poolClass = classNames('pool', {
    'only-one': list.length === 1,
    'full': list.length === 5
  })

 

  return (
    <div className={poolClass} >
      <div className='pool-header' >
        <div className='left'>
          <div className="network">
            {pool.network && pool.network.toUpperCase()}
          </div>
          <div className='pool-desc'>
            <span className='symbol'>
              <span className='symbol-label'>{lang['symbol']}:</span>
              <span className='symbol-value'>{pool.symbol}</span>
            </span>
            <span className='address'>
              <span className='address-label'>{lang['address']}:</span>
              {!pool.airdrop ? <a target='_blank' rel='noreferrer' href={`${chainConfig[pool.chainId] && chainConfig[pool.chainId]['viewUrl']}/address/${pool.address}`}>
                {pool.formatAdd}
              </a> : '--'}
            </span>
          </div>
        </div>
        <div className='version'>{lang[pool.version]}</div>
      </div>
      <div className="pool-info">
        {list.map((card, index) => <Card card={card} key={index} index={index} pool={pool} list={list} wallet={wallet} lang={lang} />)}
      </div>
    </div>
  )
}

function Card({ wallet, pool, card, index, list, lang }) {
  const [buttonElement, setButtonElement] = useState('');
  const [connected, setConnected] = useState(false)
  const history = useHistory();
  const gotoMining = url => {
    history.push(url)
  }
  const connectWallet = () => {
    wallet.connect().then(() => {
      setConnected(true)
    })
  }
  const claimAirdrop = async () => {
    let info = await getUserInfoAllForAirDrop(wallet.detail.account)
    if (!info.valid) {
      alert(lang['no-deri-to-claim']);
      return;
    }
    if (!eqInNumber(wallet.detail.chainId, info.chainId)) {
      alert(lang['please-switch-to-BSC-to-claim-deri'])
      return;
    }
    let res = await mintAirdrop(info.chainId, wallet.detail.account)
    if (!res.success) {
      alert(lang['claim-failed'])
    }
  }

  const ErrorImg = (event) => {
    event.target.src = errorimg
  }

  useEffect(() => {
    if (pool && pool.airdrop) {
      if (!wallet.isConnected()) {
        setButtonElement(<Button btnText={lang['connect-wallet']} click={connectWallet} lang={lang}></Button>)
      } else {
        setButtonElement(<Button btnText={lang['claim']} click={claimAirdrop} lang={lang}></Button>)
      }
    } else {
      let url = `/mining/${pool.version || 'v1'}/${pool.chainId}/${card.type}/${card.symbol}/${card.bTokenSymbol}/${pool.address}`
      if (card.bTokenId) {
        url = `${url}?baseTokenId=${card.bTokenId}`
      }
      if (card.symbolId) {
        if (url.indexOf('?') > 0) {
          url = `${url}&symbolId=${card.symbolId}`
        } else {
          url = `${url}?symbolId=${card.symbolId}`
        }
      }
      setButtonElement(
        <button onClick={() => gotoMining(url)}>
          {lang['staking']}
        </button>
      )
    }
    return () => { };
  }, [wallet.detail.account, connected]);
  return (
    <>
      <div className="info">
        <div className="top-info">
          <div className='pool-top'>
            {pool.version !== 'v2_lite_open' && <>
              <span className={`logo ${card.bTokenSymbol}`} >
              </span>
            </>}
            {pool.version === 'v2_lite_open' && <>
            <span className='bg-logo' >
              <img onError={ErrorImg} src={`https://raw.githubusercontent.com/deri-finance/deri-open-zone/main/img/${card.bTokenSymbol}.png`} />
            </span>
            </>}

            <span className="base-token">{card.bTokenSymbol}</span>
          </div>
          <div className="pool-detail">
            <div className='liq'>
              <span className='title'>{card.airdrop ? lang['total'] : lang['pool-liq']}</span>
              <DeriNumberFormat value={card.liquidity} displayType='text' thousandSeparator={true} decimalScale={card.lpApy ? 7 : 0} />
            </div>
            <div className='multiplier'>
              {card.multiplier && <>
                <span>{lang['multiplier']}</span>
                <TipWrapper block={false}>
                  <span className='multiplier-value' tip={lang['multiplier-tip']}>{card.multiplier}x</span>
                </TipWrapper>
              </>}
            </div>
            <div className="apy">
              {!card.isOpen && <>
                <span>{lang['apy']}</span>
                <TipWrapper block={false}>
                  <span className={card.lpApy ? 'sushi-apy-underline' : ''} tip={card.lpApy && lang['deri-apy']}>
                    {card.apy ? <DeriNumberFormat value={card.apy} suffix='%' displayType='text' allowZero={true} decimalScale={2} /> : '--'}
                  </span>
                  {card.lpApy && card.lpApy > 0 && <>
                    <span> + </span>
                    <span className={card.lpApy ? 'sushi-apy-underline' : ''} tip={card.lpApy && card.label}> <DeriNumberFormat value={card.lpApy} displayType='text' suffix='%' decimalScale={2} /></span>
                  </>}
                </TipWrapper>
              </>}
            </div>
          </div>
        </div>
        <div className="bottom-btn">
          {buttonElement}
        </div>
      </div>
      {index !== list.length - 1 && <div className='top-line'></div>}
    </>)
}
export default inject('wallet', 'version')(observer(PoolBox))
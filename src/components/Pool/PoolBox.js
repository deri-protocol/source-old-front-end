/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import config from '../../config.json'
import { DeriEnv, getUserInfoAllForAirDrop, connectWallet, mintAirdrop, isUnlocked, unlock, getPoolLiquidity, getPoolInfoApy, getLpPoolInfoApy } from '../../lib/web3js/indexV2';
import DeriNumberFormat from '../../utils/DeriNumberFormat';
import { inject, observer } from 'mobx-react';
import Button from '../Button/Button.js';
import { eqInNumber, addParam,isSushiLP,isCakeLP } from '../../utils/utils.js';
import classNames from 'classnames';
import TipWrapper from '../TipWrapper/TipWrapper.js';
import { version } from '@babel/core';
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
  const [detail, setDetail] = useState({})
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

  const onImgError = (event) => {
    event.target.src = errorimg
  }

  const loadCardInfo = async (config) => {
    const apyInfo = await getPoolInfoApy(config.chainId, config.pool, config.bTokenId)
    const liq = await getPoolLiquidity(config.chainId, config.pool, config.bTokenId)
    const detail = {
      liquidity: liq.liquidity,
      apy: ((+apyInfo.apy) * 100).toFixed(2),
      multiplier: apyInfo.multiplier,
    }
    if (config.isLp) {
      const lapy = await getLpPoolInfoApy(config.chainId, config.pool);
      const lpApy = ((+lapy.apy2) * 100).toFixed(2);
      detail['lpApy'] = lpApy
      detail['isCakeLP'] = isCakeLP(pool.address)
      detail['isSushiLP'] = isSushiLP(pool.address)
    }
    setDetail(detail)
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
    if (pool && pool.airdrop) {
      setDetail({
        liquidity: card.liquidity,
        airdrop: pool.airdrop,
        
      })
    } else {
      loadCardInfo(card)
    }
  }, [wallet.detail.account, connected, card]);
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
                <img onError={onImgError} src={`https://raw.githubusercontent.com/deri-finance/deri-open-zone/main/img/${card.bTokenSymbol}.png`} />
              </span>
            </>}

            {isCakeLP(pool.address) &&
              <TipWrapper>
                <span tip={lang['cake-lp-hover']} className="base-token lp-token">
                  {card.bTokenSymbol}
                </span>
              </TipWrapper>
            }
            {isSushiLP(pool.address) &&
              <TipWrapper>
                <span tip={lang['sushi-lp-hover']} className="base-token lp-token">
                  {card.bTokenSymbol}
                </span>
              </TipWrapper>
            }
            {!card.isLp && <span className="base-token">{card.bTokenSymbol}</span>}
          </div>
          <div className="pool-detail">
            <div className='liq'>
              <span className='title'>{card.airdrop ? lang['total'] : lang['pool-liq']}</span>
              <DeriNumberFormat value={detail.liquidity} displayType='text' thousandSeparator={true} decimalScale={detail.lpApy ? 7 : 0} />
            </div>
            <div className='multiplier'>
              {detail.multiplier && <>
                <span>{lang['multiplier']}</span>
                <TipWrapper block={false}>
                  <span className='multiplier-value' tip={lang['multiplier-tip']}>{detail.multiplier}x</span>
                </TipWrapper>
              </>}
            </div>
            <div className={`apy ${detail.lpApy && 'lp-apy'}`}>
              {!card.isOpen && !card.airdrop && <>
                <span>{lang['apy']}</span>
                <TipWrapper block={false} title={detail.lpApy}>
                  <span className={detail.lpApy ? 'sushi-apy-underline' : ''} tip={detail.lpApy ? lang['deri-apy'] : ''}>
                    <DeriNumberFormat value={detail.apy} suffix='%' displayType='text' allowZero={true} decimalScale={2} />
                  </span>
                </TipWrapper>
                {detail.lpApy && detail.lpApy > 0 && <>
                  <span>+</span>
                  <TipWrapper block={false}>
                    <span className={detail.lpApy ? 'sushi-apy-underline' : ''} tip={card.label}><DeriNumberFormat value={detail.lpApy} displayType='text' suffix='%' decimalScale={2} /></span>
                  </TipWrapper>
                </>}
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
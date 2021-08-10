
import config from  '../../../config.json'
import DeriNumberFormat from '../../../utils/DeriNumberFormat';
import { DeriEnv } from '../../../lib/web3js/indexV2.js';
const chainConfig = config[DeriEnv.get()]['chainInfo'];

function ListBox({group,lang,index}){
  const {pool,list} = group

  return (
    <div className='pool-list' key={index}>
      <div className='pool-list-header'>
        <div className='list-header-left'>
          <div className='l-h-network'>
            {pool.network && pool.network.toUpperCase()}
          </div>
          <div className='l-h-y-ad'>
            <span className='symbol'>
              <span className='symbol-label'>{lang['symbol']} : </span>
              <span className='symbol-value'>{pool.symbol}</span>  
            </span>
            <span className='add'>
              <span className='add-label'>{lang['address']} : </span>
                  {!pool.airdrop ? <a target='_blank' rel='noreferrer' href={`${chainConfig[pool.chainId] && chainConfig[pool.chainId]['viewUrl']}/address/${pool.address}`}> 
                    {pool.formatAdd}
                  </a> : '--'}
            </span>
          </div>
        </div>
        <div className='list-header-right'>
          {lang[pool.version]}
        </div>
      </div>
      <div className='pool-list-body'>
        {list.map((item,index) => (
          <div className='list-item' key={index}>
            <span className='col btoken'>
              <span className={`logo ${item.bTokenSymbol}`}></span>
              <span className='base-token'>{item.bTokenSymbol}</span>
            </span>
            <span className='col'>
              <div className='col-label'>{item.airdrop ? lang['total'] : lang['pool-liq']}</div>
              <div className='col-value'><DeriNumberFormat value={item.liquidity} displayType='text' thousandSeparator={true} decimalScale={item.lpApy ? 7 : 0}/></div>
            </span>
            <span className='col'>
              <div className='col-label'>{lang['multiplier']}</div>
              <div className='col-value' title={lang['multiplier-tip']}>{item.multiplier}x</div>
            </span>
            <span className='col'>
              <div className='col-label'>{lang['apy']}</div>
              <div className='col-value'>
              <span>
                <span className={item.lpApy ? 'sushi-apy-underline' : ''} title={ item.lpApy && lang['deri-apy']}>
                  {item.apy ? <DeriNumberFormat value={item.apy} suffix='%' displayType='text' allowZero={true} decimalScale={2}/> : '--'}                 
                </span>
                {item.lpApy &&<>
                <span> + </span>
                <span className={item.lpApy ? 'sushi-apy-underline' : '' } title={ item.lpApy && item.label}> <DeriNumberFormat value={item.lpApy} displayType='text' suffix='%' decimalScale={2}/></span>
                </>}
              </span>
              </div>
            </span>
            <span className='col'>
              <div className='col-label'>{lang['claimed-deri']}</div>
              <div className='col-value'><DeriNumberFormat value={item.claimedDeri} decimalScale={2}/></div>
            </span>
            <span className='col'>
              <div className='col-label'>{lang['unclaimed-deri']}</div>
              <div className='col-value'><DeriNumberFormat value={item.unclaimedDeri} decimalScale={2}/></div>
            </span>
            <span className='col'>
              <div className='col-label'>{lang['mining-pnl']}</div>
              <div className='col-value'><DeriNumberFormat value={item.miningPnl} decimalScale={2}/></div>
            </span>
            <span className='col'>
              <div className='staking'>{lang['staking']} ></div>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
export default function List({optionPools,v1Pools,v2Pools,type,lang}){
  return (
    <div> 
      {v2Pools.map((pool,index) => <ListBox group={pool} lang={lang} index={index}/>)}
      {optionPools.map((pool,index) => <ListBox group={pool} lang={lang} index={index}/>)}
      {v1Pools.map((pool,index) => <ListBox group={pool} lang={lang} index={index}/>)}
    </div>

  )
}
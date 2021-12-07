import React from 'react';
import { withRouter, Switch,Route,Redirect} from 'react-router-dom'
import LoadableComponent from '../../../utils/LoadableComponent'
import './body.css'
import withLanguage from '../../../components/hoc/withLanguage';
import IndexRoute from '../../../components/IndexRoute/IndexRoute';



const Lite = LoadableComponent(()=>import('../../pages/trade/Lite/Lite')) 
const Pro = LoadableComponent(()=>import('../../pages/trade/Pro/Pro'))
const AddPool = LoadableComponent(()=>import('../../pages/Permission/AddPool'))
const AddSymbol = LoadableComponent(()=>import('../../pages/Permission/AddSymbol'))
const Pool = LoadableComponent(() => import('../Mining/Pool'))
const Download = LoadableComponent(() => import('../../pages/Download/Download'))
const LegacyPool = LoadableComponent(() => import('../Mining/legacy/LegacyPool'))
const Mining = LoadableComponent(() => import('../../pages/Mining/Mining'))
const Home = LoadableComponent(() => import('../../pages/Home/Home'))
const Token = LoadableComponent(() => import('../../pages/Token/Token'))
const Team = LoadableComponent(() => import('../../pages/Team/Team'))
const Bridge = LoadableComponent(() => import('../../pages/Bridge/Bridge'))
const Signin = LoadableComponent(() => import('../../pages/Signin/Signin'))
const Nuls = LoadableComponent(() => import('../../pages/Nuls/Nuls'))
const Faucet = LoadableComponent(() => import('../../pages/Faucet/Faucet'))
const Broker = LoadableComponent(() => import('../../pages/Broker/Broker'))
const BrokerBind = LoadableComponent(() => import('../../pages/Broker/BrokerBind'))
const Governance = LoadableComponent(() => import('../../pages/Governance/Governance'))
const DipHistory = LoadableComponent(() => import('../../pages/Governance/DipHistory'))
const DipTwo = LoadableComponent(() => import('../../pages/Governance/DipTwo'))
const DipHistoryTwo = LoadableComponent(() => import('../../pages/Governance/DipHistoryTwo'))

const InfoList = LoadableComponent(() => import('../../pages/Info/List'))
const InfoDetail = LoadableComponent(() => import('../../pages/Info/Detail'))

const TradingMining = LoadableComponent(() => import('../../pages/Promotional/Promotional'))
const TradingMiningFinshedOne = LoadableComponent(() => import('../../pages/Marketing/TradingMining/Index'))

@withRouter
@withLanguage
class Body extends React.Component {

  render(){
    const {dict} = this.props  
    return (
      <div className='body'>
        <Switch >
          <Route exact path='/team' component={() => <Team lang={dict['team']} />}></Route>
          <Route exact path='/logo' component={() => <Download lang={dict['home']} />}></Route>
          <Route exact path='/deritoken' component={() => <Token lang={dict['home']} />}></Route>
          <Route exact path='/bridge' component={() => <Bridge lang={dict['bridge']} />}></Route>
          {/* <Route exact path='/broker' component={() => <Broker lang={dict['broker']} />}></Route> */}
          <Route exact path='/signin' component={() => <Signin lang={dict['signin']} />}></Route>
          <Route exact path='/nuls' component={() => <Nuls lang={dict['nuls']} />}></Route>
          <Route exact path='/faucet' component={() => <Faucet lang={dict['faucet']} />}></Route>
          {/* <Route exact path='/brokerbind' component={() => <BrokerBind lang={dict['broker']} />}></Route> */}
          <Route exact path='/index' component={() => <Home lang={dict['home']}/>}></Route>
          <Route exact path='/governance' component={() => <Governance lang={Object.assign(dict['governance'],dict['dip-two'])}/>}></Route>
          <Route exact path='/diphistorytwo' component={() => <DipHistoryTwo lang={dict['dip-history-two']}/>}></Route>
          <Route exact path='/diphistory' component={() => <DipHistory lang={dict['dip-history'] }/>}></Route>
          <Route exact path='/diptwo' component={() => <DipTwo lang={dict['dip-two']}/>}></Route>
          <Route exact path='/' render={() => <IndexRoute/>}/>
          <Route exact path='/mining' component={() => <Pool lang={dict['mining']}/>}/>
          <Route exact path='/retired' component={() => <LegacyPool lang={dict['mining']}/>}/>
          <Route exact path='/mining/:version/:chainId/:type/:symbol/:baseToken/:address' component={() => <Mining lang={dict['mining']}/>}/>
          <Route exact path='/addsymbol/:version/:chainId/:type/:symbol/:baseToken/:address' component={() => <AddSymbol lang={dict['permission']}/>}/>
          <Route exact path='/futures/lite' component={() => <Lite lang={dict['lite']}/>}/>
          <Route exact path='/futures/lite/v1' component={() => <Lite lang={dict['lite']}/>}/>
          <Route exact path='/futures/pro' component={() => <Pro lang={Object.assign(dict['lite'],dict['pro'])}/>}/>
          <Route exact path='/futures/pro/v1' component={() => <Pro lang={Object.assign(dict['lite'],dict['pro'])}/>}/>
          <Route exact path='/options/lite' component={() => <Lite lang={dict['lite']}/>}/>
          <Route exact path='/addpool' component={() => <AddPool lang={dict['permission']}/>}/>
          <Route exact path='/options/pro' component={() => <Pro lang={Object.assign(dict['lite'],dict['pro'])}/>}/>
          <Route path='/lite' component={() => <Pro lang={Object.assign(dict['lite'],dict['pro'])}/>} />
          <Route exact path='/info' component={() => <InfoList/>}/>
          <Route exact path='/info/:add/:catalog/:bToken/:network' component={() => <InfoDetail/>}/>
          <Route exact path='/trade-to-earn/finished' component={() => <TradingMining lang={dict['trading-mining']}/>}/>
          <Route exact path='/trade-to-earn/active' component={() => <TradingMining lang={dict['trading-mining']}/>}/>
          <Route exact path='/trade-to-earn/' component={() => <TradingMining lang={dict['trading-mining']}/>}/>
          <Route exact path='/trading-to-earn-finshed-one' component={() => <TradingMiningFinshedOne lang={dict['trading-mining']}/>}/>
        </Switch>
      </div>
    )
  }
}
export default Body
import React from 'react';
import { withRouter, Switch,Route,Redirect} from 'react-router-dom'
import LoadableComponent from '../../../utils/LoadableComponent'
import withLanguage from '../../../components/hoc/withLanguage';
import IndexRoute from '../../../components/IndexRoute/IndexRoute';

const Lite = LoadableComponent(()=>import('../../pages/trade/Lite'))
const Home = LoadableComponent(() => import('../../pages/Home/Home'))
const Team = LoadableComponent(() => import('../../pages/Team/Team'))
const Pool = LoadableComponent(() => import('../../components/Mining/Pool'))
const Token = LoadableComponent(() => import('../../pages/Token/Token'))
const Signin = LoadableComponent(() => import('../../pages/Signin/Signin'))
const LegacyPool = LoadableComponent(() => import('../Mining/Legacy/LegacyPool'))
const Mining = LoadableComponent(() => import('../../pages/Mining/Mining'))
const Bridge = LoadableComponent(() => import('../../pages/Bridge/Bridge'))
const Nuls = LoadableComponent(() => import('../../pages/Nuls/Nuls'))
const Broker = LoadableComponent(() => import('../../pages/Broker/Broker'))
const BrokerBind = LoadableComponent(() => import('../../pages/Broker/BrokerBind'))
const Governance = LoadableComponent(() => import('../../pages/Governance/Governance'))
const DipHistory = LoadableComponent(() => import('../../pages/Governance/DipHistory'))
const DipHistoryTwo = LoadableComponent(() => import('../../pages/Governance/DipHistoryTwo'))
const Download = LoadableComponent(() => import('../../pages/Download/Download'))

const InfoList = LoadableComponent(() => import('../../../desktop/pages/Info/List'))
const InfoDetail = LoadableComponent(() => import('../../../desktop/pages/Info/Detail'))
const TradingMining = LoadableComponent(() => import('../../pages/Marketing/TradingMining/Index'))

@withRouter
@withLanguage
class Body extends React.Component {

  
  render(){
    const {dict} = this.props
    return (
      <div className='body'>
        <Switch>
          <Route exact path='/index' component={()=><Home lang={dict['home']}/>}></Route>
          <Route exact path='/team' component={()=><Team lang={dict['team']}/>}></Route>
          <Route exact path='/deritoken' component={() => <Token lang={dict['home']} />}></Route>
          <Route exact path='/logo' component={() => <Download lang={dict['home']} />}></Route>
          <Route exact path='/bridge' component={() => <Bridge lang={dict['bridge']} />}></Route>
          {/* <Route exact path='/broker' component={() => <Broker lang={dict['broker']} />}></Route> */}
          <Route exact path='/signin' component={() => <Signin lang={dict['signin']} />}></Route>
          <Route exact path='/nuls' component={() => <Nuls lang={dict['nuls']} />}></Route>
          {/* <Route exact path='/brokerbind' component={() => <BrokerBind lang={dict['broker']} />}></Route> */}
          <Route exact path='/governance' component={() => <Governance lang={dict['governance']}/>}></Route>
          <Route exact path='/diphistorytwo' component={() => <DipHistoryTwo lang={dict['dip-history-two']}/>}></Route>
          <Route exact path='/diphistory' component={() => <DipHistory lang={dict['dip-history']}/>}></Route>
          <Route exact path='/' render={() => <IndexRoute/>}/>
          <Route exact path='/futures/lite' component={() => <Lite lang={dict['lite']}/>}/>
          <Route exact path='/options/lite' component={() => <Lite lang={dict['lite']}/>}/>
          <Route exact path='/mining' component={() => <Pool lang={dict['mining']}/>}/>
          <Route exact path='/retired' component={() => <LegacyPool lang={dict['mining']}/>}/>
          <Route exact path='/mining/:version/:chainId/:type/:symbol/:baseToken/:address' component={() => <Mining lang={dict['mining']}/>}/>
          <Route exact path='/trade-to-earn' component={() => <TradingMining lang={dict['trading-mining']}/>}/>
          <Route exact path='/info' component={() => <InfoList/>}/>
          <Route exact path='/info/:add/:catalog/:bToken/:network' component={() => <InfoDetail/>}/>
          <Route component={() => <Lite lang={dict['lite']}/>} />
        </Switch>
      </div>
    )
  }
}
export default Body;
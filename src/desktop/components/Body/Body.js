import React from 'react';
import { withRouter, Switch,Route,Redirect} from 'react-router-dom'
import LoadableComponent from '../../../utils/LoadableComponent'
import './body.css'
import withLanguage from '../../../components/hoc/withLanguage';
import IndexRoute from '../../../components/IndexRoute/IndexRoute';



const Lite = LoadableComponent(()=>import('../../pages/trade/Lite/Lite')) 
const Pro = LoadableComponent(()=>import('../../pages/trade/Pro/Pro')) 
const Pool = LoadableComponent(() => import('../Mining/Pool'))
const Mining = LoadableComponent(() => import('../../pages/Mining/Mining'))
const Home = LoadableComponent(() => import('../../pages/Home/Home'))
const Team = LoadableComponent(() => import('../../pages/Team/Team'))
const Bridge = LoadableComponent(() => import('../../pages/Bridge/Bridge'))
const Signin = LoadableComponent(() => import('../../pages/Signin/Signin'))
const Broker = LoadableComponent(() => import('../../pages/Broker/Broker'))
const BrokerBind = LoadableComponent(() => import('../../pages/Broker/BrokerBind'))
const Governance = LoadableComponent(() => import('../../pages/Governance/Governance'))
const DipHistory = LoadableComponent(() => import('../../pages/Governance/DipHistory'))

@withRouter
@withLanguage
class Body extends React.Component {

  render(){
    const {dict} = this.props  
    return (
      <div className='body'>
        <Switch >
          <Route exact path='/team' component={() => <Team lang={dict['team']} />}></Route>
          <Route exact path='/bridge' component={() => <Bridge lang={dict['bridge']} />}></Route>
          <Route exact path='/broker' component={() => <Broker lang={dict['broker']} />}></Route>
          <Route exact path='/signin' component={() => <Signin lang={dict['signin']} />}></Route>
          <Route exact path='/brokerbind' component={() => <BrokerBind lang={dict['broker']} />}></Route>
          <Route exact path='/index' component={() => <Home lang={dict['home']}/>}></Route>
          <Route exact path='/governance' component={() => <Governance lang={dict['governance']}/>}></Route>
          <Route exact path='/diphistory' component={() => <DipHistory lang={dict['dip-history']}/>}></Route>
          <Route exact path='/' render={() => <IndexRoute/>}/>
          <Route exact path='/mining' component={() => <Pool lang={dict['mining']}/>}/>
          <Route exact path='/mining/:version/:chainId/:type/:symbol/:baseToken/:address' component={() => <Mining lang={dict['mining']}/>}/>
          <Route exact path='/lite' component={() => <Lite lang={dict['lite']}/>}/>
          <Route exact path='/pro' component={() => <Pro lang={Object.assign(dict['lite'],dict['pro'])}/>}/>
          <Route component={() => <Lite lang={dict['lite']}/>} />
        </Switch>
      </div>
    )
  }
}
export default Body
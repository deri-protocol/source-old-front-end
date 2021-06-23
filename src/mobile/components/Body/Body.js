import React from 'react';
import { withRouter, Switch,Route,Redirect} from 'react-router-dom'
import LoadableComponent from '../../../utils/LoadableComponent'
import withLanguage from '../../../components/hoc/withLanguage';

const Lite = LoadableComponent(()=>import('../../pages/trade/Lite'))  
const Home = LoadableComponent(() => import('../../pages/Home/Home'))
const Team = LoadableComponent(() => import('../../pages/Team/Team'))
const Pool = LoadableComponent(() => import('../../components/Mining/Pool'))
const Mining = LoadableComponent(() => import('../../pages/Mining/Mining'))
const Bridge = LoadableComponent(() => import('../../pages/Bridge/Bridge'))
const Broker = LoadableComponent(() => import('../../pages/Broker/Broker'))
const Governance = LoadableComponent(() => import('../../pages/Governance/Governance'))
const DipHistory = LoadableComponent(() => import('../../pages/Governance/DipHistory'))
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
          <Route exact path='/bridge' component={() => <Bridge lang={dict['bridge']} />}></Route>
          <Route exact path='/broker' component={() => <Broker lang={dict['broker']} />}></Route>
          <Route exact path='/governance' component={() => <Governance lang={dict['governance']}/>}></Route>
          <Route exact path='/diphistory' component={() => <DipHistory lang={dict['dip-history']}/>}></Route>
          <Route exact path='/' render={() => {
            const url = window.location.href;
            if(/https?:\/\/app/.test(url)) {
              return  <Redirect to='/lite'/> 
            } else if(/https?:\/\/governance/.test(url)) {
              return  <Redirect to='/governance'/> 
            } else if(/https?:\/\/bridge/.test(url)) {
              return  <Redirect to='/bridge'/> 
            } 
            return <Redirect to='/index'/>
          }}>            
          </Route>
          <Route exact path='/lite' component={() => <Lite lang={dict['lite']}/>}/>
          <Route exact path='/mining' component={() => <Pool lang={dict['mining']}/>}/>
          <Route exact path='/mining/:version/:chainId/:type/:symbol/:baseToken/:address' component={() => <Mining lang={dict['mining']}/>}/>
          <Route component={() => <Lite lang={dict['lite']}/>} />
        </Switch>
      </div>
    )
  }
}
export default Body;
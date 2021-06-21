import React from 'react';
import { withRouter, Switch,Route,Redirect} from 'react-router-dom'
import LoadableComponent from '../../../utils/LoadableComponent'
import './body.css'
import withLanguage from '../../../components/hoc/withLanguage';



const Lite = LoadableComponent(()=>import('../../pages/trade/Lite/Lite')) 
const Pro = LoadableComponent(()=>import('../../pages/trade/Pro/Pro')) 
const Pool = LoadableComponent(() => import('../Mining/Pool'))
const Mining = LoadableComponent(() => import('../../pages/Mining/Mining'))
const Home = LoadableComponent(() => import('../../pages/Home/Home'))
const Team = LoadableComponent(() => import('../../pages/Team/Team'))
const Bridge = LoadableComponent(() => import('../../pages/Bridge/Bridge'))
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
          <Route exact path='/index' component={() => <Home lang={dict['home']}/>}></Route>
          <Route exact path='/governance' component={() => <Governance lang={dict['governance']}/>}></Route>
          <Route exact path='/diphistory' component={() => <DipHistory lang={dict['dip-history']}/>}></Route>
          <Route exact path='/' render={() => {
            return /^app/.test(window.location.href) ? <Redirect to='/lite'/> : <Redirect to='/index'/>
          }}>            
          </Route>
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
import React from 'react';
import { withRouter, Switch,Route} from 'react-router-dom'
import LoadableComponent from '../../../utils/LoadableComponent'
import './body.css'

const Lite = LoadableComponent(()=>import('../../pages/trade/Lite/Lite')) 
const Pro = LoadableComponent(()=>import('../../pages/trade/Pro/Pro')) 
const Pool = LoadableComponent(() => import('../Mining/Pool'))
const Mining = LoadableComponent(() => import('../../pages/Mining/Mining'))

@withRouter
class Body extends React.Component {

  render(){
    return (
      <div className='body'>
        <Switch>
          <Route exact path='/' component={Lite}/>
          <Route exact path='/mining' component={Pool}/>
          <Route exact path='/mining/:chainId/:baseToken/:address' component={Mining}/>
          <Route exact path='/lite' component={Lite}/>
          <Route exact path='/pro' component={Pro}/>
        </Switch>
      </div>
    )
  }
}
export default Body;
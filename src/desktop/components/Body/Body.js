import React from 'react';
import { withRouter, Switch,Route,Redirect} from 'react-router-dom'
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
        <Switch >
          <Route exact path='/'>
            <Redirect to='/lite'/>
          </Route>
          <Route exact path='/mining' component={Pool}/>
          <Route exact path='/mining/:chainId/:type/:symbol/:baseToken/:address' component={Mining}/>
          <Route exact path='/lite' component={Lite}/>
          <Route exact path='/pro' component={Pro}/>
          <Route component={Lite} />
        </Switch>
      </div>
    )
  }
}
export default Body;
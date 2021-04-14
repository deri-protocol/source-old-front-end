import React from 'react';
import { withRouter, Switch,Route} from 'react-router-dom'
import LoadableComponent from '../../utils/LoadableComponent'

const Lite = LoadableComponent(()=>import('../pages/trade/Lite')) 
const Pro = LoadableComponent(()=>import('../pages/trade/Pro')) 
const Mining = LoadableComponent(() => import('../pages/Mining'))

@withRouter
class Body extends React.Component {


  render(){
    return (
      <Switch>
        <Route exact path='/' component={Lite}/>
        <Route exact path='/lite' component={Lite}/>
        <Route exact path='/pro' component={Pro}/>
        <Route exact path='/mining' component={Mining}/>
      </Switch>
    )
  }
}
export default Body;
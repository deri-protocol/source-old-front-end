import React from 'react';
import { withRouter, Switch,Route} from 'react-router-dom'
import LoadableComponent from '../../../utils/LoadableComponent'

const Lite = LoadableComponent(()=>import('../../pages/trade/Lite')) 
const Pro = LoadableComponent(()=>import('../../pages/trade/Pro')) 
const Mining = LoadableComponent(() => import('../../components/Mining/Pool'))
const MiningDetail = LoadableComponent(() => import('../../pages/Mining/Mining'))

@withRouter
class Body extends React.Component {


  render(){
    return (
      <div className='body'>
        <Switch>
          <Route exact path='/' component={Lite}/>
          <Route exact path='/lite' component={Lite}/>
          <Route exact path='/pro' component={Pro}/>
          <Route exact path='/mining' component={Mining}/>
          <Route exact path='/mining/:chainId/:baseToken/:address' component={MiningDetail}/>
        </Switch>
      </div>
    )
  }
}
export default Body;
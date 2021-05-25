import React from 'react';
import { withRouter, Switch,Route} from 'react-router-dom'
import LoadableComponent from '../../../utils/LoadableComponent'

const Lite = LoadableComponent(()=>import('../../pages/trade/Lite'))  
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
          <Route exact path='/mining' component={Mining}/>
          <Route exact path='/mining/:chainId/:type/:symbol/:baseToken/:address' component={MiningDetail}/>
          <Route component={Lite} />
        </Switch>
      </div>
    )
  }
}
export default Body;
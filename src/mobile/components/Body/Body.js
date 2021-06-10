import React from 'react';
import { withRouter, Switch,Route} from 'react-router-dom'
import LoadableComponent from '../../../utils/LoadableComponent'

const Lite = LoadableComponent(()=>import('../../pages/trade/Lite'))  
const Mining = LoadableComponent(() => import('../../components/Mining/Pool'))
const MiningDetail = LoadableComponent(() => import('../../pages/Mining/Mining'))
const Home = LoadableComponent(() => import('../../pages/Home/Home'))
const Team = LoadableComponent(() => import('../../pages/Team/Team'))

@withRouter
class Body extends React.Component {


  render(){
    return (
      <div className='body'>
        <Switch>
          <Route exact path='/home' component={Home}></Route>
          <Route exact path='/team' component={Team}></Route>
          <Route exact path='/' component={Lite}/>
          <Route exact path='/lite' component={Lite}/>
          <Route exact path='/mining' component={Mining}/>
          <Route exact path='/mining/:version/:chainId/:type/:symbol/:baseToken/:address' component={MiningDetail}/>
          <Route component={Lite} />
        </Switch>
      </div>
    )
  }
}
export default Body;
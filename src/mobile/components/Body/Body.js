import React from 'react';
import { withRouter, Switch,Route} from 'react-router-dom'
import LoadableComponent from '../../../utils/LoadableComponent'
import withLanguage from '../../../components/hoc/withLanguage';

const Lite = LoadableComponent(()=>import('../../pages/trade/Lite'))  
const Home = LoadableComponent(() => import('../../pages/Home/Home'))
const Team = LoadableComponent(() => import('../../pages/Team/Team'))
const Pool = LoadableComponent(() => import('../../components/Mining/Pool'))
const Mining = LoadableComponent(() => import('../../pages/Mining/Mining'))

@withRouter
@withLanguage
class Body extends React.Component {

  
  render(){
    const {dict} = this.props
    return (
      <div className='body'>
        <Switch>
          <Route exact path='/home' component={()=><Home lang={dict['home']}/>}></Route>
          <Route exact path='/team' component={()=><Team lang={dict['team']}/>}></Route>
          <Route exact path='/' component={() => <Lite lang={dict['lite']}/>}/>
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
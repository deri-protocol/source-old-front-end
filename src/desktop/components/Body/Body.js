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

@withRouter
@withLanguage
class Body extends React.Component {

  render(){
    const {dict} = this.props

    return (
      <div className='body'>
        <Switch >
          <Route exact path='/home' component={() => <Home lang={dict['home']}/>}></Route>
          <Route exact path='/'>
            <Redirect to='/lite'/>
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
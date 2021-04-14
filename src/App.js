import './App.css';
import {isBrowser,isMobile} from 'react-device-detect'
import DesktopApp from './desktop/index'
import MobileApp from './mobile/index'

function App() {
  
  if(isBrowser){
    return <DesktopApp/>
  }
  if(isMobile){
    return <MobileApp/>
  }
}

export default App;

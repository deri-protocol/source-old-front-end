import {isBrowser,isMobile} from 'react-device-detect'
import LoadableComponent from './utils/LoadableComponent';

const DesktopApp = LoadableComponent(() => import('./desktop/index'))
const MobileApp = LoadableComponent(() => import('./mobile/index'))

function App() {
  
  if(isBrowser){
    return <DesktopApp/>
  }
  if(isMobile){
    return <MobileApp/>
  }
}

export default App;

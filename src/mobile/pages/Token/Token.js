import TokenInfo from '../../../components/Token/Token';
import './token.less'
export default function Token({lang}){
    return(
        <div className='token'>
           <TokenInfo lang={lang}></TokenInfo>
        </div>
    )
}
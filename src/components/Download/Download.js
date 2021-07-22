import logo from '../../assets/img/down-logo.png'
export default function Download({lang}){
  return (
    <div className='download-box'>
      <div className='title'>
        {lang['logo-download']}
      </div>
      <div className='img-down'>
        <div className='img'>
          <img src={logo} />
        </div>
        <div className='down'>
          <a href='https://deri.finance/logo-png.zip'>
            PNG
          </a>
          <a href='https://deri.finance/logo-svg.zip'>
            SVG
          </a>
        </div>
      </div>
      
      
    </div>
  )
}
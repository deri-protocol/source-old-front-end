export default function Table({title,data,fields}){
  return(
    <div className='info-table'>
      <div className='theader'>{title}</div>
      <div className='tbody'>
        {data.map(d => (
          <div className='row'>
            {fields.map(field => <div className='field'>{d[field]}</div>)}
            <div></div>
          </div>))}
      </div>
    </div>
  )
}
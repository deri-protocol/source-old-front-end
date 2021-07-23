import withModal from "../hoc/withModal"

export default withModal(() => (<div className='loading-mask'>
  <div className='spinner-border spinner-border-sm' role='status'>
      <span className='sr-only'></span>
  </div>
</div>))

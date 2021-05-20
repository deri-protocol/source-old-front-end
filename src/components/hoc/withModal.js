import React from 'react'
import Modal from 'react-modal/lib/components/Modal';

const withModal = Component => {
  const appElement = document.getElementById('root')
  const customizeStyle =  {
    overlay: {
      position: 'fixed',
      zIndex : 2,
      background : 'rgb(0 0 0 / 0.5)'
    },
    content: {
      position: 'absolute',
      border : 0,
      background : 'none',
      inset : 0,
      overflow : 'initial'
    }
  };

  class WithModal extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        modalIsOpen : false
      }
    }

    render(){
      const {modalIsOpen,className} = this.props
      return (
        <Modal isOpen={modalIsOpen} style={customizeStyle} appElement={appElement}>
          <div className={className}>
            <Component {...this.props} className={className} onClose={this.props.onClose}/>
          </div>
        </Modal>
      )
    }
  }

  return WithModal;
}
export default withModal;
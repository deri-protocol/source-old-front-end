import React from 'react'
import Modal from 'react-modal/lib/components/Modal';

const withModal = Component => {
  const appElement = document.getElementById('root')
  const customizeStyle =  {
    overlay: {
      position: 'fixed',
      background: 'none',
      zIndex : 2
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
      const {modalIsOpen} = this.props
      return (
        <Modal isOpen={modalIsOpen} style={customizeStyle} appElement={appElement}>
          <Component {...this.props} onClose={this.props.onClose}/>
        </Modal>
      )
    }
  }

  return WithModal;
}
export default withModal;
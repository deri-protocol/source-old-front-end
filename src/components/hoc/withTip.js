import React  from 'react'

const withTip = Component => {
  class WithTip extends React.Component {
    constructor(){
      super();
    }


    componentDidMount() {
      const allTipNode = document.querySelectorAll('[title]')
      allTipNode.forEach((node,index) => {
        const id = `hover-box-${index}`
        let hover 
        node.addEventListener('mouseover',event => {
          // event.target.parentNode.style.position = 'relative'
          if(!document.body.querySelector(`#${id}`)) {
            hover = document.createElement('div')
            hover.style.cssText = `font-size : 10px ;position : absolute;background-color: #2c2d31;border: 1px solid #AAAAAA;color: #AAAAAA;border-radius: 10px;padding: 4px;`
            document.body.appendChild(hover)
            hover.innerText = event.target.getAttribute('title')
            // event.target.removeAttribute('title')
          }
          if(event.target.getAttribute('title')){
            hover.innerText = event.target.getAttribute('title')
          }
          hover.id = id
          hover.style.display = 'block'
          hover.style.top = `${event.pageY}px`
          hover.style.left = `${event.pageX}px`
        })
        node.addEventListener('mouseout',event => {
          if(hover){
            hover.style.display = 'none'
          }
        })
      })
    }


    
    render(){
      return(
        <Component {...this.props}/>
      )
    }
  }
  return WithTip;
}

export default withTip;
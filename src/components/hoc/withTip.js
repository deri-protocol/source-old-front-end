import React  from 'react'

const withTtip = Component => {
  class WithTip extends React.Component {
    constructor(){
      super();
      this.hover = document.createElement('div')
      this.hover.style.cssText = `font-size : 10px ;position : absolute;background-color: #2c2d31;border: 1px solid #AAAAAA;color: #AAAAAA;border-radius: 10px;padding: 4px;`
    }


    componentDidMount() {
      const allTipNode = document.querySelectorAll('[title]')
      allTipNode.forEach((node,index) => {
        node.addEventListener('mouseover',event => {
          const parentNode = event.target.parentNode
          // event.target.parentNode.style.position = 'relative'
          const id = `hover-box-${index}`
          if(!document.body.querySelector(`#${id}`)) {
            document.body.appendChild(this.hover)
            this.hover.innerText = event.target.getAttribute('title')
            event.target.removeAttribute('title')
          }
          this.hover.id = id
          this.hover.style.display = 'block'
          this.hover.style.top = `${event.pageY}px`
          this.hover.style.left = `${event.pageX}px`
        })
        node.addEventListener('mouseout',event => {
          if(this.hover){
            this.hover.style.display = 'none'
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

export default withTtip;
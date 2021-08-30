import React, { useState, useEffect,useRef } from 'react'

function TipWrapper(props){
  const ref = useRef(null)
  useEffect(() => {
    const currentNode = ref.current
    if(currentNode){
      const hoverNodes = currentNode.querySelectorAll('[title]')
      hoverNodes.forEach(hoverNode => {
        const id = `hover-box-${new Date().getTime()}`
        let hover = document.body.querySelector(`#${id}`)
        hoverNode.addEventListener('mouseover',event => {
          if(!hover) {
            hover = document.createElement('div')
            hover.style.cssText = `z-index : 1;max-width : 200px;font-size : 0.1rem ;position : absolute;background-color: #2c2d31;border: 1px solid #AAAAAA;color: #AAAAAA;border-radius: 10px;padding: 4px;`
            document.body.appendChild(hover)
            hover.innerText = event.currentTarget.getAttribute('title')
            event.target.removeAttribute('title')
          } 
          if(event.currentTarget.getAttribute('title')){
            hover.innerText = event.currentTarget.getAttribute('title')
          }
          hover.id = id
          hover.style.display = 'block'
          hover.style.top = `${event.pageY +4}px`
          if(hover.offsetWidth + event.pageX > window.screen.width){
            if(event.pageX - hover.offsetWidth >= 0){
              hover.style.left = `${event.pageX - hover.offsetWidth}px`
            } else {
              hover.style.left = `${event.pageX - (hover.offsetWidth / 2)}px`
            }
          } else {
            hover.style.left = `${event.pageX}px`
          }
        })
        currentNode.addEventListener('mouseout',event => {
          if(hover){
            hover.style.display = 'none'
          }
        })   
      });
    }
  return () => {ref.current = null}
  }, [])
  return props.block ? <div ref={ref}>{props.children}</div> : <span ref={ref}>{props.children}</span>
}

export default TipWrapper
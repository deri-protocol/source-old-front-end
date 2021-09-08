import React, { useState, useEffect,useRef } from 'react'

function TipWrapper(props){
  const ref = useRef(null)
  useEffect(() => {
    const currentNode = ref.current
    if(currentNode){
      const hoverNodes = currentNode.querySelectorAll('[title]')
      hoverNodes.forEach(hoverNode => {
        let hover = 
        hoverNode.addEventListener('mouseover',event => {
          const id = `hover-box-${new Date().getTime()}`
          hover = document.body.querySelector(`#${id}`)
          hover = document.createElement('div')
          hover.style.cssText = `z-index : 9;min-width : 100px;max-width : ${window.screen.width}px ;font-size : 12px ;position : absolute;background-color: #2c2d31;border: 1px solid #AAAAAA;color: #AAAAAA;border-radius: 10px;padding: 4px;`
          document.body.appendChild(hover)
          const currentTarget = event.currentTarget
          const title = currentTarget.getAttribute('title')
          hover.innerText = title || currentTarget.getAttribute('origin-title')
          if(title) {
            currentTarget.setAttribute('origin-title',title)
            currentTarget.setAttribute('title','')
          }
          hover.id = id
          hover.style.display = 'block'
          const rect = event.currentTarget.getBoundingClientRect()
          hover.style.top = `${rect.y + rect.height + window.document.documentElement.scrollTop}px`
          // hover.style.top = `${event.pageY + event.currentTarget.offsetHeight}px`
          if(hover.offsetWidth + event.pageX > window.screen.width){
            if(event.pageX - hover.offsetWidth >= 0){
              hover.style.left = `${event.pageX - hover.offsetWidth}px`
            } else {
              const left = event.pageX - (hover.offsetWidth / 2) > 0 ? (event.pageX - (hover.offsetWidth / 2)) : 0;
              hover.style.left = `${left}px`
            }
          } else {
            hover.style.left = `${event.pageX}px`
          }
        })
        currentNode.addEventListener('mouseout',event => {
          if(hover){
            // hover.style.display = 'none'
            hover.remove()
            // document.body.removeChild(hover)
          }
        })   
      });
    }
  return () => {ref.current = null}
  }, [props.title])
  return props.block ? <div ref={ref}>{props.children}</div> : <span ref={ref}>{props.children}</span>
}

export default TipWrapper
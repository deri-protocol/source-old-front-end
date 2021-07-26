import React ,{useEffect,useState} from 'react'

export default function Token({lang}){
    return(
        <div className='token-info'>
            <div className='title'>
                {lang['the-deri-token']}
            </div>
            <div className='add-to-matemask'>
                <button>
                    {lang['add-deri-to-matemask']}
                </button>
            </div>
        </div>
    )
}
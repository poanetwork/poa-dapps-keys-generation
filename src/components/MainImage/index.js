import React from 'react'

export const MainImage = ({ extraClassName = '', networkBranch = '' }) => {
  return (
    <div className={`hm-MainImage ${extraClassName} ${networkBranch ? 'hm-MainImage-' + networkBranch : ''}`}>
      <div className="hm-MainImage_Img">
        <div className="content-ratio" />
      </div>
    </div>
  )
}

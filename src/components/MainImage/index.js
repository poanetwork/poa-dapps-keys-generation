import React from 'react'

export const MainImage = ({ extraClassName = '', networkBranch = '' }) => {
  return (
    <div className={`hm-MainImage ${extraClassName}`}>
      <div className={`hm-MainImage_Img ${'hm-MainImage_Img-' + networkBranch}`}>
        <div className="content-ratio" />
      </div>
    </div>
  )
}

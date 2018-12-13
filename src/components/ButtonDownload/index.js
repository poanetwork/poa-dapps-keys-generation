import React from 'react'
import icon from './icon.svg'

export const ButtonDownload = ({
  download = undefined,
  extraClassName = '',
  href = '',
  id = '',
  networkBranch = '',
  onClick = null,
  text = 'Download'
}) => {
  return (
    <a
      className={`sw-ButtonDownload ${extraClassName} ${'sw-ButtonDownload-' + networkBranch}`}
      download={download}
      href={href}
      id={id}
      onClick={onClick}
    >
      <span className="sw-ButtonDownload_Text">{text}</span>
      <img src={icon} alt="" className="sw-ButtonDownload_Icon" />
    </a>
  )
}

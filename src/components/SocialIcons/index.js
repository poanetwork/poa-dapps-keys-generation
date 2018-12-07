import React from 'react'

const socialNetworks = [
  {
    tag: 'twitter',
    text: 'Twitter',
    url: 'https://twitter.com/poanetwork'
  },
  {
    tag: 'poa',
    text: 'POA Network',
    url: 'https://poa.network'
  },
  {
    tag: 'telegram',
    text: 'Telegram',
    url: 'https://t.me/oraclesnetwork'
  },
  {
    tag: 'github',
    text: 'GitHub',
    url: 'https://github.com/poanetwork/'
  }
]

const getSocialNetworks = () => {
  return socialNetworks.map((item, index) => {
    return (
      <a
        className={`ft-SocialIcons_Icon ft-SocialIcons_Icon-${item.tag}`}
        href={item.url}
        key={index}
        rel="noopener noreferrer"
        target="_blank"
        title={item.text}
      >
        {item.text}
      </a>
    )
  })
}

export const SocialIcons = ({ extraClass = '' }) => {
  return <div className={`ft-SocialIcons ${extraClass}`}>{getSocialNetworks()}</div>
}

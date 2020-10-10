import PropTypes from 'prop-types'
import React from 'react'
import { navigate } from 'gatsby'
import Icon from './Icon'

const Header = props => {
  const pages = [
    { label: 'About', url: '/about' },
    { label: 'Info', url: '/info' },
    { label: 'App', url: '/app' },
    // { label: 'Contact', url: '/contact' },
  ]

  return (
    <header id="header" style={props.timeout ? { display: 'none' } : {}}>
      <div className="logo">
        <Icon></Icon>
        {/* <span className="icon fa-diamond"></span> */}
      </div>
      <div className="content">
        <div className="inner">
          <h1>Delicious Anti&nbsp;Cancer Recipe Engine</h1>
          <p>
            Recipe Generator suggests anti-cancer ingredients matches to the
            recipe
          </p>
        </div>
      </div>
      <nav>
        <ul>
          {pages.map(page => (
            <li key={page.url}>
              <button
                onClick={() => {
                  navigate(page.url, { replace: true })
                }}
              >
                {page.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

Header.propTypes = {
  onOpenArticle: PropTypes.func,
  timeout: PropTypes.bool,
}

export default Header

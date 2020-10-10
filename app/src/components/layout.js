import React from 'react'
import PropTypes from 'prop-types'
import SEO from '../components/Seo'
import '../assets/scss/main.scss'

const Layout = ({ children, location }) => (
  <>
    <SEO></SEO>
    <div>{children}</div>
  </>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

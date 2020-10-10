import React from 'react'
import { navigate } from 'gatsby'

import Layout from '../components/layout'

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isArticleVisible: false,
      timeout: false,
      articleTimeout: false,
      article: '',
      loading: props.location.state ? '' : 'is-loading', // state exist if navigated from Gatsby Page
    }
    this.handleOpenArticle = this.handleOpenArticle.bind(this)
    this.handleCloseArticle = this.handleCloseArticle.bind(this)
    this.setWrapperRef = this.setWrapperRef.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount() {
    if (this.props.location.state) {
      this.handleOpenArticle('contact')
    } else {
      setTimeout(() => {
        this.handleOpenArticle('contact')
      }, 2000)
    }
    this.timeoutId = setTimeout(() => {
      this.setState({ loading: '' })
    }, 100)
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  setWrapperRef(node) {
    this.wrapperRef = node
  }

  handleOpenArticle(article) {
    this.setState({
      isArticleVisible: !this.state.isArticleVisible,
      article,
    })

    setTimeout(() => {
      this.setState({
        timeout: !this.state.timeout,
      })
    }, 325)

    setTimeout(() => {
      this.setState({
        articleTimeout: !this.state.articleTimeout,
      })
    }, 350)
  }

  handleCloseArticle() {
    this.setState({
      articleTimeout: !this.state.articleTimeout,
    })

    setTimeout(() => {
      this.setState({
        timeout: !this.state.timeout,
      })
    }, 325)

    setTimeout(() => {
      this.setState({
        isArticleVisible: !this.state.isArticleVisible,
        article: '',
      })
    }, 350)

    setTimeout(() => {
      navigate('/', { replace: true })
    }, 600)
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (this.state.isArticleVisible) {
        this.handleCloseArticle()
      }
    }
  }

  render() {
    let close = (
      <div
        className="close"
        onClick={() => {
          this.handleCloseArticle()
        }}
      ></div>
    )
    return (
      <Layout location={this.props.location}>
        <div
          className={`body ${this.state.loading} ${
            this.state.isArticleVisible ? 'is-article-visible' : ''
          }`}
        >
          <div id="wrapper">
            <div
              ref={this.setWrapperRef}
              id="main"
              style={
                this.state.timeout ? { display: 'flex' } : { display: 'none' }
              }
            >
              <article
                id="contact"
                className={`${
                  this.state.article === 'contact' ? 'active' : ''
                } ${this.state.articleTimeout ? 'timeout' : ''}`}
                style={{ display: 'none' }}
              >
                <h2 className="major">Contact</h2>
                <form method="post" action="#">
                  <div className="field half first">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" />
                  </div>
                  <div className="field half">
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" />
                  </div>
                  <div className="field">
                    <label htmlFor="message">Message</label>
                    <textarea name="message" id="message" rows="4"></textarea>
                  </div>
                  <ul className="actions">
                    <li>
                      <input
                        type="submit"
                        value="Send Message"
                        className="special"
                      />
                    </li>
                    <li>
                      <input type="reset" value="Reset" />
                    </li>
                  </ul>
                </form>
                <ul className="icons">
                  <li>
                    <a
                      href="https://twitter.com/HuntaroSan"
                      className="icon fa-twitter"
                    >
                      <span className="label">Twitter</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://codebushi.com"
                      className="icon fa-facebook"
                    >
                      <span className="label">Facebook</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://codebushi.com"
                      className="icon fa-instagram"
                    >
                      <span className="label">Instagram</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/codebushi/gatsby-starter-dimension"
                      className="icon fa-github"
                    >
                      <span className="label">GitHub</span>
                    </a>
                  </li>
                </ul>
                {close}
              </article>
              
            </div>
          </div>
          <div id="bg"></div>
        </div>
      </Layout>
    )
  }
}

export default IndexPage

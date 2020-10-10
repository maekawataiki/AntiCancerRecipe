import React from 'react'
import { navigate } from 'gatsby'

import Layout from '../components/layout'

import pic03 from '../images/pic03.jpg'

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
      this.handleOpenArticle('about')
    } else {
      setTimeout(() => {
        this.handleOpenArticle('about')
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
                id="about"
                className={`${this.state.article === 'about' ? 'active' : ''} ${
                  this.state.articleTimeout ? 'timeout' : ''
                }`}
                style={{ display: 'none' }}
              >
                <h2 className="major">About</h2>
                {/* <span className="image main">
                  <img src={pic03} alt="" />
                </span> */}
                <p>
                  No one wants to replace their meal with chemically perfect
                  smoothies to be healthy.
                </p>
                <p>
                  Delicious Anti Cancer Recipe Engine (D-ACREngine) is a recipe
                  generator suggests delicious recipes with high anti-cancer
                  potency ingredients.
                </p>
                <p>
                  You can copy and paste ingredients of recipes from somewhere
                  else and the generator will recommend additional ingredients
                  that makes you healthy but also delicious.
                </p>
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

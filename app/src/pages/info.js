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
                <h2 className="major">Info</h2>
                {/* <span className="image main">
                  <img src={pic03} alt="" />
                </span> */}
                <p>
                  This recipe engine suggests ingredients from three point of
                  view.
                </p>
                <p>
                  <b>Anti Cancer Potency</b> which is measured by amount of
                  compounds which is likely to prevent cancer such as
                  anti-oxidants.
                </p>
                <p>
                  <b>Flavour Harmony</b> which is measured by number of flavour
                  compounds each ingredients have in common. For example, onion
                  and beef have a lot of flavour compounds in common. In theory,
                  food will be delicious if there are more coupling of
                  ingredients. Most cuisine follows this theory.
                </p>
                <p>
                  <b>Umami</b> which is amino-acids and nucleotides gives
                  deliciousness to food, including glutamate, inosinates, and
                  guanylates.
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

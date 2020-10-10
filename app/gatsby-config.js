const path = require(`path`)
module.exports = {
  pathPrefix: '/AntiCancerRecipe',
  siteMetadata: {
    title: 'Delicious Anti Cancer Recipe Engine',
    author: 'Taiki Maekawa',
    description:
      'Recipe Generator suggests delicious anti-cancer recipe based on your familiar taste',
    url: 'https://maekawataiki.github.io/AntiCancerRecipe',
    image: '/twitter.jpg',
    twitterUsername: 'maekawataiki000',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.join(__dirname, `src`, `images`),
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#333333',
        theme_color: '#333333',
        display: 'minimal-ui',
        icon: 'src/images/favicon.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-127031115-5',
      },
    },
    'gatsby-plugin-sass',
  ],
}

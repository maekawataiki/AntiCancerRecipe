module.exports = {
  siteMetadata: {
    title: 'Delicious Anti Cancer Recipe Engine',
    author: 'Taiki Maekawa',
    description:
      'Recipe Generator suggests delicious anti-cancer recipe based on your familiar taste',
    url: 'https://maekawataiki.github.io/AntiCancerRecipe',
    image: '/images/bg',
    twitterUsername: 'maekawataiki000'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
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
    'gatsby-plugin-sass',
  ],
}

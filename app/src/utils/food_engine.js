import Cleaner from '../data/cleaner.json'
import Flavour2Flavour from '../data/flavour2flavour.json'
import Food2Umami from '../data/food2umami.json'
import Food2CKScore from '../data/food2ckscore.json'

export class FoodEngine {
  constructor() {
    this.recipe = ''
    this.ingredients = []
    this.scores = { ck: 0, flavour: 0, umami: 0 }
    this.recommendation = []
    this.sort = { key: 'ck', direction: 'desc' } // 'asc' or 'desc'
  }

  updateRecipe(recipe) {
    this.recipe = recipe
    this.ingredients = this.processIngredient(this.recipe)
    this.scores = this.calculateScore(this.ingredients)
    this.recommendation = this.getRecommendation(this.ingredients)
    this.sortRecommendation()
  }

  sortRecommendation(key = '') {
    if (key) {
      if (this.sort.key === key) {
        this.sort.direction = this.sort.direction === 'asc' ? 'desc' : 'asc'
      }
      this.sort.key = key
    }

    if (this.sort.key) {
      this.recommendation.sort((a, b) => {
        if (a[this.sort.key] < b[this.sort.key]) {
          return this.sort.direction === 'asc' ? -1 : 1
        }
        if (a[this.sort.key] > b[this.sort.key]) {
          return this.sort.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
  }

  processIngredient(recipe) {
    let result = new Set()
    let ingredients = recipe.split('\n').map(ing => this.clean(ing))
    ingredients.forEach(ing => {
      result.add(ing)
      Cleaner['whitelist'].forEach(wl => {
        if ((' ' + ing + ' ').match(' ' + wl + ' ')) {
          result.add(wl)
          ing = (' ' + ing + ' ').replaceAll(' ' + wl + ' ', ' ').trim()
          result.add(ing)
        }
      })
    })
    result = [...result].filter(ing => ing)
    return result
  }

  singular(text) {
    if (text.match(/ies$/)) return text.substr(0, text.length - 3) + 'y'
    if (text.match(/(s|ss|sh|x|z|ch|ato)es$/))
      return text.substr(0, text.length - 2)
    if (text.match(/leaves$/)) return text.substr(0, text.length - 3) + 'f'
    if (text.match(/s$/)) return text.substr(0, text.length - 1)
    return text
  }

  clean(text) {
    text = text.toLowerCase()
    text = text.replaceAll(/[-_&'®™€~～]/g, ' ')
    text = text.replaceAll(/(\[.+\]|\(.+\)|（.+\))|（.+）|\(.+）/g, ' ')
    text = text
      .split(',')[0]
      .split('、')[0]
      .split('/')[0]
    text = text
      .split(' ')
      .map(token => this.singular(token))
      .join(' ')
    text = (' ' + text + ' ').replaceAll(
      /[0-9/. ]+(%|ounc|lb.|month|week|day|hour|minute|minuite|grade|portion|item|st|nd|℃|ｇ|kg|g|w|to|) /g,
      ' '
    )
    Cleaner['blacklist'].forEach(bl => {
      text = (' ' + text + ' ').replaceAll(' ' + bl + ' ', ' ')
    })
    Object.keys(Cleaner['food_map']).forEach(fm => {
      text = text.replaceAll(new RegExp(fm, 'g'), Cleaner['food_map'][fm])
    })
    text = text.trim()
    return text
  }

  calculateScore(ingredients) {
    return {
      ck: this.calculateCK(ingredients) / 50,
      flavour: this.calculateFlavour(ingredients) / 50,
      umami: this.calculateUmami(ingredients) / 20,
    }
  }

  calculateCK(ingredients) {
    let sum_content = ingredients.reduce((acc, ing) => {
      if (Food2CKScore[ing] === undefined) return acc
      Object.keys(Food2CKScore[ing]).forEach(compound => {
        acc[compound] = (acc[compound] || 0) + Food2CKScore[ing][compound]
      })
      return acc
    }, {})
    return Object.keys(sum_content).reduce((acc, compound) => {
      return acc + Math.log(sum_content[compound] + 1)
    }, 0)
  }

  calculateFlavour(ingredients) {
    return ingredients.reduce(
      (acc, ing) => {
        if (ing in Flavour2Flavour) {
          acc.score += Math.log(
            acc.visited.reduce((acc, ing2) => {
              if (ing2 in Flavour2Flavour[ing])
                return acc + Flavour2Flavour[ing][ing2]
              return acc
            }, 1)
          )
        }
        acc.visited.push(ing)
        return acc
      },
      { visited: [], score: 0 }
    ).score
  }

  calculateUmami(ingredients) {
    let sum_content = ingredients.reduce((acc, ing) => {
      if (Food2Umami[ing] === undefined) return acc
      Object.keys(Food2Umami[ing]).forEach(compound => {
        acc[compound] = (acc[compound] || 0) + Food2Umami[ing][compound]
      })
      return acc
    }, {})
    return Object.keys(sum_content).reduce((acc, compound) => {
      return acc + Math.log(sum_content[compound] + 1)
    }, 0)
  }

  getRecommendation(ingredients) {
    // Flavour
    let flavour = ingredients
      .map(ing => {
        return Flavour2Flavour[ing] || {}
      })
      .reduce((acc, match) => {
        Object.keys(match).forEach(key => {
          acc[key] = acc[key] + match[key] || match[key]
        })
        return acc
      }, {})
    // Umami
    if (ingredients.length) {
      Object.keys(Food2Umami).forEach(food => {
        flavour[food] = flavour[food] || 0
      })
    }

    ingredients.forEach(ing => {
      delete flavour[ing]
    })

    let result = Object.keys(flavour).reduce((acc, key) => {
      if (Food2CKScore[key] === undefined) return acc
      acc.push({
        name: key,
        flavour: Math.log(flavour[key] + 1),
        ck: this.calculateCK([key]),
        umami: this.calculateUmami([key]),
      })
      return acc
    }, [])

    return result
  }
}

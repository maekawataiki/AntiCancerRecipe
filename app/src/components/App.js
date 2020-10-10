import React from 'react'
import PropTypes from 'prop-types'
import { Subject } from 'rxjs/Subject'
import { debounceTime } from 'rxjs/operators'

import { FoodEngine } from '../utils/food_engine'
import RadarChart from 'react-svg-radar-chart'

class App extends React.Component {
  subscription
  table_col = [
    { label: 'AC', slug: 'ck' },
    { label: 'F', slug: 'flavour' },
    { label: 'U', slug: 'umami' },
  ]

  constructor(props) {
    super(props)

    this.food_engine = new FoodEngine()
    this.search$ = new Subject()
    this.search = this.search$.asObservable().pipe(debounceTime(500))

    this.state = {
      recipe: '',
      scores: this.food_engine.scores,
      recommendation: this.food_engine.recommendation,
      sort: this.food_engine.sort,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSort = this.handleSort.bind(this)
  }

  componentDidMount() {
    this.subscription = this.search.subscribe(text => {
      this.food_engine.updateRecipe(text)
      localStorage.setItem('recipe', this.state.recipe)
      this.setState({
        scores: this.food_engine.scores,
        recommendation: this.food_engine.recommendation,
      })
    })

    let saved_recipe = localStorage.getItem('recipe') || ''
    this.setState({ recipe: saved_recipe })
    this.search$.next(saved_recipe)
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  handleChange(e) {
    this.setState({ recipe: e.target.value })
    this.search$.next(e.target.value)
  }

  handleSort(field) {
    this.food_engine.sortRecommendation(field)
    this.setState({
      recommendation: this.food_engine.recommendation,
      sort: this.food_engine.sort,
    })
  }

  render() {
    return (
      <div id="app">
        <h2 className="major">Create Your Recipe</h2>
        <div id="recipe">
          <textarea
            name="recipe-input"
            id="recipe-input"
            cols="30"
            rows="5"
            value={this.state.recipe}
            onChange={this.handleChange}
            placeholder="Enter Ingredients in each rows.&#13;ex.)&#13;onion&#13;tomato"
          ></textarea>
        </div>
        <div id="engine">
          <div id="suggest">
            <table>
              <thead>
                <tr>
                  <th>Suggestion</th>
                  {this.table_col.map(col => (
                    <th key={col.slug}>
                      <button
                        type="button"
                        className={
                          this.state.sort.key === col.slug
                            ? this.state.sort.direction
                            : ''
                        }
                        onClick={() => this.handleSort(col.slug)}
                      >
                        {col.label}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {this.state.recommendation.map(ingredient => (
                  <tr key={ingredient.name}>
                    <td>{ingredient.name}</td>
                    <td>{ingredient.ck.toFixed(2)}</td>
                    <td>{ingredient.flavour.toFixed(2)}</td>
                    <td>{ingredient.umami.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div id="chart">
            <RadarChart
              captions={{
                ck: 'Anti Cancer',
                flavour: 'Flavour',
                umami: 'Umami',
              }}
              data={[{ data: this.state.scores, meta: { color: 'blue' } }]}
              size={200}
            />
          </div>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  timeout: PropTypes.bool,
}

export default App

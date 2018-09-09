import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ObjectList from 'react-object-list'
import {
  BooleanFilter,
  DateFilter,
  DayFilter,
  CurrencyFilter,
  MonthFilter,
  NumberSliderFilter,
  RemoteChoiceFilter,
  RemoteMultiChoiceFilter,
  SearchFilter,
  ChoiceFilter,
  MultiChoiceFilter,
  TextContainsFilter,
} from 'react-object-list/filters'

import './TableComponent.css'

const MUTABLE_PROPS = [
  'dynamic',
  'columns',
  'filters',
  'currentPage',
  'sortKeys',
  'extraColumns',
  'perPage'
]

const FILTER_MAP = {
  'BooleanFilter': BooleanFilter,
  'DateFilter': DateFilter,
  'DayFilter': DayFilter,
  'CurrencyFilter': CurrencyFilter,
  'MonthFilter': MonthFilter,
  'NumberSliderFilter': NumberSliderFilter,
  'RemoteChoiceFilter': RemoteChoiceFilter,
  'RemoteMultipleChoiceFilter': RemoteMultiChoiceFilter,
  'SearchFilter': SearchFilter,
  'ChoiceFilter': ChoiceFilter,
  'MultiChoiceFilter': MultiChoiceFilter,
  'TextContainsFilter': TextContainsFilter,
}

function format(n, sep, decimals) {
    if (decimals == 0) {
      return n.toLocaleString().split(sep)[0]
    } else {
      return n.toLocaleString().split(sep)[0]
          + sep
          + n.toFixed(decimals).split(sep)[1]
    }
}

const number0Renderer = ({row: {id}, value}) => {
  return (<div key={`number0-${id}`} style={{'float': 'right'}}>{format(value, '.', 0)}</div>)
}

const number1Renderer = ({row: {id}, value}) => {
  return (<div key={`number1-${id}`} style={{'float': 'right'}}>{format(value, '.', 1)}</div>)
}

const number2Renderer = ({row: {id}, value}) => {
  return (<div key={`number2-${id}`} style={{'float': 'right'}}>{format(value, '.', 2)}</div>)
}

const RENDERER_MAP = {
  'number0Renderer': number0Renderer,
  'number1Renderer': number1Renderer,
  'number2Renderer': number2Renderer
}

class TableComponent extends Component {
  constructor(props) {
    super(props)

    this.updatePage = this.updatePage.bind(this)
    this.updateSorting = this.updateSorting.bind(this)
    this.updateColumns = this.updateColumns.bind(this)
    this.addFilter = this.addFilter.bind(this)
    this.removeFilter = this.removeFilter.bind(this)
    this.updateFilter = this.updateFilter.bind(this)

    this.state = {}
  }

  propsToState(props, prevProps) {

    const newState = {}

    MUTABLE_PROPS.forEach(propKey => {
      if (this.state[propKey] !== props[propKey]) {
        newState[propKey] = props[propKey]
      }
    })

    this.setState(newState)
  }

  componentWillMount() {
    this.propsToState(this.props, {})
  }

  componentWillReceiveProps(nextProps) {
    this.propsToState(nextProps, this.props)
  }

  updateProps(obj) {
    if (this.props.setProps) {
      this.props.setProps(obj)
    }
    this.setState(obj)
  }

  updatePage = currentPage => this.updateProps({currentPage: currentPage})

  updateSorting = sortKey => {
    let sortKeys = this.state.sortKeys
    const currentSort = sortKeys.find(sort => sort.sortKey === sortKey)
    let value = true
    if (currentSort !== undefined && currentSort.value === true) {
      value = false
    }
    sortKeys = [{sortKey: sortKey, value}].concat(sortKeys.filter((k) => k.sortKey !== sortKey))

    this.updateProps({sortKeys: sortKeys})
  }

  updateColumns = columnKey => {
    let extraColumns = this.state.extraColumns
    if (extraColumns.includes(columnKey)) {
      extraColumns = extraColumns.filter(key => key !== columnKey)
    } else {
      extraColumns.push(columnKey)
    }

    this.updateProps({extraColumns: extraColumns})
  }

  addFilter = newFilter => {
    const filters = this.state.filters.map(filter => {
      if (filter.filterKey === newFilter.filterKey) {
        return {...filter, active: true}
      } else {
        return {...filter}
      }
    })

    this.updateProps({filters: filters})
  }

  removeFilter = filterKey => {
    const filters = this.state.filters.map(filter => {
      if (filter.filterKey === filterKey) {
        return {...filter, active: false, value: ''}
      } else {
        return {...filter}
      }
    })

    this.updateProps({filters: filters})
  }

  updateFilter = ({filter: filterKey, comparison, value}) => {
    const filters = this.state.filters.map(filter => {
      if (filter.filterKey === filterKey) {
        return {...filter, value, comparison}
      } else {
        return {...filter}
      }
    })

    this.updateProps({filters: filters})
  }

  render() {
    const { perPage, sortKeys, extraColumns, columns, filters, dynamic } = this.props
    const { data, currentPage, totalCount } = dynamic
    const filters_render = filters.map(filter => {
      if (filter['Renderer'] in FILTER_MAP) {
        const renderer = filter['Renderer']
        return {...filter, Renderer: FILTER_MAP[renderer]}
      } else {
        return {...filter}
      }
    })
    const columns_render = columns.map(column => {
      if ('item' in column && column['item'] in RENDERER_MAP) {
        const item = column['item']
        return {...column, item: RENDERER_MAP[item]}
      } else {
        return {...column}
      }
    })
    return <ObjectList
      columns={columns_render}
      data={data}
      updateSorting={this.updateSorting}
      filters={filters_render}
      meta={{
        currentPage,
        perPage,
        totalCount,
        sortKeys,
        extraColumns,
      }}
      updatePage={this.updatePage}
      maxPages={5}
      updateColumns={this.updateColumns}
      favouritesEnabled={false}
      addFilter={this.addFilter}
      removeFilter={this.removeFilter}
      updateFilter={this.updateFilter}
    />
  }

}

TableComponent.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks
     */
    id: PropTypes.string,

    currentPage: PropTypes.number,

    dynamic: {
      data: PropTypes.array,
      currentPage: PropTypes.number,
      totalCount: PropTypes.number
    },

    perPage: PropTypes.number,
    sortKeys: PropTypes.array,
    extraColumns: PropTypes.array,

    columns: PropTypes.array,
    filters: PropTypes.array,
    /**
     * Dash-assigned callback that should be called whenever any of the
     * properties change
     */
    setProps: PropTypes.func
}

export default TableComponent

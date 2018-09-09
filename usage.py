import table_custom

import json
import dash
from dash.dependencies import Input, Output, State
import dash_html_components as html
import pandas as pd
from flask_caching import Cache

app = dash.Dash('')

app.scripts.config.serve_locally = True
app.css.append_css({'external_url': 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'})

cache = Cache(app.server, config={
    'CACHE_TYPE': 'filesystem',
    'CACHE_DIR': 'cache-directory'
})



DF_GAPMINDER = pd.read_csv(
    'https://raw.githubusercontent.com/plotly/datasets/master/gapminderDataFiveYear.csv'
)

PAGE_SIZE = 20

ROWS = DF_GAPMINDER.loc[0:PAGE_SIZE-1]

ROWS = ROWS.to_dict('records')

COLUMNS = [
    {
        'dataKey': 'country',
        'header': 'Country',
        'sortKey': 'country'
    },
    {
        'dataKey': 'year',
        'header': 'Year',
        'sortKey': 'year'
    },
    {
        'dataKey': 'pop',
        'header': 'Population',
        'sortKey': 'pop',
        'item': 'number0Renderer'
    },
    {
        'dataKey': 'continent',
        'header': 'Continent',
        'sortKey': 'continent'
    },
    {
        'dataKey': 'lifeExp',
        'header': 'Life Expectancy',
        'sortKey': 'lifeExp',
        'item': 'number2Renderer'
    },
    {
        'dataKey': 'gdpPercap',
        'header': 'GDP per Capita',
        'sortKey': 'gdpPercap',
        'item': 'number2Renderer'
    },
]

FILTERS = [
    {
        'Renderer': 'MultiChoiceFilter',
        'filterKey': 'country',
        'name': 'Country',
        'active': False,
        'options': [{'label': o, 'value': o} for o in list(DF_GAPMINDER.country.unique())],
        'props': {
            'updateDelay': 5,
        }
    }
]

dynamic = {
    'currentPage': 1,
    'totalCount': len(DF_GAPMINDER),
    'data': ROWS
}


app.layout = html.Div([
    html.H1('Example'),
    html.Div([
        table_custom.TableComponent(
            id='table',
            currentPage=1,
            perPage=PAGE_SIZE,
            sortKeys=[],
            dynamic=ROWS,
            columns=COLUMNS,
            extraColumns=[],
            filters=FILTERS
        )
    ], id='table-div'),
    html.Div(id='data-store', style={'display': 'none'})
],
style = {
    'marginLeft': 'auto',
    'marginRight': 'auto',
    'width': '80%'
})


@app.callback(
    Output('table', 'dynamic'),
    [Input('table', 'currentPage'),
    Input('table', 'filters')])
@cache.memoize(timeout=5)
def update_data_store(currentPage, filters):
    ROWS = DF_GAPMINDER

    for f in filters:
        if f['active'] and 'value' in f:
            if f['value'] and f['comparison']:
                if f['comparison'] == 'is':
                    ROWS = ROWS[ROWS[f['filterKey']].isin([c['value'] for c in f['value']])]
                else:
                    ROWS = ROWS[~ROWS[f['filterKey']].isin([c['value'] for c in f['value']])]

    totalCount = len(ROWS)
    start = (currentPage - 1) * PAGE_SIZE
    end = start + PAGE_SIZE - 1
    if end > totalCount:
        start = 0
        end = PAGE_SIZE - 1
        currentPage = 1
    ROWS = ROWS.iloc[start:end, :]
    data = ROWS.to_dict('records')

    return {
        'currentPage': currentPage,
        'totalCount': totalCount,
        'data': data
    }


if __name__ == '__main__':
    app.run_server(debug=True)

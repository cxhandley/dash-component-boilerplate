# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class TableComponent(Component):
    """A TableComponent component.


Keyword arguments:
- id (string; optional): The ID used to identify this component in Dash callbacks
- currentPage (number; optional)
- dynamic (optional)
- perPage (number; optional)
- sortKeys (list; optional)
- extraColumns (list; optional)
- columns (list; optional)
- filters (list; optional)

Available events: """
    @_explicitize_args
    def __init__(self, id=Component.UNDEFINED, currentPage=Component.UNDEFINED, dynamic=Component.UNDEFINED, perPage=Component.UNDEFINED, sortKeys=Component.UNDEFINED, extraColumns=Component.UNDEFINED, columns=Component.UNDEFINED, filters=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'currentPage', 'dynamic', 'perPage', 'sortKeys', 'extraColumns', 'columns', 'filters']
        self._type = 'TableComponent'
        self._namespace = 'table_custom'
        self._valid_wildcard_attributes =            []
        self.available_events = []
        self.available_properties = ['id', 'currentPage', 'dynamic', 'perPage', 'sortKeys', 'extraColumns', 'columns', 'filters']
        self.available_wildcard_properties =            []

        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs
        args = {k: _locals[k] for k in _explicit_args if k != 'children'}

        for k in []:
            if k not in args:
                raise TypeError(
                    'Required argument `' + k + '` was not specified.')
        super(TableComponent, self).__init__(**args)

    def __repr__(self):
        if(any(getattr(self, c, None) is not None
               for c in self._prop_names
               if c is not self._prop_names[0])
           or any(getattr(self, c, None) is not None
                  for c in self.__dict__.keys()
                  if any(c.startswith(wc_attr)
                  for wc_attr in self._valid_wildcard_attributes))):
            props_string = ', '.join([c+'='+repr(getattr(self, c, None))
                                      for c in self._prop_names
                                      if getattr(self, c, None) is not None])
            wilds_string = ', '.join([c+'='+repr(getattr(self, c, None))
                                      for c in self.__dict__.keys()
                                      if any([c.startswith(wc_attr)
                                      for wc_attr in
                                      self._valid_wildcard_attributes])])
            return ('TableComponent(' + props_string +
                   (', ' + wilds_string if wilds_string != '' else '') + ')')
        else:
            return (
                'TableComponent(' +
                repr(getattr(self, self._prop_names[0], None)) + ')')

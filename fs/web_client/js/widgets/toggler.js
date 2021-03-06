'use strict';

App.widgets.Toggler = function(params, id, attributes) {
  var type = _.keys(params)[0];
  var params = params[type];
  var $el = null;
  var callback = null;

  var selectTmpl = _.template(`
    <select id="<%= id %>" ${attributes}>
      <% _.each(options, function(option) { %>
        <option><%= option %></option>
      <% }); %>
    </select>
  `);

  var checkboxTmpl = _.template(`<input id="<%= id %>" type="checkbox"/>`);
  
  this.early = function() {
    switch (type) {
    case 'select':
      return selectTmpl({
        'options': _.pluck(params, 0),
        'id': id
      });
      
    case 'checkbox':
      return checkboxTmpl({'id': id});
      
    default:
      throw 'unknown toggler: ' + type;
    }
  };

  this.later = function() {
    $el = $('#' + id);

    switch (type) {
      case 'select':
        var $items = _.object(
          _.pluck(params, 0),
          _.map(params, param => $(param[1]))
        );
        var $lastSelected = $items[params[0][0]];

        $lastSelected.show();
        
        $el.on('change', function() {
          var $selected = $items[$el.find(":selected").text()];

          if ($selected) {
            $lastSelected.hide();
            $lastSelected = $selected.show();

            if (callback) {
              callback($selected);
            }
          }
        });
        break;

      case 'checkbox':
        var $item = $(params);
        
        $el.on('click', function() {
          $item.toggle();
        });
    }
  };

  this.setCallback = function(callbackToSet) {
    callback = callbackToSet;
  };
};

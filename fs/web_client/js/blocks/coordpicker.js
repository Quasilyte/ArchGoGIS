'use strict';

App.blocks.coordpicker = function($el, params) {
  var $button = $('<i class="fa fa-map-marker"></i>');
  var $x = $(params.inputs[0]);
  var $y = $(params.inputs[1]);
  
  var map = App.page.get(params.map);
  
  $el.append($button);

  function updateInputValues(coords) {
    $x.val(coords[0]);
    $y.val(coords[1]);
  }

  function updatePlacemark() {
    updateInputValues(map.getCenter());
    map.updatePlacemark($el.prop('id'), map.getCenter(), {'draggable': true});
  }
  
  function createPlacemark() {
    updatePlacemark();
    
    map.onPlacemark($el.prop('id'), 'drag', function(event) {
      updateInputValues(event.get('target').geometry.getCoordinates());
    });

    // Следующие клики ставят отметку в отображаемый центр карты.
    $button.on('click', updatePlacemark);
  }
  
  $button.one('click', createPlacemark);
};

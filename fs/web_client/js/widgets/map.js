'use strict';

App.widgets.Map = function(params, id) {
  var tmpl =  _.template(`
    <div id="<%= id %>" style="width: 100%; height: 100%"></div>
  `);
                         
  var geo = {
    'kazan': [55.78, 49.13],
    'moscow': [55.76, 37.64]
  };
  var placemarks = {};
  var map = null;
  var eventsPool = {};
  var thisRef = this;

  params = $.extend({
    'center': geo.kazan,
    'zoom': 7,
    'controls': [
      'zoomControl',
      'searchControl',
      'typeSelector',
      'rulerControl'
    ]
  }, params);
  
  this.early = () => tmpl({'id': id});
  this.later = () => ymaps.ready(() => {
    map = new ymaps.Map(id, {
      'center': params.center,
      'zoom': params.zoom,
      'controls': params.controls
    });

    map.behaviors.disable('dblClickZoom');

    // Включаем отложенные подписки на события.
    _.each(eventsPool, function(callback, event) {
      map.events.add(event, callback);
    });
    eventsPool = null; // Больше нам не нужно их держать.

    if (params.placemarks) {
      $.each(params.placemarks, function(id, placemark) {
        thisRef.addPlacemark(placemark.coords, placemark.pref, placemark.opts);
      })
    }

    for (var type=1; type<=10; type++) {   //Добавляем в карту значки типов памятников
      for (var epoch=0; epoch<=7; epoch++) {   //Добавляем в карту значки типов памятников
        ymaps.option.presetStorage.add(`monType${type}_${epoch}`, {
          iconLayout: 'default#image',
          iconImageHref: `/web_client/img/monTypes/monType${type}_${epoch}.png`,
          iconImageSize: [12, 12],
          iconImageOffset: [-6, -6],
        })
      }
    }

    for (var i=1; i<=4; i++) {   //Добавляем в карту значки типов исследований
      ymaps.option.presetStorage.add(`resType${i}`, {
        iconLayout: 'default#image',
        iconImageHref: `/web_client/img/resTypes/resType${i}.png`,
        iconImageSize: [16, 16],
        iconImageOffset: [-8, -8],
      })
    }

    for (var i=1; i<=2; i++) {   //Добавляем в карту раскопов и шурфов типов исследований
      ymaps.option.presetStorage.add(`excType${i}`, {
        iconLayout: 'default#image',
        iconImageHref: `/web_client/img/excTypes/excType${i}.png`,
        iconImageSize: [12, 12],
        iconImageOffset: [-6, -6],
      })
    }

    ymaps.option.presetStorage.add(`heritage1`, {
      iconLayout: 'default#image',
      iconImageHref: `/web_client/img/heritage/heritage1.png`,
      iconImageSize: [12, 12],
      iconImageOffset: [-6, -6],
    })
  });

  this.center = function(coord, opts) {
    map.setCenter(coord, map.getZoom(), opts);
  };

  this.removePlacemark = function(id) {
    if (placemarks[id]) {
      map.geoObjects.remove(placemarks[id])
      delete placemarks[id];
    }
  };

  this.removeAll = function() {
    map.geoObjects.removeAll()
    placemarks = {};
  };

  this.onPlacemark = function(id, event, callback) {
    placemarks[id].events.add(event, callback);
  };

  this.addPlacemark = function(coord, prop, opts, id) {
    // https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/option.presetStorage-docpage/
    var placemark = new ymaps.Placemark(
      coord,
      prop, // Свойства отметки 
      opts
    );

    if (id) {
      placemarks[id] = placemark;
    }
    
    map.geoObjects.add(placemark);
  };

  this.updatePlacemark = function(id, coord, prop, opts) {
    if (placemarks[id]) {
      placemarks[id].geometry.setCoordinates(coord);
    } else {
      this.addPlacemark(coord, prop, opts, id);
    }
  };

  this.on = function(event, callback) {
    if (map) {
      map.events.add(event, callback);
    } else {
      // Не можем навесить событие до того, как будет создана карта.
      // Кладём подписку в очередь, биндить их будем позже.
      eventsPool[event] = callback;
    }
  };

  this.getCenter = () => map.getCenter();
};

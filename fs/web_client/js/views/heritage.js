'use strict';

App.views.heritage = new (Backbone.View.extend({
  "new": function(argument) {
    $("#container").tabs();
    var coordpicker = App.blocks.coordpicker;

    App.views.map();

    coordpicker($('#coord-picker'), {
      inputs: ['#heritage-x', '#heritage-y'],
      map: 'map'
    });

    $(".date-picker").datepicker({
      dateFormat: "dd.mm.yy"
    });

    var $heritageFile = $('#heritage-file-input');
    $heritageFile.change(App.fn.checkFileSize.bind($heritageFile, 50));

    var mapId = 1;
    $('#add-map-button').on('click', function(e) {
      var localMapId = mapId;
      var params = {
        mapId: localMapId
      }

      App.template.get("heritage/addSurveyMap", function(tmpl) {
        $('#add-map-button').before(tmpl(params));
        $(`#map${localMapId}`).tabs({active: $(this).attr("active")});

        $(".date-picker").datepicker({
          dateFormat: "dd.mm.yy"
        });

        $("[data-has-display]").trigger("change");

        App.views.functions.setAccordionHeader($(`#map-header-${localMapId}`));
      })

      App.template.get("heritage/stateTable", function(tmpl) {
        $(`#state${localMapId}`).append(tmpl(params));

        App.template.get("heritage/tableRow", function(tmpl) {
          var rows = $(`#map-table-${localMapId}`).find("tr:gt(0)");
          _.each(rows, function(row, id) {
            $(row).append(tmpl({rowNum: id}))
          })

          $(`#state${localMapId} .map-row-exist`).on("change", function() {
            var value = ($(this).val() == 0) ? true : false;
            $(this).parentsUntil("tbody").last().find(".map-table-row").prop("disabled", value)
          })
        })
        console.log($(`#map-own-type-selector-${localMapId}`))
        getDataForSelector($(`#map-own-type-selector-${localMapId}`), "OwnType");
        getDataForSelector($(`#map-disposal-type-selector-${localMapId}`), "DisposalType");
        getDataForSelector($(`#map-purpose-selector-${localMapId}`), "FunctionalPurpose");
        getDataForSelector($(`#map-availability-selector-${localMapId}`), "Availability");
        getDataForSelector($(`#map-usage-type-selector-${localMapId}`), "UsageType");
      });

      mapId++;
    });

    var photoId = 1;
    $('#add-photo-button').on('click', function(e) {
      var localPhotoId = photoId;
      var params = {
        photoId: localPhotoId
      }

      App.template.get("heritage/addPhoto", function(tmpl) {
        $('#add-photo-button').before(tmpl(params));

        $(".date-picker").datepicker({
          dateFormat: "dd.mm.yy"
        });

        getDataForSelector($(`#photo-view-selector-${localPhotoId}`), "CardinalDirection");
        App.views.functions.setAccordionHeader($(`#photo-header-${localPhotoId}`));
      })
      photoId++;
    });

    var $inputsWithDisplay = $("[data-has-display]");
    _.each($inputsWithDisplay, function(input, key) {
      $(input).on("change", function() {
        var inputId = $(this).attr("id");
        var inputVal;

        if ($(this).has("option").length) {
          inputVal = $(this).find("option:selected").text();
        } else {
          inputVal = $(this).val();
        }

        inputVal = inputVal || "Не указано";
        var displays = $(`[data-from=${inputId}]`);
        displays.text(inputVal);
      })
    })

    getDataForSelector($("#heritage-status-selector"), "HeritageStatus");
    getDataForSelector($("#heritage-security-type-selector"), "SecurityType");
    setSelectsEvents();

    $('#send-button').on('click', function() {
      if ( isValidForm() ) {
        postQuery("heritage");
      } else {
        alert('Недостаточно данных. Заполните все обязательные поля!');
      }
    });

    $('.btn-next').on('click', function(e) {
      $("#container").tabs({active: $(this).attr("active")});
    })
  },

  'show': function(arg) {
    const types       = _.uniq( _.pluck(arg.placemarks, 'type') ),
          mapInstance = App.views.map(types),
          map         = mapInstance.map,
          overlays    = mapInstance.overlayLayers;

    _.each(arg.placemarks, function(item) {
      const pathToIcon = `/web_client/img/${App.store.pathToIcons[item.type]}`;
      const icon = L.icon({
        iconUrl: `${pathToIcon}/${item.opts.preset}.png`,
        iconSize: [16, 16]
      });

      let marker = L.marker(L.latLng(item.coords[0], item.coords[1]), {
        icon: icon
      });

      marker.bindTooltip(item.pref.hintContent, {
        direction: 'top'
      });

      marker.on('mouseover', function(e) {
        this.openTooltip();
      });
      marker.on('mouseout', function(e) {
        this.closeTooltip();
      });
      marker.on('click', function(e) {
        location.hash = `${item.type}/show/${item.id}`
      });

      overlays[App.store.mapTypes[item.type]].addLayer(marker);
    });

    
    console.log(arg)
    _.each(arg.stateTables, function(table, id) {
      App.template.get("heritage/stateTable", function(tmpl) {
        $(`#state${id}`).append(tmpl({mapId: id}));

        var rows = $(`#map-table-${id}`).find("tr:gt(0)");
        _.each(rows, function(row, rowNum) {
          for (let i=0; i<5; i++) {
            $(row).append(`<td class="map-table-row">${table[rowNum][i]}</td>`)
          }
        })
      });
    })

    $(".tabs").tabs();
    App.views.functions.setAccordion(".accordion");
  }
}));
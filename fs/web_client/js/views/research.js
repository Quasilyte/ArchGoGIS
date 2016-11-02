'use strict';

App.views.research = new (App.View.extend({
  "show": function(argument) {
    App.views.functions.setAccordion("accordion");
  },

  "new": function(argument) {
    var counter = 1;
    var fmt = App.fn.fmt;
    var reportName;
    var reportYear;

    fillSelector($("#research-type-selector"), "ResearchType", "Аналитическое");
    setSelectsEvents();

    var fillResearchInputs = function() {
      if ($("#report-input-id").val()) {
        var year = reportYear
        var name = reportName + " - " + year;
      } else {
        var year = $("#research-year-input").val();
        var name = $("#report-name-input").val() + " - " + year;
      }

      $("#research-name-input").val(name);
    };

    $('#send-button').on('click', function() {
      fillResearchInputs();

      if ( validateCreatePages() ) {
        postQuery();
      } else {
        alert('Недостаточно данных. Заполните все обязательные поля!');
      }
    });

    var authorSelectHandler = function(event, ui) {
      $('#author-input-id').val(ui.item.id);

      App.models.Report.findByAuthorId(ui.item.id).then(function(reports) {
        $('#report-input').autocomplete({
          source: _.map(reports, function(report) {
            return {'label': fmt('$name ($year)', report), 'id': report.id, 'year': report.year, 'name': report.name}
          })
        });
      });

      $("#report-input").autocomplete({
        source: [],
        minLength: 0,
        select: function(event, ui) {
          reportName = ui.item.name;
          reportYear = ui.item.year;
          $("#report-input-id").val(ui.item.id);
        }
      }).focus(function() {
        $(this).autocomplete("search");
      });
    };

    var citySelectHandler = function(event, ui) {
      $('#report-city-input-id').val(ui.item.id);

      App.models.Org.findByCityId(ui.item.id).then(function(orgs) {
        $('#report-organization-input').autocomplete({
          source: _.map(orgs, function(org) {
            return {'label': org.name, 'id': org.id}
          })
        });
      });

      $("#report-organization-input").autocomplete({
        source: [],
        minLength: 0,
        select: function(event, ui) {
          $("#report-organization-input-id").val(ui.item.id);
        }
      }).focus(function() {
        $(this).autocomplete("search");
      });
    };

    var lastSelectedAuthorId = 0;
    $('#author-input').on('autocompleteselect', function(event, ui) {
      if (lastSelectedAuthorId != ui.item.id) {
        lastSelectedAuthorId = ui.item.id;
        authorSelectHandler(event, ui);
      }
    });

    var lastSelectedCityId = 0;
    $('#report-city-input').on('autocompleteselect', function(event, ui) {
      if (lastSelectedCityId != ui.item.id) {
        lastSelectedCityId = ui.item.id;
        citySelectHandler(event, ui);
      }
    });

    function addCoord (name, monId, id) {
      return $("<div>")
          .addClass("form-group")
          .append($("<label>")
            .attr("for", name+id)
            .text(`Координата ${name}`))
          .append($("<input>")
            .addClass("form-control")
            .attr({
              "id": `${name}-${monId}-${id}`,
              "data-for": `excdel${monId}del${id}:Excavation`,
              "type": "number",
              "name": name
            }))
    }

    function addExcName(monId, id) {
      return $("<div>")
        .addClass("form-group")
        .append($("<label>")
            .attr("for", `excavation-name-input-${id}`)
            .text(`Название ${id}`))
        .append($("<input>")
            .addClass("form-control")
            .attr({
              "id": `excavation-name-input-${id}`,
              "data-for": `excdel${monId}del${id}:Excavation`,
              "type": "text",
              "name": "name"
            }))
    }

    function addExcArea(monId, id) {
      return $("<div>")
        .addClass("form-group")
        .append($("<label>")
            .attr("for", `excavation-area-input-${id}`)
            .text(`Вскрытая площадь (м²)`))
        .append($("<input>")
            .addClass("form-control")
            .attr({
              "id": `excavation-area-input-${id}`,
              "data-for": `excdel${monId}del${id}:Excavation`,
              "type": "number",
              "name": "area"
            }))
    }

    function addNewCoords(btn, monId, counter) {
      var coords = $("<div>")
        .addClass("coords")
        .attr("id", `coord-picker-${monId}-${counter}`)
        .append(addCoord("x", monId, counter))
        .append(addCoord("y", monId, counter))

      btn.before(addExcName(monId, counter));
      btn.before(addExcArea(monId, counter));
      btn.before(coords);

      var coordpicker = App.blocks.coordpicker;
      coordpicker($(`#coord-picker-${monId}-${counter}`), {
        inputs: [`#x-${monId}-${counter}`, `#y-${monId}-${counter}`],
        map: 'map'
      }, `${monId}-${counter}`);
    }

    var monId = 1;
    $('#add-monument-button').on('click', function(e) {
      var newMonument = $(`
      <h4 class="accordion-header" id="monument-header-${monId}">
        <span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>
        Памятник №${monId}
      </h4>
      <div class="accordion-content">
        <div class="checkbox">
          <label for="new-monument-checkbox-${monId}">
            <input id="new-monument-checkbox-${monId}" type="checkbox" dynamic="true"></input>
            Добавить новый памятник
          </label>
        </div>
        <div class="form-group" toggle-by="new-monument-checkbox-${monId}" need-option="false">
          <label>Выбрать существующий памятник <span class="required">*</span></label>
          <!-- <%= widget("SearchLine", monInputOptions, "monument-input-${monId}") %> -->
          <input class="form-control" id="monument-input-${monId}"></input>
          <input id="monument-input-id-${monId}" data-for="mdel${monId}:Monument" hidden type="id" name="id" data-req="up"></input>
        </div>

        <div class="form-group" toggle-by="new-monument-checkbox-${monId}" need-option="true">
          <input id="monument-tmp-input-${monId}" value="Костыль" hidden data-for="mdel${monId}:Monument" type="text" name="tmp"></input>
        </div>
        <div class="form-group">
          <label>Название памятника <span class="required">*</span></label>
          <input class="form-control" id="monument-name-input-${monId}" data-for="kdel${monId}:Knowledge" type="text" name="monument_name" data-req></input>
        </div>
        <div class="form-group">
          <label>Описание памятника</label>
          <textarea class="form-control" id="monument-desc-input-${monId}" data-for="kdel${monId}:Knowledge" type="text" name="description"></textarea>
        </div>
        <div class="form-group" toggle-by="new-monument-checkbox-${monId}" need-option="true">
          <label for="epoch-selector-${monId}">Эпоха</label>
          <select class="form-control" id="epoch-selector-${monId}" data-for="edel${monId}:Epoch" type="id" name="id"></select>
        </div>
        <div class="form-group" toggle-by="new-monument-checkbox-${monId}" need-option="true">
          <label for="mon-type-selector-${monId}">Тип</label>
          <select class="form-control" id="mon-type-selector-${monId}" data-for="mtdel${monId}:MonumentType" type="id" name="id"></select>
        </div>

        <div class="checkbox">
          <label for="new-culture-checkbox">
            <input id="new-culture-checkbox" type="checkbox" dynamic="true"></input>
            Добавить новую культурную принадлежность
          </label>
        </div>
        <div class="form-group" toggle-by="new-culture-checkbox" need-option="false">
          <label for="culture-selector-${monId}">Культура</label>
          <select class="form-control" id="culture-selector-${monId}" data-for="cdel${monId}:Culture" type="id" name="id"></select>
        </div>
        <div class="form-group" toggle-by="new-culture-checkbox" need-option="true">
          <label for="culture-input-${monId}">Введите культурную принадлежность</label>
          <input id="culture-input-${monId}" data-for="cdel${monId}:Culture" type="text" name="name" class="form-control" />
        </div>

        <div id="coord-picker-${monId}" class="coords">
          <div class="form-group">
            <label for="monument-x-${monId}">
              Координата x
            </label>
            <input class="form-control" id="monument-x-${monId}" data-for="kdel${monId}:Knowledge" type="number" name="x"></input>
          </div>
          <div class="form-group">
            <label for="monument-y-${monId}">
              Координата y
            </label>
            <input class="form-control" id="monument-y-${monId}" data-for="kdel${monId}:Knowledge" type="number" name="y"></input>
          </div>
        </div>
        <br>
        <div class="form-group">
          <h4 for="report-input">Археологические вскрытия:</h4>
        </div>
      </div>
      `);

      $(this).before(newMonument);
      fillSelector($(`#epoch-selector-${monId}`), "Epoch");
      fillSelector($(`#culture-selector-${monId}`), "Culture");
      fillSelector($(`#mon-type-selector-${monId}`), "MonumentType");
      setSelectsEvents();

      var coordpicker = App.blocks.coordpicker;
      coordpicker($('#coord-picker-'+monId), {
        inputs: ['#monument-x-'+monId, '#monument-y-'+monId],
        map: 'map'
      }, monId);

      $(`#monument-header-${monId}`).next().append(`
        <button id="add-exc-button-${monId}" class="btn btn-primary">
          <i class="fa fa-cogs"></i>
          Добавить раскоп
        </button>
      `);

      (function () {
        var counter = counter || 1;
        var localMonId = monId;
        $(`#add-exc-button-${localMonId}`).on('click', function(e) {
          console.log(localMonId);
          addNewCoords($(this), localMonId, counter++)
        })
      })();

      var lastSelectedMonId = 0;
      $(`#monument-input-${monId}`).on('autocompleteselect', function(event, ui) {
        if (lastSelectedMonId != ui.item.id) {
          lastSelectedMonId = ui.item.id;
          (function(event, ui) {
            $(`#monument-input-id-${monId}`).val(lastSelectedMonId);
          })();
        }
      });
      $(`#monument-input-${monId}`).autocomplete({
        source: function(request, response) {
          var monuments = [];

          App.models.Monument.findByNamePrefix(request.term)
            .then(function(data) {
              console.log(data);
              if (data && !data.error) {
                response(_.map(data, function(row) {
                  return {'label': `${row[1]} (${row[3]}, ${row[2]})`, 'id': row[0]}
                }))
              } else {
                response();
              }
            });
        },
        minLength: 3,
        select: function(event, ui) {
          $(`#monument-input-id-${monId}`).val(ui.item.id);
        }
      }).focus(function(){
        $(this).autocomplete("search");
      });

      App.views.functions.setAccordionHeader($(`#monument-header-${monId}`));
      monId++;
    });

    var excCounter = 1;
    $("#add-exc-button-0").on('click', function(e) {
      addNewCoords($(this), 0, excCounter++)
    })

    $('#add-exc-button').trigger("click");

    $('.btn-next').on('click', function(e) {
      $("#container").tabs({active: $(this).attr("active")});
    })

    $("#container").tabs();
  }
}))

'use strict';

// Контейнеры
window.App = {
  'widgets': {},
  'blocks': {},
  'controllers': {},
  'models': {},
  'views': {},
  'fn': {}
};


const HOST_URL = `${location.protocol}//${location.host}`;

const modal = $('#modalWindow');
modal.easyModal({
  top: 200,
  overlay: 0.4,
  overlayClose: false,
  closeOnEscape: false
});

$('#modalWindow a').on('click', (e) => {
  modal.trigger('closeModal');
});

function setSelectsEvents() {
  let selects = $("[dynamic=true]");

  $.each(selects, (key, select) => {
    const obj = $(select);
    obj.on("change", () => { showField(obj) });
    obj.trigger("change");
  })
}

function showField(select) {
  let selectName = select.attr("id");
  const dynamicFields = $(`[toggle-by=${selectName}]`);
  let selectedValue = "";

  if (select.attr("type") === "checkbox") {
    selectedValue = (select.is(":checked")) ? "true" : "false";
  } else {
    selectedValue = select.find("option:selected").val();
  }

  let requiredOptions, obj;

  $.each(dynamicFields, (key, field) => {
    obj = $(field);
    requiredOptions = obj.attr("need-option").split(".");

    if ($(select).is("[used!=false]") === true && $.inArray(selectedValue, requiredOptions) !== -1) {
      obj.show().attr("used", true);
      obj.contents().attr("used", true);
      obj.contents().contents().attr("used", true);
    } else {
      obj.hide().attr("used", false);
      obj.contents().attr("used", false);
      obj.contents().contents().attr("used", false);
    }

    if (obj.has("[type='checkbox']").length > 0) {
      const checkbox = obj.find("[type='checkbox']");
      checkbox.prop("checked", false);
      checkbox.trigger("change");
    }

    if (obj.has("select").length > 0) {
      $(obj.find("select")).trigger("change");
    }
  })
}

function postQuery(objectId) {
  let iconButton = loading();

  let json = generateJson([
    ["Research", "Author", "hasauthor"],
    ["Research", "Coauthor", "hascoauthor"],
    ["Research", "Knowledge", "has"],
    ["Research", "ResearchType", "has"],
    ["Knowledge", "Monument", "belongsto"],
    ["Knowledge", "Artifact", "found"],
    ["Knowledge", "Culture", "has"],
    ["Research", "Excavation", "has"],
    ["Monument", "Excavation", "has"],
    ["Monument", "Complex", "has"],
    ["Monument", "Epoch", "has"],
    ["Monument", "MonumentType", "has"],
    ["Monument", "SpatialReference", "has"],
    ["ClarifyMon", "SpatialReference", "has"],
    ["SpatialReference", "SpatialReferenceType", "has"],
    ["Knowledge", "monumentImage", "has"],
    ["Knowledge", "monumentTopo", "hastopo"],
    ["Heritage", "Monument", "has"],
    ["Heritage", "HeritageStatus", "has"],
    ["Heritage", "SecurityType", "has"],
    ["Heritage", "SurveyMap", "has"],
    ["Heritage", "Image", "has"],
    ["Heritage", "heritageTopo", "hastopo"],
    ["Heritage", "HerSpatRef", "has"],
    ["HerSpatRef", "HerSpatRefType", "has"],
    ["Research", "Publication", "has"],
    ["Research", "Report", "has"],
    ["Research", "Image", "has"],
    ["Complex", "Artifact", "has"],
    ["Complex", "Excavation", "has"],
    ["Excavation", "Artifact", "has"],
    ["Excavation", "ExcSpatRef", "has"],
    ["ExcSpatRef", "ExcSpatRefType", "has"],
    ["Report", "Author", "hasauthor"],
    ["Report", "Coauthor", "hascoauthor"],
    ["Publication", "Author", "hasauthor"],
    ["Publication", "Coauthor", "hascoauthor"],
    ["Publication", "PublicationType", "has"],
    ["Publication", "EditionType", "has"],
    ["Publication", "City", "in"],
    ["Author", "AuthorImage", "has"],
    ["Artifact", "ArtifactCategory", "has"],
    ["Artifact", "ArtifactMaterial", "has"],
    ["Artifact", "Interpretation", "has"],
    ["Artifact", "ArtiSpatRef", "has"],
    ["ArtiSpatRef", "ArtiSpatRefType", "has"],
    ["Research", "Interpretation", "has"],
    ["Interpretation", "DateScale", "has"],
    ["Interpretation", "ArtifactImage", "has"],
    ["Interpretation", "artiImage", "has"],
    ["Interpretation", "artiCulture", "has"],
    ["Collection", "StorageInterval", "has"],
    ["Artifact", "StorageInterval", "has"],
    ["Heritage", "File", "has"],
    ["Organization", "City", "has"],
    ["collOrg", "collCity", "has"],
    ["Collection", "collOrg", "in"],
    ["Report", "Organization", "in"],
    ["SurveyMap", "OwnType", "has"],
    ["SurveyMap", "DisposalType", "has"],
    ["SurveyMap", "FunctionalPurpose", "has"],
    ["SurveyMap", "Availability", "has"],
    ["SurveyMap", "UsageType", "has"],
    ["Image", "CardinalDirection", "has"],
    ["monumentImage", "CardinalDirection", "has"]
  ]);

  let formdata = new FormData();

  const files = $('input[type=file][used!=false]');
  let uploadedFilesCounter = 0;

  let defer = $.Deferred();

  _.each(files, (element, index) => {
    if (element.files[0]) {
      let datafor = $(element).attr("data-for");
      let name = $(element).attr("name");

      uploadFile(element.files[0]).then(function(key) {
        if (!json[datafor]) {
          json[datafor] = {};
        }

        json[datafor][`${name}/text`] = key;

        if (++uploadedFilesCounter === files.length) {
          defer.resolve();
        }
      });
    } else if (++uploadedFilesCounter === files.length) {
      defer.resolve();
    }
  });

  if (files.length === 0) {
    defer.resolve();
  }

  $.when(defer).done(() => {
    console.log(json);

    _.each(json, (val, key) => {
      formdata.append(key, JSON.stringify(val));
    });

    $.ajax({
      url: "/hquery/upsert",
      data: formdata,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
      },
      type: "POST",
      processData: false,
      contentType: false,
      success: (response) => {
        console.log('upsert: ' + response);
        loading(iconButton);

        if (response.length == 4) {
          alert('При обработке данных на сервере произошла ошибка' + response);
        } else {
          $('#toObject').attr('href', location.hash.replace(/new\w*/g, 'show/') + JSON.parse(response)[objectId]);
          modal.trigger('openModal');
        }
      }
    });
  });
}

/**
 * Отображение процесса выполнения запроса.
 * Предполагается запуск ф-ии 2 раза,
 * чтобы она корректно отработала.
 * Первый запуск проводится без аргумента,
 * меняет иконку на кнопке на загрузочную, возвращает DOM-элемент.
 * При втором запуске этот DOM-элемент передаётся
 * как аргумент и возвращается на своё место.
 * 
 * @param {Object} load
 * @returns {Object} DOM-element in previous state of button
 */
function loading(load) {
  const template = '<i class="fa fa-spinner fa-pulse fa-fw"></i>';
  const icon = $('#send-button i');
  let saveTmpl;

  if (load) {
    icon.parent().removeProp('disabled');
    icon.replaceWith(load);
  } else {
    icon.parent().prop('disabled', true);
    saveTmpl = icon.get(0);
    icon.replaceWith(template);
  }

  return saveTmpl;
};

function generateJson(relations) {
  let type, json = {};
  const inputs = $("[data-for][used!=false]");
  let $input, dataFor, dataType, name, value, inputName, counter, inputTag, 
      inputClass, inputSubclass, inputObjName, dataForLayer, group, objs = {};

  $.each(inputs, (key, input) => {
    $input = $(input);
    dataFor = $input.attr("data-for");
    group = $input.attr("data-group");
    dataType = $input.attr("data-type") || $input.attr("type");
    type = (dataType != "id" && dataType != "table") ? ("/" + dataType) : "";
    name = ($input.attr("data-name") || $input.attr("name")) + type;
    value = $input.attr("data-value") || $input.val().replace(/\n/g, "\\n");
    inputTag = dataFor.split(":")[0];
    inputClass = dataFor.split(":")[1];
    inputSubclass = $input.attr("data-subclass") || inputClass;

    if (!(value || $input.is("table")) || ($input.attr("type") == "radio" && $input.is(":checked") == false)) {
      return true;
    }

    objs[inputSubclass] = objs[inputSubclass] || [];

    if ($input.attr("data-few")) {
      value = value.split(",")
      counter = 0;

      _.each(value, function(val) {
        inputObjName = dataFor.split(":")[0]+"_"+counter;
        objs[inputSubclass].push(inputObjName);
        json[inputObjName+":"+inputClass] = {};
        json[inputObjName+":"+inputClass]["id"] = val;
        counter++;
      });
    } else {
      if ($input.is("table")) {
        let $rows = $input.find("tbody > tr");
        let data = [];

        _.each($rows, function(row, rowNum) {
          let selects = $(row).find("select")
          data[rowNum] = [];
          _.each(selects, function(select, key) {
            data[rowNum][key] = $(select).val();
          })
        })
        
        value = JSON.stringify(data).replace(/\"/g, "\'");
      }

      let layers = (group) ? $(`div[data-group-layer = ${group}]`).length : 0;

      do {
        inputObjName = (layers) ? `${inputTag}_${layers}` : inputTag;
        dataForLayer = (layers) ? `${inputObjName}:${inputClass}` : dataFor;
        json[dataForLayer] = json[dataForLayer] || {};
        
        if (type != "/file") {
          json[dataForLayer][name] = value;
        }

        objs[inputSubclass].push(inputObjName);
      } while (--layers > 0)
    }
  })
  
  let fewRelations = {};
  _.each($("[data-custom-relations]"), function(obj, i) {
    let parts = $(obj).attr("data-custom-relations").split(":");
    fewRelations[parts[0]] = parts[1];
  })

  _.each(relations, (relation) => {
    if (objs[relation[0]]) {
      objs[relation[0]] = $.unique(objs[relation[0]]);
    }

    _.each(objs[relation[0]], (objName, id) => {
      const allNames = _.uniq(objs[relation[1]]);

      if (objs[relation[1]]) {
        _.each(allNames, (name, id) => {
          let objId1 = objName.split("_")[1];
          let objId2 = name.split("_")[1];
          let layer1 = objName.split("_")[2] || "";
          let layer2 = name.split("_")[2] || "";

          if ((fewRelations[objName] == relation[1]) || (fewRelations[name] == relation[0])) {
            let needRelation = false;

            if (typeof fewRelations[name] != 'undefined') {
              needRelation = $(`input[data-relation-for = "${name}"][data-relation-with = "${objName}"]`).is(":checked");
            } else {
              needRelation = $(`input[data-relation-for = "${objName}"][data-relation-with = "${name}"]`).is(":checked");
            }

            if (needRelation) {
              json[`${objName}__${relation[2]}__${name}`] = {};
            }

          } else if ((!(objId1 && objId2) || (objId1 === objId2)) && (!(layer1 && layer2) || (layer1 === layer2))) {
            json[`${objName}__${relation[2]}__${name}`] = {};
          }
        })
      }
    })
  })

  return json;
}


function fillSelector(selector, data, notLike) {
  $.each(data, (id, row) => {
    if (row.name != notLike) {
      $("<option></option>")
        .text(row.name)
        .val(row.id)
        .appendTo(selector);
    }
  })
  selector.trigger("change");
}

function getDataForSelector(selector, dataType, notLike) {
  let query = {};
  notLike = notLike || "";

  if (App.store.selectData[dataType]) {
    fillSelector(selector, App.store.selectData[dataType], notLike);
  } else {
    query[`rows:${dataType}`] = {"id": "*", "select": "*"};
    query = JSON.stringify(query);

    $.post({
      url: "/hquery/read",
      data: query,
      success: (response) => {
        const data = JSON.parse(response);
        App.store.selectData[dataType] = data.rows;
        fillSelector(selector, data.rows, notLike);
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
      }
    });
  }
}

/**
 * Загрузка файла на сервер.
 * 
 * @param {Object} file
 * @returns {Promise} async request
 */
function uploadFile (file) {
  return new Promise((resolve, reject) => {
    let data = new FormData();
    data.append('key', file, file.name);

    $.ajax({
      url: "/pfs/save",
      data: data,
      type: "POST",
      dataType: 'json',
      processData: false,
      contentType: false,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
      },
      success: (response) => {
        resolve(response.key);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}


function isValidForm () {
  let isValid = true;
  const inputs = $('.content input[data-req][used!=false]');

  inputs.removeClass('error-input');
  inputs.prev().removeClass('error-input');

  _.each(inputs, function(input) {
    const $input = $(input);

    $input.blur(function() {
      const $this = $(this);
      if ( !$this.val() ) {
        if ($input.attr('data-req') == 'up') {
          $input.prev().addClass('error-input');
        } else {
          $this.addClass('error-input');
        }
        isValid = false;
      }
    });
  });

  inputs.blur();
  return isValid;
}

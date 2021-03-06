'use strict';

App.controllers.culture = new (Backbone.View.extend({
  'show': function() {
    App.url.setMapping(['id', "mod"]);
    var cId = App.url.get('id');
    var tmplData = {};
    var data = [];
    var model = App.models.fn;

    var queries = {
      complex: {
        researches: JSON.stringify({
          "culture:Culture": {"id": cId},
          "researches:Research": {"id": "*", "select": "*", "options":"uniq"},
          "knowledges:Knowledge": {"id": "*"},
          "researches__knowledges": {},
          "culture__knowledges": {},
        }),
        monuments: JSON.stringify({
          "culture:Culture": {"id": cId},
          "monuments:Monument": {"id": "*", "select": "*", "options":"uniq"},
          "knowledges:Knowledge": {"id": "*"},
          "monuments__knowledges": {},
          "culture__knowledges": {},
        }),
        cultKnow: JSON.stringify({
          "culture:Culture": {"id": cId},
          "cultKnow:CultureKnowledge": {"id": "*", "select": "*"},
          "culture__cultKnow": {},
        }),
        carbon: JSON.stringify({
          "culture:Culture": {"id": cId},
          "k:Knowledge": {"id": "*"},
          "carbonMaterial:CarbonMaterial": {"id": "*", "select": "*"},
          "carbon:Radiocarbon": {"id": "*", "select": "*"},
          "carSpatref:SpatialReference": {"id": "*", "select": "*"},
          "carSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "k__culture": {},
          "k__has__carbon": {},
          "carbon__carbonMaterial": {},
          "carbon__has__carSpatref": {},
          "carSpatref__has__carSpatrefT": {}
        })
      },

      single: {
        culture: JSON.stringify({
          "culture:Culture": {"id": cId, "select": "*"},
        }),
        epoch: JSON.stringify({
          "culture:Culture": {"id": cId},
          "epoch:Epoch": {"id": "*", "select": "*"},
          "culture__epoch": {},
        }),
        excavations: JSON.stringify({
          "culture:Culture": {"id": cId},
          "knowledges:Knowledge": {"id": "*"},
          "excavations:Excavation": {"id": "*", "select": "*", "options":"uniq"},
          "culture__knowledges": {},
          "excavations__knowledges": {},
        }),
        artifacts: JSON.stringify({
          "culture:Culture": {"id": cId},
          "inter:Interpretation": {"id": "*"},
          "artifacts:Artifact": {"id": "*", "select": "*", "options":"uniq"},
          "culture__inter": {},
          "artifacts__inter": {},
        }),
      },

      researches: {
        authors: JSON.stringify({
          "researches:Research": {"id": "NEED"},
          "authors:Author": {"id": "*", "select": "*"},
          "researches__hasauthor__authors": {},
        }),
        resTypes: JSON.stringify({
          "researches:Research": {"id": "NEED"},
          "resType:ResearchType": {"id": "*", "select": "*"},
          "researches__has__resType": {},
        }),
        resMonuments: JSON.stringify({
          "researches:Research": {"id":"NEED"},
          "knowledges:Knowledge": {"id": "*"},
          "resMonuments:Monument": {"id": "*", "select": "*"},
          "knowledges__belongsto__resMonuments": {},
          "researches__has__knowledges": {},
        }),
        excavations: JSON.stringify({
          "researches:Research": {"id":"NEED"},
          "excavations:Excavation": {"id": "*", "select": "*"},
          "researches__has__excavations": {},
        }),
        excSpatref: JSON.stringify({
          "researches:Research": {"id":"NEED"},
          "excavations:Excavation": {"id": "*"},
          "excSpatref:SpatialReference": {"id": "*", "select": "*"},
          "excSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "excavations__has__excSpatref": {},
          "excSpatref__has__excSpatrefT": {},
          "researches__has__excavations": {},
        })
      },

      monuments: {
        monTypes: JSON.stringify({
          "monuments:Monument": {"id": "NEED"},
          "monTypes:MonumentType": {"id": "*", "select": "*"},
          "monuments__monTypes": {},
        }),
        knowledges: JSON.stringify({
          "a:Author": {"id": "*"},
          "r:Research": {"id": "*"},
          "m:Monument": {"id": "NEED"},
          "knowledges:Knowledge": {"id": "*", "select": "*"},
          "knowledges__belongsto__m": {},
          "r__has__knowledges": {},
          "r__hasauthor__a": {}
        }),

        epochs: JSON.stringify({
          "m:Monument": {"id": "NEED"},
          "epochs:Epoch": {"id": "*", "select": "*"},
          "m__has__epochs": {}
        }),

        monTypes: JSON.stringify({
          "m:Monument": {"id": "NEED"},
          "monTypes:MonumentType": {"id": "*", "select": "*"},
          "m__has__monTypes": {}
        }),

        monSpatref: JSON.stringify({
          "monument:Monument": {"id": "NEED"},
          "monSpatref:SpatialReference": {"id": "*", "select": "*"},
          "monSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "monument__has__monSpatref": {},
          "monSpatref__has__monSpatrefT": {}
        }),
      },

      cultKnow: {
        dateScale: JSON.stringify({
          "cultKnow:CultureKnowledge": {"id": "NEED"},
          "dateScale:DateScale": {"id": "*", "select": "*"},
          "cultKnow__dateScale": {},
        }),
        researchesCult: JSON.stringify({
          "cultKnow:CultureKnowledge": {"id": "NEED"},
          "research:Research": {"id": "*", "select": "*"},
          "resType:ResearchType": {"id": "*", "select": "*"},
          "author:Author": {"id": "*", "select": "*"},
          "research__cultKnow": {},
          "research__has__resType": {},
          "research__hasauthor__author": {},
        }),
      },

      carbon: {
        carbonSpatref: JSON.stringify({
          "carbon:Radiocarbon": {"id": "NEED"},
          "carSpatref:SpatialReference": {"id": "*", "select": "*"},
          "carSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "carbon__has__carSpatref": {},
          "carSpatref__has__carSpatrefT": {}
        }),
        carbonExcSpatref: JSON.stringify({
          "carbon:Radiocarbon": {"id": "NEED"},
          "exc:Excavation": {"id": "*"},
          "carExcSpatref:SpatialReference": {"id": "*", "select": "*"},
          "carExcSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "exc__has__carbon": {},
          "exc__has__carExcSpatref": {},
          "carExcSpatref__has__carExcSpatrefT": {}
        }),
        carbonMonSpatref: JSON.stringify({
          "carbon:Radiocarbon": {"id": "NEED"},
          "know:Knowledge": {"id": "*"},
          "mon:Monument": {"id": "*"},
          "carMonSpatref:SpatialReference": {"id": "*", "select": "*"},
          "carMonSpatrefT:SpatialReferenceType": {"id": "*", "select": "*"},
          "know__has__carbon": {},
          "know__belongsto__mon": {},
          "mon__has__carMonSpatref": {},
          "carMonSpatref__has__carMonSpatrefT": {}
        }),
      }
    }

    var render = function() {
      _.each(data, function(val, id) {
        _.extend(tmplData, val);
      })
      console.log(tmplData);

      tmplData.placemarks = [];

      let resPlacemarks = App.controllers.fn.getResPlacemarks(tmplData);
      let carPlacemarks = App.controllers.fn.getCarPlacemarks(tmplData);
      let monPlacemarks = App.controllers.fn.getMonPlacemarks(tmplData);

      tmplData.placemarks = _.union(tmplData.placemarks, resPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, carPlacemarks);
      tmplData.placemarks = _.union(tmplData.placemarks, monPlacemarks);

      App.page.render("culture/show", tmplData, tmplData.placemarks)
    };

    var queryCounter = _.reduce(queries, (memo, obj) => { return memo + _.size(obj) }, 0);

    var callRender = _.after(queryCounter, render);

    _.each(queries.complex, function(query, key) {
      let limit = (key === "researches") ? 5000 : 500;

      $.when(model.sendQuery(query, limit)).then(function(response) {
        _.extend(tmplData, response);

        var ids = _.map(tmplData[key], function(obj) {return obj.id.toString()});

        data.push(model.getData(queries[key], callRender, true, ids));
        
        callRender();
      })
    })

    data.push(model.getData(queries.single, callRender));
  },
}));
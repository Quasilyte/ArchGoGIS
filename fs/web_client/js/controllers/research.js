'use strict';


App.controllers.research = new (Backbone.View.extend({
  'new': function() {
    App.page.render('research', {
      'authorsInputOptions': {
        'source': App.models.Author.findByNamePrefix,
        'etl': function(authors) {
          return _.map(authors, author => ({'id': author.id, 'label': author.name}));
        }
      },
      'citiesInputOptions': {
        'source': App.models.City.findByNamePrefix,
        'etl': function(cities) {
          return _.map(cities, city => ({'id': city.id, 'label': city.name}));
        }
      }
    })
  },

  'show': function() {
    App.url.setMapping(['id']);
    var resId = App.url.get("id");
    var tmplData = {};
    var data = [];
    var model = App.models.fn;

    var queries = {
      complex: {
        monuments: JSON.stringify({
          "research:Research": {"id": resId},
          "knowledges:Knowledge": {"id": "*", "select": "*"},
          "monuments:Monument": {"id": "*", "select": "*"},
          "research__has__knowledges": {},
          "knowledges__belongsto__monuments": {},
        })
      },

      single: {
        research: JSON.stringify({
          "research:Research": {"id": resId, "select": "*"},
        }),
        author: JSON.stringify({
          "research:Research": {"id": resId},
          "author:Author": {"id": "*", "select": "*"},
          "research__hasauthor__author": {},
        }),
        coauthors: JSON.stringify({
          "research:Research": {"id": resId},
          "coauthors:Author": {"id": "*", "select": "*"},
          "research__hascoauthor__coauthors": {},
        }),
        resType: JSON.stringify({
          "research:Research": {"id": resId},
          "resType:ResearchType": {"id": "*", "select": "*"},
          "research__has__resType": {},
        }),
        report: JSON.stringify({
          "research:Research": {"id": resId},
          "author:Author": {"id": "*"},
          "reports:Report": {"id": "*", "select": "*"},
          "reports__hasauthor__author": {},
          "research__has__reports": {}
        }),
        usedArtifacts: JSON.stringify({
          "research:Research": {"id": resId},
          "usedArtifacts:Artifact": {"id": "*", "select": "*"},
          "research__used__usedArtifacts": {}
        })
      },

      monument: {
        epochs: JSON.stringify({
          "monuments:Monument": {"id": "NEED"},
          "epoch:Epoch": {"id": "*", "select": "*"},
          "monuments__has__epoch": {},
        }),
        monTypes: JSON.stringify({
          "monument:Monument": {"id": "NEED"},
          "monType:MonumentType": {"id": "*", "select": "*"},
          "monument__has__monType": {},
        }),
        excavations: JSON.stringify({
          "m:Monument": {"id": "NEED"},
          "r:Research": {"id": resId},
          "exc:Excavation": {"id": "*", "select": "*"},
          "m__has__exc": {},
          "r__has__exc": {}
        }),
        heritages: JSON.stringify({
          "monument:Monument": {"id": "NEED"},
          "heritage:Heritage": {"id": "*", "select": "*"},
          "heritage__has__monument": {}
        })
      },

      knowledge: {
        cultures: JSON.stringify({
          "knowledges:Knowledge": {"id": "NEED"},
          "cultures:Culture": {"id": "*", "select": "*"},
          "knowledges__has__cultures": {},
        }),
        artifacts: JSON.stringify({
          "knowledge:Knowledge": {"id": "NEED"},
          "artifacts:Artifact": {"id": "*", "select": "*"},
          "knowledge__found__artifacts": {}
        }),
        topos: JSON.stringify({
          "knowledge:Knowledge": {"id": "NEED"},
          "topo:Image": {"id": "*", "select": "*"},
          "knowledge__hastopo__topo": {}
        }) 
      }
    }

    var render = function() {
      _.each(data, function(val, id) {
        _.extend(tmplData, val);
      })
      console.log(tmplData);

      var type = (tmplData.resType[0] && tmplData.resType[0].id) ? tmplData.resType[0].id : 1;
      tmplData.placemarks = [];
      _.each(tmplData.knowledges, function(k, kid) {

        tmplData.placemarks.push({
          coords: [k.x, k.y],
          pref: {
            hintContent: k.monument_name
          },
          opts: {
            preset: `resType${type}`
          }
        })
      })

      _.each(tmplData.excavations, function(resExc, resId) {
        _.each(resExc, function(exc, excId) {
          var type = (exc.area <= 20) ? 1 : 2;
          tmplData.placemarks.push({
            coords: [exc.x, exc.y],
            pref: {
              hintContent: exc.name,
            },
            opts: {
              preset: `excType${type}`
            }
          })
        })
      })

      App.page.render('research/show', tmplData)
    };

    var queryCounter = _.reduce(queries, function(memo, obj) {
      return memo + _.size(obj)
    }, 0)

    var callRender = _.after(queryCounter, render);

    $.when(model.sendQuery(queries.complex.monuments)).then(function(response) {
      _.extend(tmplData, response);

      var monumentIds = _.map(tmplData.monuments, function(mon) {return mon.id.toString()});
      var knowledgeIds = _.map(tmplData.knowledges, function(know) {return know.id.toString()});

      data.push(model.getData(queries.monument, callRender, true, monumentIds));
      data.push(model.getData(queries.knowledge, callRender, true, knowledgeIds));
      callRender();
    })

    data.push(model.getData(queries.single, callRender));
  }
}));

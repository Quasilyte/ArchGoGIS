'use strict';

App.views.bigSearch = new (Backbone.View.extend({
  'index': function() {
    const prefix = App.locale.getLang() === 'ru' ? '' : `${App.locale.getLang()}_`;

    let queries = {
      author: {
        "main": {
          "author:Author": {"id": "*", "select": "*"},
        },
        "mainSpatref": {
          "author:Author": {"id": "*", "select": "*"},
        },
        "author-name": {
          "author:Author": {"id": "*", "select": "*", "filter": "name=VALUEPLACE=text"},
        },
        "author-job": {
          "job_IDPLACE:AuthorJob": {"id": "*"},
          "org_IDPLACE:Organization": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "job_IDPLACE__author": {},
          "job_IDPLACE__org_IDPLACE": {},
        },

        "artifact-category": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "cat_IDPLACE:ArtifactCategory": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "cat_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-culture": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "cult_IDPLACE:Culture": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "cult_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-material": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "mat_IDPLACE:ArtifactMaterial": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "mat_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-name": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-photo-before": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dataLess"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "photo_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-photo-after": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dataMore"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "photo_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-found-after": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "year=VALUEPLACE=more"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-found-before": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "year=VALUEPLACE=less"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
        },

        "excavation-area-more": {
          "research_IDPLACE:Research": {"id": "*"},
          "exc_IDPLACE:Excavation": {"id": "*", "filter": "area=VALUEPLACE=more"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__exc_IDPLACE": {},
        },
        "excavation-area-less": {
          "research_IDPLACE:Research": {"id": "*"},
          "exc_IDPLACE:Excavation": {"id": "*", "filter": "area=VALUEPLACE=less"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__exc_IDPLACE": {},
        },
        "excavation-obj-name": {
          "research_IDPLACE:Research": {"id": "*"},
          "exc_IDPLACE:Excavation": {"id": "*"},
          "obj_IDPLACE:Complex": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__exc_IDPLACE": {},
          "obj_IDPLACE__exc_IDPLACE": {},
        },
        "excavation-boss-name": {
          "research_IDPLACE:Research": {"id": "*"},
          "exc_IDPLACE:Excavation": {"id": "*", "filter": "boss=VALUEPLACE=text"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__exc_IDPLACE": {},
        },

        "research-after": {
          "research_IDPLACE:Research": {"id": "*", "filter": "year=VALUEPLACE=more"},
          "research_IDPLACE__author": {},
        },
        "research-before": {
          "research_IDPLACE:Research": {"id": "*", "filter": "year=VALUEPLACE=less"},
          "research_IDPLACE__author": {},
        },
        "research-type": {
          "research_IDPLACE:Research": {"id": "*"},
          "type_IDPLACE:ResearchType": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__type_IDPLACE": {},
        },

        "collection-storage": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "int_IDPLACE:StorageInterval": {"id": "*"},
          "coll_IDPLACE:Collection": {"id": "*"},
          "org_IDPLACE:Organization": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__coll_IDPLACE": {},
          "org_IDPLACE__coll_IDPLACE": {},
        },
        "collection-name": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "int_IDPLACE:StorageInterval": {"id": "*"},
          "coll_IDPLACE:Collection": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__coll_IDPLACE": {},
        },

        "heritage-security": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "her_IDPLACE:Heritage": {"id": "*"},
          "type_IDPLACE:SecurityType": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__her_IDPLACE": {},
          "type_IDPLACE__her_IDPLACE": {},
        },
        "heritage-region": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "her_IDPLACE:Heritage": {"id": "*", "filter": "code=VALUEPLACE=textStart"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__her_IDPLACE": {},
        },
        "heritage-after": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "her_IDPLACE:Heritage": {"id": "*", "filter": "docDate=VALUEPLACE=dataMore"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__her_IDPLACE": {},
        },
        "heritage-before": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "her_IDPLACE:Heritage": {"id": "*", "filter": "docDate=VALUEPLACE=dataLess"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__her_IDPLACE": {},
        },

        "monument-name": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*", "filter": "monument_name=VALUEPLACE=text"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
        },
        "monument-culture": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "cult_IDPLACE:Culture": {"id": "*", "filter": prefix + "name=VALUEPLACE=textEXACT"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "cult_IDPLACE__knowledges_IDPLACE": {},
        },
        "monument-type": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "type_IDPLACE:MonumentType": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__type_IDPLACE": {},
        },
        "monument-epoch": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "epoch_IDPLACE:Epoch": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__epoch_IDPLACE": {},
        },
        "monument-topo-after": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "topo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateMore"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "knowledges_IDPLACE__hastopo__topo_IDPLACE": {},
        },
        "monument-topo-before": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "topo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateLess"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "knowledges_IDPLACE__hastopo__topo_IDPLACE": {},
        },
        "monument-photo-after": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateMore"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "knowledges_IDPLACE__has__photo_IDPLACE": {},
        },
        "monument-photo-before": {
          "research_IDPLACE:Research": {"id": "*"},
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateLess"},
          "research_IDPLACE__author": {},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "knowledges_IDPLACE__has__photo_IDPLACE": {},
        },

        "publication-place": {
          "pub_IDPLACE:Publication": {"id": "*", "filter": "publicated_in=VALUEPLACE=text"},
          "pub_IDPLACE__author": {},
        },
        "publication-pub-name": {
          "pub_IDPLACE:Publication": {"id": "*", "filter": "publication_name=VALUEPLACE=text"},
          "pub_IDPLACE__author": {},
        },
        "publication-title": {
          "pub_IDPLACE:Publication": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "pub_IDPLACE__author": {},
        },
      },

      research: {
        // "main": {
        //   "research:Research": {"id": "*", "select": "*"},
        // },
        "main": {
          "research:Research": {"id": "*", "select": "*"},
          "k:Knowledge": {"id": "*"},
          "m:Monument": {"id": "*"},
          "rt:ResearchType": {"id": "*", "select": "*"},
          "sp:SpatialReference": {"id": "*", "select": "*"},
          "spt:SpatialReferenceType": {"id": "*", "select": "*"},
          "research__rt": {},
          "research__k": {},
          "m__k": {},
          "m__sp": {},
          "sp__spt": {},
        },
        "mainSpatref": {
          "research:Research": {"id": "*", "select": "*"},
          "k:Knowledge": {"id": "*"},
          "m:Monument": {"id": "*"},
          "rt:ResearchType": {"id": "*", "select": "*"},
          "sp:SpatialReference": {"id": "*", "select": "*"},
          "spt:SpatialReferenceType": {"id": "*", "select": "*"},
          "research__rt": {},
          "research__k": {},
          "m__k": {},
          "m__sp": {},
          "sp__spt": {},
        },
        "spatref": {
          "research:Research": {"id": "NEED"},
          "k:Knowledge": {"id": "*"},
          "m:Monument": {"id": "*"},
          "rt:ResearchType": {"id": "*", "select": "*"},
          "sp:SpatialReference": {"id": "*", "select": "*"},
          "spt:SpatialReferenceType": {"id": "*", "select": "*"},
          "research__rt": {},
          "research__k": {},
          "m__k": {},
          "m__sp": {},
          "sp__spt": {},
        },
        "author-name": {
          "author_IDPLACE:Author": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__author_IDPLACE": {},
        },
        "author-job": {
          "author:Author": {"id": "*"},
          "job_IDPLACE:AuthorJob": {"id": "*"},
          "org_IDPLACE:Organization": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__author_IDPLACE": {},
          "job_IDPLACE__author_IDPLACE": {},
          "job_IDPLACE__org_IDPLACE": {},
        },

        "artifact-category": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "cat_IDPLACE:ArtifactCategory": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "cat_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-culture": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "cult_IDPLACE:Culture": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "cult_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-material": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "mat_IDPLACE:ArtifactMaterial": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "mat_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-name": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-photo-before": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dataLess"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "photo_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-photo-after": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dataMore"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "photo_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-found-after": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "year=VALUEPLACE=more"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-found-before": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "year=VALUEPLACE=less"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
        },

        "excavation-area-more": {
          "exc_IDPLACE:Excavation": {"id": "*", "filter": "area=VALUEPLACE=more"},
          "research__exc_IDPLACE": {},
        },
        "excavation-area-less": {
          "exc_IDPLACE:Excavation": {"id": "*", "filter": "area=VALUEPLACE=less"},
          "research__exc_IDPLACE": {},
        },
        "excavation-obj-name": {
          "exc_IDPLACE:Excavation": {"id": "*"},
          "obj_IDPLACE:Complex": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__exc_IDPLACE": {},
          "obj_IDPLACE__exc_IDPLACE": {},
        },
        "excavation-boss-name": {
          "exc_IDPLACE:Excavation": {"id": "*", "filter": "boss=VALUEPLACE=text"},
          "research__exc_IDPLACE": {},
        },

        "research-after": {
          "research:Research": {"id": "*", "select": "*", "filter": "year=VALUEPLACE=more"},
        },
        "research-before": {
          "research:Research": {"id": "*", "select": "*", "filter": "year=VALUEPLACE=less"},
        },
        "research-type": {
          "type_IDPLACE:ResearchType": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "research__type_IDPLACE": {},
        },

        "collection-storage": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "int_IDPLACE:StorageInterval": {"id": "*"},
          "coll_IDPLACE:Collection": {"id": "*"},
          "org_IDPLACE:Organization": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__coll_IDPLACE": {},
          "org_IDPLACE__coll_IDPLACE": {},
        },
        "collection-name": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "int_IDPLACE:StorageInterval": {"id": "*"},
          "coll_IDPLACE:Collection": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research__knowledge_IDPLACE": {},
          "knowledge_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__coll_IDPLACE": {},
        },

        "heritage-security": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "her_IDPLACE:Heritage": {"id": "*"},
          "type_IDPLACE:SecurityType": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__her_IDPLACE": {},
          "type_IDPLACE__her_IDPLACE": {},
        },
        "heritage-region": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "her_IDPLACE:Heritage": {"id": "*", "filter": "code=VALUEPLACE=textStart"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__her_IDPLACE": {},
        },
        "heritage-after": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "her_IDPLACE:Heritage": {"id": "*", "filter": "docDate=VALUEPLACE=dataMore"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__her_IDPLACE": {},
        },
        "heritage-before": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "her_IDPLACE:Heritage": {"id": "*", "filter": "docDate=VALUEPLACE=dataLess"},
          "research_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__her_IDPLACE": {},
        },

        "monument-name": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*", "filter": "monument_name=VALUEPLACE=text"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
        },
        "monument-culture": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "cult_IDPLACE:Culture": {"id": "*", "filter": prefix + "name=VALUEPLACE=textEXACT"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "cult_IDPLACE__knowledges_IDPLACE": {},
        },
        "monument-type": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "type_IDPLACE:MonumentType": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__type_IDPLACE": {},
        },
        "monument-epoch": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "epoch_IDPLACE:Epoch": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__epoch_IDPLACE": {},
        },
        "monument-topo-after": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "topo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateMore"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "knowledges_IDPLACE__hastopo__topo_IDPLACE": {},
        },
        "monument-topo-before": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "topo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateLess"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "knowledges_IDPLACE__hastopo__topo_IDPLACE": {},
        },
        "monument-photo-after": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateMore"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "knowledges_IDPLACE__has__photo_IDPLACE": {},
        },
        "monument-photo-before": {
          "knowledge_IDPLACE:Knowledge": {"id": "*"},
          "knowledges_IDPLACE:Knowledge": {"id": "*"},
          "monument_IDPLACE:Monument": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateLess"},
          "research__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledge_IDPLACE": {},
          "monument_IDPLACE__knowledges_IDPLACE": {},
          "knowledges_IDPLACE__has__photo_IDPLACE": {},
        },

        "publication-place": {
          "author_IDPLACE:Author": {"id": "*"},
          "pub_IDPLACE:Publication": {"id": "*", "filter": "publicated_in=VALUEPLACE=text"},
          "pub_IDPLACE__author_IDPLACE": {},
          "research__author_IDPLACE": {},
        },
        "publication-pub-name": {
          "author_IDPLACE:Author": {"id": "*"},
          "pub_IDPLACE:Publication": {"id": "*", "filter": "publication_name=VALUEPLACE=text"},
          "pub_IDPLACE__author_IDPLACE": {},
          "research__author_IDPLACE": {},
        },
        "publication-title": {
          "author_IDPLACE:Author": {"id": "*"},
          "pub_IDPLACE:Publication": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "pub_IDPLACE__author_IDPLACE": {},
          "research__author_IDPLACE": {},
        },
      },

      monument: {
        // "main": {
        //   "monument:Monument": {"id": "*", "select": "*"},
        //   "knowledge:Knowledge": {"id": "*", "select": "*"},
        //   "monument__knowledge": {},
        // },
        "main": {
          "monument:Monument": {"id": "*", "select": "*"},
          "knowledge:Knowledge": {"id": "*", "select": "*"},
          "monument__knowledge": {},
          "epoch:Epoch": {"id": "*", "select": "*"},
          "mt:MonumentType": {"id": "*", "select": "*"},
          "sp:SpatialReference": {"id": "*", "select": "*"},
          "spt:SpatialReferenceType": {"id": "*", "select": "*"},
          "monument__epoch": {},
          "monument__mt": {},
          "monument__sp": {},
          "sp__spt": {},
        },
        "spatref": {
          "monument:Monument": {"id": "NEED"},
          "epoch:Epoch": {"id": "*", "select": "*"},
          "mt:MonumentType": {"id": "*", "select": "*"},
          "sp:SpatialReference": {"id": "*", "select": "*"},
          "spt:SpatialReferenceType": {"id": "*", "select": "*"},
          "monument__epoch": {},
          "monument__mt": {},
          "monument__sp": {},
          "sp__spt": {},
        },
        "mainSpatref": {
          "monument:Monument": {"id": "*", "select": "*"},
          "knowledge:Knowledge": {"id": "*", "select": "*"},
          "monument__knowledge": {},
          "epoch:Epoch": {"id": "*", "select": "*"},
          "mt:MonumentType": {"id": "*", "select": "*"},
          "sp:SpatialReference": {"id": "*", "select": "*"},
          "spt:SpatialReferenceType": {"id": "*", "select": "*"},
          "monument__epoch": {},
          "monument__mt": {},
          "monument__sp": {},
          "sp__spt": {},
        },
        "author-name": {
          "author_IDPLACE:Author": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "research_IDPLACE:Research": {"id": "*"},
          "research_IDPLACE__author_IDPLACE": {},
          "research_IDPLACE__knowledge": {},
        },
        "author-job": {
          "author_IDPLACE:Author": {"id": "*"},
          "research_IDPLACE:Research": {"id": "*"},
          "job_IDPLACE:AuthorJob": {"id": "*"},
          "org_IDPLACE:Organization": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "job_IDPLACE__author_IDPLACE": {},
          "job_IDPLACE__org_IDPLACE": {},
          "research_IDPLACE__author_IDPLACE": {},
          "research_IDPLACE__knowledge": {},
        },

        "artifact-category": {
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "cat_IDPLACE:ArtifactCategory": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "knowledge__artifact_IDPLACE": {},
          "cat_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-culture": {
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "cult_IDPLACE:Culture": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "knowledge__artifact_IDPLACE": {},
          "cult_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-material": {
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "mat_IDPLACE:ArtifactMaterial": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "knowledge__artifact_IDPLACE": {},
          "mat_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-name": {
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "knowledge__artifact_IDPLACE": {},
        },
        "artifact-photo-before": {
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dataLess"},
          "knowledge__artifact_IDPLACE": {},
          "photo_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-photo-after": {
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dataMore"},
          "knowledge__artifact_IDPLACE": {},
          "photo_IDPLACE__artifact_IDPLACE": {},
        },
        "artifact-found-after": {
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "year=VALUEPLACE=more"},
          "knowledge__artifact_IDPLACE": {},
        },
        "artifact-found-before": {
          "artifact_IDPLACE:Artifact": {"id": "*", "filter": "year=VALUEPLACE=less"},
          "knowledge__artifact_IDPLACE": {},
        },

        "excavation-area-more": {
          "exc_IDPLACE:Excavation": {"id": "*", "filter": "area=VALUEPLACE=more"},
          "monument__exc_IDPLACE": {},
        },
        "excavation-area-less": {
          "exc_IDPLACE:Excavation": {"id": "*", "filter": "area=VALUEPLACE=less"},
          "monument__exc_IDPLACE": {},
        },
        "excavation-obj-name": {
          "exc_IDPLACE:Excavation": {"id": "*"},
          "obj_IDPLACE:Complex": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "monument__exc_IDPLACE": {},
          "obj_IDPLACE__exc_IDPLACE": {},
        },
        "excavation-boss-name": {
          "exc_IDPLACE:Excavation": {"id": "*", "filter": "boss=VALUEPLACE=text"},
          "monument__exc_IDPLACE": {},
        },

        "research-after": {
          "research_IDPLACE:Research": {"id": "*", "select": "*", "filter": "year=VALUEPLACE=more"},
          "research_IDPLACE__knowledge": {},
        },
        "research-before": {
          "research_IDPLACE:Research": {"id": "*", "select": "*", "filter": "year=VALUEPLACE=less"},
          "research_IDPLACE__knowledge": {},
        },
        "research-type": {
          "type_IDPLACE:ResearchType": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "research_IDPLACE__type_IDPLACE": {},
          "research_IDPLACE__knowledge": {},
        },

        "collection-storage": {
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "int_IDPLACE:StorageInterval": {"id": "*"},
          "coll_IDPLACE:Collection": {"id": "*"},
          "org_IDPLACE:Organization": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "knowledge__artifact_IDPLACE": {},
          "int_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__coll_IDPLACE": {},
          "org_IDPLACE__coll_IDPLACE": {},
        },
        "collection-name": {
          "artifact_IDPLACE:Artifact": {"id": "*"},
          "int_IDPLACE:StorageInterval": {"id": "*"},
          "coll_IDPLACE:Collection": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "knowledge__artifact_IDPLACE": {},
          "int_IDPLACE__artifact_IDPLACE": {},
          "int_IDPLACE__coll_IDPLACE": {},
        },

        "heritage-security": {
          "her_IDPLACE:Heritage": {"id": "*"},
          "type_IDPLACE:SecurityType": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "monument__her_IDPLACE": {},
          "type_IDPLACE__her_IDPLACE": {},
        },
        "heritage-region": {
          "her_IDPLACE:Heritage": {"id": "*", "filter": "code=VALUEPLACE=textStart"},
          "monument__her_IDPLACE": {},
        },
        "heritage-after": {
          "her_IDPLACE:Heritage": {"id": "*", "filter": "docDate=VALUEPLACE=dataMore"},
          "monument__her_IDPLACE": {},
        },
        "heritage-before": {
          "her_IDPLACE:Heritage": {"id": "*", "filter": "docDate=VALUEPLACE=dataLess"},
          "monument__her_IDPLACE": {},
        },

        "monument-name": {
          "knowledge:Knowledge": {"id": "*", "select": "*", "filter": "monument_name=VALUEPLACE=text"},
        },
        "monument-culture": {
          "cult_IDPLACE:Culture": {"id": "*", "filter": prefix + "name=VALUEPLACE=textEXACT"},
          "cult_IDPLACE__knowledge": {},
        },
        "monument-type": {
          "type_IDPLACE:MonumentType": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "monument__type_IDPLACE": {},
        },
        "monument-epoch": {
          "epoch_IDPLACE:Epoch": {"id": "*", "filter": "id=VALUEPLACE=number"},
          "monument__epoch_IDPLACE": {},
        },
        "monument-topo-after": {
          "topo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateMore"},
          "knowledge__hastopo__topo_IDPLACE": {},
        },
        "monument-topo-before": {
          "topo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateLess"},
          "knowledge__hastopo__topo_IDPLACE": {},
        },
        "monument-photo-after": {
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateMore"},
          "knowledge__has__photo_IDPLACE": {},
        },
        "monument-photo-before": {
          "photo_IDPLACE:Image": {"id": "*", "filter": "creationDate=VALUEPLACE=dateLess"},
          "knowledge__has__photo_IDPLACE": {},
        },

        "publication-place": {
          "author_IDPLACE:Author": {"id": "*"},
          "research_IDPLACE:Research": {"id": "*"},
          "pub_IDPLACE:Publication": {"id": "*", "filter": "publicated_in=VALUEPLACE=text"},
          "pub_IDPLACE__author_IDPLACE": {},
          "research_IDPLACE__author_IDPLACE": {},
          "research_IDPLACE__knowledge": {},
        },
        "publication-pub-name": {
          "author_IDPLACE:Author": {"id": "*"},
          "research_IDPLACE:Research": {"id": "*"},
          "pub_IDPLACE:Publication": {"id": "*", "filter": "publication_name=VALUEPLACE=text"},
          "pub_IDPLACE__author_IDPLACE": {},
          "research__author_IDPLACE": {},
          "research_IDPLACE__knowledge": {},
        },
        "publication-title": {
          "author_IDPLACE:Author": {"id": "*"},
          "research_IDPLACE:Research": {"id": "*"},
          "pub_IDPLACE:Publication": {"id": "*", "filter": "name=VALUEPLACE=text"},
          "pub_IDPLACE__author_IDPLACE": {},
          "research__author_IDPLACE": {},
          "research_IDPLACE__knowledge": {},
        },
      }
    };

    const instMap = App.views.map();
    let exact = "";
    $("#search-counter-title").hide();

    function changeCriterionType(id) {
      $(`#search-criterion-${id}`).on("change", function() {
        let option = $(`#search-criterion-${id} :selected`);
        let listType = $(option).attr("listType");
        let coords = $(option).attr("data-coords");
        let datePicker = $(option).attr("datePicker");
        let valueHeader = $(`#criterion-value-header-${id}`);
        let autoInput = $(option).attr("auto-input");

        valueHeader.next().remove()

        if (listType) {
          valueHeader.after(`<select id="search-value-${id}" class="form-control criterion-value"></select>`)
          getDataForSelector($(`#search-value-${id}`), listType);
        } else if (coords) {
          var coordpicker = App.blocks.coordpicker;

          App.template.get("bigSearch/coords", function(tmpl) {
            valueHeader.after(tmpl({'id': id}))

            coordpicker($('#coord-picker-1'), {
              inputs: ['#coords-top', '#coords-left'],
              map: instMap.map
            });

            coordpicker($('#coord-picker-2'), {
              inputs: ['#coords-bottom', '#coords-right'],
              map: instMap.map
            });
          })
        } else {
          valueHeader.after(`<input id="search-value-${id}" class="form-control input criterion-value">`)
          if (autoInput) {
            App.views.functions.setCultureAutocomplete($(`#search-value-${id}`), 1, 0, "search", false);

            $(`#search-value-${id}`).on('autocompleteselect', function(event, ui) {
              exact = "Exact";
            })
          }
        }

        if (datePicker) {
          $(`#search-value-${id}`).datepicker({
            dateFormat: "dd.mm.yy"
          });
        }
      })
    }

    var criterionId = 0;
    $('#add-criterion-button').on('click', function(e) {
      var localCriterionId = criterionId;
      var params = {
        criterionId: localCriterionId
      }

      App.template.get("bigSearch/criterion", function(tmpl) {
        $.when($('#add-criterion-button').before(tmpl(params)))
          .then(changeCriterionType(localCriterionId));
      })

      criterionId++;
    });
    $('#add-criterion-button').trigger("click");

    let overlays = null;
    $("#show-results-button").on("click", function() {
      let left = $("#coords-left").val();
      let top = $("#coords-top").val();
      let right = $("#coords-right").val();
      let bot = $("#coords-bottom").val();
      let coordsCrit = false;

      if (left && top && right && bot) {
        coordsCrit = true;
      }

      let entity = $("#search-object").val();
      let query;
      let criteria = $(".criterion-type");

      query = _.clone(queries[entity].main);

      const ctl = App.locale.getLang() === "en" ? App.locale.cyrToLatin : src => src;

      App.views.clearOverlays(overlays);

      _.each(criteria, function(krit, i) {
        let $krit = $(krit);
        let criterion = $("#search-criterion-"+i).val();

        if (criterion == "monument-coords") {
          return 1;
        }

        let valueParts = $("#search-value-"+i).val().split(/[;]\s*/g);
        let value = valueParts.join(")|(");

        let addQuery = JSON.stringify(queries[entity][criterion]).replace(/_IDPLACE/g, i);
        addQuery = addQuery.replace(/VALUEPLACE/g, value);
        addQuery = addQuery.replace(/EXACT/g, exact);
        addQuery = JSON.parse(addQuery);

        _.extend(query, addQuery);
      })
      console.log(query)
      query = JSON.stringify(query);

      function checkCoords(sp, left, top, right, bot) {
        if (sp.y >= left && sp.y <= right && sp.x >= bot && sp.x <= top) {
          return true;
        }
      }

      $.post({
        url: "/hquery/read?limit=15000",
        data: query,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
        },
        success: function(response) {
          response = JSON.parse(response);
          let placemarks = [], spatref, elemCounter = 0;
          console.log(response)

          function render() {
            let preset, epoch, type, ids = {}, id, name;
            _.each(spatref.sp, function(sp, i) {
              if (sp) {
                if (entity == "monument") {
                  epoch = spatref.epoch[i].id;
                  type = spatref.mt[i].id;
                  preset = `monType${type}_${epoch}`;
                  id = spatref.monument[i].id;
                  name = spatref.monument[i].name;

                  if (!coordsCrit || (coordsCrit && checkCoords(sp, left, top, right, bot))) {
                    if (!ids[spatref.monument[i].id]) {
                      ids[spatref.monument[i].id] = true;
                      placemarks.push(
                        App.controllers.fn.createStandartPlacemark('monument', spatref.monument[i].id, sp.x, sp.y, spatref.monument[i].name, preset)
                      );

                      $("#search-results").append(`<p id="record-${id}" data-id="${id}" class="record"><a href='#${entity}/show/${id}'>${ ctl(name) }</a></p>`);
                      elemCounter++;
                    }
                  }
                }
                if (entity == "research") {
                  type = spatref.rt[i].id;
                  preset = `resType${type}`;
                  id = spatref.research[i].id;
                  name = spatref.research[i].name;

                  if (!coordsCrit || (coordsCrit && checkCoords(sp, left, top, right, bot))) {
                    console.log(ids[spatref.research[i].id])
                    console.log(!ids[spatref.research[i].id])
                    if (!ids[spatref.research[i].id]) {
                      placemarks.push(
                        App.controllers.fn.createStandartPlacemark('research', spatref.research[i].id, sp.x, sp.y, spatref.research[i].name, preset)
                      );
                      ids[spatref.research[i].id] = true;
                      
                      $("#search-results").append(`<p id="record-${id}" data-id="${id}" class="record"><a href='#${entity}/show/${id}'>${ ctl(name) }</a></p>`);
                      elemCounter++;
                    }
                  }
                }
              }
            })
            overlays = App.views.addToMap(placemarks, instMap);
          }

          if (entity == "monument") {
            _.each(response.knowledge, function(know, i) {
              response.monument[i]["name"] = know.monument_name; 
            })
          }

          $("#search-results").html("");

          spatref = response;
          render();

          if (entity == "author") {
            let data = _.toArray(response[entity])
            data = _.uniq(data, function(item, key, id) {return item.id});
            _.each(data, function(obj, key) {
              $("#search-results").append(`<p id="record-${obj.id}" data-id="${obj.id}" class="record"><a href='#${entity}/show/${obj.id}'>${ ctl(obj.name) }</a></p>`);
              elemCounter++;
            })
          }

          $("#search-counter-title").show();
          $("#search-counter").text(elemCounter);
        }
      });
    });

    $("#create-selection-button").on("click", function() {
      let selName = $("#selection-name").val();
      
      if (!selName) {
        return;
      }

      let ids = [];
      let entity = $("#search-object").val();
      entity = entity[0].toUpperCase() + entity.substr(1);

      _.each($(".record"), function(record, i) {
        ids.push($(record).attr("data-id"))
      })

      let query = {
        "sel:Selection": {"name/text": `${selName}`, "entity/text": `${entity}`},
      }

      _.each(ids, function(id, i) {
        query[`obj${i}:${entity}`] = {
          "id": `${id}`
        };
        query[`sel__has__obj${i}`] = {};
      })        

      query = JSON.stringify(query);

      $.post({
        url: "/hquery/upsert",
        data: query,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem('token'));
        },
        success: function(response) {
          console.log(response)
        }
      })
    })
  }
}));
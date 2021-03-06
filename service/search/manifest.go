package search

import (
	"github.com/ArchGIS/ArchGoGIS/service"
	"github.com/ArchGIS/ArchGoGIS/web"
)

// Config is map URLs to Handlers
var Config = service.Config{
	ServiceName: "search",
	Routes: []web.Route{
		{"/authors", authorsHandler},
		{"/monuments", monumentsHandler},
		{"/arch_maps", archMapHandler},
		{"/filter_monuments", filterMonumentsHandler},
		{"/filter_res", filterResHandler},
		{"/filter_authors", filterAuthorHandler},
		{"/filter_cultures", filterCultureHandler},
		{"/filter_reports", filterReportHandler},
		{"/filter_excavations", filterExcavationHandler},
		{"/filter_radiocarbons", filterRadiocarbonHandler},
		{"/cities", citiesHandler},
		{"/collections", collectionsHandler},
		{"/okns", oknsHandler},
		{"/count", countHandler},
	},
}

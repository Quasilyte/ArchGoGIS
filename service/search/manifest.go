package search

import (
	"github.com/ArchGIS/ArchGoGIS/service"
	"github.com/ArchGIS/ArchGoGIS/web"
)

var Config = service.Config{
	ServiceName: "search",
	Routes: []web.Route{
		{"/authors", authorsHandler},
		{"/monuments", monumentsHandler},
		{"/arch_maps", archMapHandler},
		{"/filter_monuments", filterMonumentsHandler},
		{"/filter_res", filterResHandler},
		{"/filter_authors", filterAuthorHandler},
		{"/filter_reports", filterReportHandler},
	},
}

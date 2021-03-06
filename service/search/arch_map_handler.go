package search

import (
	"errors"
	"net/http"
	"regexp"

	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"github.com/ArchGIS/ArchGoGIS/ext"
	"github.com/ArchGIS/ArchGoGIS/service/search/errs"
	"github.com/ArchGIS/ArchGoGIS/web/api"
)

var (
	errSearchPattern = errors.New("1000")
)

var (
	matcher = regexp.MustCompile(`([^\d\(\)]*)(\(?(\d+)\)?)?`)
)

var archMapHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	result, err := searchForArchMap(r.URL.Query().Get("term"))

	if err == nil {
		w.Write(result)
	} else {
		w.Write(api.Error(err))
	}
})

func searchForArchMap(term string) ([]byte, error) {
	matches := matcher.FindStringSubmatch(term)
	if len(matches) < 2 || len(matches) > 4 {
		return nil, errSearchPattern
	}

	if 4 == len(matches) && matches[3] != "" {
		const query = "MATCH (am:ArchMap)" +
			"MATCH (au:Author)-[:Created]->(am)" +
			"MATCH (p:Publisher)-[:Published {year: {publicationYear}}]->(am)" +
			"WHERE au.name STARTS WITH {authorName}" +
			"RETURN am"

		resp, err := neo.Run(query, neo.Params{
			"authorName":      `"` + matches[1] + `"`,
			"publicationYear": matches[3],
		})

		if err != nil {
			return nil, errs.RetrieveError
		}

		if len(resp.Results[0].Data) == 0 {
			return []byte("[]"), nil
		}

		var buf ext.Xbuf

		buf.WriteByte('[')
		for _, row := range resp.Results[0].Data {
			buf.Write(row.Row[0])
			buf.WriteByte(',')
		}
		buf.DropLastByte()
		buf.WriteByte(']')

		return buf.Bytes(), nil
	}

	const query = "MATCH (am:ArchMap)" +
		"MATCH (au:Author)-[:Created]->(am)" +
		"WHERE au.name STARTS WITH {authorName}" +
		"RETURN am"

	resp, err := neo.Run(query, neo.Params{
		"authorName": `"` + matches[1] + `"`,
	})

	if err != nil {
		return nil, errs.RetrieveError
	}

	if len(resp.Results[0].Data) == 0 {
		return []byte("[]"), nil
	}
	
	var buf ext.Xbuf

	buf.WriteByte('[')
	for _, row := range resp.Results[0].Data {
		buf.Write(row.Row[0])
		buf.WriteByte(',')
	}
	buf.DropLastByte()
	buf.WriteByte(']')

	return buf.Bytes(), nil
}

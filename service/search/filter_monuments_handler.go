package search

import (
	"bytes"
	// "github.com/ArchGIS/ArchGoGIS/cfg"
	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"github.com/ArchGIS/ArchGoGIS/echo"
	"github.com/ArchGIS/ArchGoGIS/ext"
	"net/http"
	"github.com/ArchGIS/ArchGoGIS/service/search/errs"
	// "unicode/utf8"
	"unsafe"
	"github.com/ArchGIS/ArchGoGIS/web"
	"github.com/ArchGIS/ArchGoGIS/web/api"
)

const (
	filterMonumentsCypher = "MATCH (m:Monument)" +
		"MATCH (k:Knowledge)-[:belongsto]->(m)" +
		"MATCH (r:Research)-[:has]->(k)" +
		"MATCH (a:Author)<-[:hasauthor]-(r)" +
		"MATCH (e:Epoch)<-[:has]-(m)" +
		"MATCH (c:Culture)<-[:has]-(k)"
)


func filterMonumentsHandler(w web.ResponseWriter, r *http.Request) {
	result, err := searchForFilterMonuments(
		r.URL.Query().Get("name"),
		r.URL.Query().Get("author"),
		r.URL.Query().Get("epoch"),
		r.URL.Query().Get("culture"),
		r.URL.Query().Get("year"))

	if err == nil {
		w.Write(result)
	} else {
		w.Write(api.Error(err))
	}
}

func searchForFilterMonuments(mnt, author, epoch, culture, year string) ([]byte, error) {
	// if needle == "" {
	// 	return nil, errs.FilterIsEmpty
	// }

	// runes := utf8.RuneCountInString(needle)
	// if runes < cfg.SearchMinPrefixLen {
	// 	return nil, errs.PrefixIsTooShort
	// } else if runes > cfg.SearchMaxPrefixLen {
	// 	return nil, errs.PrefixIsTooLong
	// }

	// needle = norm.NormalMonument(needle)
	params := neo.Params{}
	query := filterMonumentsCypher + "WHERE "
	first := false
	if mnt != "" {
		query = query + "k.monument_name =~ {mnt} "
		first = true
		params["mnt"] = `"(?ui)^.*` + mnt + `.*$"`
	}
	if author != "" {
		if first {
			query = query + "AND a.name =~ {author} "
		} else {
			query = query + "a.name =~ {author} "
			first = true
		}

		params["author"] = `"(?ui)^.*` + author + `.*$"`
	}
	if epoch != "" {
		if first {
			query = query + "AND e.id = {epoch} "
		} else {
			query = query + "e.id = {epoch} "
			first = true
		}

		params["epoch"] = epoch
	}
	if culture != "" {
		if first {
			query = query + "AND c.id = {culture} "
		} else {
			query = query + "c.id = {culture} "
			first = true
		}

		params["culture"] = culture
	}
	if year != "" {
		if first {
			query = query + "AND r.year = {year} "
		} else {
			query = query + "r.year = {year} "
		}

		params["year"] = year
	}
	query = query + "RETURN m.id, k.monument_name, r.year, a.name, e.name, c.name, k.x, k.y"

	resp, err := neo.Run(query, params)
	
	if err != nil {
		echo.ServerError.Print(err)
		return nil, errs.RetrieveError
	}

	if len(resp.Results[0].Data) == 0 {
		return []byte("[]"), nil
	} else {
		// Подготавливаем ответ.
		var buf ext.Xbuf

		buf.WriteByte('[')
		for _, row := range resp.Results[0].Data {
			// #FIXME: перепиши меня, когда будет время!
			buf.WriteByte('[')
			buf.Write(
				bytes.Join(*(*[][]byte)(unsafe.Pointer(&row.Row)), []byte(",")),
			)
			buf.WriteByte(']')
			buf.WriteByte(',')
		}
		buf.DropLastByte()
		buf.WriteByte(']')

		return buf.Bytes(), nil
	}
}

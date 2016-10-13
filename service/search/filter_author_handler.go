package search

import (
	"bytes"
	"unsafe"
	"net/http"

	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"github.com/ArchGIS/ArchGoGIS/echo"
	"github.com/ArchGIS/ArchGoGIS/ext"
	"github.com/ArchGIS/ArchGoGIS/service/search/errs"
	"github.com/ArchGIS/ArchGoGIS/web"
	"github.com/ArchGIS/ArchGoGIS/web/api"
)

const (
	filterAuthorCypher = "MATCH (a:Author)"
)


func filterAuthorHandler(w web.ResponseWriter, r *http.Request) {
	result, err := searchForFilterAuthor(
		r.URL.Query().Get("author"),
		r.URL.Query().Get("year"))


	if err == nil {
		w.Write(result)
	} else {
		w.Write(api.Error(err))
	}
}

func searchForFilterAuthor(author, year string) ([]byte, error) {
	params := neo.Params{}
	query := filterAuthorCypher + "WHERE "
	first := false

	if author != "" {
		query = query + "a.name =~ {author} "
		first = true
		params["author"] = `"(?ui)^.*` + author + `.*$"`
	}
	if year != "" {
		if first {
			query = query + "AND a.birthdate = {year} "
		} else {
			query = query + "a.birthdate = {year} "
			// first = true
		}

		params["year"] = year
	}
	
	query = query + "RETURN a.id, a.name, a.birthdate"

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

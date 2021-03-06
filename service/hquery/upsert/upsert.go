package upsert

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"mime"
	"net/http"

	"github.com/ArchGIS/ArchGoGIS/assert"
	"github.com/ArchGIS/ArchGoGIS/cfg"
	"github.com/ArchGIS/ArchGoGIS/db/neo"
	"github.com/ArchGIS/ArchGoGIS/db/pg/seq"
	"github.com/ArchGIS/ArchGoGIS/echo"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/errs"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/parsing"
	"github.com/ArchGIS/ArchGoGIS/service/hquery/upsert/builder"
	"github.com/ArchGIS/ArchGoGIS/throw"
	"github.com/ArchGIS/ArchGoGIS/web/api"
)

var Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	defer throw.Catch(func(err error) {
		if _, ok := err.(*errs.HqueryError); ok {
			w.Write([]byte(err.Error()))
		} else {
			// Runtime ошибка?
			// panic(err)
			fmt.Print(err)
		}
	})

	mimeType, _, _ := mime.ParseMediaType(r.Header.Get("Content-Type"))
	input := make(map[string]map[string]string)

	if "multipart/form-data" == mimeType {
		// Нужно распаковать formData.
		r.ParseMultipartForm(999999)

		for tag, headers := range r.MultipartForm.File {
			file, err := headers[0].Open()
			if err != nil {
				echo.ServerError.Print(err)
				return
			}

			data, err := ioutil.ReadAll(file)
			if err != nil {
				echo.ServerError.Print(err)
				return
			}

			key, err := agent.Save(data)
			if err != nil {
				echo.ServerError.Print(err)
				return
			}

			url, _ := agent.Url(key)

			input[tag] = map[string]string{
				"name/text": headers[0].Filename,
				"url/text":  url,
			}
		}

		for tag, rawBody := range r.Form {
			parsedBody := make(map[string]string)
			err := json.Unmarshal([]byte(rawBody[0]), &parsedBody)
			if err != nil {
				w.Write(api.Error(errs.BadJsonGiven))
				return
			}

			input[tag] = parsedBody
		}
	} else {
		input = parsing.MustFetchJson(r.Body)
	}

	jsonFromClient, _ := json.Marshal(input)
	fmt.Printf("---INPUT---\n%v\n----END----\n", string(jsonFromClient))

	// fmt.Printf("%#v\n", input)
	w.Write(processRequest(input))
})

func mustPassValidation(data *Data) {
	for _, node := range data.nodeInserts {
		if validators, ok := cfg.HqueryValidators[node.Labels]; ok {
			for propName, validator := range validators {
				throw.If(node.Props[propName] == "", errs.ValidationNoValue)
				throw.If(!validator(node.Props[propName]), errs.ValidationFailed)
			}
		}
	}
}

func processRequest(input map[string]map[string]string) []byte {
	data := mustParse(input)
	mustPassValidation(data)
	// fmt.Printf("Data: %#v", data.updateSize())

	var tx neo.TxQuery

	if data.updateSize() > 0 {
		tx.SetBatch(makeUpdateBatch(data))
		// fmt.Printf("Upsert query: %#v", tx.Query)

		resp, err := tx.Run()
		response, _ := json.Marshal(resp.Results)
		fmt.Printf("Response from updates neo4j: %v\n", string(response))
		if err != nil {
			tx.Rollback()
			echo.ServerError.Print(err)
			return api.Error(errs.BatchUpdateFailed)
		}

		// Все ли записи были обновлены?
		for _, result := range resp.Results {
			if len(result.Data) == 0 {
				echo.ServerError.Print("partial update")
				return api.Error(errs.BatchUpdateFailed)
			}
		}
	}

	var ids map[string]string

	if data.insertSize() > 0 {
		ids = make(map[string]string, len(data.nodeInserts))
		for _, node := range data.nodeInserts {
			id, err := seq.NextId(node.Labels)
			throw.Guard(err, func(err error) {
				echo.ServerError.Print(err)
				throw.Error(errs.BatchInsertFailed)
			})
			ids[node.Name] = id
		}

		tx.SetBatch(makeInsertBatch(ids, data))

		_, err := tx.Run()
		if err != nil {
			echo.ServerError.Print(err)
			return api.Error(errs.BatchInsertFailed)
		}
	}

	tx.Commit()
	jsonString, err := json.Marshal(ids)
	fmt.Printf("Response from inserts neo4j: %v\n", string(jsonString))
	assert.Nil(err) // Если encode map[string]string провалился, то совсем беда

	return jsonString
}

func mustParse(input map[string]map[string]string) *Data {
	parser := MustNewParser(input)

	parser.mustParse()

	return &parser.Data
}

func makeUpdateBatch(data *Data) neo.Batch {
	batch := neo.Batch{
		make([]neo.Statement, 0, data.updateSize()),
	}

	for _, node := range data.nodeUpdates {
		batch.Add(builder.UpdateNode(node), node.Props)
	}

	return batch
}

func makeInsertBatch(ids map[string]string, data *Data) neo.Batch {
	sb := builder.NewStatementBuilder(data.insertSize())

	// Собрать MATCH для отсутствующих в insert связей.
	for _, edge := range data.edges {
		if _, ok := data.nodeInserts[edge.Lhs]; !ok {
			node := data.nodeUpdates[edge.Lhs]
			sb.AddRef(node.Props["id"], node)
		}
		if _, ok := data.nodeInserts[edge.Rhs]; !ok {
			node := data.nodeUpdates[edge.Rhs]
			sb.AddRef(node.Props["id"], node)
		}
	}

	for _, node := range data.nodeInserts {
		sb.AddNode(ids[node.Name], node)
	}

	for _, edge := range data.edges {
		sb.AddEdge(edge)
	}

	return neo.Batch{[]neo.Statement{sb.Build()}}
}

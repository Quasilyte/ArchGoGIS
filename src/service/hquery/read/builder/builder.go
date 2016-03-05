package builder

import (
	"bytes"
	"cfg"
	"db/neo"
	"fmt"
	"service/hquery/read/ast"
)

var placeholders []string

func init() {
	// Нам не понадобится больше имён для placeholder'ов, чем у нас
	// вообще можно быть параметров в запросе.
	// #FIXME: хотя здесь важен лимит именно на количество свойств в insert
	// запросах. Мы можем использовать меньше памяти.
	placeholders = make([]string, cfg.HqueryMaxPropsTotal)

	for i := 0; i < cfg.HqueryMaxPropsTotal; i++ {
		placeholders[i] = fmt.Sprintf("p%d", i) // p0, p1, ..., p(n-1)
	}
}

type StatementBuilder struct {
	paramIndex int
	buf        bytes.Buffer
	params     map[string]string
}

func NewStatementBuilder(paramCount int) *StatementBuilder {
	return &StatementBuilder{params: make(map[string]string, paramCount)}
}

func (my *StatementBuilder) Build() neo.Statement {
	return neo.Statement{
		my.buf.String(),
		my.params,
	}
}

/*
func (my *StatementBuilder) AddNode(id string, node *ast.Node) {
	node.Props = append(node.Props, &ast.Prop{"id", id})

	my.buf.WriteString("CREATE (" + node.Tag + " {")
	my.writeProps(node.Props)
	my.buf.WriteString("})")
}
*/

/*
func (my *StatementBuilder) AddEdge(edge *ast.Edge) {
	name := edge.Lhs + "_" + edge.Label + "_" + edge.Rhs // Возможно стоит вынести в newEdge()

	if 0 == len(edge.Props) {
		my.buf.WriteString("CREATE UNIQUE (" + edge.Lhs + ")-[")
		my.buf.WriteString(name + ":" + edge.Label + "]->(" + edge.Rhs + ")")
	} else {
		my.buf.WriteString("CREATE UNIQUE (" + edge.Lhs + ")-[" + name + ":" + edge.Label + " {")

		insertProps := make([]string, len(edge.Props))
		updateProps := make([]string, len(edge.Props))
		for i, prop := range edge.Props {
			placeholder := my.nextPlaceholder()
			insertProps[i] = prop.Key + ":{" + placeholder + "}"
			updateProps[i] = name + "." + prop.Key + "={" + placeholder + "}"
			my.params[placeholder] = prop.Val
		}
		my.buf.WriteString(strings.Join(insertProps, ","))
		my.buf.WriteString("}]->(" + edge.Rhs + ") SET ")
		my.buf.WriteString(strings.Join(updateProps, ","))
	}
}
*/
// RETURN(CASE WHEN LENGTH(COLLECT(r)) = 1 THEN HEAD(COLLECT(r)) ELSE NULL END) AS r
func (my *StatementBuilder) AddNodesReturn(nodes map[string]*ast.Node) {
	my.buf.WriteString("RETURN ")

	for _, node := range nodes {
		if node.Selected {
			switch {
			case node.Matcher.One():
				my.buf.WriteString("(CASE WHEN LENGTH(COLLECT(" + node.Name + "))=1 ")
				my.buf.WriteString("THEN HEAD(COLLECT(" + node.Name + ")) ELSE NULL END) ")
				my.buf.WriteString("AS " + node.Name + ",")
			case node.Matcher.Any():
				my.buf.WriteString("COLLECT(" + node.Name + ") AS " + node.Name + ",")
			default:
				my.buf.WriteString(node.Name + ",")
			}
		}
	}
}

func (my *StatementBuilder) AddEdgesReturn(edges []*ast.Edge) {
	for _, edge := range edges {
		if edge.Selected {
			my.buf.WriteString(edge.Tag + ",")
		}
	}
	my.buf.Truncate(my.buf.Len() - 1)
}

func (my *StatementBuilder) AddNodeMatch(tag string) {
	my.buf.WriteString("MATCH (" + tag + ")")
}

func (my *StatementBuilder) AddEdgeMatch(edge *ast.Edge) {
	my.buf.WriteString("MATCH (" + edge.Lhs + ")-[" + edge.Tag + ":" + edge.Type + "]->(" + edge.Rhs + ")")
}

func (my *StatementBuilder) AddAny(name string) {
	my.buf.WriteString("COLLECT")
}

func (my *StatementBuilder) AddRef(id string, tag string) {
	placeholder := my.nextPlaceholder()
	my.buf.WriteString("MATCH (" + tag + " {id:{" + placeholder + "}})")
	my.params[placeholder] = id
}

/*
func (my *StatementBuilder) writeProps(props []*ast.Prop) {
	for _, prop := range props {
		placeholder := my.nextPlaceholder()
		my.buf.WriteString(prop.Key + ":{" + placeholder + "},")
		my.params[placeholder] = prop.Val
	}
	my.buf.Truncate(my.buf.Len() - 1) // Отбрасываем лишнюю запятую
}
*/

func (my *StatementBuilder) nextPlaceholder() string {
	my.paramIndex++
	return placeholders[my.paramIndex-1]
}

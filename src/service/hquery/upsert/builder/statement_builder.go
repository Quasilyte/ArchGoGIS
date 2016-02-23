package builder

import (
	"db/neo"
	"service/hquery/upsert/ast"
)

func NewStatementBuilder(paramCount int) *StatementBuilder {
	return &StatementBuilder{params: make(map[string]string, paramCount)}
}

func (my *StatementBuilder) Build() neo.Statement {
	return neo.Statement{
		my.buf.String(),
		my.params,
	}
}

func (my *StatementBuilder) AddNode(id string, node *ast.Node) {
	node.Props = append(node.Props, &ast.Prop{"id", id})

	my.buf.WriteString("CREATE (" + node.Tag + " {")
	my.writeProps(node.Props)
	my.buf.WriteString("})")
}

func (my *StatementBuilder) AddEdge(id string, edge *ast.Edge) {
	edge.Props = append(edge.Props, &ast.Prop{"id", id})

	my.buf.WriteString("CREATE (" + edge.Lhs + ")-[:" + edge.Label + " {")
	my.writeProps(edge.Props)
	my.buf.WriteString("}]->(" + edge.Rhs + ")")
}

func (my *StatementBuilder) AddRef(id string, node *ast.Node) {
	placeholder := my.nextPlaceholder()
	my.buf.WriteString("MATCH (" + node.Tag + " {id:{" + placeholder + "}})")
	my.params[placeholder] = id
}

func (my *StatementBuilder) writeProps(props []*ast.Prop) {
	for _, prop := range props {
		placeholder := my.nextPlaceholder()
		my.buf.WriteString(prop.Key + ":{" + placeholder + "},")
		my.params[placeholder] = prop.Val
	}
	my.buf.Truncate(my.buf.Len() - 1) // Отбрасываем лишнюю запятую
}

func (my *StatementBuilder) nextPlaceholder() string {
	my.paramIndex++
	return placeholders[my.paramIndex-1]
}
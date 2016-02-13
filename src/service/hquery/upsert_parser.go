package hquery

import (
	"encoding/json"
	"io"
	"service/hquery/stmt"
	"strings"
)

// propPairs - callback для concatProps
func propPairs(prop *prop) string {
	return prop.key + ": " + prop.val
}

// concatProps - хелпер для генерации строки props
func concatProps(entry UpsertEntry, fn func(*prop) string) (string, error) {
	parts := make([]string, 0, len(entry))

	for key := range entry {
		prop, err := newProp(key, entry[key])
		if err != nil {
			return "", err
		}

		parts = append(parts, fn(prop))
	}

	return strings.Join(parts, ","), nil
}

func newUpsertParser(input io.ReadCloser) (*UpsertParser, error) {
	parser := &UpsertParser{} // Откладываем инициализацию map'ов
	err := json.NewDecoder(input).Decode(&parser.batch)

	if err == nil {
		// Производим аллокации только если успешно выполнился decode.
		// Выделяем [возможно] больше памяти, чем нужно, зато гарантированно
		// задаём максимально возможный capacity
		parser.updates = make(UpdateMap, len(parser.batch))
		parser.inserts = make(InsertMap, len(parser.batch))
		return parser, nil
	} else {
		return nil, err
	}
}

func (my *UpsertParser) parse() error {
	// Обработать каждый entry
	for descriptor, entry := range my.batch {
		if !validDescriptorLen(descriptor) {
			return descriptorLengthErr()
		}

		if err := my.parseEntry(descriptor, entry); err != nil {
			return err
		}
	}

	// Проверить lhs & rhs для связей
	for _, relation := range my.relations {
		if !my.hasRef(relation.Lhs) {
			return missingRefErr(relation.Lhs)
		}
		if !my.hasRef(relation.Rhs) {
			return missingRefErr(relation.Rhs)
		}
	}

	return nil
}

func (my *UpsertParser) parseEntry(descriptor string, entry UpsertEntry) error {
	nameAndLabel := strings.Split(descriptor, ":")
	if len(nameAndLabel) != 2 {
		return descriptorPatternErr(descriptor)
	}

	if strings.Contains(nameAndLabel[0], "->") {
		return my.parseRelation(nameAndLabel[0], nameAndLabel[1], entry)
	}

	if entry["id"] != "" {
		return my.parseUpdate(nameAndLabel[0], descriptor, entry)
	} else {
		return my.parseInsert(nameAndLabel[0], descriptor, entry)
	}
}

func (my *UpsertParser) parseRelation(connectedNames, label string, entry UpsertEntry) error {
	// На уровне выше должна была быть проверка, что хотя бы 1 "->" присутствует
	names := strings.Split(connectedNames, "->")
	if len(names) != 2 {
		return multipleArrowsErr()
	}
	if !(validPropName(names[0]) && validPropName(names[1])) {
		return badPropNameErr()
	}

	props, err := concatProps(entry, propPairs)
	if err != nil {
		return err
	}

	my.pushRelation(stmt.NewRelation(names, label, props))
	return nil
}

func (my *UpsertParser) pushRelation(relation *stmt.Relation) {
	my.relations = append(my.relations, relation)
}

func (my *UpsertParser) parseUpdate(name, descriptor string, entry UpsertEntry) error {
	id := entry["id"]
	delete(entry, "id")

	props, err := concatProps(entry, func(prop *prop) string {
		return name + "." + prop.key + "=" + prop.val
	})
	if err != nil {
		return err
	}

	my.updates[name] = stmt.NewUpdate(descriptor, id, props)
	return nil
}

func (my *UpsertParser) parseInsert(name, descriptor string, entry UpsertEntry) error {
	props, err := concatProps(entry, propPairs)
	if err != nil {
		return err
	}

	my.inserts[name] = stmt.NewInsert(descriptor, props)
	return nil
}

func (my *UpsertParser) hasRef(name string) bool {
	if _, ok := my.inserts[name]; ok {
		return true
	}

	if _, ok := my.updates[name]; ok {
		return true
	}

	return false
}

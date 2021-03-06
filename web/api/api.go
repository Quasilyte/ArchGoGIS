package api

var noError []byte

func init() {
	noError = []byte(`{"error":false}`)
}

func NoError() []byte {
	return noError
}

func InternalServerError() []byte {
	return []byte(`{"error":1}`)
}

func Error(err error) []byte {
	errBytes := make([]byte, 0, len(err.Error()))

	errBytes = append(errBytes, err.Error()...)

	return errBytes
}

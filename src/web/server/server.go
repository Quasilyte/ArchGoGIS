package server

import (
	"echo"
	"net/http"
	"service"
	"web"
)

func Serve(serverConfig Config, serviceConfigs ...service.Config) error {
	for _, serviceConfig := range serviceConfigs {
		registerService(serviceConfig)
	}

	echo.Info.Printf("starting server at :%s port", serverConfig.Port)

	return http.ListenAndServe(":"+serverConfig.Port, nil)
}

func registerService(config service.Config) {
	echo.Info.Printf("register %s service", config.ServiceName)

	for _, route := range config.Routes {
		pattern := "/" + config.ServiceName + route.Pattern

		echo.Info.Print("register handler on " + pattern)
		handleFunc(pattern, route.Handler)
	}

	if config.StaticPath != "" { // Обслуживаем статические файлы.
		staticUrl := "/" + config.StaticPath + "/"
		path := "fs/" + config.StaticPath
		fs := http.FileServer(http.Dir(path))

		echo.Info.Printf("serve static content in " + path)
		http.Handle(staticUrl, http.StripPrefix(staticUrl, fs))
	}
}

func handleFunc(pattern string, handler web.HandlerFunc) {
	http.HandleFunc(pattern, promote(handler))
}

func promote(handler web.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		echo.Info.Printf("%s requests %s", r.RemoteAddr, r.RequestURI)
		handler(web.ResponseWriter{w}, r)
	}
}

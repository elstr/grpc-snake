create-protos :
	protoc -I proto/ proto/snake.proto --go_out=plugins=grpc:proto
	protoc -I=proto/ proto/snake.proto --js_out=import_style=commonjs:proto --grpc-web_out=import_style=commonjs,mode=grpcwebtext:proto
	mv proto/*.js web

run-proxy: 
	docker build -t snake/envoy -f ./envoy.Dockerfile .
	docker run -d -p 8080:8080 -p 9901:9901 snake/envoy

run-server:
	go run server/server.go

compile-web:
	cd web; npx webpack snake.js;

run-web:
	cd web; npm run start; python2 -m SimpleHTTPServer 8081


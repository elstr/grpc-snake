protos :
	protoc -I proto/ proto/snake.proto --go_out=plugins=grpc:proto
	protoc -I=proto/ proto/snake.proto --js_out=import_style=commonjs:proto --grpc-web_out=import_style=commonjs,mode=grpcwebtext:proto
	mv proto/*.js web

proxy: 
	docker build -t snake/envoy -f ./envoy.Dockerfile .
	docker run -d -p 8080:8080 -p 9901:9901 snake/envoy

server:
	go run server/server.go

ui:
	cd ui; npm run start;


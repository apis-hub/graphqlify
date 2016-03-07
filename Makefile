docker-deps:
	docker-compose build

docker-server: docker-deps
	docker-compose start

docker-test: docker-build
	docker-comose run app npm test

deps:
	npm prune
	npm install

server: deps
	npm start

test: deps
	npm run test

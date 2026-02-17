install:
	npm install
	cd frontend && npm install

build:
	npm run build

start:
	npx start-server -s /opt/render/project/src/frontend/dist

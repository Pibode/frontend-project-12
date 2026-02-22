install:
	npm ci
	cd frontend && npm install --legacy-peer-deps

build:
	npm run build

start:
	npx start-server -s ./frontend/dist
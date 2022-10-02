up: 
	docker-compose up

up-build:
	docker-compose up --build

up-prod: 
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

up-build-prod: 
	docker-compose -f docker-compose.yml -f docker-compose.prod.init.yml up --build -d

down: 
	docker-compose down
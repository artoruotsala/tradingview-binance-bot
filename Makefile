up: 
	docker-compose up

up-build-prod: 
	docker-compose -f docker-compose.yml -f docker-compose.prod.init.yml up --build -d

up-prod: 
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

down: 
	docker-compose down
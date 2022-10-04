up: 
	docker-compose up

up-initdb:
	docker-compose -f docker-compose.yml -f docker-compose.initdb.yml up --build

up-prod: 
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

up-prod-initdb: 
	docker-compose -f docker-compose.yml -f docker-compose.prod.init.yml -f docker-compose.initdb.yml up --build -d

up-external-db: 
docker-compose -f docker-compose.rds.yml up -d

down: 
	docker-compose down
up: 
	docker-compose up -d

up-prod: 
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

down: 
	docker-compose down
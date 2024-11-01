start-frontend:
	npm --prefix garment-finder-frontend run start
start-backend:
	PORT=3001 DEBUG=garment-finder-backend:* npm --prefix garment-finder-backend run start
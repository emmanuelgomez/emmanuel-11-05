# Makefile for Garment Finder Project

# Variables
FRONTEND_DIR = garment-finder-frontend
BACKEND_DIR = garment-finder-backend

# Install dependencies
install-frontend:
	npm --prefix $(FRONTEND_DIR) install

install-backend:
	npm --prefix $(BACKEND_DIR) install

install: install-frontend install-backend

# Start services
start-frontend:
	npm --prefix $(FRONTEND_DIR) run start

start-backend:
	PORT=3001 DEBUG=garment-finder-backend:* npm --prefix $(BACKEND_DIR) run start

# Build services
build-frontend:
	npm --prefix $(FRONTEND_DIR) run build

build-backend:
	npm --prefix $(BACKEND_DIR) run build

# Run tests
test-frontend:
	npm --prefix $(FRONTEND_DIR) test

test-backend:
	npm --prefix $(BACKEND_DIR) test

test: test-frontend test-backend

# All-in-one commands
setup: install build

#!/bin/sh

# This is a simple loop that checks if the database is reachable
echo "Waiting for database to be reachable..."
until nc -z $DB_HOST $DB_PORT; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is up! Running migrations..."
npm run migrate

echo "Running seeds..."
npm run seed

echo "Starting application..."
npm start
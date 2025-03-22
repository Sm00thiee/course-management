#!/bin/sh
# wait-for-db.sh

set -e

host_mongodb="$1"
host_mysql="$2"
shift 2
cmd="$@"

# Function to check if MongoDB is up
check_mongodb() {
  echo "Checking MongoDB connection..."
  nc -z "$host_mongodb" 27017
}

# Function to check if MySQL is up
check_mysql() {
  echo "Checking MySQL connection..."
  nc -z "$host_mysql" 3306
}

# Wait for both databases
until check_mongodb && check_mysql; do
  echo "Waiting for MongoDB and MySQL..."
  sleep 3
done

echo "MongoDB and MySQL are up - executing command"
exec $cmd 
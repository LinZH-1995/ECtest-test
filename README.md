## Getting Started
#### 1. Install Docker
```
https://www.docker.com/   ---> Docker version 24.0.5
```
#### 2. Copy project
```
git clone https://github.com/LinZH-1995/ECtest-test.git
```
#### 3. Open project directory
```
cd ECtest-test
```
#### 4. Create Docker Image by docker-compose
```
docker-compose build --no-cache
```
#### 5. Start Docker Container by docker-compose
```
docker-compose up -d
```
#### 6. Exec Container
```
docker container ls   ---> list container
```
```
docker exec -it (CONTAINER ID) /bin/sh   ---> exec container
```
#### 7. Create Table for Database
```
npx sequelize db:migrate
```
#### 8. Create Test Data (need to upload photo before test photo download)
```
npx sequelize db:seed:all
```
```
two test users

account: user1@example.com / password: 12345678
account: user2@example.com / password: 12345678
```
#### 9. Connect - [swagger](http://localhost:443/swagger)、[swagger.json](http://localhost:443/swagger/json)
```
http://localhost:443/swagger (test API)
```
```
http://localhost:443/swagger/json
```

## Unit Test
#### 1. Follow Getting Started Step 2 ~ 3
```
git clone https://github.com/LinZH-1995/ECtest-test.git

cd ECtest-test
```
#### 2. Install package
```
npm install
```
#### 3. Create A Test Database (make sure PostgreSQL already install)
```
npx sequelize db:create --env test
```
#### 4. Create Tables
```
npx sequelize db:migrate --env test
```
#### 5. Start Testing
```
npm run test
```
#### 6. Delete Tables / Delete Database 
```
Delete Tables: npx sequelize db:migrate:undo:all --env test
```
```
Delete Database: npx sequelize db:drop --env test
```
## Getting Started
#### 1. Install Docker
```
https://www.docker.com/  // Docker version 24.0.5
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
#### 5. Create Table for Database
```
npx sequelize db:migrate
```
#### 5. Create Test Data (need to upload photo before test photo download)
```
npx sequelize db:seed:all
```
#### 6. Connect - [swagger](http://localhost:3000/swagger)、[swagger.json](http://localhost:3000/swagger/json)
```
http://localhost:3000/swagger (test API)
```
```
http://localhost:3000/swagger/json
```

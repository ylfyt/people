# People

#### A web application for people management

- Backend: NodeJs App (root directory)
- User app: NextJs App ("next-main" directory)
- Admin panel: NextJs App ("next-admin" directory)
- Database: PostgreSQL

#### Features

##### 1. User

- Users can record their presence by pressing the "enter" and "exit" buttons on the main page
- Users can see and update their profile on the "profile" page
- Users can see and filter their presence records

##### 2. Admin

- Admin can add, update, and delete user on the main page
- Admin can see and filter all users presence record

### Access the App

This app already inserts a dummy user with the email **admin@example.com** and password **123123**. You can access it using the link http://localhost:3001 for the "user" role and http://localhost:3001/admin for the admin panel if you are using the Docker or Docker Compose method.

### How to Run?

#### 1. Using Docker compose

```bash
docker compose up
```

#### 2. Using Docker

- Build the docker image

```bash
docker build -t people .
```

- Run docker container with the following command

```bash
docker run -d --name people-container --network db_network -p 3001:3001 -e DATABASE_URL=postgresql://<USERNAME>:<PASSWORD>@<POSTGRES_HOST>:5432/db_people people
```

Please make sure the connection string variable "DATABASE_URL" is correct. "db_network" is docker network for the postgresql database.

#### 3. Using NodeJS

- Environment variables setup (create .env file)

1. Backend (root directory)

   ```bash
   DATABASE_URL="connection string to postgres db"
   PORT="listen port, by default is 3001"
   ```

2. User App ('next-main' directory)

   ```bash
    NEXT_PUBLIC_API_BASE_URL="Base url of the backend api, ex. http://localhost:$PORT/api"
   ```

3. Admin ('next-admin' directory)

   ```bash
   NEXT_PUBLIC_API_BASE_URL="Base url of the backend api, ex. http://localhost:$PORT/api"
   ```

- Run npm command to start the app

1. Backend (root directory)
   ```bash
    npm install 
    npx prisma migrate deploy
    npm run build
    npm run start
   ```
2. User App ("next-main" directory)
   ```bash
   cd next-main
   npm install
   npm run dev
   ```
3. Admin Panel ("next-admin" directory)
   ```bash
   cd next-admin
   npm install
   npm run dev
   ```

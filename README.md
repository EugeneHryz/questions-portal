# AskMe

AskMe is a single page web app where users can ask and answer questions. Each user can ask another user a question and select answer type for that question (Radio button, Checkbox, Single line text, etc.). The user who was asked the question can view it and answer according to the answer type.

## Technologies

- Spring Boot + Spring MVC
- Spring Data JPA
- Spring Security Framework
- PostgreSQL
- ReactJS + Bootstrap + MUI library
- WebSockets + STOMP protocol

## How to run

1. Download required node modules

Navigate to the `frontend` folder in the project root and run `npm install`

```
cd frontend
npm install
```

2. Import the whole project into Intellij IDEA

**Notice:** you need running PostgreSQL server for the app to work. You can specify DB url and user credentials in `application.properties` file.

3. Run Spring Boot application

4. Navigate to `frontend` folder and execute `npm start`. This command will start react development server and will allow you to access the app in browser when you navigate to `http://localhost:3000/`
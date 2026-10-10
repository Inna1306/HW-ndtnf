# Books App

## Требования

- **Node.js** ≥ 18
- **npm** ≥ 9 (или `yarn` / `pnpm`)

## Установка
### Установка зависимостей

npm install

### Установка пакетов для работы с MongoDB
Если их нет в package.json:

npm install @nestjs/mongoose mongoose

### Настройка окружения

#### Подключение к локальной MongoDB
В файле src/app.module.ts укажите строку подключения:

MongooseModule.forRoot('mongodb://localhost:27017/books-app')

### Создайте файл .env в корне проекта:

MONGODB_URI=mongodb://localhost:27017/books-app
PORT=3000
Добавьте .env в .gitignore:

## Запуск

### Режим разработки 

npm run start:dev

### Обычный запуск

npm run start

### Продакшн-сборка

npm run build
npm run start:prod

### После запуска приложение доступно по адресу: **http://localhost:3000**
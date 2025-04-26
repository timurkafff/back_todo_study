# Установка и запуск API для Туду-Листа

## Установка

1. **Клонируйте репозиторий или создайте новую папку:**

   ```bash
   mkdir todo-list-api
   cd todo-list-api
   ```

2. **Инициализируйте новый проект:**

   ```bash
   npm init -y
   ```

3. **Установите необходимые зависимости:**

   ```bash
   npm install express cors
   npm install --save-dev typescript @types/node @types/express @types/cors ts-node
   ```

4. **Инициализируйте TypeScript:**

   ```bash
   npx tsc --init
   ```

## Запуск сервера

1. **Запустите сервер:**

   ```bash
   npx ts-node src/index.ts
   ```

2. **Проверьте, что сервер работает, открыв в браузере:**

   ```
   http://localhost:3000/api/tasks
   ``` 

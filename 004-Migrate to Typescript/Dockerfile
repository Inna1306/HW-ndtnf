FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
# Нужны и dev-зависимости (typescript), чтобы собрать проект
RUN npm install

# Копируем исходники TypeScript и конфиг компилятора
COPY tsconfig.json ./
COPY src ./src
COPY views ./views

# Компилируем TypeScript в dist/
RUN npm run build \
    # Удаляем dev-зависимости, оставляем только прод-код
    && npm prune --omit=dev

RUN mkdir -p uploads

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "dist/app.js"]

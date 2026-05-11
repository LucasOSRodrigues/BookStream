FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

ENV DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5433/${POSTGRES_DB}?schema=public"

COPY . .

RUN npx prisma generate

EXPOSE ${PORT:-3000}

CMD ["npm", "run", "dev"]
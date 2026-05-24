FROM node:22-slim

WORKDIR /app

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install --ignore-scripts

COPY . .

RUN npx prisma generate

RUN npm prune --omit=dev

ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]

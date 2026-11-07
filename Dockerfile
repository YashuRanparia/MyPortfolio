FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
# Schema push + seed are idempotent, so they're safe on every start.
CMD ["sh", "-c", "node node_modules/drizzle-kit/bin.cjs push --force && npx tsx scripts/seed.mts && npm start"]

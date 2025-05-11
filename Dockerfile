# Étape 1 : Build React app
FROM node:18 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Étape 2 : Serveur nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

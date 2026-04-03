FROM node:22.11.0 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY src ./src
COPY public ./public
COPY index.html tsconfig.app.json tsconfig.json tsconfig.node.json vite.config.ts xlsx-to-json.js eslint.config.js ./
RUN npm run build


FROM nginx:1.27.3
COPY --from=builder /app/dist ./usr/share/nginx/html
COPY start.sh /etc/nginx/
RUN sed -i 's/\r$//' /etc/nginx/start.sh  # fix CRLF
RUN chmod +x /etc/nginx/start.sh
ARG NGINX_PORT
EXPOSE $NGINX_PORT
CMD ["/etc/nginx/start.sh"]


# docker build . -t tech-radar
# docker run --rm --name tech-radar -p 8085:8085 -e NGINX_PORT=8085 tech-radar
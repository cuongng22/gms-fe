# Stage 1: Build Angular app
FROM node:18 AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy các file package và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn và build ứng dụng
COPY . .
RUN npm run build --prod

# Stage 2: Setup Nginx để serve app
FROM nginx:alpine

# Copy các file build từ image trước sang Nginx
COPY --from=build /fe/dist/crew-trip /usr/share/nginx/html/crew-trip/fe

# Expose port 80 để Nginx phục vụ ứng dụng
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]

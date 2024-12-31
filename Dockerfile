# Stage 1: Build Angular app
FROM node:20-alpine AS build


# Thiết lập thư mục làm việc
WORKDIR /app
# Chuyển quyền thư mục
RUN chown -R 0:0 /app
# Copy các file package và cài đặt dependencies
COPY package*.json ./
RUN npm install --force

# Copy toàn bộ mã nguồn và build ứng dụng
# Ở đây chúng ta sử dụng môi trường staging
# Để build ứng dụng với môi trường production, thay staging bằng production
COPY . .
# Build Angular ứng dụng
RUN npm run build:production

# Stage 2: Setup Nginx để serve app
FROM nginx:alpine

# Copy các file build từ image trước sang Nginx
COPY --from=build /app/dist/crew-trip /usr/share/nginx/html/crew-trip/fe

# Thêm cấu hình nginx cho phép port 80 trỏ đến file index trong thư mục của dự án
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Expose port 80 để Nginx phục vụ ứng dụng
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]

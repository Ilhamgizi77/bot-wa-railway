# Gunakan node.js base image
FROM node:20.17.0

# Set working directory di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file proyek ke dalam container
COPY . .

# Expose port 3000 (jika bot kamu menggunakan port tertentu, sesuaikan sesuai kebutuhan)
EXPOSE 3000

# Perintah untuk menjalankan bot
CMD ["node", "bot.js"]



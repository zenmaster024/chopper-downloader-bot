FROM node:20-slim
RUN apt-get update && apt-get install -y ffmpeg python3 python3-pip ca-certificates \
    && pip3 install -U yt-dlp --break-system-packages \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
ENV PORT=7860
CMD ["node", "server.js"]

FROM node:18
# utworz katalog dla programu i ustaw jako katalog roboczy
WORKDIR /usr/src/app
# skopiuj plik ze spisem zaleznosci do katalogu programu
COPY package*.json ./
# pobierz zależności
RUN npm install
# skopiuj kod programu
COPY . .
# wystaw port (pochodzi ze zmiennej środowiskowej)
EXPOSE ${PORT}
# uruchom stronę
CMD ["npm", "start"]

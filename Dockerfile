# Usar la imagen oficial de Node.js 20 como base
FROM node:20

# RUN mkdir /dockerizado/app

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /dockerizado/app

#Copiar los archivos de configuración necesarios (por ejemplo, package.json y tsconfig.json)
COPY package.json package-lock.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto en el que la aplicación se ejecutará dentro del contenedor
EXPOSE 3000

# Comando para ejecutar la aplicación cuando el contenedor se inicia
ENTRYPOINT ["npx", "ts-node", "src/server.ts"]

# Se corre con docker build -t tdd_tp1:1.0 . (el punto indica que busque el dockerfile en el directorio actual)
# Si corrió todo ok, hacer docker run -d -p 3000:3000 tdd_tp1:1.0

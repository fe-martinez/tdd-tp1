# Requisitos
* Node.js 20.12
* Docker 24.0
* npm 10.5
* npx 10.5
* Typescript 5.4
* Sqlite3 5.1
* Docker compose 2.26

# Dependencias
* Express 4.19
* Bcrypt 5.1
* Dotenv 16.4
* Joi 17.12
* Jsonwebtoken 9.0
* Multer 1.4
* Sharp 0.33

# Instalación del proyecto

## Linux (Ubuntu):

* Instalar nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
* Probablemente antes de correr el siguiente comando haya que refrescar la terminal, sino no va a reconocer `nvm`
* Instalar Node: `nvm install 20`
* Verificar la instalacion con `node -v` y `npm -v`
* Instalar Typescript: `npm install -D typescript`
* Instalar Docker:
    * `sudo apt install apt-transport-https ca-certificates curl software-properties-common`
    * `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`
    * `sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"`
    * `sudo apt update`
    * `sudo apt install docker-ce`
* Instalar Docker Compose:
    * `sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d '"' -f 4)/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`
    * `sudo chmod +x /usr/local/bin/docker-compose`


* Clonar el repositorio
* Instalar el resto de las dependencias haciendo `npm install` dentro del directorio del proyecto para instalar el resto de las dependencias.

## Windows 10:
* Instalación de Node:
    * Ir a la página web de Node.js (https://nodejs.org/en). De ser necesario, puede dirigirse a https://nodejs.org/en/download/package-manager para descargar la versión deseada. Se puede utilizar PowerShell, el Símbolo del Sistema (cmd.exe) o la terminal de depuración de JavaScript Visual Studio Code para la instalación, usando Docker como herramienta de gestión de paquetes.
        * Docker: puede descargar Docker Desktop en https://www.docker.com/products/docker-desktop/, lo que incluirá el Docker Engine  https://docs.docker.com/engine/install/binaries/. Ya viene con Docker Compose.
    * Node instala npm automáticamente.
* Instalación de Typescript:
    * Con docker: docker run -it node bash; npm install -g typescript
    * Directamente usando npm: npm install -g typescript
* Clonar el proyecto
* En la terminal de VSCode, PowerShell o CMD correr npm install en la carpeta del proyecto para terminar de instalar las dependencias 

# Correr el proyecto
* Clonar el repositorio
* Ir a la carpeta tdd-tp1 (o el nombre que usted haya elegido)
* Correr npm install

#### Correr el proyecto sin Docker:
* Correr el comando npx ts-node src/server.ts

#### Correr el proyecto con Docker Compose:
* `sudo docker-compose up --build`
(En Windows es necesario tener abierto Docker Desktop para poder correr los comandos).

# Objetivo del trabajo
Implementar una API Rest correspondiente a un mini portal social que permita registrarse como un nuevo usuario, cargar su perfil, poder buscar otros perfiles y seguirlos y dejar de seguirlos, ver mi listado de seguidores y de seguidos. 
La implementación se hizo utilizando Node.js y Typescript, usando el framework Express.

# Seguridad de los datos
Para garantizar la seguridad de los datos, la implementación cuenta con las siguientes características:
* Basic Authentication para la autenticación: Basic Authentication es un método de autenticación simple basado en HTTP que utiliza un nombre de usuario y una contraseña para autenticar a un usuario. Cuando un cliente intenta acceder a un recurso protegido, envía las credenciales codificadas en base64 en el encabezado Authorization de la solicitud HTTP. El servidor verifica estas credenciales comparándolas con las credenciales almacenadas.
* JWT como token para la autorización: JSON Web Tokens (JWT) es un estándar abierto que define un formato compacto y autónomo para la transferencia de información entre dos partes como un objeto JSON. Los JWT son comúnmente utilizados para la autenticación y autorización en aplicaciones web y APIs. Un JWT consta de tres partes: el encabezado, la carga útil y la firma.
* Las contraseñas almacenadas en las bases de datos están encriptadas mediante una función de hashing provista por la librería bcrypt.

Además, se cuenta con refresh tokens para combatir el tiempo de vida limitado de los JWT.

# Decisiones de implementación
* El usuario se crea sin foto, pero requiere los demás campos.
* Se puede actualizar: foto, nombre, género, email, contraseña.
* Usamos una base de datos SQLite3. Los datos persisten al desconectar el servidor.
* La imágen del usuario se guarda comprimida en una carpeta para ahorrar espacio, y se guarda la ruta en la base de datos. Además, hay un tamaño mínimo y un tamaño máximo de imágen.

# Arquitectura
![Arquitectura](https://gitlab.com/ramirogestoso/tdd-tp1/-/raw/Dev/arquitectura.png)

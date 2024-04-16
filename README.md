# Requisitos
* Node.js 20.12
* Docker 24.0 o Chocolatey 2.2
* npm 10.5
* npx 10.5
* Typescript 5.4
* Express 4.19
* Editor de texto
* PowerShell, Símbolo del Sistema (cmd.exe) o terminal de VSCode.

# Instalación del proyecto

### Windows 10:
* Instalación de Node:
    * Ir a la página web de Node.js (https://nodejs.org/en). De ser necesario, puede dirigirse a https://nodejs.org/en/download/package-manager para descargar la versión deseada. Se puede utilizar PowerShell, 0el Símbolo del Sistema (cmd.exe) o la terminal de depuración de JavaScript Visual Studio Code para la instalación, usando Docker o Chocolatey como herramientas de gestión de paquetes.
        * Chocolatey: https://docs.chocolatey.org/en-us/choco/setup
        * Docker: puede descargar Docker Desktop en https://www.docker.com/products/docker-desktop/, lo que incluirá el Docker Engine  https://docs.docker.com/engine/install/binaries/
    * Node instala npm automáticamente.
* Instalación de Typescript:
    * Con choco: choco install typescript
    * Con docker: docker run -it node bash; npm install -g typescript
    * Directamente usando npm: npm install -g typescript
Por lo general, no necesitará instalar Express ni npx, pero, de ser necesario, se puede hacer lo siguiente:
* Instalación de Express:
    * Usando npm: npm install express --save
* Instalación de npx: si bien npx viene con npm, de ser necesario se puede hacer
    * npm install -g npx

### Linux (Ubuntu):
* Instalar nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
* Probablemente antes de correr el siguiente comando haya que refrescar la terminal, sino no va a reconocer `nvm`
* Instalar Node: `nvm install 20`
* Verificar la instalacion con `node -v` y `npm -v`
* Instalar Typescript: `npm install -D typescript`
* Instalar Docker
* Clonar el repositorio
* Instalar el resto de las dependencias haciendo `npm install` dentro del directorio del proyecto para instalar el resto de las dependencias: Express, bcrypt, jwt, sqlite3.

# Correr el proyecto
* Clonar el repositorio
* Ir a la carpeta tdd-tp1 (o el nombre que usted haya elegido)
* Correr npm update (esto es útil para actualizar las dependencias que sean necesarias para correr el proyecto)
* Correr el comando npx ts-node src/server.ts
(Después completamos esto)
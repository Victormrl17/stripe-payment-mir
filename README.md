# stripe-payment-mir

Este proyecto es una aplicación de pago utilizando Stripe, construida con un frontend en React y un backend en Node.js con Express y Prisma.

## Tabla de Contenido
1. [Configuración del Entorno](#configuración-del-entorno)
   - [Backend](#backend)
   - [Frontend](#frontend)
2. [Uso](#uso)
3. [Endpoints](#endpoints)
   - [Crear Payment Intent](#crear-payment-intent)
4. [Tecnologías Utilizadas](#tecnologías-utilizadas)

## Configuración del Entorno

### Backend

1. Clona el repositorio y navega al directorio `server`.
2. Crea un archivo `.env` en el directorio `server` con el siguiente contenido:

    ```env
    DATABASE_URL=
    STRIPE_SECRET_KEY=
    ```

3. Instala las dependencias:

    ```sh
    npm install
    ```

4. Ejecuta las migraciones de Prisma:

    ```sh
    npx prisma migrate dev
    ```

5. Inicia el servidor:

    ```sh
    npm start
    ```

### Frontend

1. Navega al directorio `client`.
2. Instala las dependencias:

    ```sh
    npm install
    ```

3. Inicia la aplicación de React:

    ```sh
    npm start
    ```

## Uso

1. Abre tu navegador y navega a `http://localhost:3000`.
2. Completa el formulario de pago con tu correo electrónico, cantidad y moneda.
3. Ingresa los detalles de tu tarjeta y haz clic en "Pagar".

## Endpoints

### Crear Payment Intent

- **URL:** `/create-payment-intent`
- **Método:** `POST`
- **Cuerpo de la Solicitud:**

    ```json
    {
      "amount": 1000,
      "currency": "usd",
      "email": "example@example.com"
    }
    ```

- **Respuesta Exitosa:**

    ```json
    {
      "clientSecret": "your_client_secret"
    }
    ```

- **Respuesta de Error:**

    ```json
    {
      "error": "Error message"
    }
    ```

## Tecnologías Utilizadas

- **Frontend:** React, TypeScript, Stripe.js
- **Backend:** Node.js, Express, Prisma, PostgreSQL
- **Otros:** Zod para validación de datos

# Business Intelligence Inventory Dashboard

This is a school project for a **Business Intelligence Inventory Dashboard** built with **React** and **Material UI**. The dashboard is based on the Material UI Dashboard template and connects with a custom backend to visualize inventory data and analytics.

## Technologies Used

- **Frontend**: Javascript, React, Material UI
- **Backend**: Typescript, Express, Prisma
- **Data Visualization**: Material UI Dashboard Template
- **Backend Repository**: [Vigor BI Backend](https://github.com/osberttt/vigor-bi-backend)

## Getting Started

To run the application locally, follow the steps below:

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Setup

Follow the steps below to set up the project locally:

## Backend Setup

1.  **Clone the Backend Repository:**

    ```bash
    git clone https://github.com/osberttt/vigor-bi-backend
    cd vigor-bi-backend
    ```

2.  **Create a Database:**

    * Create a new database using your preferred database management system (e.g., MySQL, PostgreSQL, SQLite).
    * Note the database name, username, password, and host.

3.  **Create an `.env` File:**

    * In the root directory of the backend project, create a file named `.env`.
    * Add the `DATABASE_URL` variable with your database connection string.

        * **Example (MySQL):**

            ```
            DATABASE_URL="mysql://<user>:<password>@<host>:<port>/<database>"
            ```

        * **Example (PostgreSQL):**

            ```
            DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?schema=public"
            ```

        * **Example (SQLite):**

            ```
            DATABASE_URL="file:./dev.db"
            ```

        * Replace `<user>`, `<password>`, `<host>`, `<port>`, and `<database>` with your actual database credentials.

4.  **Change Prisma Provider (Optional):**

    * If you are using a database other than MySQL, open the `prisma/schema.prisma` file.
    * Modify the `provider` field in the `datasource` block to your desired database type (e.g., `postgresql`, `sqlite`).

        ```prisma
        datasource db {
          provider = "postgresql" // or "sqlite", etc.
          url      = env("DATABASE_URL")
        }
        ```

5.  **Install Dependencies:**

    ```bash
    npm install
    ```

6.  **Seed the Database (Optional):**

    * If you need to populate the database with initial data, run the seed script.

    ```bash
    npm run seed
    ```

7.  **Start the Development Server:**

    ```bash
    npm run dev
    ```

    * The backend server should now be running.

## Frontend Setup

1.  **Clone the Frontend Repository:**

    ```bash
    git clone https://github.com/osberttt/vigor-front-end
    cd vigor-bi-frontend
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Start the Frontend Application:**

    ```bash
    npm start
    ```

    * The frontend application should now be running in your browser.
    * It should connect to the backend server you started earlier.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
Feel free to modify the template to better match your project's details.

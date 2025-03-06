# Business Intelligence Inventory Dashboard

This is a school project for a **Business Intelligence Inventory Dashboard** built with **React** and **Material UI**. The dashboard is based on the Material UI Dashboard template and connects with a custom backend to visualize inventory data and analytics.

## Technologies Used

- **Frontend**: Javascript, React, Material UI
- **Backend**: Typescript, Express, Prisma
- **Data Visualization**: Material UI Dashboard Template
- **Backend Repository**: [Vigor BI Backend](https://github.com/osberttt/vigor-bi-backend)

## Features

### Overview Page
- **Key Performance Indicators (KPIs)**
  - Displays **Unique Sold SKU**, **Total Cost**, and **Total Profit** for the last 30 days starting from the selected date.
  - Each KPI card includes a **mini line graph** that shows daily trends.
  - Hovering over the line graph reveals daily data.
  - A **capsule indicator** shows the percentage change compared to the previous month.
  - A **"Get Insights" button** opens an AI-generated insight dialog for deeper analysis.

- **Total Sold Quantities Line Graph**
  - Visualizes the **total sold quantities** of stock and menu items over the last 30 days.
  - Two separate lines for **stock** and **menu items**.
  - Hovering over points displays daily data for both categories.

- **Revenue Bar Graph**
  - Compares revenue between **stock** and **menu items** using two separate bars.
  - Includes a capsule showing the percentage change from the previous month.
  - The **"Get Insights" button** provides AI-generated insights into revenue trends.

- **Top 5 Best-Selling & Worst-Selling Items**
  - Displays the top five best and worst-performing items based on sales.
  - A **daily conversion section** shows the quantity sold for each day.
  - Hovering over items provides **detailed daily sales data**.

- **Date Selection**
  - Users can change the starting date using a **calendar picker**.
  - All data, including KPIs, graphs, and tables, adjust dynamically based on the selected date.

### Trends Page
- Displays **month-over-month and year-over-year (YoY) bar graphs** for **total cost, revenue, and profit**.
- Provides **interactive graphs and AI insights** for better decision-making.

### Cost & Profit Page
- Breaks down cost and profit metrics by category, item, and time period.
- Includes a **calculator** where users can input a **start date and end date** to see cost, revenue, and profit during that period.
- Offers AI-driven insights to optimize **profitability and cost efficiency**.

### Stock Management Page
- Monitors **stock levels** for stock items.
- Provides AI-driven insights to prevent **stockouts and overstocking**.

### AI-Driven Insights
- Every key section includes a **"Get Insights" button** for AI-generated analysis.
- Helps users **identify patterns, optimize stock, and improve profitability**.



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
    * Add the `API_KEY` variable if you want AI insight from gemini api too.

        * **Example:**

            ```
            API_KEY="<your_api_key>"
            ```
        * Replace `<your_api_key>` with your actual gemini api key.

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

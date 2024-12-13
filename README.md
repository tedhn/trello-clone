
# A Trello Clone


This project is a full-stack task board application similar to Trello, built with the following technologies:

Frontend: TypeScript, React, Next.js, tRPC, Mantine (UI Library), Jotai (State Management) , TailwindCss (Styling)

Backend: PostgreSQL, Prisma (ORM) , tRPC
## Features

**Task Board Management:** Create, update, delete task lists and items.

**Drag-and-Drop Functionality**: Move items across lists.

**Persistence**: All data is stored in a PostgreSQL database.

**User Accounts**: Each user has their own task board.

**CI/CD** : Automated deployment using Vercel.
## Demo

Give it a try @ https://trello-clone-sable-nine.vercel.app/dashboard

## Running Locally

#### Prerequisites

    Node.js (LTS recommended)
    Yarn or PNPM
    Docker ( for containerization)

Follow these steps to set up and run the project, configure the database, and start the application.

#### 1. Clone the Repository
Clone the project repository from GitHub (or other version control platforms) to your local machine:
 
    git clone https://github.com/tedhn/trello-clone.git 

#### 2. Install Dependencies

Navigate to the project directory and install the required dependencies using pnpm:

    cd trello-clone
    pnpm install / yarn / npm install

#### 3. Start the Database

Execute the start-database.sh script to set up the local database. This script should configure and launch your PostgreSQL database for the project.

Make sure that you have the script file start-database.sh in your project directory and that PostgreSQL is installed and configured on your machine.

    ./start-database.sh

#### 4. Push Database Schema

Push the Prisma schema to the database using the following command:

    pnpm db:push / yarn db:push / npm db:push

#### 5. Open Prisma Studio (Optional)

To view and interact with your database, you can launch Prisma Studio. This graphical interface allows you to manage your database models and records visually.

Run the following command:

    npx prisma studio

#### 6. Start the Development Server

Finally, start the development server to run the application. This will launch the project, allowing you to view it locally.

    pnpm run dev / yarn dev / npm run dev


## Screenshots

Login / Register

![Imgur](https://imgur.com/lJIk922.jpg)

Dashboard


![Imgur](https://imgur.com/2dmUnBU.jpg)


## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.



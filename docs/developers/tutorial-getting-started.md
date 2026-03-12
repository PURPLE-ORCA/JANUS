# Tutorial: Getting Started

Welcome to the development team for JANUS. This tutorial will guide you through setting up your local environment, running the application, and understanding our specific deployment constraints.

* **Audience:** Full-stack engineers (Laravel/React) joining the project.
* **Goal:** Successfully launch the JANUS monolith locally and understand the Hostinger deployment context.

## 1. Environment Setup

JANUS is a standard Laravel 12 application using Inertia.js and React.

### Requirements
* PHP 8.2+
* Composer
* Bun (used as the primary package manager for Node dependencies)
* PostgreSQL

### Step-by-step Installation

1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/PURPLE-ORCA/JANUS.git
   cd JANUS
   composer install
   bun install
   ```

2. **Configure your `.env` file:**
   Duplicate the example file and generate an application key.
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Configure the Database (PostgreSQL):**
   Update your `.env` to point to a local PostgreSQL database instance.
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=janus_local
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

4. **Run Migrations and Seeders:**
   JANUS relies heavily on seeded data for development.
   ```bash
   php artisan migrate:fresh --seed
   ```

## 2. Running the Application

Because JANUS is a monolith using Inertia, you need to run two servers concurrently during development.

1. **Start the Laravel backend API/Server:**
   ```bash
   php artisan serve
   ```
   *(Usually runs on `http://127.0.0.1:8000`)*

2. **Start the Vite development server (for React/Tailwind Hot Reloading):**
   ```bash
   bun run dev
   ```

Visit `http://localhost:8000` in your browser. You should see the public landing page.

## 3. Hostinger Deployment Constraints

JANUS is deployed on a standard shared hosting environment (Hostinger). This dictates certain architectural choices you must respect while developing:

### A. Storage & Symlinks
We use the `public` disk driver, avoid AWS S3. 
You must run `php artisan storage:link` locally. 
> *Note for deployment:* On shared hosting, symlinks sometimes fail. We may employ a specific PHP script or cron job to generate the symlink if SSH access isn't available.

### B. Build Process
We do not run `npm run build` or `bun run build` on the production server. 
The production workflow dictates that we build locally and commit the compiled `build/` folder to a deployment branch, or transfer assets via FTP.

### C. Queue System
We use the `database` driver for queues (email sending, heavy processing) because setting up Redis on basic shared hosting isn't always reliable.
When developing email-related features locally, remember to run a queue worker to process jobs:
```bash
php artisan queue:work
```

## Next Steps

Now that you have the app running locally, log in using one of the seeded administrator accounts to explore the "God Mode" dashboard, or view the candidate portals. 

For adding new functionality, refer to the [How to Add a New Feature](how-to-add-new-feature.md) guide.

# Laravel 12 Skeleton Application

This is a fresh Laravel 12 skeleton application that provides a robust foundation for building modern PHP web applications. Laravel is a web application framework with expressive, elegant syntax designed to make development an enjoyable and creative experience. The framework eases common tasks used in many web projects such as routing, authentication, sessions, caching, and database operations.

The skeleton comes pre-configured with essential components including user authentication scaffolding, database migrations for users with password reset tokens and sessions, a queue system with job batching for background job processing, cache storage tables, and a complete testing suite. It uses SQLite as the default database driver and includes Vite for modern frontend asset compilation. The application follows Laravel's MVC architecture pattern with a streamlined bootstrap configuration using the new `Application::configure()` method, service providers, middleware configuration, and console command registration. Laravel 12 introduces improved developer experience with new Composer scripts including a `dev` script that runs the server, queue listener, logs viewer (Pail), and Vite concurrently, plus a health check endpoint at `/up` for monitoring application status.

## User Model and Authentication

### User Model with Factory Support

The User model extends Laravel's Authenticatable class and provides user management functionality with built-in authentication features, including password hashing, email verification support, remember token handling, and notification capabilities. In Laravel 12, the model uses a method-based approach for attribute casting instead of the property-based approach.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}

// Creating a new user with hashed password
$user = User::create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'password' => 'secret123', // Automatically hashed
]);

// Accessing user attributes
echo $user->name; // "John Doe"
echo $user->email_verified_at?->format('Y-m-d'); // null or date

// Using with authentication
if (Auth::attempt(['email' => 'john@example.com', 'password' => 'secret123'])) {
    $authenticatedUser = Auth::user();
    echo "Welcome, {$authenticatedUser->name}!";
}

// Sending notifications
$user->notify(new WelcomeNotification());
```

### User Factory for Testing and Seeding

The UserFactory generates fake user data for testing and database seeding using Faker library, providing realistic test data with proper password hashing. The factory includes an `unverified()` state method for creating users without email verification.

```php
<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}

// Create a single user with default password 'password'
$user = User::factory()->create();

// Create multiple users
$users = User::factory()->count(10)->create();

// Create an unverified user
$unverifiedUser = User::factory()->unverified()->create([
    'email' => 'test@example.com',
]);

// Create a user with specific attributes
$admin = User::factory()->create([
    'name' => 'Admin User',
    'email' => 'admin@example.com',
]);
```

## Database Migrations and Schema

### User Authentication Tables Migration

This consolidated migration creates the users table for storing user accounts with authentication fields including email verification timestamp, password hash, and remember token for persistent authentication. It also creates the password_reset_tokens table for password recovery functionality and the sessions table for database-backed session management with user tracking and IP address logging.

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};

// Run migrations
// php artisan migrate

// Rollback migrations
// php artisan migrate:rollback

// Fresh migration (drop all tables and re-run)
// php artisan migrate:fresh

// Seed after migration
// php artisan migrate --seed

// Query the tables
$users = DB::table('users')->get();
$user = DB::table('users')->where('email', 'john@example.com')->first();
$activeSessions = DB::table('sessions')->where('user_id', $user->id)->get();
```

### Cache Storage Migration

This migration creates cache storage tables for database-backed caching, including a cache_locks table for atomic lock operations to prevent race conditions in distributed systems.

```php
<?php

// Cache Tables Migration
// File: 0001_01_01_000001_create_cache_table.php
Schema::create('cache', function (Blueprint $table) {
    $table->string('key')->primary();
    $table->mediumText('value');
    $table->integer('expiration');
});

Schema::create('cache_locks', function (Blueprint $table) {
    $table->string('key')->primary();
    $table->string('owner');
    $table->integer('expiration');
});

// Usage examples
Cache::put('user.1', $user, now()->addMinutes(10));
$user = Cache::get('user.1');

// Using cache locks to prevent race conditions
Cache::lock('process-order-123', 10)->get(function () {
    // Only one process can execute this at a time
    $order = Order::find(123);
    $order->process();
});
```

### Jobs and Queue Management Migration

The jobs migration creates tables for Laravel's queue system, including support for job batching which allows grouping related jobs together and tracking their collective progress and failures.

```php
<?php

// Jobs and Queue Tables Migration
// File: 0001_01_01_000002_create_jobs_table.php
Schema::create('jobs', function (Blueprint $table) {
    $table->id();
    $table->string('queue')->index();
    $table->longText('payload');
    $table->unsignedTinyInteger('attempts');
    $table->unsignedInteger('reserved_at')->nullable();
    $table->unsignedInteger('available_at');
    $table->unsignedInteger('created_at');
});

Schema::create('job_batches', function (Blueprint $table) {
    $table->string('id')->primary();
    $table->string('name');
    $table->integer('total_jobs');
    $table->integer('pending_jobs');
    $table->integer('failed_jobs');
    $table->longText('failed_job_ids');
    $table->mediumText('options')->nullable();
    $table->integer('cancelled_at')->nullable();
    $table->integer('created_at');
    $table->integer('finished_at')->nullable();
});

Schema::create('failed_jobs', function (Blueprint $table) {
    $table->id();
    $table->string('uuid')->unique();
    $table->text('connection');
    $table->text('queue');
    $table->longText('payload');
    $table->longText('exception');
    $table->timestamp('failed_at')->useCurrent();
});

// Dispatching jobs
SendEmailJob::dispatch($user);

// Dispatching jobs with delay
SendReminderEmail::dispatch($user)->delay(now()->addMinutes(5));

// Job batching
Bus::batch([
    new ProcessImport($file1),
    new ProcessImport($file2),
    new ProcessImport($file3),
])->then(function (Batch $batch) {
    // All jobs completed successfully
})->catch(function (Batch $batch, Throwable $e) {
    // First batch job failure detected
})->finally(function (Batch $batch) {
    // The batch has finished executing
})->dispatch();

// Failed job monitoring
$failedJobs = DB::table('failed_jobs')->get();
```

## Routing and Web Endpoints

### Web Routes Configuration

The web routes file defines HTTP endpoints accessible through the browser, with middleware for web features like sessions, CSRF protection, and cookie encryption automatically applied. The application includes a default welcome page route.

```php
<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Custom route examples:

// Simple route with closure
Route::get('/hello', function () {
    return response()->json([
        'message' => 'Hello World',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Route with parameters
Route::get('/users/{id}', function ($id) {
    $user = User::findOrFail($id);
    return response()->json($user);
});

// Route with controller
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware('auth');

// Resource routes for CRUD operations
Route::resource('posts', PostController::class);

// Grouped routes with middleware
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
});
```

### Health Check Endpoint

Laravel 12 includes a built-in health check endpoint at `/up` configured in the bootstrap file, useful for monitoring application availability in load balancers and container orchestration systems.

```php
<?php

// Health check endpoint configured in bootstrap/app.php
// GET /up
// Returns 200 OK if application is running

// Test the health endpoint
curl http://localhost:8000/up

// Use in Docker health checks
// HEALTHCHECK CMD curl -f http://localhost:8000/up || exit 1

// Use in Kubernetes liveness probe
// livenessProbe:
//   httpGet:
//     path: /up
//     port: 8000
```

### Console Commands and Artisan

The console routes file registers custom Artisan commands that can be executed from the command line for maintenance, automation, and administrative tasks.

```php
<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Custom command examples:

// Command with arguments and options
Artisan::command('users:cleanup {days=30} {--force}', function ($days, $force) {
    $this->info("Cleaning up users inactive for {$days} days...");

    if (!$force && !$this->confirm('Are you sure?')) {
        $this->error('Operation cancelled');
        return 1;
    }

    $deleted = User::where('last_login_at', '<', now()->subDays($days))->delete();
    $this->info("Deleted {$deleted} users");

    return 0;
})->purpose('Clean up inactive users');

// Execute from command line:
// php artisan inspire
// php artisan users:cleanup 60 --force
```

## Database Seeding

### Database Seeder for Initial Data

The DatabaseSeeder class populates the database with initial or test data, useful for development environments and automated testing scenarios. It uses the `WithoutModelEvents` trait to prevent model events from firing during seeding for better performance.

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Create test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create multiple users
        // User::factory(10)->create();

        // Create admin user
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('admin123'),
        ]);

        // Create users with specific states
        User::factory()->unverified()->count(5)->create();
    }
}

// Run seeder
// php artisan db:seed

// Run specific seeder
// php artisan db:seed --class=DatabaseSeeder

// Fresh migration with seeding
// php artisan migrate:fresh --seed
```

## Application Configuration

### Application Bootstrap and Setup

Laravel 12 introduces a streamlined bootstrap configuration using the `Application::configure()` method. This new approach replaces the traditional HTTP Kernel and Console Kernel classes with a more intuitive fluent interface for configuring routing, middleware, and exception handling.

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Configure middleware
        // $middleware->append(CustomMiddleware::class);
        // $middleware->group('api', [
        //     ThrottleRequests::class.':api',
        //     SubstituteBindings::class,
        // ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Configure exception handling
        // $exceptions->report(function (InvalidOrderException $e) {
        //     Log::error('Invalid order', ['exception' => $e]);
        // });
    })->create();

// The new configuration provides:
// - Automatic route registration with health check support
// - Fluent middleware configuration
// - Simplified exception handling setup
// - Better IDE support with type hints
```

### Environment Configuration

Environment variables control application behavior across different deployment environments, configured via the .env file for security and flexibility. Laravel 12 adds new configuration options for maintenance mode, bcrypt rounds, and improved logging controls.

```bash
# .env example
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:generated_key_here
APP_DEBUG=true
APP_URL=http://localhost

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
# APP_MAINTENANCE_STORE=database

# PHP_CLI_SERVER_WORKERS=4

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

CACHE_STORE=database
QUEUE_CONNECTION=database

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local

MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

VITE_APP_NAME="${APP_NAME}"
```

```php
<?php

// Accessing environment variables in code
$appName = env('APP_NAME', 'Laravel');
$isDebug = env('APP_DEBUG', false);
$dbConnection = env('DB_CONNECTION', 'mysql');
$bcryptRounds = env('BCRYPT_ROUNDS', 12);

// Using config facade (cached, preferred)
$appName = config('app.name');
$timezone = config('app.timezone', 'UTC');
$cacheDriver = config('cache.default');
$maintenanceDriver = config('app.maintenance.driver');

// Setting config values at runtime
config(['app.name' => 'My Application']);

// Generate application key
// php artisan key:generate
```

## Testing Framework

### Feature Testing

Feature tests verify application behavior from an HTTP perspective, testing routes, middleware, and full request/response cycles. Laravel 12 maintains the robust testing framework with PHPUnit support.

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_health_check_endpoint_works(): void
    {
        $response = $this->get('/up');
        $response->assertStatus(200);
    }

    public function test_user_can_view_dashboard_when_authenticated(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertSee($user->name);
    }

    public function test_unauthenticated_user_redirected_to_login(): void
    {
        $response = $this->get('/dashboard');
        $response->assertRedirect('/login');
    }

    public function test_user_can_be_created_via_api(): void
    {
        $response = $this->postJson('/api/users', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['id', 'name', 'email']);
        $this->assertDatabaseHas('users', ['email' => 'jane@example.com']);
    }

    public function test_session_stored_in_database(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/');

        $this->assertDatabaseHas('sessions', [
            'user_id' => $user->id,
        ]);
    }
}

// Run tests
// php artisan test
// php artisan test --filter ExampleTest
// php artisan test --coverage
```

## Service Providers

### Application Service Provider

Service providers bootstrap application services, registering bindings in the container and performing setup tasks when the application boots. The AppServiceProvider provides the primary location for application-level service registration.

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Register bindings in the service container
        // $this->app->singleton(ApiClient::class, function ($app) {
        //     return new ApiClient(config('services.api.key'));
        // });
    }

    public function boot(): void
    {
        // Bootstrap application services
        // Model::preventLazyLoading(!app()->isProduction());

        // Share data with all views
        // View::share('appName', config('app.name'));

        // Register custom validation rules
        // Validator::extend('uppercase', function ($attribute, $value) {
        //     return strtoupper($value) === $value;
        // });

        // Configure maintenance mode
        // Model::unguard();
    }
}

// Using registered services
// $apiClient = app(ApiClient::class);
// $apiClient->fetchData();
```

## Development Workflow and Commands

### Common Development Commands

Laravel provides a rich set of Artisan commands for development, testing, and maintenance tasks. Laravel 12 introduces enhanced Composer scripts for streamlined development workflow.

```bash
# Quick setup script (install dependencies, configure, migrate, build)
composer setup

# Start development environment (server, queue, logs, vite concurrently)
composer dev
# This runs: artisan serve, queue:listen, pail (logs), and npm run dev

# Run tests
composer test
# Or use artisan directly:
php artisan test
php artisan test --filter=ExampleTest

# Start development server
php artisan serve
# Default: http://localhost:8000

# Run on specific host and port
php artisan serve --host=0.0.0.0 --port=8080

# Database operations
php artisan migrate              # Run migrations
php artisan migrate:fresh        # Drop all tables and re-run migrations
php artisan migrate:fresh --seed # Fresh migration with seeding
php artisan db:seed              # Run database seeders

# Queue operations
php artisan queue:work           # Process queued jobs
php artisan queue:listen         # Listen for new jobs (auto-restart)
php artisan queue:work --tries=3 --timeout=60
php artisan queue:failed         # List failed jobs
php artisan queue:retry all      # Retry all failed jobs

# View logs with Pail (new in Laravel 11+)
php artisan pail                 # Real-time log viewing
php artisan pail --timeout=0     # No timeout

# Asset compilation (Vite)
npm install                      # Install Node dependencies
npm run dev                      # Start Vite dev server
npm run build                    # Build for production

# Cache and optimization
php artisan config:cache         # Cache configuration
php artisan route:cache          # Cache routes
php artisan view:cache           # Compile Blade views
php artisan optimize             # Optimize the framework
php artisan optimize:clear       # Clear all caches

# Maintenance mode
php artisan down                 # Put app in maintenance mode
php artisan up                   # Bring app out of maintenance mode

# Interactive REPL
php artisan tinker               # Interactive shell

# View routes
php artisan route:list           # Display all registered routes

# Generate application key
php artisan key:generate         # Set APP_KEY in .env

# Health check
curl http://localhost:8000/up    # Test health endpoint
```

### Advanced Composer Scripts

Laravel 12 skeleton includes sophisticated Composer scripts for automating common development tasks with proper dependency handling and concurrent execution.

```json
{
    "scripts": {
        "setup": [
            "composer install",
            "@php -r \"file_exists('.env') || copy('.env.example', '.env');\"",
            "@php artisan key:generate",
            "@php artisan migrate --force",
            "npm install",
            "npm run build"
        ],
        "dev": [
            "Composer\\Config::disableProcessTimeout",
            "npx concurrently -c \"#93c5fd,#c4b5fd,#fb7185,#fdba74\" \"php artisan serve\" \"php artisan queue:listen --tries=1\" \"php artisan pail --timeout=0\" \"npm run dev\" --names=server,queue,logs,vite --kill-others"
        ],
        "test": [
            "@php artisan config:clear --ansi",
            "@php artisan test"
        ]
    }
}
```

## Summary

This Laravel 12 skeleton application serves as a comprehensive starting point for building modern PHP web applications with enterprise-grade architecture and the latest framework innovations. The primary use cases include developing RESTful APIs with built-in health monitoring, building traditional server-rendered web applications with Blade templating, creating single-page applications with API backends, implementing authentication and authorization systems with database-backed sessions, processing background jobs through the queue system with job batching support, and utilizing database-backed caching for improved performance. The skeleton is particularly well-suited for rapid prototyping while maintaining production-ready code structure, improved developer experience with concurrent development tools, and modern PHP 8.2+ features.

Integration patterns follow Laravel's convention-over-configuration philosophy with the new streamlined bootstrap configuration replacing traditional kernel classes, service providers for dependency injection, Eloquent ORM for database interactions, middleware configured through fluent interfaces, and events for decoupled application components. The application supports multiple database drivers (SQLite, MySQL, PostgreSQL, SQL Server), various caching backends (database, Redis, Memcached) with atomic lock support, and flexible session storage options including database-backed sessions with user tracking. Queue workers can be configured for different backends including database, Redis, and Amazon SQS, with built-in job batching for managing related jobs collectively. The framework includes comprehensive testing support with PHPUnit, Vite for modern frontend asset compilation, Laravel Pail for real-time log viewing, and enhanced Composer scripts for streamlined development workflows including the `composer dev` command that runs server, queue, logs, and asset compilation concurrently. The new `Application::configure()` bootstrap pattern provides better IDE support and type safety, while the built-in health check endpoint at `/up` enables easy integration with container orchestration systems and load balancers, making it ideal for teams seeking a balance between developer productivity, modern development practices, and code maintainability.

# MarketAI 🚀 - The Next-Gen AI Sales Page Builder

MarketAI is a high-performance visual editor and AI copywriting engine designed to transform product ideas into high-converting sales pages in seconds. Built with a focus on elite UX and robust AI architecture.

## 🌟 Key Features

- **Dual-Engine AI (Gemini 2.5 & 2.0)**: Implementing a sophisticated multi-model failover strategy. If one model is unavailable, the system automatically discovers and switches to the next available high-performance model.
- **Magic Rewrite Toolbar**: Real-time AI content manipulation. Highlight any text to instantly shorten, expand, or rewrite it with a specific conversion tone (Persuasive, Professional, Witty).
- **Modular Visual Builder**: A "What You See Is What You Get" editor with rich text support, section management (FAQ & Testimonials), and live mobile/desktop viewport switching.
- **WhatsApp Lead Capture**: Seamlessly integrate WhatsApp Business as a primary CTA, complete with automated custom messages per project.
- **Dynamic Theme Engine**: Switch between multiple premium themes (Dark Tech, Vibrant, Corporate, Minimalist) with a single click.
- **One-Click HTML Export**: Export fully functional, standalone sales pages ready for production hosting.

## 🛠️ Technical Stack

- **Backend**: Laravel 11 (PHP 8.2+)
- **Frontend**: React 18 with Inertia.js (Modern Monolith Architecture)
- **AI Integration**: Google Gemini API (with custom Failover Logic)
- **Styling**: TailwindCSS & Framer Motion (for premium micro-animations)
- **Icons**: Lucide React
- **Database**: PostgreSQL / MySQL

## 🧠 Architecture Highlights

### AI Multi-Model Failover Logic
To ensure 100% uptime, MarketAI doesn't rely on a single AI model. The `GeminiService` implements a discovery loop that iterates through:
1. `gemini-2.5-flash` (Cutting-edge speed & reasoning)
2. `gemini-2.0-flash` (High performance)
3. `gemini-1.5-flash` (Stable fallback)
4. `gemini-pro-latest` (Pro reasoning)

This ensures that even during API outages or model deprecations, the user experience remains uninterrupted.

### Data Persistence Pattern
Uses a safe DTO (Data Transfer Object) pattern for handling AI responses and manual edits, ensuring that generated copy is safely merged and validated before being persisted to the JSON-column in the database.

## 🚀 Quick Start & Demo

### Online Demo
[Link to your production site here]

### Local Setup

#### ⚡ Quick Start (Recommended)
If you are on Windows, simply run:
```bash
./setup.bat
```
This will automatically install dependencies, run migrations, and seed the demo account.

#### 🛠️ Manual Installation
1. Clone the repository.
2. Run `composer install` and `npm install`.
3. Configure your `.env` with a `GEMINI_API_KEY` and database credentials.
4. Run migrations with seeders:
   ```bash
   php artisan migrate --seed
   ```
5. Build assets and start the server:
   ```bash
   npm run build
   php artisan serve
   ```

### 🔑 Demo Credentials
- **Email**: `demo@marketai.com`
- **Password**: `demo123456`

---
Developed with ❤️ for the Modern Marketer.

# MarketAI: Professional AI Sales Page Generator 🚀

**MarketAI** is a production-ready SaaS application that transforms raw product/service information into high-conversion, structured sales pages. Powered by Gemini AI for copywriting and Pollinations AI for visual generation, it offers a seamless "What You See Is What You Get" experience for entrepreneurs and marketers.

![MarketAI Dashboard](https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80)

## 🌟 Key Features

- **AI-Driven Copywriting**: Leverages Gemini AI to generate persuasive headlines, subheadlines, and sales copy based on minimal product data.
- **Magic AI Images**: Automatically generates relevant hero imagery using a custom AI Visual Engine (Pollinations.ai) with smart category fallbacks.
- **Visual Builder**: Edit your sales page in real-time with an inline `contentEditable` editor.
- **Section-by-Section Regeneration**: Not happy with a specific headline or CTA? Regenerate individual sections with a single click.
- **5 Premium Themes**: Instantly switch between Modern SaaS, Corporate Elite, Vibrant Pulse, Dark Tech, and Minimalist Luxury styles.
- **Standalone Export**: Download your generated sales page as a production-ready HTML/CSS file.
- **Complete History**: Manage, edit, and delete past generations with a sleek Framer Motion-powered dashboard.

## 🛠️ Tech Stack

- **Backend**: Laravel 11 (PHP)
- **Frontend**: React (TypeScript), Inertia.js
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, Lucide React (Icons)
- **AI Models**: 
  - Google Gemini AI (Text Generation)
  - Pollinations AI (Visual Generation)
- **Database**: MySQL/PostgreSQL

## 🚀 Getting Started

### Prerequisites
- PHP 8.2+
- Node.js 18+
- Composer
- A Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/market-ai.git
   cd market-ai
   ```

2. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your database credentials and Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Database & Migrations**
   ```bash
   php artisan key:generate
   php artisan migrate
   ```

5. **Run Development Server**
   ```bash
   php artisan serve
   # In another terminal
   npm run dev
   ```

## 🎨 Design Themes

MarketAI comes with 5 curated themes to match any brand identity:
- **Modern SaaS**: Clean, Indigo-focused professional look.
- **Corporate Elite**: Serious, Slate-toned serif typography for enterprise.
- **Vibrant Pulse**: High-energy gradients and bold fonts.
- **Dark Tech**: Matrix-style neon green and black aesthetic.
- **Minimalist Luxury**: Simple, high-end white-space focused design.

## 📝 License
Distributed under the MIT License.

---
Built with ❤️ by Aries Jakaradytia Mustika - 2026

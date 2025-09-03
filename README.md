# Bozor Front

A Vue.js Single Page Application (SPA) built with modern web technologies.

## Features

- ⚡️ **Vue 3** - Progressive JavaScript framework
- 🚦 **Vue Router** - Official router for Vue.js
- 🗃️ **Pinia** - Intuitive, type safe store for Vue
- ⚡️ **Vite** - Next generation frontend tooling
- 🎨 **ESLint + Prettier** - Code quality and formatting
- 📱 **Responsive Design** - Mobile-first approach

## Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint and fix files
npm run lint
```

## Project Structure

```
bozor_front/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable Vue components
│   ├── router/            # Vue Router configuration
│   ├── stores/            # Pinia stores
│   ├── views/             # Page components
│   ├── App.vue            # Root component
│   ├── main.js            # Application entry point
│   └── style.css          # Global styles
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
└── package.json           # Project dependencies
```

## Development

This project uses:

- **Vue 3** with Composition API
- **Vite** for fast development and building
- **Vue Router** for client-side routing
- **Pinia** for state management
- **ESLint** for code linting
- **Prettier** for code formatting

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint and fix code

## Browser Support

This project supports all modern browsers that support ES2015+.

## License

MIT

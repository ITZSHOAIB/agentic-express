# Agentic Express 🚀

Agentic Express is a TypeScript-based npm package designed to accelerate REST agent application development on top of Express.js. By providing prebuilt utilities, middleware, and patterns, it allows developers to focus on building Langgraph agents without worrying about the underlying REST infrastructure.

## ☄️ Features
- **Express.js Simplified**: Prebuilt middleware and utilities to streamline REST API development.
- **Langgraph Agent Focus**: Designed to complement Langgraph agent development by handling REST concerns.
- **TypeScript Support**: Fully typed for safer and more predictable development.
- **Scalable Patterns**: Encourages best practices for building scalable and maintainable applications.

## ⚒️ Installation

Install the package via npm or yarn:

```bash
pnpm add agentic-express
# or
npm install agentic-express
# or
yarn add agentic-express
```

## 👀 Usage

Here's how you can use Agentic Express to build a REST agent app:

```typescript
import express from 'express';
import { AgenticExpress } from 'agentic-express';

const app = express();

// Set up the app with Agentic Express middleware
const agenticExpressMiddleware = new AgenticExpress({
  graphStream: invokeGraph,
}).setup();

// Add the middleware to the express app
app.use("/", agenticExpressMiddleware);

// Start the server
app.listen(3000, () => {
  console.log('Agentic Express server is running on http://localhost:3000');
});
```

## 🤝 Contribution

We welcome contributions! Please see the [CONTRIBUTING.md](.github/CONTRIBUTING.md) file for detailed guidelines on how to contribute.


## 📜 License

This project is licensed under the MIT License. See the [LICENSE file](/LICENSE) for details.


---

Created with ❤️ by Sohab Sk
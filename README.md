# TypeScript Library Starter 🚀

Welcome to the **TypeScript Library Starter**! This template is designed to help you kickstart your TypeScript library development with ease. It includes all the necessary tools and configurations to get you up and running quickly.

> [!NOTE]
> This is **[ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)** only

## Features ✨

- **TypeScript** for type-safe code
- **Vitest** for testing
- **Biome** for linting and formatting
- **Changesets** for versioning and changelogs
- **GitHub Actions** for CI/CD
- **Automated NPM Release** for hassle-free release
- **simple-git-hooks** for better collaboration

## Getting Started 🛠️

### Prerequisites

- **Node.js (>= 20.0.0)**
- **pnpm (>= 9.12.0)**

### Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/ITZSHOAIB/typescript-library-starter.git
    cd typescript-library-starter
    ```

2. **Install dependencies**:
    ```sh
    pnpm i
    ```

## Usage 📚

After the installation, you can start using your library in your projects. Here's an example of how to import and use your library:

- Replace `typescript-library-starter` with the actual name of your library as specified in your package.json along with other appropriate fields as well.

- Note: If the GitHub Actions workflow is currently disabled, you can enable it by removing any comments or disabling flags in the workflow configuration files located in the `.github/workflows` directory.

- Note: To enable pre-commit hooks, run the following command:
    ```sh
    pnpm prepare
    ```

- For **Automated NPM Release**, add NPM token in github repository's secrets with key named `NPM_TOKEN`

## Contributing 🤝

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request. Follow these steps to contribute:

1. **Fork the repository**:
    Click the "Fork" button on the top right of the repository page.

2. **Clone your fork**:
    ```sh
    git clone https://github.com/your-username/typescript-library-starter.git
    cd typescript-library-starter
    ```

3. **Create a new branch**:
    ```sh
    git checkout -b feature/your-feature-name
    ```

4. **Make your changes** and **commit**:
    ```sh
    git commit -m "Add your commit message"
    ```

5. **Push to your fork**:
    ```sh
    git push origin feature/your-feature-name
    ```

6. **Create a pull request**:
    Go to the original repository and click the "New pull request" button.

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

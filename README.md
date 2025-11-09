# AI Schema Generator

[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini-blueviolet)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-informational)](https://tailwindcss.com/)

An advanced AI tool that transforms any data source—be it an image, PDF, CSV, URL, or plain text—into a complete, production-ready backend specification. It generates a normalized SQL database schema, a full-featured REST API definition, a visual ERD diagram, and detailed design reasoning in seconds.

## Overview

The AI Schema Generator is designed to dramatically accelerate the backend design and prototyping phase for developers. By leveraging the powerful reasoning capabilities of Google's Gemini model, this application automates the tedious process of data modeling and API design. Simply provide a data source, and the AI will act as an expert software architect to deliver a comprehensive set of development assets.

![Application Screenshot](https://storage.googleapis.com/aistudio-hosting/project-assets/readme-images/ai-schema-generator-demo.png)

## Key Features

-   **Multi-Source Data Input**: Accepts a wide variety of inputs to suit any workflow:
    -   **File Upload**: Upload images (`.png`, `.jpg`), documents (`.pdf`), or data files (`.csv`).
    -   **From URL**: Analyze data directly from public URLs, including Google Sheets.
    -   **From Text**: Describe your data requirements using natural language.
-   **AI-Powered Asset Generation**: Utilizes the Google Gemini API to intelligently analyze your data and generate a complete backend specification.
-   **Comprehensive Outputs**: Produces four critical, ready-to-use assets:
    1.  **SQL Database Schema**: Well-structured and normalized `CREATE TABLE` statements with appropriate data types and keys.
    2.  **REST API (OpenAPI 3.0)**: A complete OpenAPI specification in YAML format, detailing CRUD endpoints for each data entity.
    3.  **Entity-Relationship Diagram (ERD)**: A clean, visual diagram of the database schema rendered using Mermaid.js.
    4.  **Design Reasoning**: A clear, human-readable explanation of the AI's architectural choices, explaining why tables, columns, and relationships were designed a certain way.
-   **Interactive & Modern UI**: A sleek, responsive, and user-friendly interface built with React and Tailwind CSS, featuring a tabbed view to easily switch between the generated assets.
-   **Instant Simulated Deployment**: A "Deploy Now" feature that generates a realistic, shareable URL to a live, self-contained API explorer page, perfectly simulating the result of a real-world deployment.

## How It Works

The application follows a simple yet powerful workflow:

1.  **Input**: The user selects an input method (file, URL, or text) and provides the data source.
2.  **Prompting**: The frontend constructs a detailed prompt for the Gemini model. This prompt instructs the AI to act as a world-class software architect and to return a structured JSON object containing all the required assets.
3.  **API Call**: The request is sent to the Gemini API using its Function Calling and JSON mode capabilities to ensure a reliable, structured response.
4.  **Parsing & Display**: The application receives the JSON response, parses it, and dynamically renders each asset in the appropriate tab (`SQL`, `API`, `Diagram`, `Reasoning`).
5.  **Deployment Simulation**: When the user clicks "Deploy", the app generates a complete, self-contained HTML page for the API explorer using the generated endpoint data. This page is then opened in a new tab with a unique blob URL, providing an instant and functional API documentation site.

## Tech Stack

-   **Frontend**: React 19, TypeScript
-   **Styling**: Tailwind CSS
-   **AI Model**: Google Gemini API (`@google/genai`)
-   **Diagramming**: Mermaid.js
-   **Environment**: Vite-based setup running within a cloud development environment.

## Project Structure

The project is organized into a modular and maintainable structure:

```
/
├── public/
├── src/
│   ├── components/       # Reusable React components (InputPanel, CodeDisplay, etc.)
│   ├── services/         # Logic for interacting with the Gemini API (geminiService.ts)
│   ├── types.ts          # Core TypeScript type definitions
│   ├── App.tsx           # Main application component and state management
│   ├── index.tsx         # React application entry point
│   └── ...
├── index.html            # Main HTML file
└── metadata.json         # Application metadata
```

## Getting Started

This project is designed to run in an environment where the Gemini API key is securely managed.

### Prerequisites

-   Node.js and npm (or a compatible package manager).
-   A Google Gemini API key set as an environment variable (`API_KEY`).

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up your environment:**
    -   Create a `.env` file in the root directory.
    -   Add your Gemini API key to the file: `API_KEY=your_api_key_here`
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will now be running on your local development server.

## Contributing

Contributions are welcome! If you have ideas for new features or find any bugs, please follow these steps:

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/your-awesome-feature`).
3.  Make your changes and commit them (`git commit -m 'Add some awesome feature'`).
4.  Push to the branch (`git push origin feature/your-awesome-feature`).
5.  Open a Pull Request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
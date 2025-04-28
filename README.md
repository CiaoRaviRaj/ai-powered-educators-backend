# Wings AI-Powered Educators Backend

A powerful backend service for the Wings AI-Powered Educators platform, designed to help educators leverage AI for creating and managing educational content.

## Technologies

- Node.js
- Express.js
- MongoDB
- Google Gemini API
- OpenAI API
- JWT Authentication

## Prerequisites

- Node.js (version in .nvmrc)
- MongoDB
- Google Gemini API key
- OpenAI API key (optional)

## Getting Started

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ai-powered-educators-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wings-ai
JWT_SECRET=your_jwt_secret
GOOGLE_GEN_API_KEY=your_google_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Running the Application

For development:

```bash
npm start
```

The server will start on the port specified in your `.env` file (default 5000).

## API Routes

The API provides various endpoints for:

- User authentication
- Assignment management
- Course management
- AI model integration

Refer to the routes directory for detailed endpoint information.

## Project Structure

- `/controllers` - Logic for handling requests and responses
- `/models` - Database models and schemas
- `/routes` - API route definitions
- `/middleware` - Custom middleware functions
- `/helpers` - Utility helper functions
- `/services` - Service layer for business logic
- `/constants` - Constant values and enums
- `/uploads` - Directory for uploaded files

## Deployment

This project is configured for deployment on Render using the `render.yaml` file.

### Deployment Steps

1. Push your code to a Git repository
2. Connect your repository to Render
3. The services defined in `render.yaml` will be automatically configured
4. Add your environment variables in the Render dashboard
5. Deploy your application

## Environment Variables

The following environment variables are required:

| Variable           | Description                       |
| ------------------ | --------------------------------- |
| PORT               | The port the server will run on   |
| MONGODB_URI        | MongoDB connection string         |
| JWT_SECRET         | Secret key for JWT authentication |
| GOOGLE_GEN_API_KEY | Google Gemini API key             |
| OPENAI_API_KEY     | OpenAI API key (optional)         |

## License

ISC

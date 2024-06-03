# Movie Quotes

Movie Quotes is a Vue 3 application that allows users to share and interact with quotes from movies. Users can sign up, log in, and engage with the community by creating, liking, and commenting on movie quotes. The application also supports live notifications and profile management.

## Features

- User Authentication (Sign up, Sign in, Forgot Password, Reset Password)
- View and create movie quotes
- Like and comment on quotes
- Live notifications using Pusher and Laravel Echo
- Edit and remove movies and quote posts
- User profile management (change profile image, username, password)
- Localization support for English and Georgian using Vue i18n

## Technologies Used

- **Vue 3**
- **Axios**
- **Pusher**
- **Laravel Echo**
- **Vee Validate**
- **Tailwind CSS**
- **Vue i18n**
- **TypeScriot**

## Installation Instructions

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Step-by-Step Guide

1. **Clone the repository**:

   ```bash
   git clone git@github.com:RedberryInternship/front-movie-quotes-irakli-ketchekmadze.git
   cd movie-quotes
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**:

   - Create a `.env` file in the root directory.
   - Add necessary environment variables (e.g., API base URL, Pusher credentials).

4. **Run the development server**:
   ```bash
   npm run serve
   # or
   yarn serve
   ```

## Usage

To start using the application, run the development server as described above. You can then access the application at `http://localhost:8080` (or another port if specified).

## Configuration

The application requires several environment variables for configuration. Add these variables to your `.env` file:

```env
VUE_APP_API_BASE_URL=http://your-backend-url/api
VUE_APP_PUSHER_APP_KEY=your-pusher-app-key
VUE_APP_PUSHER_APP_CLUSTER=your-pusher-app-cluster
```

## Folder Structure

movie-quotes/
├── public/
├── src/
│ ├── assets/
│ ├── components/
│ ├── i18n/
│ ├── router/
│ ├── store/
│ ├── views/
│ ├── App.vue
│ └── main.js
├── .env
├── package.json
└── README.md

# Ticket Booking App

Simple web application built using Vite and JavaScript.

## Running the Project

To run the project, follow these steps:

1. Clone the repository to your computer:

   ```bash
   git clone https://github.com/DmytroRyzhko/digital-test.git
   ```

2. Navigate to the project folder:

   ```bash
   cd cinema-app
   ```

3. Install project dependencies using npm (or yarn):

   ```bash
   npm install
   ```

4. Start the Vite development server:

   ```bash
   npm run dev
   ```

5. Open your web browser and go to [http://127.0.0.1:5173](http://127.0.0.1:5173) to view the application.

## Known Issues

If you encounter the "Built file does not work because of CORS error" issue (for production build), it may be related to browser settings that block cross-origin requests.

The easiest way to fix this is to run

```bash
npx vite preview
```

For more details see https://vitejs.dev/guide/troubleshooting.html#build.

Also for local development, you can bypass this issue by opening your browser with a flag that disables the CORS policy. For Google Chrome, you can do this as follows:

```bash
google-chrome --disable-web-security --user-data-dir
```

**Be cautious when disabling the CORS policy for continued work with third-party websites and browsing the internet.**

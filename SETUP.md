# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Building for Production

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

## Environment Variables (Optional)

Create a `.env.local` file in the root directory if you need to store API keys:

```env
NEXT_PUBLIC_ALPHA_VANTAGE_KEY=your_key_here
NEXT_PUBLIC_FINNHUB_TOKEN=your_token_here
```

**Note**: For production deployments, use Next.js API routes to securely handle API keys server-side.

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, Next.js will automatically try the next available port (3001, 3002, etc.).

### CORS Errors
If you encounter CORS errors when testing APIs:
- The app automatically tries to use a proxy route (`/api/proxy`)
- For production, ensure your API routes are properly configured
- Some APIs require server-side requests only

### Module Not Found Errors
Run `npm install` again to ensure all dependencies are installed.

### Build Errors
- Ensure you're using Node.js 18 or higher
- Clear `.next` folder and `node_modules`, then reinstall:
  ```bash
  rm -rf .next node_modules
  npm install
  ```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Vercel will automatically detect Next.js and configure deployment

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Set Node version to 18 or higher

### Other Platforms
Follow Next.js deployment guides for your specific platform.

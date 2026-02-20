# Deployment Guide for SPA-CRM

This guide covers how to deploy the Admin Panel (`spa-crm`) to **Vercel** or **Netlify**.

> [!IMPORTANT]
> The Admin Panel connects to your Backend (`D:\backend`). For the deployed Admin Panel to work, **your Backend must also be deployed** and accessible via a public URL (e.g., `https://your-api.com`).
>
> You will need to update the API URL in your frontend code before deploying.

## 1. Prepare for Production

### Update API URL
Currently, `spa-crm` connects to `http://localhost:5000`. You need to change this to your deployed backend URL.

1.  Open `src/pages/AppointmentList.tsx` (and any other files making API calls).
2.  Replace `http://localhost:5000` with your *Production Backend URL* (or use an environment variable like `import.meta.env.VITE_API_URL`).

## 2. Deploy to Vercel (Recommended)

1.  **Push your code to GitHub/GitLab/Bitbucket**.
2.  Log in to [Vercel](https://vercel.com/).
3.  Click **"Add New..."** -> **"Project"**.
4.  Import your `spa-crm` repository.
5.  Vercel should automatically detect **Vite**.
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
    *   **Install Command:** `npm install`
6.  Click **Deploy**.

*Note: A `vercel.json` file has been added to handle Single Page Application (SPA) routing.*

## 3. Deploy to Netlify

1.  **Push your code to GitHub/GitLab/Bitbucket**.
2.  Log in to [Netlify](https://netlify.com/).
3.  Click **"Add new site"** -> **"Import from Git"**.
4.  Select your `spa-crm` repository.
5.  Netlify should detect the settings:
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist`
6.  Click **Deploy site**.

*Note: A `netlify.toml` file has been added to handle Single Page Application (SPA) routing.*

## 4. Manual / Static Hosting (Apache/Nginx)

If you are hosting on a traditional server:
1.  Run `npm run build` locally.
2.  Upload the contents of the `dist` folder to your server's public HTML folder.
3.  Configure your server to redirect all requests to `index.html` (SPA fallback).

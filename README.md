# Welcome to your Lovable project

## Project info

**URL**: [https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)

## How can I edit this code?

There are several ways of editing your application.

### Use Lovable

Simply visit the [Lovable Project](https://github.com/md610mursalin610-sudo/wedding-storybook.git) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

### Use your preferred IDE

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/md610mursalin610-sudo/wedding-storybook.git)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### Edit a file directly in GitHub

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

### Use GitHub Codespaces

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://github.com/md610mursalin610-sudo/wedding-storybook.git) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## How to add photos to the Gallery (Album)

You can add photos from either Google Drive or from local files under the `public/` folder.

### Option 1 — Add photos from Google Drive

- Make sure each file is shared as: Anyone with the link (Viewer).
- Copy the image link in any of these formats:
  - `https://drive.google.com/file/d/<FILE_ID>/view?usp=sharing`
  - `https://drive.google.com/open?id=<FILE_ID>&usp=sharing`
  - `https://drive.google.com/uc?id=<FILE_ID>`
- Open `src/pages/Index.tsx` and add items into the `weddingPhotos` array using the link in the `src` field.
- The app automatically converts Google Drive links to direct image URLs, and if loading fails, it will try the Drive thumbnail fallback.

Notes:

- Ensure the link has no trailing spaces or extra characters.
- Avoid malformed IDs (e.g., an ID ending with a dash `-` is invalid).
- File must be an image (jpg/png/webp). HEIC/HEIF or videos will not render in `<img>`.

### Option 2 — Add photos from local public folder

- Put your images into `public/album/` (you can create this folder).
- Reference them in `weddingPhotos` with a leading slash, e.g. `src: "/album/photo1.jpg"`.

### Where to edit the album items

- File: `src/pages/Index.tsx`
- Array: `weddingPhotos`
- Each photo object supports:
  - `id: number` — unique per item
  - `src: string` — Google Drive link or public path
  - `alt: string` — accessibility text
  - `category: string` — one of: `All` (implicit), `Ceremony`, `Reception`, `Portraits`, `Details`
  - `caption: string` — short description

### Download button behavior

- The Lightbox Download button works for both Google Drive and local images.
- For Drive images, it uses the proper `export=download` URL.

### Troubleshooting

- If a Google Drive image doesn’t show:
  - Open the direct view form to confirm it loads: `https://drive.google.com/uc?export=view&id=<FILE_ID>`
  - If that fails, try the thumbnail: `https://drive.google.com/thumbnail?id=<FILE_ID>&sz=w2000`
  - Recheck sharing permissions and the file type.
  - Remove duplicates and fix malformed IDs.

"# real-estate" 
Real Estate Website

A responsive real estate web application built with React for the frontend and Node.js/Express for the backend. This project allows users to list properties, upload property images, and view properties in a modern, interactive interface.

Live Demo

https://real-estate-iul2.vercel.app/


---

Features

Add new properties with details such as:

Title

Description

Type & Category

Location

Price

Bedrooms & Bathrooms

Size

Multiple images (with carousel functionality)


View available properties in a responsive grid.

Carousel functionality for property images with navigation arrows.

Drag-and-drop and click-to-upload image functionality.

Backend built with Node.js and Express connected to MongoDB.

Image storage handled using Cloudinary.

Fully responsive UI built with Tailwind CSS.

Navigation to add new property pages.



---

Technologies Used

Frontend: React, Tailwind CSS, React Router

Backend: Node.js, Express

Database: MongoDB, Mongoose

Image Upload: Cloudinary

Deployment: Vercel (frontend), Render / Heroku (backend)



---

Installation

1. Clone the repository



git clone https://github.com/<your-username>/real-estate.git
cd real-estate

2. Install frontend dependencies



cd frontend
npm install

3. Install backend dependencies



cd ../backend
npm install

4. Setup environment variables



Create a .env file in both frontend and backend:

Frontend .env

VITE_CLOUD_NAME=your_cloudinary_cloud_name
VITE_UPLOAD_PRESET=your_cloudinary_upload_preset
VITE_API_URL=http://localhost:5000

Backend .env

MONGO_URI=your_mongodb_connection_string
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

5. Run the application



Backend:


cd backend
npm run dev

Frontend:


cd frontend
npm run dev

The frontend will run at http://localhost:5173 by default, and the backend at http://localhost:5000.


---

Project Structure

real-estate/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── PropertyCard.jsx
│   │   ├── pages/
│   │   │   ├── AddProperty.jsx
│   │   │   └── PropertyList.jsx
│   │   └── services/api.js
│   └── ...
├── backend/            # Node/Express backend
│   ├── models/
│   │   └── Property.js
│   ├── routes/
│   │   └── properties.js
│   └── server.js
└── README.md


---

Usage

1. Navigate to the homepage to see a list of properties.


2. Click + Add Property to add a new listing with images.


3. Use the carousel arrows to browse through multiple images for a property.




---

Screenshots






---

License

This project is open source and available under the MIT License.


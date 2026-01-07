# **The Luxe Estate 🏛️✨**  
### _Luxury Clothing, Affordable Elegance_ 
## **Overview**  
**The Luxe Estate** is a premium e-commerce platform that brings the **Old Money** aesthetic to modern shoppers. It offers luxury clothing at **affordable prices**, allowing fashion enthusiasts to embrace timeless elegance without overspending.  

## **Features**  
- 🏷️ **Curated Luxury Collection** – High-end fashion pieces at unbeatable prices.  
- 🛍️ **Smooth Shopping Experience** – Intuitive UI/UX with easy navigation.  
- 🛒 **Universal Add-to-Cart** – Buttons are visible and functional on **every product card, detail page, and landing section**, complete with quantity selection and cart badge updates.  
- 🧭 **Smart Category Filtering** – `/men` and `/women` collections include filter chips (T-Shirts, Shirts, Trousers, etc.) powered by new `DataSeeds/*.json` files.  
- 🧱 **Consistent Layout & Branding** – Header/navbar keeps Luxe Estate’s round logo centered with nav links/controls aligned on a single row.  
- 🔄 **Real-Time Cart Updates** – Adjust quantities and remove items instantly.  
- 🚀 **Fast & Scalable** – Optimized backend with **Node.js, Express, and MongoDB**.  
- 🎨 **Modern & Responsive UI** – Styled with **React and Tailwind CSS**.  

## **Tech Stack**  
- **Frontend**: React, Tailwind CSS, Vite  
- **Backend**: Node.js, Express, MongoDB (No Mongoose)  
- **State Management**: React Hooks (useState, useEffect)  
- **API Handling**: Axios  

## **Recent Enhancements**
- ♻️ Rebuilt every dataset in `DataSeeds/` with luxury-branded entries so filtering and detail views stay accurate.  
- 🛒 Ensured Add to Cart flows work across cards, detail pages, and home highlights with identical visual styling.  
- 🧭 Added gender-page segment filters using `categorySlug` inference for better discovery.  
- 🧭 Implemented sticky header grid layout that centers the Luxe Estate logo while keeping nav links left and utility controls right.  
- 🎯 Optimized cart/wishlist handlers inside `GenderCollection` to reuse shared `ProductCard`.  

## **Contact & Socials**  
📧 **Email**: deepgoyani77@gmail.com  
🔗 **LinkedIn**: [Deep Goyani](https://www.linkedin.com/in/deepgoyani/)  

## **Deployments**
- 🌐 **Frontend (Vercel)**: https://luxe-estate-theta.vercel.app/
- ⚙️ **Backend (Render)**: https://luxe-estate-3.onrender.com/

### Environment Setup
Create a `.env` file inside `Frontend/vite-project` (or update `.env` if it exists) to point the app to the deployed backend:

```
VITE_API_BASE_URL=https://luxe-estate-3.onrender.com/api
VITE_ENABLE_CONVERSION_RATES=false
```

> Enable conversion rates by setting `VITE_ENABLE_CONVERSION_RATES=true` if the `/api/conversion-rates` endpoint is available in production.

## **API Documentation**  
📖 View the full API documentation **https://documenter.getpostman.com/view/39216507/2sAYdbPYVv**.

## **Figma Design**  
🎨 Check out the **Figma UI/UX design** **https://www.figma.com/design/8idhJAd1WOXAiQWHxvZPci/Kreep?node-id=110-1485&t=RT2QWcnHsCjIt9Yp-1**.

🌎 **Live Demo**: [The Luxe Estate](https://luxe-estate-theta.vercel.app/)  

⭐ _If you found this project useful, give it a star!_ ⭐  

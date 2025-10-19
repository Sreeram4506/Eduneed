# TODO: Make Frontend UI More Professional

## Tasks
- [ ] Update global styles in index.css for better typography and color scheme
- [ ] Redesign Navigation component with modern styling
- [ ] Update App.js layout for better structure
- [ ] Enhance LoginPage with professional design
- [ ] Enhance SignupPage with professional design
- [ ] Improve BrowsePage layout and card design
- [ ] Update UploadPage styling
- [ ] Polish FileDetailPage design
- [ ] Refine AdminPanelPage appearance
- [ ] Test the updated UI for responsiveness and visual appeal

# TODO: Connect to MongoDB Atlas and Deploy on Vercel

## Tasks
- [ ] Create backend/vercel.json for Vercel deployment configuration
- [ ] Create backend/.env for local development with Atlas URI placeholder
- [ ] Remove proxy from frontend/package.json
- [ ] Update frontend/src/utils/api.js to use dynamic API_BASE_URL from environment variable
- [ ] Test local connection to Atlas by setting MONGO_URI in .env
- [ ] Deploy backend to Vercel with environment variables (MONGO_URI, JWT_SECRET, etc.)
- [ ] Deploy frontend to Vercel with REACT_APP_API_BASE_URL pointing to backend
- [ ] Handle any serverless-specific issues (e.g., database connections)

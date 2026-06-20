import { route } from "@react-router/dev/routes";

export default [
  route("/lens/:id", "routes/lens.jsx"), 
  route("/map", "routes/map.jsx"),
  route("/gem/:gemId", "routes/gem.hunt.jsx"),
  route("/gem/detail/:gemId", "routes/gem.detail.jsx"),
  route("/camera", "routes/camera.jsx"),
  route("/camera/gallery", "routes/camera.gallery.jsx"),
  route("/profile/:id", "routes/profile.jsx"),
  route("/profile/:id/settings", "routes/profile.settings.jsx"),
  route("/profile/:id/settings/details", "routes/profile.settings.details.jsx"),
  route("/profile/:id/settings/language", "routes/profile.settings.language.jsx"),
  route("/profile/:id/viewmasters", "routes/profile.viewmasters.jsx"),
  route("/profile/:id/stickers", "routes/profile.stickers.jsx"),
  route("/profile/:id/gems", "routes/profile.gems.jsx"),
  route("/profile/:id/about", "routes/profile.about.jsx"),
  route("/profile/:id/discovered", "routes/profile.discovered.jsx"),
  route("/onboarding", "routes/onboarding.jsx"),
  route("/signup", "routes/signup.jsx"),
];
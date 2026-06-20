import { route } from "@react-router/dev/routes";

export default [
  // This handles /lens/ann_d, /lens/dries, etc.
  route("lens/:id", "routes/lens.jsx"), 

  route("/map", "routes/map.jsx"),
  route("/gem/:gemId", "routes/gem.hunt.jsx"),
  route("/gem/detail/:gemId", "routes/gem.detail.jsx"),
  route("/camera", "routes/camera.jsx"),
  route("/camera/gallery", "routes/camera.gallery.jsx"),
  route("/profile/:id", "routes/profile.jsx"),
  route("/onboarding", "routes/onboarding.jsx"),
  route("/signup", "routes/signup.jsx"),
];
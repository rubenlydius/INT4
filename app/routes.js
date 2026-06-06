// import { type RouteConfig, index } from "@react-router/dev/routes";

// export default [index("routes/home.tsx")] satisfies RouteConfig;



import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("/map", "routes/map.jsx"),
  route("/camera", "routes/camera.jsx"),
  route("/profile", "routes/profile.jsx"),
];

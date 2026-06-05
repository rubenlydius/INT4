import { type RouteConfig, index } from "@react-router/dev/routes";

export default [index("routes/home.tsx")] satisfies RouteConfig;



// import { index, route } from "@react-router/dev/routes";

// export default [
//   index("routes/home.tsx"),
//   route("/map", "routes/map.tsx"),
//   route("/camera", "routes/camera.tsx"),
//   route("/profile", "routes/profile.tsx"),
// ];
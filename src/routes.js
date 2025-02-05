import { Routes, Route } from "react-router-dom";
import Login from "./comps/template/signinform";
import Register from "./comps/template/registerform";

function Routers() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={<Login />} /> {/* Redirect to login by default */}
    </Routes>
  );
}

export default Routers;

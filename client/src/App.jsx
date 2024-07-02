import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import PropertyListing from "./pages/PropertyListing";
import UpdatePropertyInfo from "./pages/UpdatePropertyInfo";
import Properties from "./pages/Properties";
import Search from "./components/Search";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/properties/:propertyid" element={<Properties />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<PropertyListing />}></Route>
          <Route
            path="/update-property/:propertyid"
            element={<UpdatePropertyInfo />}
          ></Route>
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

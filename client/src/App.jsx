import "./App.css";
import Navbar from "./components/Navbar";
import PageNotFound from "./components/PageNotFound";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Post from "./pages/Post";
import Create from "./pages/Create";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ErrorPage from "./components/ErrorPage";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <ErrorPage />
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/posts" element={<Home />}></Route>
        <Route exact path="/posts/:_id" element={<Post />}></Route>
        <Route exact path="/posts/search" element={<Home />}></Route>
        <Route exact path="/posts/create" element={<Create />}></Route>
        <Route exact path="/posts/:_id/edit" element={<Create />}></Route>
        <Route exact path="/auth" element={<Auth />}></Route>
        <Route exact path="*" element={<PageNotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

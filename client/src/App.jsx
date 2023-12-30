import "./App.css";
import {
  Navbar,
  Home,
  Auth,
  PostDetails,
  Create,
  ErrorComponent,
} from "./components/";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SOMETHING_WENT_WRONG } from "./constants/actionTypes";

function App() {
  const user = useSelector((state) => state.user);
  const { currentPost } = useSelector((state) => state.posts);

  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/posts/:_id" element={<PostDetails />}></Route>
          {!user ? (
            <Route exact path="/auth" element={<Auth />}></Route>
          ) : (
            <Route exact path="/auth" element={<Navigate to="/" />}></Route>
          )}
          <Route exact path="/posts/search" element={<Home />}></Route>

          {user ? (
            <Route exact path="/posts/create" element={<Create />}></Route>
          ) : (
            <Route
              exact
              path="/posts/create"
              element={<Navigate to="/" />}
            ></Route>
          )}
          {currentPost && user && user._id === currentPost.owner._id ? (
            <Route exact path="/posts/:_id/edit" element={<Create />}></Route>
          ) : (
            <Route
              exact
              path="/posts/:_id/edit"
              element={<Navigate to="/" />}
            ></Route>
          )}
          <Route exact path="/posts" element={<Home />}></Route>
          <Route
            exact
            path="*"
            element={
              <ErrorComponent
                error={{
                  type: SOMETHING_WENT_WRONG,
                  error: null,
                  message: "Page not found",
                  statusCode: 404,
                }}
              />
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

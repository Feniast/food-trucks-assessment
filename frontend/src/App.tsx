import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppProviders from "./components/AppProviders";
import { routes } from "./routes";

const router = createBrowserRouter(routes);

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;

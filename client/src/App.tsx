import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from './routes/router.jsx';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster
        richColors
        closeButton
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
    </ErrorBoundary>
  );
}

export default App;

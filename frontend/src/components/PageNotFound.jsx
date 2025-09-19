
function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Oops! Page not found.</p>
      <a
        href="/"
        className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
      >
        Go Home
      </a>
    </div>
  );
}

export default PageNotFound
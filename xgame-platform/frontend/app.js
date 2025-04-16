import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    // Fetch apps/games list from backend API (placeholder)
    setApps([
      {
        id: 1,
        name: 'Sample Game',
        description: 'An exciting sample game.',
        screenshots: [
          'https://via.placeholder.com/600x400?text=Screenshot+1',
          'https://via.placeholder.com/600x400?text=Screenshot+2'
        ],
        rating: 4.5
      },
      {
        id: 2,
        name: 'Sample App',
        description: 'A useful sample app.',
        screenshots: [
          'https://via.placeholder.com/600x400?text=Screenshot+1'
        ],
        rating: 4.0
      }
    ]);
  }, []);

  function openAppDetails(app) {
    setSelectedApp(app);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  function closeAppDetails() {
    setSelectedApp(null);
    document.body.style.overflow = 'auto';
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">XGame Platform</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {apps.map(app => (
          <div key={app.id} className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition" onClick={() => openAppDetails(app)}>
            <h2 className="text-xl font-semibold mb-2">{app.name}</h2>
            <p className="text-gray-300">{app.description}</p>
            <div className="mt-2 flex items-center">
              <i className="fas fa-star text-yellow-400 mr-1"></i>
              <span>{app.rating}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center p-6 z-50 overflow-auto">
          <button className="self-end mb-4 text-white text-3xl font-bold" onClick={closeAppDetails} aria-label="Close">&times;</button>
          <h2 className="text-3xl font-bold mb-4">{selectedApp.name}</h2>
          <p className="mb-4 max-w-3xl text-center">{selectedApp.description}</p>
          <div className="flex space-x-4 overflow-x-auto max-w-4xl mb-4">
            {selectedApp.screenshots.map((src, index) => (
              <img key={index} src={src} alt={`Screenshot ${index + 1}`} className="rounded-lg max-h-64" />
            ))}
          </div>
          <div className="flex items-center text-yellow-400 text-2xl">
            <i className="fas fa-star mr-2"></i>
            <span>{selectedApp.rating}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

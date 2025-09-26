import React, { useState, useEffect } from 'react';
import courseService from '../services/courseService';

interface ApiStatusNotificationProps {
  onStatusChange?: (isConnected: boolean) => void;
}

const ApiStatusNotification: React.FC<ApiStatusNotificationProps> = ({ onStatusChange }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        setIsLoading(true);
        const connected = await courseService.checkApiConnection();
        setIsConnected(connected);
        onStatusChange?.(connected);
      } catch (error) {
        setIsConnected(false);
        onStatusChange?.(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkApiStatus();
  }, [onStatusChange]);

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
            Vérification de la connexion à la base de données...
          </div>
        </div>
      </div>
    );
  }

  if (isConnected === false) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <strong>Attention :</strong> Impossible de se connecter à la base de données.
            <br />
            <small>Vérifiez que le serveur backend est démarré sur le port 8484.</small>
          </div>
        </div>
      </div>
    );
  }

  if (isConnected === true) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Connexion à la base de données établie ✓
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ApiStatusNotification; 
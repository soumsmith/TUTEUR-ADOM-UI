import { useState, useEffect } from 'react';
import requestService from '../../services/requestService';
import type { Request } from '../../types';
import AppointmentScheduler from '../appointments/AppointmentScheduler';

const RequestsManagement = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [action, setAction] = useState<'approved' | 'rejected' | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await requestService.getAllPendingRequests();
        setRequests(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des demandes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleRequestAction = (request: Request, actionType: 'approved' | 'rejected') => {
    setSelectedRequest(request);
    setAction(actionType);
    if (actionType === 'approved') {
      setShowScheduler(true);
    } else {
      setShowModal(true);
    }
  };

  const handleSchedulingComplete = async () => {
    if (!selectedRequest) return;

    try {
      await requestService.updateRequestStatus(selectedRequest.id, 'approved');
      setRequests(requests.filter(req => req.id !== selectedRequest.id));
      setShowScheduler(false);
      setSelectedRequest(null);
      setAction(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut de la demande');
      console.error(err);
    }
  };

  const handleSchedulingCancel = () => {
    setShowScheduler(false);
    setSelectedRequest(null);
    setAction(null);
  };
  
  const confirmAction = async () => {
    if (!selectedRequest || !action) return;
    
    try {
      await requestService.updateRequestStatus(selectedRequest.id, action);
      setRequests(requests.filter(req => req.id !== selectedRequest.id));
      setShowModal(false);
      setSelectedRequest(null);
      setAction(null);
    } catch (err) {
      setError('Échec de l\'action. Veuillez réessayer.');
      console.error(err);
    }
  };
  
  const cancelAction = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setAction(null);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">En attente</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Approuvée</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Refusée</span>;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande en attente</h3>
          <p className="text-gray-600">
            Toutes les demandes ont été traitées.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demande
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enseignant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cours
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map(request => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{request.id.slice(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">ID: {request.parentId.slice(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">ID: {request.teacherId.slice(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">ID: {request.courseId.slice(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(request.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRequestAction(request, 'approved')}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => handleRequestAction(request, 'rejected')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Refuser
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de confirmation pour le rejet */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmer le rejet
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir rejeter cette demande ? Cette action ne peut pas être annulée.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelAction}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={confirmAction}
                className="btn-primary bg-red-600 hover:bg-red-700"
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal du programmateur de rendez-vous */}
      {showScheduler && selectedRequest && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="max-w-2xl w-full m-4">
            <AppointmentScheduler
              requestId={selectedRequest.id}
              teacherId={selectedRequest.teacherId}
              parentId={selectedRequest.parentId}
              onScheduled={handleSchedulingComplete}
              onCancel={handleSchedulingCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsManagement; 
import { useAdminDetails } from '../../hooks/useAdminDetails';
import type { Appointment } from '../../types';

interface AdminAppointmentRowProps {
  appointment: Appointment;
  formatDate: (dateString: string) => string;
  getStatusBadge: (status: string) => JSX.Element | null;
  onComplete: () => void;
  onCancel: () => void;
}

const AdminAppointmentRow = ({ appointment, formatDate, getStatusBadge, onComplete, onCancel }: AdminAppointmentRowProps) => {
  const { parent, teacher, loading } = useAdminDetails(appointment.parentId, appointment.teacherId);

  return (
    <tr key={appointment.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatDate(appointment.date)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {appointment.startTime} - {appointment.endTime}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {loading ? (
          <div className="text-sm text-gray-500">Chargement...</div>
        ) : parent ? (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {parent.firstName} {parent.lastName}
            </div>
            <div className="text-sm text-gray-500">{parent.email}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Parent non trouvé</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {loading ? (
          <div className="text-sm text-gray-500">Chargement...</div>
        ) : teacher ? (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {teacher.firstName} {teacher.lastName}
            </div>
            <div className="text-sm text-gray-500">{teacher.subject}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Enseignant non trouvé</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{appointment.location}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(appointment.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {appointment.status === 'scheduled' && (
          <>
            <button
              onClick={onComplete}
              className="text-green-600 hover:text-green-900 mr-3"
            >
              Terminer
            </button>
            <button
              onClick={onCancel}
              className="text-red-600 hover:text-red-900"
            >
              Annuler
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default AdminAppointmentRow; 
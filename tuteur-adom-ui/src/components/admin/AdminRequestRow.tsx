import { useAdminDetails } from '../../hooks/useAdminDetails';
import type { Request } from '../../types';

interface AdminRequestRowProps {
  request: Request;
  formatDate: (dateString: string) => string;
  getStatusBadge: (status: string) => JSX.Element | null;
  onApprove: () => void;
  onReject: () => void;
}

const AdminRequestRow = ({ request, formatDate, getStatusBadge, onApprove, onReject }: AdminRequestRowProps) => {
  const { parent, teacher, course, loading } = useAdminDetails(request.parentId, request.teacherId, request.courseId);

  return (
    <tr key={request.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">#{request.id.slice(0, 8)}</div>
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
        {loading ? (
          <div className="text-sm text-gray-500">Chargement...</div>
        ) : course ? (
          <div>
            <div className="text-sm font-medium text-gray-900">{course.subject}</div>
            <div className="text-sm text-gray-500">{course.hourlyRate} FCFA/h</div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Cours non trouvé</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{formatDate(request.createdAt)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(request.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={onApprove}
          className="text-green-600 hover:text-green-900 mr-3"
        >
          Approuver
        </button>
        <button
          onClick={onReject}
          className="text-red-600 hover:text-red-900"
        >
          Refuser
        </button>
      </td>
    </tr>
  );
};

export default AdminRequestRow; 
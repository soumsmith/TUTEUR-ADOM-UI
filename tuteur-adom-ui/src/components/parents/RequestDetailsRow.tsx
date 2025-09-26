import { useRequestDetails } from '../../hooks/useRequestDetails';
import type { Request } from '../../types';

interface RequestDetailsRowProps {
  request: Request;
  formatDate: (dateString: string) => string;
  getStatusBadge: (status: string) => JSX.Element | null;
}

const RequestDetailsRow = ({ request, formatDate, getStatusBadge }: RequestDetailsRowProps) => {
  const { teacher, course, loading } = useRequestDetails(request.teacherId, request.courseId);

  return (
    <tr key={request.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatDate(request.createdAt)}</div>
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
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{request.message.slice(0, 50)}...</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(request.status)}
      </td>
    </tr>
  );
};

export default RequestDetailsRow; 
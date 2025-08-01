import TeachersList from '../components/teachers/TeachersList';

const TeachersListPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Enseignants disponibles</h1>
      <TeachersList />
    </div>
  );
};

export default TeachersListPage; 
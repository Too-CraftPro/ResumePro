import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/solid';

const DashboardPage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await api.get('/resumes');
        setResumes(data);
      } catch (error) {
        toast.error('Failed to fetch resumes.');
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleCreateResume = async () => {
    try {
      const { data } = await api.post('/resumes', { title: 'New Awesome Resume' });
      toast.success('New resume created!');
      navigate(`/builder/${data._id}`);
    } catch (error) {
      toast.error('Could not create resume.');
    }
  };

  const handleDeleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
       try {
        await api.delete(`/resumes/${id}`);
        setResumes(resumes.filter(r => r._id !== id));
        toast.success('Resume deleted.');
      } catch (error) {
        toast.error('Failed to delete resume.');
      }
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Your Resumes</h1>
        <button
          onClick={handleCreateResume}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Create New Resume
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resumes.map((resume) => (
          <div key={resume._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">{resume.title}</h2>
            <p className="text-gray-500 mb-4">Last updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>
            <div className="flex gap-4">
              <Link to={`/builder/${resume._id}`} className="flex-1 text-center bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
                Edit
              </Link>
              <button onClick={() => handleDeleteResume(resume._id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
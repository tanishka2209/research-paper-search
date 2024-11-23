import React, { useState, useEffect } from 'react';
import { Search, BookmarkPlus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [papers, setPapers] = useState([]);
  const [savedPapers, setSavedPapers] = useState([]);
  const [activeTab, setActiveTab] = useState('search');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllPapers();
    fetchSavedPapers();
  }, []);

  const fetchAllPapers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/papers');
      setPapers(response.data);
    } catch (error) {
      console.error('Error fetching papers:', error);
      setError('Failed to load papers.');
      toast.error('Failed to load papers.'); // Show toast only on error
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedPapers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/saved-papers');
      setSavedPapers(response.data);
    } catch (error) {
      console.error('Error fetching saved papers:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) {
      fetchAllPapers();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/search-papers', {
        params: { query: searchTerm },
      });
      setPapers(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error occurred while searching.';
      setError(errorMessage);
      setPapers([]);
      toast.error(errorMessage); // Show toast on search error
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (paper) => {
    try {
      await axios.post('http://localhost:5000/api/saved-papers', paper);
      setSavedPapers([...savedPapers, paper]);
      toast.success('Paper saved!'); // Show toast on success
    } catch (error) {
      console.error('Error saving paper:', error);
      toast.error('Error saving paper.'); // Show toast on error
    }
  };

  const handleRemove = async (paperId) => {
    try {
      await axios.delete(`http://localhost:5000/api/saved-papers/${paperId}`);
      setSavedPapers(savedPapers.filter((paper) => paper.id !== paperId));
      toast.success('Paper removed!'); // Show toast on success
    } catch (error) {
      console.error('Error removing paper:', error);
      toast.error('Error removing paper.'); // Show toast on error
    }
  };

  const isPaperSaved = (paperId) => savedPapers.some((paper) => paper.id === paperId);

  const PaperCard = ({ paper, onSave, onRemove }) => {
    const saved = isPaperSaved(paper.id);

    return (
      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <h3 className="text-xl font-semibold mb-2">{paper.title}</h3>
        <p className="text-sm text-gray-600">Authors: {paper.authors}</p>
        <p className="text-sm text-gray-600">Year: {paper.year}</p>
        <p className="text-sm text-gray-600">Citations: {paper.citations}</p>
        <div className="mt-4">
          <button
            onClick={() => (saved ? onRemove(paper.id) : onSave(paper))}
            className={`px-4 py-2 rounded flex items-center ${
              saved ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {saved ? (
              <>
                <Trash2 className="mr-2" size={16} />
                Remove from Saved
              </>
            ) : (
              <>
                <BookmarkPlus className="mr-2" size={16} />
                Save Paper
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Research Paper Search</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <button
            onClick={() => setActiveTab('search')}
            className={`mr-4 ${activeTab === 'search' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Search
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`${activeTab === 'saved' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Saved Papers
          </button>
        </div>
        {activeTab === 'search' && (
          <div>
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter keywords to search"
                  className="flex-grow px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 flex items-center"
                >
                  <Search className="mr-2" size={16} />
                  Search
                </button>
              </div>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && papers.length === 0 && !error && <p>No articles found.</p>}
            <div>
              {papers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} onSave={handleSave} onRemove={handleRemove} />
              ))}
            </div>
          </div>
        )}
        {activeTab === 'saved' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Saved Papers</h2>
            {savedPapers.length === 0 ? (
              <p>No saved papers.</p>
            ) : (
              savedPapers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} onSave={handleSave} onRemove={handleRemove} />
              ))
            )}
          </div>
        )}
      </main>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </div>
  );
}

export default App;

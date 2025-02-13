import { useState, useEffect } from 'react';
import Image from 'next/image';

const TopUser = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRanking = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rankings/top?limit=100`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setRankings(result.data);
    } catch (error) {
      console.error('Error fetching ranking:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full border rounded-lg overflow-hidden">
      
      <div className="divide-y">
        {rankings.map((user) => (
          <div key={user.id} className="flex items-center p-4 hover:bg-gray-50">
            <div className="flex items-center justify-center w-8 h-8 mr-4">
              <span className={`text-lg font-semibold ${
                user.rank === 1 ? 'text-yellow-500' :
                user.rank === 2 ? 'text-gray-400' :
                user.rank === 3 ? 'text-amber-600' :
                'text-gray-600'
              }`}>
                #{user.rank}
              </span>
            </div>
            
            <div className="relative w-10 h-10 mr-4">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            
            <div className="flex flex-col flex-1">
              <span className="font-medium">{user.name}</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm font-medium">
                {user.markedSpotsCount}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {rankings.length === 0 && (
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-500">No rankings available</p>
        </div>
      )}
    </div>
  );
};

export default TopUser;
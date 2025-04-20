import React, { useState } from 'react';
import axios from 'axios';

const FetchDataComponent = () => {
  const [listData, setListData] = useState({ skills: [], missing: [], cover_letters: [] });
  const [dictData, setDictData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchListData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://d9ad-103-104-226-58.ngrok-free.app/get_skills_data');
      const { skills, missing, cover_letters } = response.data;
      setListData({ skills, missing, cover_letters });
    } catch (error) {
      console.error('Error fetching list data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDictData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://your-ngrok-url.ngrok.io/get_resume_data');
      setDictData(response.data);
    } catch (error) {
      console.error('Error fetching dictionary data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg w-full max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Data Fetcher</h2>

      <button
        onClick={fetchListData}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Fetch List Data
      </button>

      {listData.skills.length > 0 && (
        <div className="border p-2 rounded bg-gray-100">
          <h3 className="font-semibold">Skills:</h3>
          <ul>{listData.skills.map((skill, i) => <li key={i}>{skill}</li>)}</ul>

          <h3 className="font-semibold mt-2">Missing:</h3>
          <ul>{listData.missing.map((item, i) => <li key={i}>{item}</li>)}</ul>

          <h3 className="font-semibold mt-2">Cover Letters:</h3>
          <ul>{listData.cover_letters.map((cl, i) => <li key={i}>{cl}</li>)}</ul>
        </div>
      )}

      <button
        onClick={fetchDictData}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Fetch Dictionary Data
      </button>

      {Object.keys(dictData).length > 0 && (
        <div className="border p-2 rounded bg-gray-100">
          <h3 className="font-semibold">Dictionary Data:</h3>
          <ul>
            {Object.entries(dictData).map(([key, value], i) => (
              <li key={i}><strong>{key}:</strong> {String(value)}</li>
            ))}
          </ul>
        </div>
      )}

      {loading && <p className="text-sm text-gray-500">Loading...</p>}
    </div>
  );
};

export default FetchDataComponent;

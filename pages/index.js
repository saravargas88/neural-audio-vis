import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/result')
      .then((res) => res.json())
      .then(setData);dd
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Result Data</h1>
      <pre>{data ? JSON.stringify(data, null, 2) : 'Loading...'}</pre>
    </main>
  );
}

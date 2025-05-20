import React, { useState } from 'react';
import DataLoader from './services/DataLoaderService';
import IntroductionPage from './pages/IntroductionPage';
import './styles/IntroductionPage.css'
function App() {
  const [data, setData] = useState(null);

  return (
    <>
      {!data && (
        <>
          <div>Carregant dades...</div>
          <DataLoader storageKey="bookingData" onDataLoaded={setData} />
        </>
      )}
      {data && <IntroductionPage data={data} />}
    </>
  );
}

export default App;

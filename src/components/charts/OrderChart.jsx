import React from 'react';

const OrderChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No hay elementos en la lista.</p>;
  }

  const parseCountryData = (text) => {
    const [country, percent] = text.split('-').map(str => str.trim());
    console.log(country, percent)
    return { country, percent };
  };

  return (
    <div>
      <h2 style={{fontSize:'26px', color: 'white', fontWeight: 'bold', marginTop: '0px', padding:'0'}}>{'Països amb cancel·lacionsper sobre de la mitja'}</h2>
      <ol>
        {data.map((item, index) => {
          const { country, percent } = parseCountryData(item);
          return (
            <li key={index}>
              <span>{country}</span>
              <span style={{fontWeight: 'normal' }}> ➜ {percent}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};


export default OrderChart;

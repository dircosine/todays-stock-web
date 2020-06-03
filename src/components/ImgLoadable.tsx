import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import './ImgLoadable.scss';

interface ImgLoadableProps {
  src: string;
  alt: string;
}

function ImgLoadable({ src, alt }: ImgLoadableProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [src]);

  const handleImgLoad = () => {
    setLoading(false);
  };

  return (
    <div className="ImgLoadable">
      <img
        className="chart"
        alt={alt}
        src={src}
        width="100%"
        onLoad={handleImgLoad}
        hidden={loading}
      />
      {loading && (
        <div className="spinner">
          <Spin />
        </div>
      )}
    </div>
  );
}

export default ImgLoadable;

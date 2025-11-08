
import React from 'react';

interface ImageDisplayProps {
  title: string;
  imageUrl: string | null;
  isLoading?: boolean;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, imageUrl, isLoading }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-300 mb-3">{title}</h3>
      <div className="w-full aspect-square bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700 shadow-lg">
        {isLoading ? (
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        ) : imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
        ) : (
          <div className="text-gray-500 text-sm">No image to display</div>
        )}
      </div>
    </div>
  );
};

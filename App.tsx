
import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { editImageWithPrompt } from './services/geminiService';
import { ImageData } from './types';

const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 3zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM4.5 9.25a.75.75 0 01.75.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75zM13.25 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM6.168 6.168a.75.75 0 011.06 0l1.061 1.06a.75.75 0 01-1.06 1.06L6.168 7.228a.75.75 0 010-1.06zM11.672 11.672a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM7.228 11.672a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM12.732 6.168a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0z" clipRule="evenodd" />
    </svg>
);


function App() {
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (imageData: ImageData) => {
    setOriginalImage(imageData);
    setEditedImage(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!originalImage || !prompt) {
      setError("Please upload an image and enter a prompt.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);
    try {
      const result = await editImageWithPrompt(originalImage, prompt);
      setEditedImage(result);
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred.');
        }
    } finally {
      setIsLoading(false);
    }
  };
  
  const originalImageUrl = originalImage ? `data:${originalImage.mimeType};base64,${originalImage.base64}` : null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Gemini Image Editor
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Edit images with the power of AI. Just describe your changes.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-2xl">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">1. Upload Image</label>
                <ImageUploader onImageUpload={handleImageUpload} disabled={isLoading} />
              </div>

              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                  2. Describe Your Edit
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Add a retro filter', 'Make the sky look like a sunset', 'Remove the car in the background'"
                  rows={4}
                  className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-500 disabled:opacity-50"
                  disabled={isLoading}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading || !originalImage || !prompt}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-700 transition-all duration-200 disabled:bg-indigo-900/50 disabled:cursor-not-allowed disabled:text-gray-400 shadow-lg transform hover:scale-105 active:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                    <>
                     <SparklesIcon className="h-5 w-5" />
                     Generate
                    </>
                )}
              </button>
              
              {error && <p className="text-sm text-red-400 bg-red-900/50 p-3 rounded-md border border-red-700">{error}</p>}
            </div>
          </div>
          
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageDisplay title="Original" imageUrl={originalImageUrl} />
            <ImageDisplay title="Edited" imageUrl={editedImage} isLoading={isLoading} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

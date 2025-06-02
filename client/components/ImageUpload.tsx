'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uploadImage } from '@/service/imageService';

interface ImageUploadProps {
  onImageUpload: () => void;
}

export default function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { data: session } = useSession();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setTitles(prev => [...prev, ...new Array(newFiles.length).fill('')]);
  };

  const handleTitleChange = (index: number, value: string) => {
    const newTitles = [...titles];
    newTitles[index] = value;
    setTitles(newTitles);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setTitles(titles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      titles.forEach((title) => formData.append('titles', title));

      const res = await uploadImage(session?.accessToken||"" , formData)

      if (res.ok) {
        toast.success('Images uploaded successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
        setFiles([]);
        setTitles([]);
        
        // Call the onImageUpload callback to refresh images in DragDropContainer
        onImageUpload();
      } else {
        const data = await res.json();
        toast.error(`Error: ${data.error || 'Failed to upload images'}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('Error uploading images. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form 
        onSubmit={handleSubmit} 
        className="p-6 bg-white rounded-lg shadow-lg"
        onDragEnter={handleDrag}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Upload Images</h2>
        
        {/* Drag & Drop Area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-10 text-center mb-6 transition ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label 
            htmlFor="file-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p className="text-lg text-gray-700">Drag and drop your images here</p>
            <p className="text-sm text-gray-500 mt-2">or click to browse</p>
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700">Selected Images ({files.length})</h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Preview of ${file.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow mr-2">
                    <p className="text-sm text-gray-500 truncate">{file.name}</p>
                    <input
                      type="text"
                      placeholder="Add a title"
                      value={titles[index]}
                      onChange={(e) => handleTitleChange(index, e.target.value)}
                      className="w-full mt-1 p-2 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1 text-gray-500 hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={files.length === 0 || uploading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition ${
            files.length === 0 || uploading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {uploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            'Upload Images'
          )}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
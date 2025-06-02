'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { deleteImage, editImage } from '@/service/imageService';

export default function ImageCard({
  image,
  onDelete,
  onEdit,
  isSelectionMode,
  isSelected,
  onSelect,
  onToggleDraggable,
}: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(image.title);
  const [file, setFile] = useState<File | null>(null);
  const { data: session } = useSession();

  // Helper function to disable drag while buttons are being interacted with
  const handleButtonMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation to prevent grid layout from handling it
    onToggleDraggable(false); // Disable dragging when interacting with buttons
  };

  const handleButtonMouseUp = () => {
    // Re-enable dragging after button interaction
    onToggleDraggable(true);
  };

  const handleEdit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    if (file) formData.append('image', file);

    const res = await editImage(session?.accessToken || "",formData,image._id)
   
    if (res.ok) {
      setIsEditing(false);
      onEdit();
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  const handleDelete = async () => {
    const res = await deleteImage(session?.accessToken || "",image._id)
    if (res.ok) {
      onDelete();
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 transition-all hover:shadow-md w-full h-full relative">
      {isSelectionMode && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="absolute top-2 left-2 h-4 w-4 accent-blue-500 z-10"
          onMouseDown={handleButtonMouseDown}
          onMouseUp={handleButtonMouseUp}
        />
      )}
      {isEditing ? (
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-1.5 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Image title"
            onMouseDown={handleButtonMouseDown}
            onMouseUp={handleButtonMouseUp}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            onMouseDown={handleButtonMouseDown}
            onMouseUp={handleButtonMouseUp}
          />
          <div className="flex space-x-1">
            <button
              onClick={handleEdit}
              className="flex-1 bg-blue-500 text-white py-1 rounded text-sm hover:bg-blue-600 transition-colors"
              onMouseDown={handleButtonMouseDown}
              onMouseUp={handleButtonMouseUp}
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-500 text-white py-1 rounded text-sm hover:bg-gray-600 transition-colors"
              onMouseDown={handleButtonMouseDown}
              onMouseUp={handleButtonMouseUp}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex justify-center">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${image.url}`}
              alt={image.title}
              className="rounded-md mb-2 object-contain max-h-36"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{image.title}</h3>
          {!isSelectionMode && (
            <div className="flex space-x-1 mt-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-yellow-500 text-white py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-1 rounded text-sm hover:bg-red-600 transition-colors"
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
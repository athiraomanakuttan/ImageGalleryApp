'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ImageCard from './ImageCard';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getImages, rearrangeOrder } from '@/service/imageService';

// Enable responsive features
const ResponsiveGridLayout = WidthProvider(Responsive);

interface Image {
  _id: string;
  title: string;
  url: string;
  order: number;
}

interface GridItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  image: Image;
}

interface DragDropContainerProps {
  refreshTrigger: number;
}

export default function DragDropContainer({ refreshTrigger }: DragDropContainerProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [originalImages, setOriginalImages] = useState<Image[]>([]);
  const [layout, setLayout] = useState<GridItem[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDraggable, setIsDraggable] = useState(true);
  const { data: session } = useSession();

  // Fetch images from API
  const fetchImages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getImages(session?.accessToken ||"")
      if (res.ok) {
        const data = await res.json();
        setImages(data);
        setOriginalImages(data);
        
        // Create initial layout from images
        const initialLayout = data.map((image: Image, index: number) => ({
          i: image._id,
          x: index % 3,
          y: Math.floor(index / 3), 
          w: 1,
          h: 1,
          image: image
        }));
        
        setLayout(initialLayout);
        setIsOrderChanged(false);
      } else {
        throw new Error(`Failed to fetch images: ${res.statusText}`);
      }
    } catch (error: any) {
      console.error('Error fetching images:', error);
      setError(error.message || 'Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  // Reload images when refreshTrigger changes
  useEffect(() => {
    if (session) fetchImages();
  }, [session, refreshTrigger]);

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedImages([]);
  };

  const handleSelectImage = (imageId: string) => {
    setSelectedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  // Handle layout change
  const onLayoutChange = (newLayout: any) => {
    // Update layout
    const updatedLayout = layout.map(item => {
      const newPos = newLayout.find((l: any) => l.i === item.i);
      if (newPos) {
        return { ...item, x: newPos.x, y: newPos.y };
      }
      return item;
    });
    
    setLayout(updatedLayout);
    
    // Extract new image order based on layout positions
    const newImageOrder = [...updatedLayout]
      .sort((a, b) => {
        // Sort by y first, then by x
        if (a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
      })
      .map(item => item.image);
    
    // Update images state with new order
    setImages(newImageOrder);
    
    // Check if order changed compared to original
    const isChanged = newImageOrder.some(
      (img, index) => img._id !== originalImages[index]?._id
    );
    
    setIsOrderChanged(isChanged);
  };

  // Toggle draggable state - used when interacting with buttons
  const handleToggleDraggable = (isDraggableState: boolean) => {
    setIsDraggable(isDraggableState);
  };

  // Save the new order to the backend
  const saveOrder = async () => {
    if (!images.length) {
      setError('No images to save');
      toast.error('No images to save', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const imagesToSave = images.map((img, index) => ({
      id: img._id,
      order: index,
    }));

    try {
      const res = await rearrangeOrder(session?.accessToken || "",imagesToSave)

      const data = await res.json();
      if (res.ok) {
        setOriginalImages(images);
        setIsOrderChanged(false);
        setIsSelectionMode(false);
        setSelectedImages([]);
        toast.success('Order saved successfully', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        throw new Error(data.error || 'Failed to save order');
      }
    } catch (error: any) {
      console.error('Error saving order:', error);
      setError(error.message || 'Failed to save order');
      toast.error(error.message || 'Failed to save order', {
        position: "top-right",
        autoClose: 3000,
      });
      await fetchImages(); // Revert to original order on failure
    }
  };

  if (isLoading) {
    return <div>Loading images...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
        <button
          onClick={fetchImages}
          className="ml-4 bg-blue-500 text-white p-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // Define the layouts for different breakpoints
  const layouts = {
    lg: layout,
    md: layout,
    sm: layout,
    xs: layout,
    xxs: layout
  };

  return (
    <div>
      <div className="p-4 flex justify-between items-center">
        <button
          onClick={toggleSelectionMode}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {isSelectionMode ? 'Cancel Selection' : 'Select Images'}
        </button>
        <button
          onClick={saveOrder}
          disabled={!isOrderChanged}
          className={`p-2 rounded text-white ${
            isOrderChanged ? 'bg-green-500' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Save Order
        </button>
      </div>
      
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 3, md: 3, sm: 2, xs: 1, xxs: 1 }}
        rowHeight={250}
        margin={[16, 16]}
        containerPadding={[16, 16]}
        onLayoutChange={(layout) => onLayoutChange(layout)}
        isDraggable={isDraggable && (!isSelectionMode || selectedImages.length === 0)}
        isResizable={false}
      >
        {layout.map((item) => (
          <div key={item.i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all hover:shadow-md">
            <ImageCard
              image={item.image}
              onDelete={fetchImages}
              onEdit={fetchImages}
              isSelectionMode={isSelectionMode}
              isSelected={selectedImages.includes(item.image._id)}
              onSelect={() => handleSelectImage(item.image._id)}
              onToggleDraggable={handleToggleDraggable}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
      
      <ToastContainer />
    </div>
  );
}
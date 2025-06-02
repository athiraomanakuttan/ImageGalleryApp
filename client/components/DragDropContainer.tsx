'use client';
import { useState, useEffect, useMemo } from 'react';
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
  const [allImages, setAllImages] = useState<Image[]>([]);
  const [originalImages, setOriginalImages] = useState<Image[]>([]);
  const [layout, setLayout] = useState<GridItem[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDraggable, setIsDraggable] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(12); // 12 images per page for better grid layout
  const { data: session } = useSession();

  // Calculate pagination values using useMemo to prevent recalculation on every render
  const paginationData = useMemo(() => {
    const totalImages = allImages.length;
    const totalPages = Math.ceil(totalImages / imagesPerPage);
    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    const currentPageImages = allImages.slice(startIndex, endIndex);
    
    return {
      totalImages,
      totalPages,
      startIndex,
      endIndex,
      currentPageImages
    };
  }, [allImages, currentPage, imagesPerPage]);

  // Create layout for current page images
  const currentLayout = useMemo(() => {
    return paginationData.currentPageImages.map((image: Image, index: number) => ({
      i: image._id,
      x: index % 4, // 4 columns for better layout
      y: Math.floor(index / 4), 
      w: 1,
      h: 1,
      image: image
    }));
  }, [paginationData.currentPageImages]);

  // Update layout when currentLayout changes
  useEffect(() => {
    setLayout(currentLayout);
    setSelectedImages([]); // Clear selections when changing pages
  }, [currentLayout]);

  // Fetch images from API
  const fetchImages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getImages(session?.accessToken || "");
      if (res.ok) {
        const data = await res.json();
        setAllImages(data);
        setOriginalImages(data);
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
    const updatedLayout = layout.map(item => {
      const newPos = newLayout.find((l: any) => l.i === item.i);
      if (newPos) {
        return { ...item, x: newPos.x, y: newPos.y };
      }
      return item;
    });
    
    setLayout(updatedLayout);
    
    // Extract new image order based on layout positions
    const newPageOrder = [...updatedLayout]
      .sort((a, b) => {
        if (a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
      })
      .map(item => item.image);
    
    // Update all images array with new page order
    const updatedAllImages = [...allImages];
    newPageOrder.forEach((img, index) => {
      const globalIndex = paginationData.startIndex + index;
      if (globalIndex < updatedAllImages.length) {
        updatedAllImages[globalIndex] = img;
      }
    });
    setAllImages(updatedAllImages);
    
    // Check if order changed
    const isChanged = newPageOrder.some(
      (img, index) => img._id !== originalImages[paginationData.startIndex + index]?._id
    );
    
    setIsOrderChanged(isChanged);
  };

  const handleToggleDraggable = (isDraggableState: boolean) => {
    setIsDraggable(isDraggableState);
  };

  // Save the new order to the backend
  const saveOrder = async () => {
    if (!allImages.length) {
      setError('No images to save');
      toast.error('No images to save', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const imagesToSave = allImages.map((img, index) => ({
      id: img._id,
      order: index,
    }));

    try {
      const res = await rearrangeOrder(session?.accessToken || "", imagesToSave);
      const data = await res.json();
      
      if (res.ok) {
        setOriginalImages(allImages);
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
      await fetchImages();
    }
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPrevPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    
    if (paginationData.totalPages <= maxVisible) {
      for (let i = 1; i <= paginationData.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(paginationData.totalPages);
      } else if (currentPage >= paginationData.totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = paginationData.totalPages - 3; i <= paginationData.totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(paginationData.totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 flex items-center justify-center">
        <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl p-8 border border-emerald-400/30">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-3 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
            <span className="text-slate-300 text-lg">Loading your gallery...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl p-8 border border-red-400/30 max-w-md w-full text-center">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <button
            onClick={fetchImages}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const layouts = {
    lg: layout,
    md: layout,
    sm: layout,
    xs: layout,
    xxs: layout
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900">
      {/* Header Controls */}
      <div className="bg-slate-800/90 backdrop-blur-lg border-b border-emerald-400/30 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Gallery
              </h1>
              <span className="text-slate-400 text-sm">
                {paginationData.totalImages} images • Page {currentPage} of {paginationData.totalPages}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* <button
                onClick={toggleSelectionMode}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  isSelectionMode
                    ? 'bg-red-500/20 border border-red-400/30 text-red-300 hover:bg-red-500/30'
                    : 'bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/30'
                }`}
              >
                {isSelectionMode ? 'Cancel Selection' : 'Select Images'}
              </button> */}
              
              <button
                onClick={saveOrder}
                disabled={!isOrderChanged}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  isOrderChanged
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white hover:scale-105'
                    : 'bg-slate-600/50 text-slate-400 cursor-not-allowed'
                }`}
              >
                Save Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="container mx-auto px-6 py-8">
        {paginationData.currentPageImages.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-12 border border-slate-600/30">
              <div className="text-slate-400 text-xl mb-4">No images found</div>
              <p className="text-slate-500">Upload some images to get started</p>
            </div>
          </div>
        ) : (
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }}
            rowHeight={280}
            margin={[20, 20]}
            containerPadding={[0, 0]}
            onLayoutChange={onLayoutChange}
            isDraggable={isDraggable && (!isSelectionMode || selectedImages.length === 0)}
            isResizable={false}
          >
            {layout.map((item) => (
              <div 
                key={item.i} 
                className="bg-slate-800/90 backdrop-blur-lg rounded-2xl shadow-xl transition-all hover:shadow-2xl hover:scale-105 border border-slate-600/30 hover:border-emerald-400/30 overflow-hidden"
              >
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
        )}
      </div>

      {/* Pagination */}
      {paginationData.totalPages > 1 && (
        <div className="bg-slate-800/90 backdrop-blur-lg border-t border-emerald-400/30 sticky bottom-0">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-slate-400 text-sm">
                Showing {paginationData.startIndex + 1}-{Math.min(paginationData.endIndex, paginationData.totalImages)} of {paginationData.totalImages} images
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  ←
                </button>
                
                {getPageNumbers().map((pageNum, index) => (
                  <button
                    key={index}
                    onClick={() => typeof pageNum === 'number' && goToPage(pageNum)}
                    disabled={pageNum === '...'}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                      pageNum === currentPage
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                        : pageNum === '...'
                        ? 'text-slate-500 cursor-default'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === paginationData.totalPages}
                  className="px-3 py-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
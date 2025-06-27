import { X, ChevronLeft, ChevronRight } from 'lucide-react';

function Modal({ currentPhoto, handleCloseModal, handleNext, handlePrev }) {
  if (!currentPhoto) return null;

  return (
    <div
      className="fixed inset-0 top-10 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleCloseModal}
    >
      <div
        className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 backdrop-blur-md p-2 rounded-full text-black hover:bg-white/30 transition-all shadow-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full text-black hover:bg-white/30 transition-all shadow-lg"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full text-black hover:bg-white/30 transition-all shadow-lg"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="flex items-center justify-center bg-white">
          <img
            src={currentPhoto.image}
            alt={currentPhoto.name}
            className="max-w-full max-h-[85vh] object-contain"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
          <h3 className="text-white font-medium">{currentPhoto.name}</h3>
        </div>
      </div>
    </div>
  );
}

export default Modal;

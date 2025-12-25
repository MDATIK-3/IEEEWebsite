import PhotoCard from "../../components/common/PhotoCard";
import Modal from "@/app/components/Shares/Modal";

const PhotoGrid = ({ photos }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14">
      {photos.map((photo, index) => (
        <PhotoCard 
          key={photo.id} 
          photo={photo} 
          index={index} 
          photos={photos}
          variant="homepage"
          Modal={Modal}
        />
      ))}
    </div>
  );
};

export default PhotoGrid;

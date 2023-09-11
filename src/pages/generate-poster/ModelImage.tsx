import { useRef, useEffect } from 'react';
import Konva from 'konva';
import { Image, Transformer } from 'react-konva';

interface ModelImageProps {
  imageConfig: Konva.ImageConfig;
  isSelected: boolean;
  onSelect: (shapeId: string | undefined) => void;
  onChange: (imageConfig: Konva.ImageConfig) => void;
}

const ModelImage: React.FC<ModelImageProps> = ({ imageConfig, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        {...imageConfig}
        onMouseDown={() => onSelect(imageConfig.id)}
        onTap={() => onSelect(imageConfig.id)}
        ref={shapeRef}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...imageConfig,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          if (node) {
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            // we will reset it back
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...imageConfig,
              x: node.x(),
              y: node.y(),
              // set minimal value
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
            });
          }
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default ModelImage;

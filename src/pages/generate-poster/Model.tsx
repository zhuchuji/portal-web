import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import Konva from "konva";
import { Image, Transformer, Group, Text } from "react-konva";
import { message } from "antd";

export interface ModelHandlerProps {
  toDataURL: () => string | undefined;
}

interface ModelProps {
  imageConfig: Konva.ImageConfig;
  isSelected: boolean;
  onSelect: (shapeId: string | undefined) => void;
  onChange: (imageConfig: Konva.ImageConfig) => void;
  onDelete: (shapeId: string) => void;
}

const Model = forwardRef<ModelHandlerProps, ModelProps>(({
  imageConfig,
  isSelected,
  onSelect,
  onChange,
  onDelete,
}, ref) => {
  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  
  useImperativeHandle(ref, () => {
    return {
      toDataURL() {
        if (shapeRef.current) {
          return shapeRef.current.toDataURL();
        }
      }
    }
  });

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <Group>
      {isSelected && (
        <Text
          text="x"
          fontSize={20}
          fill="#ccc"
          x={
            (imageConfig.x || 0) +
            ((imageConfig.image as HTMLImageElement).width || 0) +
            10
          }
          y={(imageConfig.y || 0) - 30}
          onClick={() => {
            if (imageConfig.id) {


              onDelete(imageConfig.id);
            }
          }}
        />
      )}
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
    </Group>
  );
});

export default Model;

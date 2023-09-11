import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Image, Transformer } from "react-konva";
import Konva from "konva";
import { Radio, Select, Form, InputNumber, Tabs, List, Row, Col } from "antd";
import { styled } from "styled-components";
import Title from "../../components/Title";
import ImageSelection from "../../components/ImageSelection";
import ModelImage from "./ModelImage";

import jeepWrangler1 from "./images/jeep-wrangler-1.png";
import jeepWrangler2 from "./images/jeep-wrangler-2.png";
import jeepWrangler3 from "./images/jeep-wrangler-3.png";
import jeepWrangler4 from "./images/jeep-wrangler-4.png";
import jeepWrangler5 from "./images/jeep-wrangler-5.png";
import jeepWrangler6 from "./images/jeep-wrangler-6.png";
import jeepWrangler7 from "./images/jeep-wrangler-7.png";
import jeepWrangler8 from "./images/jeep-wrangler-8.png";

enum ToolType {
  Pen,
  Eraser,
}

const jeepWranglers = [
  {
    imageUrl: jeepWrangler1,
    id: 1,
  },
  {
    imageUrl: jeepWrangler2,
    id: 2,
  },
  {
    imageUrl: jeepWrangler3,
    id: 3,
  },
  {
    imageUrl: jeepWrangler4,
    id: 4,
  },
  {
    imageUrl: jeepWrangler5,
    id: 5,
  },
  {
    imageUrl: jeepWrangler1,
    id: 5,
  },
  {
    imageUrl: jeepWrangler6,
    id: 6,
  },
  {
    imageUrl: jeepWrangler7,
    id: 7,
  },
  {
    imageUrl: jeepWrangler8,
    id: 8,
  },
];

let shapeId = 0;

const Edit: React.FC = () => {
  const [canvasWidth, setCanvasWidth] = useState<number>(800);
  const [canvasHeight, setCanvasHeight] = useState<number>(600);
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);
  const [lines, setLines] = useState<Konva.LineConfig[]>([]);
  const [images, setImages] = useState<Konva.ImageConfig[]>([]);
  const [tool, setTool] = useState<ToolType>(ToolType.Pen);
  const [selectedShapeId, setSelectedShapeId] = useState<string>();
  const isDrawing = useRef<boolean>(false);
  const draggingImage = useRef<HTMLImageElement>();
  const stageRef = useRef<Konva.Stage>(null);

  useEffect(() => {
    if (stageRef.current) {
      stageRef.current.content.tabIndex = 1;
      stageRef.current.content.style.outline = "none";
      const deleteImage = (e: KeyboardEvent) => {
        if (e.key === "Backspace" && selectedShapeId) {
          const originalImageIndex = images.findIndex(
            (image) => image.id === selectedShapeId
          );
          images.splice(originalImageIndex, 1);
          setImages([...images]);
          setSelectedShapeId(undefined);
        }
      };
      stageRef.current.content.addEventListener("keydown", deleteImage);

      return () => {
        stageRef.current?.content.removeEventListener("keydown", deleteImage);
      };
    }
  }, [stageRef, selectedShapeId]);

  const handleMouseDown = (e: Konva.KonvaPointerEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedShapeId(undefined);
      isDrawing.current = true;
      const pos = e.target.getStage()?.getPointerPosition();
      if (pos) {
        setLines([
          ...lines,
          { id: String(shapeId++), tool, points: [pos.x, pos.y] },
        ]);
      }
    }
  };

  const handleMouseMove = (e: Konva.KonvaPointerEvent) => {
    if (!isDrawing.current) {
      return;
    }
    const point = e.target.getStage()?.getPointerPosition();
    if (point) {
      let lastLine = lines[lines.length - 1];
      if (lastLine.points == undefined) {
        lastLine.points = [];
      }
      lastLine.points = (lastLine.points as number[]).concat([
        point.x,
        point.y,
      ]);

      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const changeCanvasWidth = (width: number | null) => {
    if (width) {
      const height = Math.round(width / aspectRatio);
      setCanvasWidth(width);
      setCanvasHeight(height);
    }
  };

  const changeCanvasHeight = (height: number | null) => {
    if (height) {
      const width = Math.round(height * aspectRatio);
      setCanvasWidth(width);
      setCanvasHeight(height);
    }
  };

  const changeCanvasAspectRatio = (ratio: number) => {
    const height = Math.round(canvasWidth / ratio);
    setCanvasHeight(height);
    setAspectRatio(ratio);
  };

  const changeImage = (imageConfig: Konva.ImageConfig) => {
    const originalImageIndex = images.findIndex(
      (image) => image.id === imageConfig.id
    );
    images.splice(originalImageIndex, 1, imageConfig);
    setImages([...images]);
  };

  const tabs = [
    {
      key: "1",
      label: "我的上传",
      children: "Content of Tab Pane 1",
    },
    {
      key: "2",
      label: "牧马人",
      children: (
        <List
          style={{ maxHeight: '600px', overflow: 'auto' }}
          dataSource={jeepWranglers}
          renderItem={(item) => (
            <ImageSelection
              style={{ width: "150px", cursor: "grab" }}
              key={item.id}
              src={item.imageUrl}
              draggable
              onDragStart={(e) => {
                draggingImage.current = e.currentTarget;
              }}
            />
          )}
        />
      ),
    },
  ];

  return (
    <>
      <Title>请选择你的画布与布局</Title>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Row style={{ width: "90%", minWidth: '900px' }} gutter={40}>
          <Col span={16} style={{ borderRight: "1px solid #ccc" }}>
            <div
              style={{ display: "flex" }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={async (e) => {
                e.preventDefault();
                if (stageRef.current && draggingImage.current) {
                  stageRef.current.setPointersPositions(e);
                  const position = stageRef.current.getPointerPosition();
                  const imageConfig: Konva.ImageConfig = {
                    id: String(shapeId++),
                    image: draggingImage.current,
                    offset: {
                      x: draggingImage.current.width / 2,
                      y: draggingImage.current.height / 2,
                    },
                    ...(position ? position : {}),
                  };
                  setImages(images.concat(imageConfig));
                }
              }}
            >
              <Stage
                style={{ border: "1px solid #ccc" }}
                width={canvasWidth}
                height={canvasHeight}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                ref={stageRef}
              >
                <Layer>
                  {images.map((imageConfig) => (
                    <ModelImage
                      key={imageConfig.id}
                      imageConfig={imageConfig}
                      onSelect={(id) => setSelectedShapeId(id)}
                      isSelected={selectedShapeId === imageConfig.id}
                      onChange={changeImage}
                    />
                  ))}
                  {lines.map((line, i) => (
                    <Line
                      key={i}
                      points={line.points}
                      stroke="#999"
                      strokeWidth={5}
                      tension={0.5}
                      lineCap="round"
                      lineJoin="round"
                      globalCompositeOperation={
                        line.tool === ToolType.Eraser
                          ? "destination-out"
                          : "source-over"
                      }
                    />
                  ))}
                </Layer>
              </Stage>
            </div>
            <Form layout="inline" style={{ marginTop: "20px" }}>
              <Form.Item label="比例">
                <Select
                  style={{ width: "150px" }}
                  defaultValue={aspectRatio}
                  onChange={changeCanvasAspectRatio}
                  options={[
                    { value: 1 / 1, label: "1 : 1" },
                    { value: 3 / 2, label: "3 : 2" },
                    { value: 2 / 3, label: "2 : 3" },
                    { value: 4 / 3, label: "4 : 3" },
                    { value: 3 / 4, label: "3 : 4" },
                    { value: 16 / 9, label: "16 : 9" },
                    { value: 9 / 16, label: "9 : 16" },
                    { value: -1, label: "自定义" },
                  ]}
                />
              </Form.Item>
              <Form.Item label="宽度">
                <InputNumber
                  value={canvasWidth}
                  min={200}
                  max={2000}
                  onChange={changeCanvasWidth}
                />
              </Form.Item>
              <Form.Item label="高度">
                <InputNumber
                  value={canvasHeight}
                  min={200}
                  max={2000}
                  onChange={changeCanvasHeight}
                />
              </Form.Item>
            </Form>
            <Form layout="inline" style={{ marginTop: "20px" }}>
              <Form.Item label="工具">
                <Radio.Group
                  onChange={(e) => setTool(e.target.value)}
                  value={tool}
                >
                  <Radio value={ToolType.Pen}>画笔</Radio>
                  <Radio value={ToolType.Eraser}>擦除</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </Col>
          <Col span={8}>
            <p>添加指定元素并拖动到想要的位置</p>
            <Tabs
              style={{ border: '1px solid #ccc' }}
              items={tabs}
              defaultActiveKey={tabs[1].key}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Edit;

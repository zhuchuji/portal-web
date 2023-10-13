import { useState, useRef, useEffect, DragEvent } from "react";
import { Stage, Layer, Line } from "react-konva";
import Konva from "konva";
import {
  Radio,
  Select,
  Form,
  InputNumber,
  Tabs,
  List,
  Row,
  Col,
  Button,
  message,
  Typography,
} from "antd";
import Title from "../../components/Title";
import ImageSelection from "../../components/ImageSelection";
import Model, { ModelHandlerProps } from "./Model";

import jeepWrangler1 from "./images/jeep-wrangler-1.png";
import jeepWrangler2 from "./images/jeep-wrangler-2.png";
import jeepWrangler3 from "./images/jeep-wrangler-3.png";
import jeepWrangler4 from "./images/jeep-wrangler-4.png";
import jeepWrangler5 from "./images/jeep-wrangler-5.png";
import jeepWrangler6 from "./images/jeep-wrangler-6.png";
import jeepWrangler7 from "./images/jeep-wrangler-7.png";
import jeepWrangler8 from "./images/jeep-wrangler-8.png";
import { ImageInfo } from "../../utils/image";
import scene1 from "./images/scene_1.jpg";

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

const scenes = [
  {
    imageUrl: scene1,
    name: "夜景灯光",
    id: 1,
  },
];

let shapeId = 0;

export interface EditProps {
  onNext: (data: {
    canvas: ImageInfo;
    target: ImageInfo;
    width: number;
    height: number;
    scene: number;
  }) => void;
}

const Edit: React.FC<EditProps> = ({ onNext }) => {
  const [renderedWidth, setRenderedWidth] = useState<number>(0);
  const [renderedHeight, setRenderedHeight] = useState<number>(0);
  const [realWidth, setRealWidth] = useState<number>(800);
  const [realHeight, setRealHeight] = useState<number>(600);
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);
  const [lines, setLines] = useState<Konva.LineConfig[]>([]);
  const [model, setModel] = useState<Konva.ImageConfig>();
  const [tool, setTool] = useState<ToolType>(ToolType.Pen);
  const [selectedShapeId, setSelectedShapeId] = useState<string>();
  const isDrawing = useRef<boolean>(false);
  const draggingImage = useRef<HTMLImageElement>();
  const stageRef = useRef<Konva.Stage>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasLayerRef = useRef<Konva.Layer>(null);
  const modelRef = useRef<ModelHandlerProps>(null);
  const [selectedScene, setSelectedScene] = useState<number>(scenes[0].id);

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      const height = Math.floor(width / aspectRatio);
      setRenderedWidth(width);
      setRenderedHeight(height);
    }
  }, [containerRef]);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    if (stageRef.current && draggingImage.current) {
      stageRef.current.setPointersPositions(e);
      const position = stageRef.current.getPointerPosition();
      const model: Konva.ImageConfig = {
        id: String(shapeId++),
        image: draggingImage.current,
        ...(position
          ? {
              x: position.x - dragOffset.current.x,
              y: position.y - dragOffset.current.y,
            }
          : {}),
      };
      setModel(model);
    }
  };

  const changeImage = (model: Konva.ImageConfig) => {
    setModel(model);
  };

  const deleteImage = (shapeId: string) => {
    setModel(undefined);
    setSelectedShapeId(undefined);
  };

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
    if (isDrawing.current) {
      isDrawing.current = false;
    }
  };

  const changeCanvasWidth = (realWidth: number | null) => {
    if (realWidth) {
      setRealWidth(realWidth);
      const realHeight = Math.round(realWidth / aspectRatio);
      setRealHeight(realHeight);
      const renderedHeight = Math.round(renderedWidth / aspectRatio);
      setRenderedHeight(renderedHeight);
    }
  };

  const changeCanvasHeight = (realHeight: number | null) => {
    if (realHeight) {
      setRealHeight(realHeight);
      const realWidth = Math.round(realHeight * aspectRatio);
      setRealWidth(realWidth);
      const renderedHeight = Math.round(renderedWidth / aspectRatio);
      setRenderedHeight(renderedHeight);
    }
  };

  const changeCanvasAspectRatio = (ratio: number) => {
    setAspectRatio(ratio);
    const realHeight = Math.round(realWidth / ratio);
    const renderedHeight = Math.round(renderedWidth / ratio);
    setRealHeight(realHeight);
    setRenderedHeight(renderedHeight);
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
          style={{ maxHeight: "350px", overflow: "auto" }}
          dataSource={jeepWranglers}
          renderItem={(item) => (
            <ImageSelection
              style={{ width: "150px", cursor: "grab" }}
              key={item.id}
              src={item.imageUrl}
              draggable
              onDragStart={(e) => {
                draggingImage.current = e.currentTarget;
                dragOffset.current.x = e.nativeEvent.offsetX;
                dragOffset.current.y = e.nativeEvent.offsetY;
              }}
            />
          )}
        />
      ),
    },
  ];

  const sceneTabs = [
    {
      key: "1",
      label: "场景选择",
      children: (
        <List
          style={{ maxHeight: "350px", overflow: "auto" }}
          grid={{ column: 2 }}
          dataSource={scenes}
          renderItem={(item) => (
            <div key={item.id} style={{ margin: "10px" }}>
              <ImageSelection
                style={{ margin: 0 }}
                src={item.imageUrl}
                selected={selectedScene === item.id}
                onClick={() => setSelectedScene(item.id)}
              />
              <Typography.Paragraph>{item.name}</Typography.Paragraph>
            </div>
          )}
        />
      ),
    },
  ];

  const handleNext = () => {
    const modelImage = modelRef.current?.toDataURL();
    if (modelImage == null) {
      message.error("请先添加模型！");
    } else if (stageRef.current && canvasLayerRef.current) {
      const scale = realWidth / renderedWidth;
      stageRef.current.scale({ x: scale, y: scale });
      const canvasImage = canvasLayerRef.current.toDataURL({
        width: realWidth,
        height: realHeight,
      });
      stageRef.current.scale({ x: 1, y: 1 });

      onNext({
        canvas: { data: canvasImage, mimeType: "image/png" },
        target: { data: modelImage, mimeType: "image/png" },
        width: realWidth,
        height: realHeight,
        scene: selectedScene,
      });
    }
  };

  return (
    <>
      <Title>请选择你的画布与布局</Title>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Row style={{ width: "90%", minWidth: "900px" }} gutter={40}>
          <Col span={16} style={{ borderRight: "1px solid #ccc" }}>
            <div>
              <div ref={containerRef}>
                <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                  <Stage
                    style={{ border: "1px solid #ccc" }}
                    width={renderedWidth}
                    height={renderedHeight}
                    onMouseDown={handleMouseDown}
                    onMousemove={handleMouseMove}
                    onMouseup={handleMouseUp}
                    ref={stageRef}
                  >
                    <Layer>
                      {model && (
                        <Model
                          ref={modelRef}
                          key={model.id}
                          imageConfig={model}
                          onSelect={(id) => setSelectedShapeId(id)}
                          isSelected={selectedShapeId === model.id}
                          onChange={changeImage}
                          onDelete={(shapeId) => deleteImage(shapeId)}
                        />
                      )}
                    </Layer>
                    <Layer ref={canvasLayerRef}>
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
                      value={realWidth}
                      min={200}
                      max={2000}
                      onChange={changeCanvasWidth}
                    />
                  </Form.Item>
                  <Form.Item label="高度">
                    <InputNumber
                      value={realHeight}
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
                <Button
                  style={{ marginTop: "20px" }}
                  type="primary"
                  onClick={handleNext}
                >
                  下一步
                </Button>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <p>添加指定元素并拖动到想要的位置</p>
            <Tabs
              style={{ border: "1px solid #ccc" }}
              tabBarStyle={{ padding: "0 20px" }}
              items={tabs}
              defaultActiveKey={tabs[1].key}
            />
            <Tabs
              style={{ marginTop: '20px', border: "1px solid #ccc" }}
              tabBarStyle={{ padding: "0 20px" }}
              items={sceneTabs}
              defaultActiveKey={sceneTabs[0].key}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Edit;

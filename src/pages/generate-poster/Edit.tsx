import { useState, useRef, MouseEvent } from "react";
import { Stage, Layer, Line, Image } from "react-konva";
import Konva from "konva";
import { Space, Select, Form, InputNumber } from "antd";
import { styled } from "styled-components";
import Title from "../../components/Title";

enum ToolType {
  Pen,
  Eraser,
}

const Edit: React.FC = () => {
  const [canvasWidth, setCanvasWidth] = useState<number>(800);
  const [canvasHeight, setCanvasHeight] = useState<number>(600);
  const [lines, setLines] = useState<Konva.LineConfig[]>([]);
  const [tool, setTool] = useState<ToolType>(ToolType.Pen);
  const isDrawing = useRef<boolean>(false);

  const handleMouseDown = (e: Konva.KonvaPointerEvent) => {
    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos) {
      setLines([...lines, { tool, points: [pos.x, pos.y] }]);
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

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "800px" }}>
        <Title>请选择你的画布与布局</Title>
        <Stage
          style={{ marginBottom: '20px', border: "1px solid #ccc" }}
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
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
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
        <Form
          layout="inline"
        >
          <Form.Item label="比例">
            <Select
              style={{ width: '150px' }}
              defaultValue={4 / 3}
              options={[
                { value: 1 / 1, label: "1 : 1" },
                { value: 3 / 2, label: "3 : 2" },
                { value: 2 / 3, label: "2 : 3" },
                { value: 4 / 3, label: "4 : 3" },
                { value: 3 / 4, label: "3 : 4" },
                { value: 16 / 9, label: "16 : 9" },
                { value: 9 / 16, label: "9 : 16" },
              ]}
            />
          </Form.Item>
          <Form.Item label="宽度">
            <InputNumber value={canvasWidth} onChange={value => setCanvasWidth(value || 800)}/>
          </Form.Item>
          <Form.Item label="高度">
            <InputNumber value={canvasHeight} onChange={value => setCanvasHeight(value || 600)}/>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Edit;

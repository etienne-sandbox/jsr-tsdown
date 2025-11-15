import { useState } from "react";
import { container } from "./MyButton.css";

interface MyButtonProps {
  type?: "primary";
}

export const MyButton: React.FC<MyButtonProps> = ({ type }) => {
  let [count, setCount] = useState(0);
  return (
    <button className={container} onClick={() => setCount(count + 1)}>
      my button
      <br /> type: {type}
      <br /> count: {count}
    </button>
  );
};

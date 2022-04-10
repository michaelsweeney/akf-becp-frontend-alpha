import { Input } from "@mui/material";
import { useEffect, useState } from "react";
const FocusInput = (props) => {
  const { callback, value, inputType } = props;
  // console.log(value);
  let stateValue = value;
  const [inputValue, setInputValue] = useState(stateValue);

  // useEffect(() => {
  // console.log(inputValue, stateValue);
  // setInputValue(stateValue);
  // callback(stateValue);
  // }, [stateValue]);

  return (
    <Input
      type={inputType}
      onFocus={(e) => {}}
      onChange={(e) => {
        setInputValue(e.target.value);
      }}
      onBlur={(e) => {
        // console.log(e.target.value, stateValue);
        callback(e.target.value);
      }}
      value={inputValue}
    />
  );
};
export { FocusInput };

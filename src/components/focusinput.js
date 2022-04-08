import { Input } from "@mui/material";
import { useEffect, useState } from "react";
const FocusInput = (props) => {
  const { callback, value, inputType } = props;

  let stateValue = value;
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(stateValue);

  useEffect(() => {
    setInputValue(stateValue);
    callback(stateValue);
  }, [stateValue]);
  return (
    <Input
      type={inputType}
      onFocus={(e) => {
        setIsFocused(true);
      }}
      onChange={(e) => {
        setInputValue(e.target.value);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        callback(e.target.value);
      }}
      value={inputValue}
    />
  );
};
export { FocusInput };

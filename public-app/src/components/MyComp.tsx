import React from 'react';

interface IProps {
  message?: string;
  value?: number;
  flag?: boolean;
  options?: string[];
  selectedOption?: string;
  callback?: () => void;
}

export const MyComp: React.FC<IProps> = ({
  message = 'HELLO WORLD FROM MY COMPONENT',
  value = 123,
  flag = true,
  options,
  selectedOption,
  callback,
}) => {
  return (
    <div>
      <p>Message: {message}</p>
      <p>Value: {value}</p>
      <button
        onClick={() => {
          if (callback) {
            callback();
          } else {
            console.log('... clicked ...');
          }
        }}
      >
        Click Me
      </button>
      {flag ? <p>Flag is on</p> : <p>Flag is off</p>}
      {options &&
        options.map(v => {
          if (selectedOption && selectedOption === v) {
            return (
              <p key={v} style={{ fontWeight: 'bold' }}>
                option: {v}
              </p>
            );
          }
          return <p key={v}>option: {v}</p>;
        })}
    </div>
  );
};

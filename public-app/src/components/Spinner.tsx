import React from 'react';
// tslint:disable-next-line: align
/** @jsx jsx */ import { jsx, css } from '@emotion/core';

interface ISpinnerProps {
  color?: string;
  size?: number;
  margin?: number;
}

export const Spinner: React.FC<ISpinnerProps> = ({
  color = '#ffffff',
  size = 25,
  margin = 100,
}) => {
  const styles = css`
    .loader {
      margin: ${margin}px auto;
      font-size: ${size}px;
      width: 1em;
      height: 1em;
      border-radius: 50%;
      position: relative;
      text-indent: -9999em;
      -webkit-animation: load5 1.1s infinite ease;
      animation: load5 1.1s infinite ease;
      -webkit-transform: translateZ(0);
      -ms-transform: translateZ(0);
      transform: translateZ(0);
    }
    @-webkit-keyframes load5 {
      0%,
      100% {
        box-shadow: 0em -2.6em 0em 0em ${color}, 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
          2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
          0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
          -2.6em 0em 0 0em rgba(255, 255, 255, 0.5), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);
      }
      12.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.7), 1.8em -1.8em 0 0em ${color},
          2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
          0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
          -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);
      }
      25% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.5),
          1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7), 2.5em 0em 0 0em ${color},
          1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
          -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
          -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
      }
      37.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
          1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5), 2.5em 0em 0 0em rgba(255, 255, 255, 0.7),
          1.75em 1.75em 0 0em ${color}, 0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
          -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
          -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
      }
      50% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
          1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.5),
          1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7), 0em 2.5em 0 0em ${color},
          -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
          -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
      }
      62.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
          1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
          1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5), 0em 2.5em 0 0em rgba(255, 255, 255, 0.7),
          -1.8em 1.8em 0 0em ${color}, -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
          -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
      }
      75% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
          1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
          1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.5),
          -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7), -2.6em 0em 0 0em ${color},
          -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
      }
      87.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
          1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
          1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
          -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5), -2.6em 0em 0 0em rgba(255, 255, 255, 0.7),
          -1.8em -1.8em 0 0em ${color};
      }
    }
    @keyframes load5 {
      0%,
      100% {
        box-shadow: 0em -2.6em 0em 0em ${color}, 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
          2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
          0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
          -2.6em 0em 0 0em rgba(255, 255, 255, 0.5), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);
      }
      12.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.7), 1.8em -1.8em 0 0em ${color},
          2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
          0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
          -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);
      }
      25% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.5),
          1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7), 2.5em 0em 0 0em ${color},
          1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
          -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
          -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
      }
      37.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
          1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5), 2.5em 0em 0 0em rgba(255, 255, 255, 0.7),
          1.75em 1.75em 0 0em ${color}, 0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
          -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
          -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
      }
      50% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
          1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.5),
          1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7), 0em 2.5em 0 0em ${color},
          -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
          -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
      }
      62.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
          1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
          1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5), 0em 2.5em 0 0em rgba(255, 255, 255, 0.7),
          -1.8em 1.8em 0 0em ${color}, -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
          -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
      }
      75% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
          1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
          1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.5),
          -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7), -2.6em 0em 0 0em ${color},
          -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
      }
      87.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
          1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
          1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
          -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5), -2.6em 0em 0 0em rgba(255, 255, 255, 0.7),
          -1.8em -1.8em 0 0em ${color};
      }
    }
  `;

  return (
    <div css={styles}>
      <div className="loader"></div>
    </div>
  );
};

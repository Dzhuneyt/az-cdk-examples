import React, { useState } from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { RouteComponentProps } from '@reach/router';
import { GraphQLClient } from 'graphql-request';
import { Button } from 'rcomps';
import { gate } from 'store';

interface IHomeProps extends RouteComponentProps {}

export const Home: React.FC<IHomeProps> = () => {
  const [text, setText] = useState(`query {
  version
}`);
  const [results, setResults] = useState('');

  const run = async () => {
    try {
      const headers = await gate.getRefreshedAuthHeader();
      const client = new GraphQLClient(`https://api-dev.azcdk.xyz/graphql`, headers);
      const res = await client.request(text);
      setResults(JSON.stringify(res, undefined, 2));
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 500px;
        width: 100%;
        font-size: 150%;
        color: #343434;
        background-color: #bde0fc;
        p {
          margin: 100px 100px;
        }
        textarea {
          width: 100%;
          padding: 10px;
          border: 3px solid #999;
          -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
          -moz-box-sizing: border-box; /* Firefox, other Gecko */
          box-sizing: border-box; /* IE 8+ */
        }
      `}
    >
      <div
        css={css`
          margin-bottom: 20px;
          max-width: 960px;
        `}
      >
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          name="graphql"
          rows={10}
          cols={100}
        ></textarea>
      </div>
      <div>
        <Button onClick={run}>Run</Button>
      </div>
      <div
        css={css`
          margin-top: 20px;
        `}
      >
        <p>{results}</p>
      </div>
    </div>
  );
};

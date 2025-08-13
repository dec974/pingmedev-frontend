import React, { useState, useMemo } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import SlateEditor from '../components/SlateEditor';

const TestPage = () => {
  return <SlateEditor />;
};

export default TestPage;

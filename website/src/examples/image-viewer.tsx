import * as React from 'react';
import {renderToDOM} from '../../../examples/image-viewer/app';

export default function App() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      renderToDOM(ref.current);
    }
  }, []);

  return <div style={{height: '100%'}} ref={ref} />;
}

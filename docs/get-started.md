# Get Started

## Installation

```bash
npm install mjolnir.js
```

# Usage

```ts
import {EventManager, Pinch, Pan} from 'mjolnir.js';

const eventManager = new EventManager({
  target: document.getElementById('container'),
  recognizers: [Pinch, Pan]
});

eventManager.on({
  pinch: (event) => {
    // do something
  }
});

// ...
eventManager.destroy();
```

## Using with React


```tsx
import React, {useRef, useEffect} from 'react';
import {EventManager, Pan} from 'mjolnir.js';

function App() {
  const ref = useRef();

  useEffect(() => {
    // did mount
    const eventManager = new EventManager({
      target: ref.current,
      recognizers: [Pan],
      events: {
        panmove: console.log
      }
    });

    // unmount
    return () => eventManager.destroy();
  }, []);

  return <div ref={ref} />;
}
```

*Note that React's event chain is independent from that of mjolnir.js'. Therefore, a `click` event handler registered with mjolnir.js cannot be blocked by calling `stopPropagation` on a React `onClick` event.*

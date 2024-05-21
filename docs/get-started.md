# Get Started

## Installation

```bash
npm install mjolnir.js
```

or

```html
<script src="https://unpkg.com/mjolnir.js@3/dist.min.js"></script>
```

# Using with NPM

```ts
import {EventManager, Pinch, Pan} from 'mjolnir.js';

const eventManager = new EventManager(document.getElementById('container'), {
  recognizers: [new Pinch(), new Pan()],
  events: {
    pinch: (event) => {
      // do something
    }
  }
});

// when done
eventManager.destroy();
```

## Using with Script Tag

```js
const {EventManager, Pinch, Pan} = mjolnir;

const eventManager = new EventManager(document.getElementById('container'), {
  recognizers: [new Pinch(), new Pan()],
  events: {
    pinch: (event) => {
      // do something
    }
  }
});

// when done
eventManager.destroy();
```


## Using with React


```tsx
import React, {useRef, useEffect} from 'react';
import {EventManager, Pinch, Pan} from 'mjolnir.js';

function App() {
  const ref = useRef();

  useEffect(() => {
    // did mount
    const eventManager = new EventManager(ref.current, {
      recognizers: [new Pinch(), new Pan()],
      events: {
        pinch: (event) => {
          // do something
        }
      }
    });

    // unmounting
    return () => eventManager.destroy();
  }, []);

  return <div id="container" ref={ref} />;
}
```

*Note that React's event chain is independent from that of mjolnir.js'. Therefore, a `click` event handler registered with mjolnir.js cannot be blocked by calling `stopPropagation` on a React `onClick` event.*

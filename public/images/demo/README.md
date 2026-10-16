# Demo catalogue photography

Photos for the demo catalogue (`lib/demo`). Until a file exists, its slot draws
a flat illustration of the garment in its colourway.

Name each file `<product-handle>-<n>.jpg` (`.webp` and `.png` work too):

| n | Shot |
|---|---|
| 1 | first colour, front |
| 2 | first colour, back |
| 3 | second colour, front |
| 4 | second colour, back |

e.g. `signature-pima-polo-1.jpg`. A 3:4 portrait crop on a plain light-grey
background matches the grid. Handles are listed in `SPECS` in `lib/demo/index.ts`.

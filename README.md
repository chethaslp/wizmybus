
<p align="center">
  <h1>Where is my bus?</h1>
</p>

## Usage
An app to show real time location of public transport buses to consumers, which enables efficient crowd and time management.

## Workflow
![Workflow](https://github.com/chethaslp/wizmybus/blob/master/img/workflow.png?raw=true)

## TODO
- [x] ~Include map view~
- [X] ~Get Bus Database~ (Collected more than 40k bus routes!)
- [ ] Real Time location feature
- [ ] Create QR Code page
- [ ] Create Client and Operator pages
- [ ] Add Authentication
- [ ] Write Rules for Firestore
- [x] Bus Timing search (KSRTC) (Partially Done)
- [x] Arrival time prediction (Partially Done)

## Folder structure
```
wizmybus
│   - README.md
│
└───app
│   │- mainPage.jsx <-- [landing page]
│   │- loading.jsx
│   │- page.jsx
│   │- style.css
│   │   
│   └───components
│       └───fb
│       |   |- auth.jsx (Firebase Authentication Code)
│       |   |- db.jsx (Firebase Database Code)
│       |   |- config.jsx (Firebase Configs)
│       |   
│       └───map
│       |   |- icons.js (Icons for Map Markers)
│       |   |- stoplist.js (List of 2k+ bus stops)
│       |   |- util.jsx (Other Utilities)
│       |   
│       └───ui
│           |- noSSR.js
│   
└───img (for Readme.md)
.   │- workflow.png
.
.
```

## Demo

Link here

## Getting Started (Locally)

First, run the development server:

```bash
npx next dev
# or
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

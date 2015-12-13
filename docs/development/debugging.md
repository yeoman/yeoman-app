# Debugging

## Renderer Process

It's possible to debug the Renderer process simply by opening the Web Developers tools <kbd>CMD</kbd>+<kbd>OPT</kbd>+<kbd>I</kbd> ( <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>I</kbd> on Windows) or from the menu View > Developer > Toggle Developers Tools.

## Main Process

In order to debug the Main process we can use [node-inspector](https://github.com/node-inspector/node-inspector), here are the steps on how to use it:

0. Install **node-inspector**: `npm install -g node-inspector`
0. Starts the app in debug mode, run: `npm run debug`
0. Starts the node inspector, run: `npm run inspector`

Please note that we run `node-inspector` using its default ports, it uses port `8080` to run the inspector web interface and port `5858` to communicate between with the node process. For more info plese consult [node-inspector](https://github.com/node-inspector/node-inspector) docs.


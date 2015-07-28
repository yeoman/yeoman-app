# Events


We're using Events to communicate between render, main-process and yeoman's child-process. I would like to give you a brief overview of the different events layers. Let's get started from the top.

![yeoman-app](https://cloud.githubusercontent.com/assets/1393946/8196723/eeb06f30-148e-11e5-92b0-6bbcae3615a5.png)

## IPC renderer

All kind of user interactions like clicking a button, selecting a native menu item or keyboard-hits will be emitted on the [ipc renderer](https://github.com/atom/electron/blob/master/docs/api/ipc-renderer.md) module. It also receive messages sent from the `main process`. For example, when the app is loading the main process sends a list of installed generators to the render process. If the user selects one element from the list the render process will emit an event with the generator name to the main process.


## IPC main process

The `main process` use the [ipc main process](https://github.com/atom/electron/blob/master/docs/api/ipc-main-process.md) module to  receive and send message from and to the `render process`. For example, it will call the native "Open Dialog" and respond with the selected folder to the `render process`. But it does even more than that. It's the mediator between the `render process` and the `child process`.


## IPC child process

The real magic happens here. We're using [yeoman-environment](https://github.com/yeoman/environment) which is the headless (UI-less) yeoman core. The whole [yeoman process](../src/browser/yo/yo.js) is running in a `child process` which allows us to terminate the process gracefully. With our custom [adapter](../src/browser/yo/adapter.js) we can easily forward `prompt`'s, `diff`'s and `log`'s via [process.send](https://nodejs.org/api/child_process.html#child_process_child_send_message_sendhandle) to the parent process / `main process`.

By the limitation of `process.send` we're only able to send JSON data between the child and parent process. By that all message are send in the following format:

### Schema

```json
{
  "event": "event_name",
  "data": "payload_data"
}
```

- **event_name** â€“ Specifies the event name. A full list of events, and when they execute, can be found below.

- **payload_data** â€“ The `body` of the event. The body must be a valid JSON object.


## Events

### generator:init

This event is used to initialize yeoman in the `child process`.


### generator:error

This event is emitted when something goes wrong in the `child process`.

**Payload:**

Either a `string` or a stringified `Error` object.


### generator:installed-generators

This event is emitted with a list of installed generators.

**Payload:**
```js
[
  {
    name: 'generator-angular',
    version: '0.11.1',
    description: 'Yeoman generator for AngularJS',
    officialGenerator: true
  }
]
```

### generator:directory-selected

This event is emitted with the destination folder in which Yeoman will be scaffolding a new application.

**Payload:**
```js
/path/to/scaffolding/project
```

### generator:run

This event is used to execute the provided yeoman generator in the given folder.

**Payload:**
```js
[
  'generator-angular',
  '/path/to/scaffolding/project'
]
```

### generator:prompt-questions

This event is emitted with the questions from the current running yeoman generator. Check out the [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) documentation for details.

**Payload:**
```js
[
  {
    type: 'confirm',
    name: 'compass',
    message: 'Would you like to use Sass (with Compass)?',
    default: true
  }
]
```

### generator:prompt-answer

This event is used to send the answers from the current prompt back to the generator.

**Payload:**
```js
{
  compass: true
}
```


### generator:install

This event is emitted once when the first installing task is started.


### generator:bowerInstall

This event is emitted when `bower` starts installing the dependencies.


### generator:bowerInstall:end

This event is emitted when `bower` is completed.


### generator:npmInstall

This event is emitted when `npm` starts installing the dependencies.


### generator:npmInstall:end

This event is emitted when `npm` is completed.


### generator:done

This event is emitted when the entire scaffolding process is done.


### context-generator

This is an mediator event to forward the `renderer process` to the `child process`. Currently used only for `generator:run` and `generator:prompt-answer`.


### context-appwindow

This is an mediator event to forward the `renderer process` to the `main process`. Currently used only for `open-dialog` and `generator-cancel`.


### open-dialog

This event will open the open dialog.


### generator-cancel

This event will cancel the execution of the active yeoman generator.


### application:quit
### application:report-issue
### application:run-specs
### window:reload
### window:toggle-dev-tools
### window:toggle-full-screen

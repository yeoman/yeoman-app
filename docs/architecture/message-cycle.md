# Message cycle

The image below shows the message (IPC & Event) cycle in the yeoman application.


The Atom Shell provieds two IPC (Inter process communication) modules which allows you to send and receive message between the render (frontend) and the browser (backend).

With the [IPC renderer](https://github.com/atom/atom-shell/blob/master/docs/api/ipc-renderer) module you can send message to the browser and also receive messages from the browser. The [IPC browser](https://github.com/atom/atom-shell/blob/master/docs/api/ipc-browser.md) let you revice message send from the render process to the browser. For detailed informations please visit the Atom Shell documenation. 


![Message cycle in the yeoman application](message-cycle.png)


## List of implemented IPC's

- appwindow

- generator-data

- generator-error

- generator-done

- directory-selected

- generator-prompt


## List of implemented events


- application:quit

- application:new-window

- connector:generator-data

- connector:generator-error

- connector:generator-done

- connector:directory-selected

- connector:generator-prompt

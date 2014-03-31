# Yeoman App

<!-- [![Build Status](https://secure.travis-ci.org/yeoman/yeoman-app.png?branch=master)](https://travis-ci.org/yeoman/yeoman-app) [![NPM version](https://badge.fury.io/js/yeoman-app.png)](http://badge.fury.io/js/yeoman-app) [![Dependency Status](https://david-dm.org/yeoman/yeoman-app.png)](https://david-dm.org/yeoman/yeoman-app) -->

A desktop app made with [Node Webkit](https://github.com/rogerwang/node-webkit) that scaffolds projects using [Yeoman](https://github.com/yeoman/yeoman).

> Maintainer: [Zeno Rocha](https://github.com/zenorocha/)

![Sample](http://f.cl.ly/items/0I1t1S1e0v3s1u421y1X/Screen%20Shot%202014-03-29%20at%208.07.06%20PM.png)

## Download

![Windows](http://f.cl.ly/items/1H0O3m1s0c0Q3E302c0e/win.png) | ![Mac](http://f.cl.ly/items/303x3T0l1g40333z0H0x/mac.png) | ![Linux](http://f.cl.ly/items/3d1o293v402R1z0G2o3g/lin.png)
--- | --- | --- | ---
[win32, 7+](#) | [32bit, 10.7+](#) | [32bit](#) / [64bit](#)

## Development

Install [node-webkit](https://github.com/rogerwang/node-webkit) and make an [alias](https://github.com/rogerwang/node-webkit/wiki/How-to-run-apps) to it:

```sh
$ alias nw="/Applications/node-webkit.app/Contents/MacOS/node-webkit"
```

Run node-webkit from the root directory with `--debug` to enable debugging mode like so:

```sh
$ nw . --debug
```

## Tasks

We use [Grunt](http://gruntjs.com/), a task-runner in [Node](http://nodejs.org/), to automate things.

To install it, run:

```sh
$ npm install -g grunt-cli
```

To install local dependencies, run:

```sh
$ npm install
```

To build package for development purposes on Mac OSx, run:

```sh
$ grunt build
```

To build packages for release purposes on Mac OSx/Window/Linux, run:

```sh
$ grunt release
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Credits

* 3D Grid Effect by [Codrops](http://tympanus.net/codrops/2014/03/27/3d-grid-effect/);
* Graphite CSS UI Kit by [CSSFlow](http://www.cssflow.com/ui-kits/graphite).

## History

For detailed changelog, check [Releases](https://github.com/yeoman/yeoman-app/releases).

## License

[MIT License](http://opensource.org/licenses/mit-license.php)

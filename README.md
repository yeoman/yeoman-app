# Yeoman App

<!-- [![Build Status](https://secure.travis-ci.org/zenorocha/yeoman-app.png?branch=master)](https://travis-ci.org/zenorocha/yeoman-app) [![NPM version](https://badge.fury.io/js/yeoman-app.png)](http://badge.fury.io/js/yeoman-app) [![Dependency Status](https://david-dm.org/zenorocha/yeoman-app.png)](https://david-dm.org/zenorocha/yeoman-app) -->

![](http://f.cl.ly/items/0I1t1S1e0v3s1u421y1X/Screen%20Shot%202014-03-29%20at%208.07.06%20PM.png)

> An app made with [Node Webkit](https://github.com/rogerwang/node-webkit) that scaffolds projects using [Yeoman](https://github.com/yeoman/yeoman).

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

## Team

Yeoman App is maintained by these guys and some awesome [contributors](https://github.com/zenorocha/yeoman-app/graphs/contributors).

[![Zeno Rocha](http://gravatar.com/avatar/e190023b66e2b8aa73a842b106920c93?s=70)](https://github.com/zenorocha/) | [![Henrique Vicente](http://gravatar.com/avatar/5733fd332f2a0da11931e0e73ddfb20d?s=70)](https://github.com/henvic/) | [![Bruno Coelho](http://gravatar.com/avatar/1f90c690b534779560d3bfdb23772915?s=70)](https://github.com/brunocoelho/)
--- | --- | --- | ---
[Zeno Rocha](https://github.com/zenorocha/) | [Henrique Vicente](https://github.com/henvic/) | [Bruno Coelho](https://github.com/brunocoelho/)

## Credits

* 3D Grid Effect by [Codrops](http://tympanus.net/codrops/2014/03/27/3d-grid-effect/);
* Graphite CSS UI Kit by [CSSFlow](http://www.cssflow.com/ui-kits/graphite).

## History

For detailed changelog, check [Releases](https://github.com/zenorocha/yeoman-app/releases).

## License

[MIT License](http://zenorocha.mit-license.org/) © Zeno Rocha

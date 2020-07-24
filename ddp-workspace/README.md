# DDP-Workspace
# DataDonationPlatform Angular SDK and Toolkit libraries; basil-app, sandbox-app sample apps; ddp-angio, ddp-brain, ddp-mbc apps

These libraries and projects were generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.3.

## Initial steps
```
nvm use 10.16.0
npm install -g @angular/cli@10.0.3
npm install
```
## Launch apps

Don't forget to [render](../README.md/#rendering-pepperconfigjs-and-ddpconfigjs-files "rendering config") `ddpConfig.js/pepperConfig.js`.

Sample apps:
```
ng serve basil-app
ng serve sandbox-app
```

DDP apps:
```
ng serve ddp-angio
ng serve ddp-brain
ng serve ddp-mbc
ng serve ddp-osteo
ng serve ddp-testboston
ng serve ddp-mpc
```

By default `ng serve` returns ES2015 files, these files are incompatible with Internet Explorer 11 in order to open app in IE11, you need to add additional param for `ng serve` and generate ES5 files, run `ng serve ddp-angio --configuration es5`

## Create new library

Run `ng generate library %library-name%`

## Create new app

Run `ng generate application %app-name%`

Useful tricks:
- How to add `--configuration es5` param support:
	1. Copy `pepper-angular\ddp-workspace\projects\ddp-angio\tsconfig.es5.json` to the new project folder
	2. Modify `pepper-angular\ddp-workspace\angular.json`:
   	- Your-project-name -> architect -> build -> options -> add:
   ```
   "es5BrowserSupport": true
   ```
  	 - Your-project-name -> architect -> build -> configurations -> add:
   ```
   "es5": {
    	"tsConfig": "projects/your-project-name/tsconfig.es5.json"
    }
   ```

- How to fix [missed whitespaces](https://github.com/angular/angular/issues/21049 "missed whitespaces") between inline or inline-block elements in Angular 6+:
	- For JIT Compiling
	Add `{ preserveWhitespaces: true }` as an option to the `bootstrapModule()` method in main.ts:
	```
	platformBrowserDynamic().bootstrapModule(AppModule, { preserveWhitespaces: true })
	```
	- For AOT Compiling
	Add `"angularCompilerOptions": { "preserveWhitespaces": true }` to tsconfig.app.json:
	```
	{
		"extends": "../../tsconfig.json",
		"compilerOptions": {
			"outDir": "../../out-tsc/app",
			"types": []
		},
		"include": [
			"src/**/*.ts"
		],
		"exclude": [
			"src/test.ts",
			"src/**/*.spec.ts"
		],
		"angularCompilerOptions": {
			"preserveWhitespaces": true
		}
	}
	```

- How to add Material theme:
	1. Create theme file `pepper-angular\ddp-workspace\projects\your-project\src\theme.scss`
	2. Add theme path in `angular.json`: your-project-name -> architect -> build -> options -> styles

## Build DDP-SDK

Run `ng build ddp-sdk` to build the project. The build artifacts will be stored in the `dist/` directory.
Run `ng build ddp-sdk --watch` to build the project and enable hot reload. 

## Packing and publishing DDP-SDK

Go to the dist folder `cd dist/ddp-sdk` and run `npm pack` or `npm publish`.

## Build Toolkit

Run `ng build toolkit` to build the project. The build artifacts will be stored in the `dist/` directory.
Run `ng build toolkit --watch` to build the project and enable hot reload. 

## Packing and publishing Toolkit

Go to the dist folder `cd dist/toolkit` and run `npm pack` or `npm publish`.

## Code scaffolding

Run `ng generate component component-name --project ddp-sdk` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project ddp-sdk`.
> Note: Don't forget to add `--project ddp-sdk`(or another project) or else it will be added to the default project in your `angular.json` file. 

## Running unit tests

Run `ng test %app/library-name%` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e %app/library-name%` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

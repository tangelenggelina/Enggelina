# Copilot for Visual Studio Code
This extension contributes JavaScript/TypeScript development tooling. It is the successor of the [AngularDoc](https://marketplace.visualstudio.com/items?itemName=AngularDoc.angulardoc-vscode) extension, but we have made significant improvements to the static analyzer's performance, and best of all, we now support [React](https://reactjs.org/), [Vue](https://vuejs.org/), [NestJS](https://nestjs.com/), and [Stencil](https://stenciljs.com/) in addition to [Angular](https://angular.io/)!

## Features

- "Application Explorer" view that lets you browse the application's modules and components, and the top level constructs in the TypeScript file.
- "State Management Explorer" view that lets you browse the NgRx/Redux/Vuex constructs such as stores, states, reducers, selectors, and effects, etc.
- State management diagrams for NgRx, Redux, and Vuex.
- (Angular) Invoking [schematics commands](https://blog.angular.io/version-6-of-angular-now-available-cc56b0efa7a4) from the explorer's inline menu. The list of supported schematics is customizable (see the Usage section below).
- "RxJS Operator Decision Tree" command (see https://rxjs-dev.firebaseapp.com/operator-decision-tree).

## Screenshots

![Application Explorer for Angular](https://user-images.githubusercontent.com/1360728/56192774-f8ece380-5fe3-11e9-8513-5170f03fc949.png)

![State Management Diagram for React](https://user-images.githubusercontent.com/1360728/56263693-cf41c400-6098-11e9-9cc0-6e41040e57ba.png)

![State Management Explorer for Vue](https://user-images.githubusercontent.com/1360728/56192234-cd1d2e00-5fe2-11e9-942b-0f755d94a4ff.gif)

![Schematics command screenshot](https://user-images.githubusercontent.com/1360728/56264237-b0dcc800-609a-11e9-939f-6e852ca0bafe.gif)

![RxJS Operator Decision Tree](https://user-images.githubusercontent.com/1360728/56631994-919ae900-660c-11e9-9e49-03cd0a6960e6.gif)

## Installation

Launch Visual Studio Code. In the command palette (`cmd-shift-p`) select `Install Extension` and enter `Copilot`.

## Usage

To verify the installation, you can optionally clone the repositories from https://github.com/AngularDoc-Showcases and see if the Copilot features work as expected.

To use Copilot view, click the "Copilot" icon in the Activity bar on the far left-hand side. It may take a few seconds for the project to be analyzed and the items to show up in the Application Explorer and State Management Explorer. Click on an element in the tree view and the corresponding file will be previewed in the editor. 

The "State Management Explorer" view and diagrams are advanced features that are enabled for projects using AngularDoc Team Services on https://angulardoc.io, and open source projects that have set up the free service on https://angulardoc.org.

To run the schematics commands, move the cursor over a module in Application Explorer, and select the inline icon "Schematics". You will then be asked to pick the schematics type and enter the entity type/name in the input box. Press "Enter" to confirm. The following schematics are supported by default (and you can add your own schematics to the list in the User Settings):
- @schematics/angular
- @ngrx/schematics
- @angular/pwa
- @ng-bootstrap/schematics
- @angular/material
- @clr/angular
- @angular/elements

_Note_: Only the schematics that have been installed in the project will be available to pick.

To run the "RxJS Operator Decision Tree" command, select it in the command palette (`cmd-shift-p`).

## About

For more information on our product suite, please visit our [web site](https://angulardoc.github.io). Follow us on Twitter [@angulardocio](https://twitter.com/angulardocio) to receive updates. Last but not the least, please [leave a review](https://marketplace.visualstudio.com/items?itemName=Metatype.copilot-vscode&ssr=false#review-details) if you like this extension!



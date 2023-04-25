import { __decorate } from "tslib";
import { Component } from '@angular/core';
let ExampleComponent = class ExampleComponent {
    constructor(teszt) {
        this.teszt = teszt;
        this.kulu = 'yaku';
    }
    ngOnInit() {
        this.teszt.test;
    }
};
ExampleComponent = __decorate([
    Component({
        selector: 'example',
        templateUrl: './example.component.html',
        styleUrls: ['./example.component.css']
    })
], ExampleComponent);
export { ExampleComponent };
//# sourceMappingURL=example.component.js.map
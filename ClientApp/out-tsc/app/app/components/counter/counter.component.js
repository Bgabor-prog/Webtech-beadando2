import { __decorate } from "tslib";
import { Component } from '@angular/core';
let CounterComponent = class CounterComponent {
    constructor() {
        this.currentCount = 0;
    }
    incrementCounter() {
        this.currentCount++;
    }
};
CounterComponent = __decorate([
    Component({
        selector: 'app-counter-component',
        templateUrl: './counter.component.html'
    })
], CounterComponent);
export { CounterComponent };
//# sourceMappingURL=counter.component.js.map
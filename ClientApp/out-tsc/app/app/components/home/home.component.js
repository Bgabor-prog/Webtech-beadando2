import { __decorate } from "tslib";
import { Component } from '@angular/core';
let HomeComponent = class HomeComponent {
    constructor(http) {
        this.http = http;
        this.http.get("/api").subscribe(b => console.log(b));
    }
};
HomeComponent = __decorate([
    Component({
        selector: 'app-home',
        templateUrl: './home.component.html',
    })
], HomeComponent);
export { HomeComponent };
//# sourceMappingURL=home.component.js.map
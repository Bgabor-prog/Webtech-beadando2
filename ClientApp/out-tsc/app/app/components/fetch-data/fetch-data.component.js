import { __decorate, __param } from "tslib";
import { Component, Inject } from '@angular/core';
let FetchDataComponent = class FetchDataComponent {
    constructor(http, baseUrl) {
        this.forecasts = [];
        http.get(baseUrl + 'weatherforecast').subscribe(result => {
            this.forecasts = result;
        }, error => console.error(error));
    }
};
FetchDataComponent = __decorate([
    Component({
        selector: 'app-fetch-data',
        templateUrl: './fetch-data.component.html'
    }),
    __param(1, Inject('BASE_URL'))
], FetchDataComponent);
export { FetchDataComponent };
//# sourceMappingURL=fetch-data.component.js.map
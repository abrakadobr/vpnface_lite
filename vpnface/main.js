(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/api.service.ts":
/*!********************************!*\
  !*** ./src/app/api.service.ts ***!
  \********************************/
/*! exports provided: APIService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "APIService", function() { return APIService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var APIService = /** @class */ (function () {
    function APIService(http) {
        this.http = http;
        this._status = 'none';
        this._servers = null;
        this._title = '';
        this._ticon = '';
        this._mtitle = '';
        this._hasMenu = true;
        this._load = '';
    }
    //common
    APIService.prototype.lastLogs = function () {
        return this.http.get('/api/logs');
    };
    APIService.prototype.loadStatus = function () {
        var _this = this;
        return new rxjs__WEBPACK_IMPORTED_MODULE_2__["Observable"](function (o) {
            _this.http.get('/api/status/').subscribe(function (data) {
                _this._status = data.status;
                o.next(data);
                o.complete();
            });
        });
    };
    //SERVERS
    APIService.prototype.serversCodes = function () {
        if (!this._servers)
            return [];
        return Object.keys(this._servers);
    };
    APIService.prototype.serversList = function () {
        var _this = this;
        var ret = [];
        var codes = this.serversCodes();
        codes.forEach(function (c) {
            var o = {
                code: c,
                name: _this._servers[c].name,
                cloud: 'cloud_off'
            };
            if (_this._servers[c].type == 'root')
                o.cloud = 'cloud_off';
            if (_this._servers[c].type == 'public')
                o.cloud = 'cloud_queue';
            if (_this._servers[c].type == 'dark')
                o.cloud = 'cloud_circle';
            ret.push(o);
        });
        return ret;
    };
    APIService.prototype.loadServers = function () {
        var _this = this;
        return new rxjs__WEBPACK_IMPORTED_MODULE_2__["Observable"](function (o) {
            _this.http.get('/api/vpnlist').subscribe(function (data) {
                _this._servers = data;
                o.next(data);
                o.complete();
            });
        });
    };
    APIService.prototype.loadServer = function (code) {
        return this.http.get('/api/server/' + code);
    };
    //KEYS
    APIService.prototype.grabKey = function (key) {
        window.open('/api/ovpn/' + key, '_blank');
    };
    APIService.prototype.createKey = function (server, name) {
        var _this = this;
        return new rxjs__WEBPACK_IMPORTED_MODULE_2__["Observable"](function (o) {
            _this.http.post('/api/gencli', {
                srv: server,
                cli: name
            }).subscribe(function (d) {
                _this.loadServers().subscribe(function (dd) {
                    o.next(d);
                    o.complete();
                });
            });
        });
    };
    APIService.prototype.lockKey = function (key) {
        return this.http.get('api/lock/' + key);
    };
    APIService.prototype.unlockKey = function (key) {
        return this.http.get('api/unlock/' + key);
    };
    //install
    APIService.prototype.finilizeInstall = function () {
        return this.http.get('http://10.1.0.1:8808/api/finilize');
    };
    APIService.prototype.ping10 = function () {
        return this.http.jsonp('http://10.1.0.1:8808/api/ping', 'cb');
    };
    APIService.prototype.confirmIP = function (ip) {
        return this.http.post('/api/confirmip', { ip: ip });
    };
    APIService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], APIService);
    return APIService;
}());



/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".sidenav-container {\n  height: 100%;\n}\n\n.sidenav {\n  width: 200px;\n  box-shadow: 3px 0 6px rgba(0,0,0,.24);\n}\n\n.toolbar-hor-spacer {\n  flex: 1 1 auto;\n}\n\nmat-nav-list mat-icon {\n  margin-right: 4pt;\n}\n\n.tb-icon mat-icon {\n  position: relative;\n  top: 4pt;\n  margin-right: 8px;\n}\n"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-sidenav-container class=\"sidenav-container\">\n  <mat-sidenav\n    #drawer\n    class=\"sidenav\"\n    fixedInViewport=\"true\"\n    [attr.role]=\"isHandset ? 'dialog' : 'navigation'\"\n    [mode]=\"(isHandset | async)!.matches ? 'over' : 'side'\"\n    [opened]=\"(!(isHandset | async)!.matches)&&api._hasMenu\">\n    <mat-toolbar color=\"primary\">{{api._mtitle}}</mat-toolbar>\n    <mat-nav-list *ngFor=\"let cd of _menu\">\n      <a mat-list-item (click)=\"goto(cd.code,drawer)\"><mat-icon>{{cd.cloud}}</mat-icon> {{cd.name}}</a>\n    </mat-nav-list>\n  </mat-sidenav>\n  <mat-sidenav-content>\n    <mat-toolbar color=\"primary\">\n      <button\n        type=\"button\"\n        aria-label=\"Toggle sidenav\"\n        mat-icon-button\n        (click)=\"drawer.toggle()\"\n        *ngIf=\"((isHandset | async)!.matches)&&api._hasMenu\">\n        <mat-icon aria-label=\"Side nav toggle icon\">more_vert</mat-icon>\n      </button>\n      <span><span class=\"tb-icon\" *ngIf=\"api._ticon != ''\"><mat-icon>{{api._ticon}}</mat-icon> </span>{{api._title}}</span>\n      <span class=\"toolbar-hor-spacer\"></span>\n      <button *ngIf=\"api._hasMenu\" mat-button class=\"more-button\" aria-label=\"Справка\" routerLink=\"help\">\n        <mat-icon>help_outline</mat-icon>\n      </button>\n    </mat-toolbar>\n\n    <router-outlet></router-outlet>\n  </mat-sidenav-content>\n</mat-sidenav-container>\n<app-logger></app-logger>\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/cdk/layout */ "./node_modules/@angular/cdk/esm5/layout.es5.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./api.service */ "./src/app/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AppComponent = /** @class */ (function () {
    function AppComponent(router, breakpointObserver, api) {
        var _this = this;
        this.router = router;
        this.breakpointObserver = breakpointObserver;
        this.api = api;
        this.title = 'app';
        this._status = 'none';
        this._menu = [];
        this._hs = true;
        this._doNext = true;
        this.isHandset = this.breakpointObserver.observe(_angular_cdk_layout__WEBPACK_IMPORTED_MODULE_2__["Breakpoints"].Handset);
        this.updateStatus();
        this.isHandset.subscribe(function (d) {
            _this._hs = d.matches;
        });
    }
    AppComponent.prototype.updateServers = function (cb) {
        var _this = this;
        this.api.loadServers().subscribe(function (data) {
            _this._menu = _this.api.serversList();
            cb();
        });
    };
    AppComponent.prototype.goto = function (srvCode, drawer) {
        if (this._hs)
            drawer.toggle();
        this.router.navigate(['vpn', srvCode]);
    };
    AppComponent.prototype.updateStatus = function () {
        var _this = this;
        this.api.loadStatus().subscribe(function (data) {
            if (_this._status != data.status)
                _this.setStatus(data.status);
            if (_this._doNext)
                setTimeout(function () {
                    _this.updateStatus();
                }, 1000);
        });
    };
    AppComponent.prototype.setStatus = function (st) {
        var _this = this;
        if (st === void 0) { st = 'none'; }
        //special single case on install finished
        if (this._status == 'install2' && st == 'ready') {
            window.location.replace('http://10.1.0.1/vpn/adm');
            return;
        }
        this._status = st;
        //this._status = 'install2'
        //this._doNext = false
        //console.log(['setStatus',this._status])
        if (this._status == 'install0')
            return this.router.navigate(['install']);
        if (this._status == 'install1')
            return this.router.navigate(['install1']);
        if (this._status == 'install2')
            return this.router.navigate(['install2']);
        if (this._status == 'ready') {
            this._doNext = false;
            this.updateServers(function () {
                _this.api._mtitle = 'Сервера';
                _this.api._hasMenu = true;
                _this.router.navigate(['vpn/inet']);
            });
        }
    };
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_2__["BreakpointObserver"], _api_service__WEBPACK_IMPORTED_MODULE_3__["APIService"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/esm5/input.es5.js");
/* harmony import */ var _angular_material_button_toggle__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/button-toggle */ "./node_modules/@angular/material/esm5/button-toggle.es5.js");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/progress-spinner */ "./node_modules/@angular/material/esm5/progress-spinner.es5.js");
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/progress-bar */ "./node_modules/@angular/material/esm5/progress-bar.es5.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/esm5/select.es5.js");
/* harmony import */ var _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/cdk/layout */ "./node_modules/@angular/cdk/esm5/layout.es5.js");
/* harmony import */ var _vpnserver_vpnserver_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./vpnserver/vpnserver.component */ "./src/app/vpnserver/vpnserver.component.ts");
/* harmony import */ var _vpnuserdialog_vpnuserdialog_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./vpnuserdialog/vpnuserdialog.component */ "./src/app/vpnuserdialog/vpnuserdialog.component.ts");
/* harmony import */ var _installer_installer_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./installer/installer.component */ "./src/app/installer/installer.component.ts");
/* harmony import */ var _installer1_installer1_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./installer1/installer1.component */ "./src/app/installer1/installer1.component.ts");
/* harmony import */ var _installer2_installer2_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./installer2/installer2.component */ "./src/app/installer2/installer2.component.ts");
/* harmony import */ var _loader_loader_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./loader/loader.component */ "./src/app/loader/loader.component.ts");
/* harmony import */ var _logger_logger_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./logger/logger.component */ "./src/app/logger/logger.component.ts");
/* harmony import */ var _logline_logline_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./logline/logline.component */ "./src/app/logline/logline.component.ts");
/* harmony import */ var _help_help_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./help/help.component */ "./src/app/help/help.component.ts");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/material/dialog */ "./node_modules/@angular/material/esm5/dialog.es5.js");
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/material/paginator */ "./node_modules/@angular/material/esm5/paginator.es5.js");
/* harmony import */ var _app_paginator__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./app.paginator */ "./src/app/app.paginator.ts");
/* harmony import */ var _warn_dialog_warn_dialog_component__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./warn-dialog/warn-dialog.component */ "./src/app/warn-dialog/warn-dialog.component.ts");
/* harmony import */ var _help_client_help_client_component__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./help-client/help-client.component */ "./src/app/help-client/help-client.component.ts");
/* harmony import */ var _help_faq_help_faq_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./help-faq/help-faq.component */ "./src/app/help-faq/help-faq.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









//import { MainpageComponent } from './mainpage/mainpage.component'






















var appRoutes = [
    { path: 'help', component: _help_help_component__WEBPACK_IMPORTED_MODULE_23__["HelpComponent"] },
    { path: 'load', component: _loader_loader_component__WEBPACK_IMPORTED_MODULE_20__["LoaderComponent"] },
    { path: 'install', component: _installer_installer_component__WEBPACK_IMPORTED_MODULE_17__["InstallerComponent"] },
    { path: 'install1', component: _installer1_installer1_component__WEBPACK_IMPORTED_MODULE_18__["Installer1Component"] },
    { path: 'install2', component: _installer2_installer2_component__WEBPACK_IMPORTED_MODULE_19__["Installer2Component"] },
    { path: 'vpn/:code', component: _vpnserver_vpnserver_component__WEBPACK_IMPORTED_MODULE_15__["VpnserverComponent"] },
    { path: '',
        redirectTo: '/load',
        pathMatch: 'full'
    },
    { path: '**',
        redirectTo: '/load',
        pathMatch: 'full'
    }
];
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_6__["AppComponent"],
                _vpnserver_vpnserver_component__WEBPACK_IMPORTED_MODULE_15__["VpnserverComponent"],
                _vpnuserdialog_vpnuserdialog_component__WEBPACK_IMPORTED_MODULE_16__["VpnuserdialogComponent"],
                _installer_installer_component__WEBPACK_IMPORTED_MODULE_17__["InstallerComponent"],
                _installer2_installer2_component__WEBPACK_IMPORTED_MODULE_19__["Installer2Component"],
                _loader_loader_component__WEBPACK_IMPORTED_MODULE_20__["LoaderComponent"],
                _installer1_installer1_component__WEBPACK_IMPORTED_MODULE_18__["Installer1Component"],
                _logger_logger_component__WEBPACK_IMPORTED_MODULE_21__["LoggerComponent"],
                _logline_logline_component__WEBPACK_IMPORTED_MODULE_22__["LoglineComponent"],
                _help_help_component__WEBPACK_IMPORTED_MODULE_23__["HelpComponent"],
                _warn_dialog_warn_dialog_component__WEBPACK_IMPORTED_MODULE_27__["WarnDialogComponent"],
                _help_client_help_client_component__WEBPACK_IMPORTED_MODULE_28__["HelpClientComponent"],
                _help_faq_help_faq_component__WEBPACK_IMPORTED_MODULE_29__["HelpFaqComponent"]
            ],
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterModule"].forRoot(appRoutes, { enableTracing: false } // <-- debugging purposes only
                ),
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_7__["BrowserAnimationsModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_7__["NoopAnimationsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatGridListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatCardModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_material_dialog__WEBPACK_IMPORTED_MODULE_24__["MatDialogModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatMenuModule"],
                _angular_material_select__WEBPACK_IMPORTED_MODULE_13__["MatSelectModule"],
                _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__["MatProgressSpinnerModule"],
                _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_12__["MatProgressBarModule"],
                _angular_material_button_toggle__WEBPACK_IMPORTED_MODULE_10__["MatButtonToggleModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatTableModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatPaginatorModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatSortModule"],
                _angular_material_input__WEBPACK_IMPORTED_MODULE_9__["MatInputModule"],
                _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_14__["LayoutModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatToolbarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatSidenavModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatListModule"],
                _angular_http__WEBPACK_IMPORTED_MODULE_3__["HttpModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientJsonpModule"]
            ],
            providers: [
                { provide: _angular_material_paginator__WEBPACK_IMPORTED_MODULE_25__["MatPaginatorIntl"], useClass: _app_paginator__WEBPACK_IMPORTED_MODULE_26__["MatPaginatorIntlRu"] }
            ],
            entryComponents: [_vpnuserdialog_vpnuserdialog_component__WEBPACK_IMPORTED_MODULE_16__["VpnuserdialogComponent"], _warn_dialog_warn_dialog_component__WEBPACK_IMPORTED_MODULE_27__["WarnDialogComponent"]],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_6__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/app.paginator.ts":
/*!**********************************!*\
  !*** ./src/app/app.paginator.ts ***!
  \**********************************/
/*! exports provided: MatPaginatorIntlRu */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatPaginatorIntlRu", function() { return MatPaginatorIntlRu; });
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/material/paginator */ "./node_modules/@angular/material/esm5/paginator.es5.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var MatPaginatorIntlRu = /** @class */ (function (_super) {
    __extends(MatPaginatorIntlRu, _super);
    function MatPaginatorIntlRu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.itemsPerPageLabel = 'Элементов на странице';
        _this.nextPageLabel = 'Следующая страница';
        _this.previousPageLabel = 'Предыдущая страница';
        _this.getRangeLabel = function (page, pageSize, length) {
            if (length === 0 || pageSize === 0) {
                return '0 из ' + length;
            }
            length = Math.max(length, 0);
            var startIndex = page * pageSize;
            // If the start index exceeds the list length, do not try and fix the end index to the end.
            var endIndex = startIndex < length ?
                Math.min(startIndex + pageSize, length) :
                startIndex + pageSize;
            return startIndex + 1 + ' - ' + endIndex + ' из ' + length;
        };
        return _this;
    }
    return MatPaginatorIntlRu;
}(_angular_material_paginator__WEBPACK_IMPORTED_MODULE_0__["MatPaginatorIntl"]));



/***/ }),

/***/ "./src/app/help-client/help-client.component.css":
/*!*******************************************************!*\
  !*** ./src/app/help-client/help-client.component.css ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/help-client/help-client.component.html":
/*!********************************************************!*\
  !*** ./src/app/help-client/help-client.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "          <mat-form-field>\n            <mat-select [(value)]=\"_cliOS\" placeholder=\"Инструкция для\">\n              <mat-option value='win'>Windows</mat-option>\n              <mat-option value='linux'>Linux</mat-option>\n              <mat-option value='macos'>MacOS</mat-option>\n              <mat-option value='android'>Android</mat-option>\n              <mat-option value='ios'>iOS</mat-option>\n            </mat-select>\n          </mat-form-field>\n          <br/>\n          <p *ngIf=\"_cliOS == ''\" class=\"mat-body-1\">\n          Выберите вашу операционную систему из списка, что бы увидеть инструкции.\n          </p>\n\n          <div *ngIf=\"_cliOS == 'win'\">\n            <p  class=\"mat-body-1\">\n  Оффициальный клиент OpenVPN можно скачать с <a href=\"https://openvpn.net/index.php/open-source/downloads.html\" target=\"_blank\">этой страницы</a>. Последнюю версию (на момент создания проекта) можно скачать по <a href=\"https://swupdate.openvpn.org/community/releases/openvpn-install-2.4.6-I602.exe\" target=\"_blank\">этой прямой ссылке</a>.\n            </p>\n            <p class=\"mat-body-1\">\n              После установки, надо загрузить ключ с настройками подключения в установленный клиент. Подробную инструкцию (в картинках) по установке и загрузке файла ключа можно посмотреть, к примеру, <a href=\"https://buffered.com/tutorials/setup-openvpn-client-windows-7/\" target=\"_blank\">здесь</a>\n            </p>\n          </div>\n\n          <div *ngIf=\"_cliOS == 'linux'\">\n            <p  class=\"mat-body-1\">\n              В основных linux системах, openvpn пакет установлен, и vpn соединяния управляются сетевым менеджером. Обычно, требуется установить дополнительный пакет для удобного создания vpn подключений из *.ovpn файлов.\n            </p>\n            <p class=\"mat-body-1\">\n              Например в linux ubuntu/debian:<br/>\n              <code>apt-get install network-manager-openvpn-gnome</code>\n              <br/>\n              После установке, выберите пункт \"редактировать соединения\" в меню сетевого менеджера, и добавьте новое из скачаного ovpn файла ключа.\n            </p>\n          </div>\n\n          <div *ngIf=\"_cliOS == 'macos'\">\n            <p  class=\"mat-body-1\">\n            Для MacOS требуется установить программу <a href=\"https://tunnelblick.net/index.html\" target=\"_blank\">TunnelBlick</a>. Инструкции по загрузке ovpn файла ключа в установленный tunelblik можно посмотреть <a href=\"https://tunnelblick.net/czUsing.html\" target=\"_blank\">тут</a>.\n            </p>\n          </div>\n\n          <div *ngIf=\"_cliOS == 'android'\">\n            <p  class=\"mat-body-1\">\n            Официальный android OpenVPN клиент можно установить из <a href=\"https://play.google.com/store/apps/details?id=net.openvpn.openvpn\" target=\"_blank\">Google Play</a>.\n            </p>\n          </div>\n\n          <div *ngIf=\"_cliOS == 'ios'\">\n            <p  class=\"mat-body-1\">\n            Официальный iOS OpenVPN клиент можно установить из <a href=\"https://itunes.apple.com/us/app/openvpn-connect/id590379981\" target=\"_blank\">App Store</a>.\n            </p>\n          </div>\n\n\n"

/***/ }),

/***/ "./src/app/help-client/help-client.component.ts":
/*!******************************************************!*\
  !*** ./src/app/help-client/help-client.component.ts ***!
  \******************************************************/
/*! exports provided: HelpClientComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HelpClientComponent", function() { return HelpClientComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var HelpClientComponent = /** @class */ (function () {
    function HelpClientComponent() {
        this._cliOS = '';
    }
    HelpClientComponent.prototype.ngOnInit = function () {
    };
    HelpClientComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-help-client',
            template: __webpack_require__(/*! ./help-client.component.html */ "./src/app/help-client/help-client.component.html"),
            styles: [__webpack_require__(/*! ./help-client.component.css */ "./src/app/help-client/help-client.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], HelpClientComponent);
    return HelpClientComponent;
}());



/***/ }),

/***/ "./src/app/help-faq/help-faq.component.css":
/*!*************************************************!*\
  !*** ./src/app/help-faq/help-faq.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "p.mat-body-1 mat-icon {\n  position: relative;\n  top: 4pt;\n}\n"

/***/ }),

/***/ "./src/app/help-faq/help-faq.component.html":
/*!**************************************************!*\
  !*** ./src/app/help-faq/help-faq.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "          <h3 class=\"mat-h3\">Сколько человек я могу подключить к своим VPN серверам?</h3>\n          <p class=\"mat-body-1\">\n          Сколько угодно. Но имейте в виду, что каждое активное соединение потребляет ресурсы (оперативную память и процессор) сервера. Если у вас слабый сервер, при большом количестве активных соединений сервер может замедлиться в работе и VPN соединения начнут работать с перебоями. Для минимальной безопасности, сервера по умолчанию настроены на максимум 100 одновременных соединений. Если вы уверены в мощности своего сервера - вы можете изменить эти настройки (для этого требуются навыки системного администрирования. обратитесь к <a href=\"http://10.1.0.1:81\" target=\"_blank\">документации</a> для подробностей)\n          </p>\n          <h3 class=\"mat-h3\">После подключения к TOR я становлюсь анонимным?</h3>\n          <p class=\"mat-body-1\">\n          Анонимность в интернете - это целый комплекс мер, и анонимизация своего IP - только одна из них. Просто подключение через сеть TOR не обеспечивает вашей анонимности, имейте это в виду. Почитайте в интернете более подробную информацию и проведите соответсвующие меры, для уверености в своей анонимности.\n          </p>\n          <h3 class=\"mat-h3\">Могу ли я изменить настройки серверов и клиентов?</h3>\n          <p class=\"mat-body-1\">\n          VPNFace Light использует OpenSource компоненты, и просто устанавливает ряд конфигураций для них. Всё это может быть изменено и перенастроено человеком со знаниями и навыками linux системного администратора. Обратитесь к <a href=\"http://10.1.0.1:81\" target=\"_blank\">документации</a> для подробностей.\n          </p>\n          <h3 class=\"mat-h3\">Почему пропадает интернет во время подключения к администраторскому VPN серверу?</h3>\n          <p class=\"mat-body-1\">\n          Администраторский сервер по умолчанию, для безопасности, настроен без доступа в интернет.\n          </p>\n          <h3 class=\"mat-h3\">Почему я не могу удалить ключ?</h3>\n          <p class=\"mat-body-1\">\n          Каждый пользовательсткий ovpn файл содержит в себе ключи подключения к серверу. OpenVPN создаёт их разово при установке и использует их в дальнейшем для всех клиентов, в связи с чем просто удаление ключа не обеспечит безопасности - требуется специальная запись о блокировке ключа. Используйте опции \"заблокировать\" (<mat-icon>no_encryption</mat-icon>) и \"разблокировать\" (<mat-icon>vpn_lock</mat-icon>) для управления ключами.\n          </p>\n          <h3 class=\"mat-h3\">Я потерял администраторский ключ и не могу больше попасть в админку. Всё пропало?</h3>\n          <p class=\"mat-body-1\">\n          Конечно нет. Но без навыков системного администрирования тут не обойтись. Подключитесь к вашему серверу через веб консоль хостера, и посмотрите <a href=\"http://10.1.0.1:81\" target=\"_blank\">документацию</a> для того, что бы найти ваши ключи на сервере.\n          </p>\n\n"

/***/ }),

/***/ "./src/app/help-faq/help-faq.component.ts":
/*!************************************************!*\
  !*** ./src/app/help-faq/help-faq.component.ts ***!
  \************************************************/
/*! exports provided: HelpFaqComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HelpFaqComponent", function() { return HelpFaqComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var HelpFaqComponent = /** @class */ (function () {
    function HelpFaqComponent() {
    }
    HelpFaqComponent.prototype.ngOnInit = function () {
    };
    HelpFaqComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-help-faq',
            template: __webpack_require__(/*! ./help-faq.component.html */ "./src/app/help-faq/help-faq.component.html"),
            styles: [__webpack_require__(/*! ./help-faq.component.css */ "./src/app/help-faq/help-faq.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], HelpFaqComponent);
    return HelpFaqComponent;
}());



/***/ }),

/***/ "./src/app/help/help.component.css":
/*!*****************************************!*\
  !*** ./src/app/help/help.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".grid-container {\n  margin: 20px;\n}\n\n.dashboard-card {\n  position: absolute;\n  top: 15px;\n  left: 15px;\n  right: 15px;\n  bottom: 15px;\n  overflow-y: scroll;\n}\n\n.more-button {\n  position: absolute;\n  top: 5px;\n  right: 10px;\n}\n\n.dashboard-card-content {\n  text-align: center;\n  margin: 0 8pt;\n}\n\n.full-width {\n  width: 50%;\n}\n\n.err-msg {\n  color: #f00;\n}\n\np {\n  font-family: Roboto,\"Helvetica Neue Light\",\"Helvetica Neue\",Helvetica,Arial,\"Lucida Grande\",sans-serif;\n  text-align: justify;\n}\n\n.card-faq p {\n  margin-left: 8pt;\n}\n"

/***/ }),

/***/ "./src/app/help/help.component.html":
/*!******************************************!*\
  !*** ./src/app/help/help.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"grid-container\">\n  <h1 class=\"mat-h1\">Как установить OpenVPN на устройство</h1>\n  <mat-grid-list cols=\"1\" [rowHeight]=\"300\">\n    <mat-grid-tile [colspan]=\"1\" [rowspan]=\"1\">\n      <mat-card class=\"dashboard-card\">\n        <mat-card-content>\n          <app-help-client></app-help-client>\n        </mat-card-content>\n      </mat-card>\n    </mat-grid-tile>\n  </mat-grid-list>\n  <br/>\n  <h1 class=\"mat-h1\">Вопросы и ответы</h1>\n  <mat-grid-list cols=\"1\" [rowHeight]=\"300\">\n    <mat-grid-tile [colspan]=\"1\" [rowspan]=\"1\">\n      <mat-card class=\"dashboard-card card-faq\">\n        <mat-card-content>\n          <app-help-faq></app-help-faq>\n        </mat-card-content>\n      </mat-card>\n    </mat-grid-tile>\n  </mat-grid-list>\n\n  <br/>\n  <h1 class=\"mat-h1\">О VPNFace Light</h1>\n  <mat-grid-list cols=\"1\" [rowHeight]=\"300\">\n    <mat-grid-tile [colspan]=\"1\" [rowspan]=\"1\">\n      <mat-card class=\"dashboard-card\">\n        <mat-card-content>\n          <p class=\"mat-body-1\">\n          VPNFace Light - менеджер ключей для OpenVPN.\n          </p>\n          <p class=\"mat-body-1\">\n          По умолчанию программа устанавливает три VPN сервера для различных видов подключений, и лимитирует количество одновременных соединений с каждым сервером 100 пользователям. Это не является программным ограничением и может быть переконфигурировано системным администратором.\n          </p>\n          <p class=\"mat-body-1\">\n          VPNFace Light использует OpenSource компоненты: <a href=\"https://openvpn.net/\" target=\"_blank\">openvpn</a>, <a href=\"https://github.com/OpenVPN/easy-rsa\" target=\"_blank\">easy-rsa</a>, <a href=\"https://git-scm.com/\" target=\"_blank\">git</a>, <a href=\"https://www.torproject.org\" target=\"_blank\">tor</a>, <a href=\"https://www.nginx.com/\" target=\"_blank\">nginx</a>,<a href=\"https://nodejs.org\" target=\"_blank\">nodejs</a>, <a href=\"https://angular.io/\" target=\"_blank\">angularjs</a>, и распространяется бесплатно и без ограничений по использованию.\n          </p>\n          <p class=\"mat-body-1\">\n          Если вы хотите подключить VPNFace Light к уже работающим OpenVPN серверам - обратитесь к <a href=\"http://10.1.0.1:81\" target=\"_blank\">документации</a>.\n          </p>\n          <p class=\"mat-body-1\">\n          Программа VPNFace Light разработана в поддержку движения DIGITAL RESISTANCE. Автор: <a href=\"https://github.com/abrakadobr/\" target=\"_blank\">abrakadobr</a><br/>\n          Поблагодарить: BTC 1EzMFMyiGEqcjjHD8dvgrn4YsXwvgeDyVD\n          </p>\n        </mat-card-content>\n      </mat-card>\n    </mat-grid-tile>\n  </mat-grid-list>\n</div>\n"

/***/ }),

/***/ "./src/app/help/help.component.ts":
/*!****************************************!*\
  !*** ./src/app/help/help.component.ts ***!
  \****************************************/
/*! exports provided: HelpComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HelpComponent", function() { return HelpComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var HelpComponent = /** @class */ (function () {
    function HelpComponent(api) {
        this.api = api;
    }
    HelpComponent.prototype.ngOnInit = function () {
        this.api._title = 'Справка';
        this.api._ticon = 'help';
        this.api._hasMenu = true;
    };
    HelpComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-help',
            template: __webpack_require__(/*! ./help.component.html */ "./src/app/help/help.component.html"),
            styles: [__webpack_require__(/*! ./help.component.css */ "./src/app/help/help.component.css")]
        }),
        __metadata("design:paramtypes", [_api_service__WEBPACK_IMPORTED_MODULE_1__["APIService"]])
    ], HelpComponent);
    return HelpComponent;
}());



/***/ }),

/***/ "./src/app/installer/installer.component.css":
/*!***************************************************!*\
  !*** ./src/app/installer/installer.component.css ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".grid-container {\n  margin: 20px;\n}\n\n.dashboard-card {\n  position: absolute;\n  top: 15px;\n  left: 15px;\n  right: 15px;\n  bottom: 15px;\n}\n\n.more-button {\n  position: absolute;\n  top: 5px;\n  right: 10px;\n}\n\n.dashboard-card-content {\n  text-align: center;\n  margin: 0 8pt;\n}\n\n.full-width {\n  width: 50%;\n}\n\n.err-msg {\n  color: #f00;\n}\n\np {\n  font-family: Roboto,\"Helvetica Neue Light\",\"Helvetica Neue\",Helvetica,Arial,\"Lucida Grande\",sans-serif;\n}\n"

/***/ }),

/***/ "./src/app/installer/installer.component.html":
/*!****************************************************!*\
  !*** ./src/app/installer/installer.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div\n  class=\"grid-container\">\n  <h1 class=\"mat-h1\">IP адрес сервера</h1>\n  <mat-grid-list cols=\"1\" [rowHeight]=\"200\">\n    <mat-grid-tile [colspan]=\"1\" [rowspan]=\"1\">\n      <mat-card class=\"dashboard-card\">\n        <mat-card-content class=\"dashboard-card-content\">\n            <mat-form-field class=\"full-width\">\n              <input\n                matInput\n                required\n                maxlength=\"16\"\n                [disabled]=\"_load\"\n                [(ngModel)]=\"_ip\"\n                placeholder=\"Адрес\">\n              <mat-hint>Подтвердите авто-определение, или укажите корректный адрес</mat-hint>\n            </mat-form-field>\n            <br/>\n            <button\n              mat-button\n              style=\"margin: 4pt 0;\"\n              [disabled]=\"_load\"\n              (click)=\"confirmIP()\">Подтвердить</button>\n\n            <div *ngIf=\"_load\" >\n              <mat-progress-bar mode=\"indeterminate\"></mat-progress-bar>\n              <mat-hint style=\"font-size:80%;\">{{_log}}</mat-hint>\n            </div>\n\n        </mat-card-content>\n      </mat-card>\n    </mat-grid-tile>\n  </mat-grid-list>\n</div>\n"

/***/ }),

/***/ "./src/app/installer/installer.component.ts":
/*!**************************************************!*\
  !*** ./src/app/installer/installer.component.ts ***!
  \**************************************************/
/*! exports provided: InstallerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InstallerComponent", function() { return InstallerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var InstallerComponent = /** @class */ (function () {
    function InstallerComponent(api) {
        this.api = api;
        this._ip = '';
        this._load = false;
        this._log = '';
    }
    InstallerComponent.prototype.ngOnInit = function () {
        this.api._title = 'Установка. шаг 1';
        this.api._hasMenu = false;
        this._ip = window.location.hostname;
    };
    InstallerComponent.prototype.confirmIP = function () {
        var _this = this;
        this._load = true;
        this._log = 'Сохраняем адрес';
        this.api.confirmIP(this._ip).subscribe(function (data) {
            _this._log = 'Создаётся администраторский VPN. Генерация ключей безопасности на слабых серверах может длиться до 10 минут. Не закрывайте эту страницу.';
        });
    };
    InstallerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-installer',
            template: __webpack_require__(/*! ./installer.component.html */ "./src/app/installer/installer.component.html"),
            styles: [__webpack_require__(/*! ./installer.component.css */ "./src/app/installer/installer.component.css")]
        }),
        __metadata("design:paramtypes", [_api_service__WEBPACK_IMPORTED_MODULE_1__["APIService"]])
    ], InstallerComponent);
    return InstallerComponent;
}());



/***/ }),

/***/ "./src/app/installer1/installer1.component.css":
/*!*****************************************************!*\
  !*** ./src/app/installer1/installer1.component.css ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".grid-container {\n  margin: 20px;\n}\n\n.dashboard-card {\n  position: absolute;\n  top: 15px;\n  left: 15px;\n  right: 15px;\n  bottom: 15px;\n}\n\n.more-button {\n  position: absolute;\n  top: 5px;\n  right: 10px;\n}\n\n.dashboard-card-content {\n  text-align: center;\n  margin: 0 8pt;\n}\n\n.full-width {\n  width: 50%;\n}\n\n.err-msg {\n  color: #f00;\n}\n\nbutton mat-icon {\n  position: relative;\n  top: -2pt;\n}\n"

/***/ }),

/***/ "./src/app/installer1/installer1.component.html":
/*!******************************************************!*\
  !*** ./src/app/installer1/installer1.component.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div\n  *ngIf=\"state == 'createacc'\"\n  class=\"grid-container\">\n  <h1 class=\"mat-h1\">Создание администраторского подключения</h1>\n  <mat-grid-list cols=\"1\" [rowHeight]=\"200\">\n    <mat-grid-tile [colspan]=\"1\" [rowspan]=\"1\">\n      <mat-card class=\"dashboard-card\">\n        <mat-card-content class=\"dashboard-card-content\">\n            <mat-form-field class=\"full-width\">\n              <input\n                matInput\n                required\n                maxlength=\"16\"\n                [disabled]=\"_load\"\n                [(ngModel)]=\"_account\"\n                placeholder=\"Название аккаунта\">\n              <mat-hint>Английские буквы и цифры. Первый символ - буква.</mat-hint>\n              <mat-hint align=\"end\">{{_account.length}} / 16</mat-hint>\n            </mat-form-field>\n            <br/>\n            <button\n              mat-button\n              style=\"margin: 4pt 0;\"\n              [disabled]=\"_load\"\n              (click)=\"createAcc()\">Создать!</button>\n            <div\n              class=\"err-msg mat-body-2\" style=\"margin:4pt;\"\n              *ngIf=\"_err!=''\">{{_err}}</div>\n\n            <div *ngIf=\"_load\" >\n              <mat-progress-bar mode=\"indeterminate\"></mat-progress-bar>\n            </div>\n\n        </mat-card-content>\n      </mat-card>\n    </mat-grid-tile>\n  </mat-grid-list>\n</div>\n\n<div class=\"grid-container\" *ngIf=\"state=='wait10'\">\n  <h1 class=\"mat-h1\">Установка клиента</h1>\n  <h3 class=\"mah-h3\">Не закрывайте эту страницу</h3>\n\n  <mat-grid-list cols=\"2\" [rowHeight]=\"150\">\n    <mat-grid-tile [colspan]=\"1\" [rowspan]=\"1\">\n      <mat-card class=\"dashboard-card\">\n        <mat-card-subtitle>1. Скачайте файл ключа</mat-card-subtitle>\n        <mat-card-content class=\"dashboard-card-content\">\n          <p class=\"mat-body-1\" style=\"margin-top:0pt;\">\n              <button\n                mat-button\n                color=\"primary\"\n                style=\"margin-top: 0pt;\"\n                (click)=\"grabKey()\"><mat-icon>get_app</mat-icon> Скачать Ключ</button>\n          </p>\n        </mat-card-content>\n      </mat-card>\n    </mat-grid-tile>\n\n\n    <mat-grid-tile [colspan]=\"1\" [rowspan]=\"1\">\n      <mat-card class=\"dashboard-card\">\n        <mat-card-subtitle>2. Подключите VPN на этом устройстве</mat-card-subtitle>\n        <mat-card-content class=\"dashboard-card-content\">\n          <p class=\"mat-body-1\" style=\"margin-top:20pt;\">\n              <mat-progress-bar mode=\"indeterminate\"></mat-progress-bar>\n              <mat-hint class=\"hint\">Ожидаю VPN подключения</mat-hint>\n          </p>\n        </mat-card-content>\n      </mat-card>\n    </mat-grid-tile>\n  </mat-grid-list>\n</div>\n\n<div class=\"grid-container\" *ngIf=\"state=='wait10'\">\n\n  <mat-grid-list cols=\"1\" [rowHeight]=\"350\">\n    <mat-grid-tile [colspan]=\"1\" [rowspan]=\"1\">\n      <mat-card class=\"dashboard-card\">\n        <mat-card-subtitle>Инструкции по установке OpenVPN клиента</mat-card-subtitle>\n        <mat-card-content class=\"dashboard-card-content\" style=\"text-align:left\">\n          <app-help-client></app-help-client>\n        </mat-card-content>\n      </mat-card>\n    </mat-grid-tile>\n\n  </mat-grid-list>\n</div>\n"

/***/ }),

/***/ "./src/app/installer1/installer1.component.ts":
/*!****************************************************!*\
  !*** ./src/app/installer1/installer1.component.ts ***!
  \****************************************************/
/*! exports provided: Installer1Component */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Installer1Component", function() { return Installer1Component; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var Installer1Component = /** @class */ (function () {
    function Installer1Component(api, router, route) {
        this.api = api;
        this.router = router;
        this.route = route;
        this._account = 'admin';
        this._err = '';
        this._cliOS = '';
        this._ip = '';
        this._load = false;
        this.state = 'createacc';
    }
    Installer1Component.prototype.ngOnInit = function () {
        var _this = this;
        this.api._hasMenu = false;
        this.api._title = 'Установка. шаг 2';
        this.api.loadServer('adm').subscribe(function (s) {
            if (!s.clients.length) {
                _this.state = 'createacc';
            }
            else {
                _this._account = s.clients[0].code;
                _this.state = 'wait10';
                _this.nextPing();
            }
        });
    };
    Installer1Component.prototype.createAcc = function () {
        var _this = this;
        var rx = /^[a-zA-Z][a-zA-Z0-9]{1,15}$/;
        if (!rx.test(this._account)) {
            this._err = 'Некорректно';
            setTimeout(function () {
                _this._err = '';
            }, 2000);
            return;
        }
        this._load = true;
        this.api.createKey('adm', this._account).subscribe(function (data) {
            _this._load = false;
            _this.state = 'wait10';
            _this.nextPing();
        });
    };
    Installer1Component.prototype.grabKey = function () {
        this.api.grabKey(this._account + '@adm');
    };
    Installer1Component.prototype.getCliSoft = function () {
    };
    Installer1Component.prototype.nextPing = function () {
        var _this = this;
        console.log('next ping');
        this.api.ping10().subscribe({
            next: function (ping) {
                console.log(['ping!', ping]);
                window.location.replace('http://10.1.0.1:8808/install2');
            },
            error: function (err) {
                console.log(err);
                setTimeout(function () {
                    _this.nextPing();
                }, 1000);
            },
            complete: function () {
                //console.log('complete')
            }
        });
    };
    Installer1Component = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-installer1',
            template: __webpack_require__(/*! ./installer1.component.html */ "./src/app/installer1/installer1.component.html"),
            styles: [__webpack_require__(/*! ./installer1.component.css */ "./src/app/installer1/installer1.component.css")]
        }),
        __metadata("design:paramtypes", [_api_service__WEBPACK_IMPORTED_MODULE_2__["APIService"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"]])
    ], Installer1Component);
    return Installer1Component;
}());



/***/ }),

/***/ "./src/app/installer2/installer2.component.css":
/*!*****************************************************!*\
  !*** ./src/app/installer2/installer2.component.css ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".grid-container {\n  margin: 20px;\n}\n\n.dashboard-card {\n  position: absolute;\n  top: 15px;\n  left: 15px;\n  right: 15px;\n  bottom: 15px;\n  overflow-y: scroll;\n}\n\n.more-button {\n  position: absolute;\n  top: 5px;\n  right: 10px;\n}\n\n.dashboard-card-content {\n  text-align: center;\n  margin: 0 8pt;\n}\n\n.full-width {\n  width: 50%;\n}\n\n.err-msg {\n  color: #f00;\n}\n\np {\n  font-family: Roboto,\"Helvetica Neue Light\",\"Helvetica Neue\",Helvetica,Arial,\"Lucida Grande\",sans-serif;\n}\n\np.mat-body-1 mat-icon {\n  position: relative;\n  top: 4pt;\n}\n"

/***/ }),

/***/ "./src/app/installer2/installer2.component.html":
/*!******************************************************!*\
  !*** ./src/app/installer2/installer2.component.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"grid-container\">\n  <h1 class=\"mat-h1\">Завершение установки</h1>\n  <mat-grid-list cols=\"1\" [rowHeight]=\"300\">\n    <mat-grid-tile [colspan]=\"1\" [rowspan]=\"1\">\n      <mat-card class=\"dashboard-card\">\n        <mat-card-subtitle>Поздравляем!</mat-card-subtitle>\n        <mat-card-content class=\"dashboard-card-content\" style=\"text-align:left;\">\n          <mat-progress-bar style=\"margin: 4pt 0;\" mode=\"indeterminate\"></mat-progress-bar>\n          <br/>\n          <p class=\"mat-body-1\">\n            Вы успешно установили себе OpenVPN клиент, загрузили в него ключ соединения и подключились к своему серверу!\n          </p>\n          <p class=\"mat-body-1\">\n            Не закрывайте эту страницу!\n          </p>\n          <p class=\"mat-body-1\">\n            Сейчас происходит завершение установки и подготовка сервера к работе. Финальная часть установки занимает в среднем в два раза больше времени, чем предыдущий шаг.\n          </p>\n          <ul class=\"steps\">\n            <li>Создание \"Интернет VPN\" сервера. Пользователи, подключившиеся к этому впн будут выходить в интернет сразу с сервера. Для всего интернета ip адрес пользователя (публичный ip) и страна будет определяться как ip адрес и страна сервера.</li>\n            <li>Создание \"Dark VPN\" сервера. Пользователи будут выходить в интернет через сеть TOR. Публичный ip адрес и страна пользователя будут меняться случайным образом каждые 15-20 минут. Сайты *.onion будут доступны напрямую.</li>\n            <li>Настройка \"Админ ВПН\". Установка администраторских сервисов и панелей управления для администрирования.</li>\n            <li>Финальная настройка файрвола.</li>\n          </ul>\n          <p class=\"mat-body-1\">\n            После завершения установки вы перейдёте к панели управления автоматически.\n          </p>\n        </mat-card-content>\n      </mat-card>\n    </mat-grid-tile>\n  </mat-grid-list>\n</div>\n<div class=\"grid-container\">\n  <h2 class=\"mat-h2\">Вопросы и ответы</h2>\n  <mat-grid-list cols=\"1\" [rowHeight]=\"300\">\n    <mat-grid-tile [colspan]=\"1\" [rowspan]=\"1\">\n      <mat-card class=\"dashboard-card\">\n        <mat-card-content class=\"dashboard-card-content\" style=\"text-align:left;\">\n\n          <h3 class=\"mat-h3\">Ничего не происходит.</h3>\n          <p class=\"mat-body-1\">\n          Скорее всего на сервере генерируются ключи - на слабых серверах это может длиться до 10и минут. В данный момент требуется создать два vpn сервера, так что суммарно это можно занять до 20 минут. Не закрывайте страницу. Если всё длится уже дольше получаса без изменений - есть вероятность, что что-то всё же пошло не так. Попробуйте открыть панель управления по адресу <a href=\"http://10.1.0.1\" _target=\"blank\">http://10.1.0.1</a> - если ничего не вышло,  Вам понадобятся навыки linux администрирования и <a href=\"http://vpnface-lite.rtfd.io/\" target=\"_blank\">online документация</a>. Сервер доступен для ssh подключения по адресу 10.1.0.1\n          </p>\n\n          <app-help-faq></app-help-faq>\n\n          <h3 class=\"mat-h3\">Справка</h3>\n          <p class=\"mat-body-1\">\n          После установки вы всегда сможете найти справочную информацию в разделе \"справка\" <mat-icon>help_outline</mat-icon>. Внутренняя документация так же станет доступна после завершения установки.\n          </p>\n        </mat-card-content>\n      </mat-card>\n    </mat-grid-tile>\n  </mat-grid-list>\n</div>\n"

/***/ }),

/***/ "./src/app/installer2/installer2.component.ts":
/*!****************************************************!*\
  !*** ./src/app/installer2/installer2.component.ts ***!
  \****************************************************/
/*! exports provided: Installer2Component */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Installer2Component", function() { return Installer2Component; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var Installer2Component = /** @class */ (function () {
    function Installer2Component(api) {
        this.api = api;
    }
    Installer2Component.prototype.ngOnInit = function () {
        this.api._title = 'Установка. шаг 3';
        this.api._hasMenu = false;
        this.api.finilizeInstall().subscribe(function (start) { });
    };
    Installer2Component = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-installer2',
            template: __webpack_require__(/*! ./installer2.component.html */ "./src/app/installer2/installer2.component.html"),
            styles: [__webpack_require__(/*! ./installer2.component.css */ "./src/app/installer2/installer2.component.css")]
        }),
        __metadata("design:paramtypes", [_api_service__WEBPACK_IMPORTED_MODULE_1__["APIService"]])
    ], Installer2Component);
    return Installer2Component;
}());



/***/ }),

/***/ "./src/app/loader/loader.component.css":
/*!*********************************************!*\
  !*** ./src/app/loader/loader.component.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".grid-container {\n  margin: 20px;\n}\n\n.dashboard-card {\n  position: absolute;\n  top: 15px;\n  left: 15px;\n  right: 15px;\n  bottom: 15px;\n}\n\n.more-button {\n  position: absolute;\n  top: 5px;\n  right: 10px;\n}\n\n.dashboard-card-content {\n  text-align: center;\n  margin: 0 8pt;\n}\n\n.full-width {\n  width: 50%;\n}\n\n.err-msg {\n  color: #f00;\n}\n\np {\n  font-family: Roboto,\"Helvetica Neue Light\",\"Helvetica Neue\",Helvetica,Arial,\"Lucida Grande\",sans-serif;\n}\n"

/***/ }),

/***/ "./src/app/loader/loader.component.html":
/*!**********************************************!*\
  !*** ./src/app/loader/loader.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"grid-container\">\n  <mat-grid-list cols=\"1\" [rowHeight]=\"85\">\n    <mat-grid-tile [colspan]=\"1\" [rowspan]=\"1\">\n      <mat-card class=\"dashboard-card\">\n        <mat-card-content class=\"dashboard-card-content\">\n          <mat-progress-bar mode=\"indeterminate\"></mat-progress-bar>\n        </mat-card-content>\n      </mat-card>\n    </mat-grid-tile>\n  </mat-grid-list>\n</div>\n\n\n"

/***/ }),

/***/ "./src/app/loader/loader.component.ts":
/*!********************************************!*\
  !*** ./src/app/loader/loader.component.ts ***!
  \********************************************/
/*! exports provided: LoaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoaderComponent", function() { return LoaderComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var LoaderComponent = /** @class */ (function () {
    function LoaderComponent(api) {
        this.api = api;
    }
    LoaderComponent.prototype.ngOnInit = function () {
        this.api._title = 'Загрузка';
    };
    LoaderComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-loader',
            template: __webpack_require__(/*! ./loader.component.html */ "./src/app/loader/loader.component.html"),
            styles: [__webpack_require__(/*! ./loader.component.css */ "./src/app/loader/loader.component.css")]
        }),
        __metadata("design:paramtypes", [_api_service__WEBPACK_IMPORTED_MODULE_1__["APIService"]])
    ], LoaderComponent);
    return LoaderComponent;
}());



/***/ }),

/***/ "./src/app/logentry.ts":
/*!*****************************!*\
  !*** ./src/app/logentry.ts ***!
  \*****************************/
/*! exports provided: Logentry */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Logentry", function() { return Logentry; });
var Logentry = /** @class */ (function () {
    function Logentry(type, key, msg) {
        if (type === void 0) { type = ''; }
        if (key === void 0) { key = ''; }
        if (msg === void 0) { msg = ''; }
        this.type = type;
        this.key = key;
        this.msg = msg;
    }
    return Logentry;
}());



/***/ }),

/***/ "./src/app/logger/logger.component.css":
/*!*********************************************!*\
  !*** ./src/app/logger/logger.component.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#logger\n{\n  position: fixed;\n  bottom: 0px;\n  right: 0px;\n  margin: 0 24px 8px 0;\n  width: 40pt;\n  height: 40pt;\n  z-index: 2;\n}\n\n#last-logs\n{\n  position: fixed;\n  bottom: 0px;\n  right: 0px;\n  margin: 0 24pt 52pt 0;\n  width: 250pt;\n  height: auto;\n  z-index: 2;\n}\n\n"

/***/ }),

/***/ "./src/app/logger/logger.component.html":
/*!**********************************************!*\
  !*** ./src/app/logger/logger.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"last-logs\">\n  <div class=\"line-entry\" *ngFor=\"let le of _logs\">\n    <app-logline\n      [lline]=\"le\"></app-logline>\n  </div>\n</div>\n<div id=\"logger\">\n  <img (click)=\"say()\" width=\"100%\" src=\"/dr80.png\"/>\n</div>\n"

/***/ }),

/***/ "./src/app/logger/logger.component.ts":
/*!********************************************!*\
  !*** ./src/app/logger/logger.component.ts ***!
  \********************************************/
/*! exports provided: LoggerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoggerComponent", function() { return LoggerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _logentry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../logentry */ "./src/app/logentry.ts");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LoggerComponent = /** @class */ (function () {
    function LoggerComponent(api) {
        this.api = api;
        this._logs = [];
    }
    LoggerComponent.prototype.ngOnInit = function () {
        var _this = this;
        setInterval(function () {
            _this.updateLogs();
        }, 1000);
    };
    LoggerComponent.prototype.updateLogs = function () {
        var _this = this;
        this.api.lastLogs().subscribe(function (logs) {
            logs.forEach(function (l) {
                _this._logs.push(l);
            });
        });
    };
    LoggerComponent.prototype.say = function () {
        var sayings = [
            'Если ты это читаешь - ты и есть сопротивление',
            'Учись всегда - мир меняется быстрее тебя',
            'DIGITAL RESISTANCE',
            'Ты - это то, как ты сопротивляешься..',
            'TOR - не панацея. почитай про безопасность в TOR'
        ];
        var x = Math.floor((Math.random() * sayings.length));
        this._logs.push(new _logentry__WEBPACK_IMPORTED_MODULE_1__["Logentry"]('log', '~~', sayings[x]));
    };
    LoggerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-logger',
            template: __webpack_require__(/*! ./logger.component.html */ "./src/app/logger/logger.component.html"),
            styles: [__webpack_require__(/*! ./logger.component.css */ "./src/app/logger/logger.component.css")]
        }),
        __metadata("design:paramtypes", [_api_service__WEBPACK_IMPORTED_MODULE_2__["APIService"]])
    ], LoggerComponent);
    return LoggerComponent;
}());



/***/ }),

/***/ "./src/app/logline/logline.component.css":
/*!***********************************************!*\
  !*** ./src/app/logline/logline.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".log-entry\n{\n  font-size: 60%;\n  color: #333;\n  text-align: right;\n  font-family: 'Ubuntu mono', monospace;\n  margin: -6pt 0;\n}\n\n.log-entry .key-w {\n  margin-left: 4pt;\n}\n\n.key-b {\n  color: #000;\n}\n\n.key-log {\n  color: #009;\n}\n\n.key-success {\n  color: #090;\n}\n\n.key-error {\n  color: #900;\n}\n\n.key-test {\n  color: #990;\n}\n"

/***/ }),

/***/ "./src/app/logline/logline.component.html":
/*!************************************************!*\
  !*** ./src/app/logline/logline.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"state=='visible'\" class=\"log-entry mat-body-1 log-{{lline.type}}\">\n  <span class=\"msg msg-{{lline.type}}\">{{lline.msg}}</span>\n  <span class=\"key-w\"><span class=\"key-b key-bl\">[</span><span class=\"key key-{{lline.type}}\">{{lline.key}}</span><span class=\"key-b key-bl\">]</span></span>\n</div>\n"

/***/ }),

/***/ "./src/app/logline/logline.component.ts":
/*!**********************************************!*\
  !*** ./src/app/logline/logline.component.ts ***!
  \**********************************************/
/*! exports provided: LoglineComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoglineComponent", function() { return LoglineComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _logentry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../logentry */ "./src/app/logentry.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var LoglineComponent = /** @class */ (function () {
    function LoglineComponent() {
        this.state = 'visible';
    }
    LoglineComponent.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.toggleState();
        }, 35000);
    };
    LoglineComponent.prototype.toggleState = function () {
        this.state = this.state == 'visible' ? 'invislble' : 'visible';
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", _logentry__WEBPACK_IMPORTED_MODULE_1__["Logentry"])
    ], LoglineComponent.prototype, "lline", void 0);
    LoglineComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-logline',
            template: __webpack_require__(/*! ./logline.component.html */ "./src/app/logline/logline.component.html"),
            styles: [__webpack_require__(/*! ./logline.component.css */ "./src/app/logline/logline.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], LoglineComponent);
    return LoglineComponent;
}());



/***/ }),

/***/ "./src/app/vpnserver/vpnserver.component.css":
/*!***************************************************!*\
  !*** ./src/app/vpnserver/vpnserver.component.css ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".page-container {\n  margin: 20px;\n}\n\n.table-container {\n  margin: 20px;\n}\n\n.spacer {\n  flex: 1 1 auto;\n}\n\n.table-header h1 {\n  display: inline-block;\n}\n\n.mat-toolbar-row, .mat-toolbar-single-row\n{\n  background-color: inherit;\n  font-weight: lighter;\n}\n\n.mat-column-blocked {\n  flex: 0 0 40pt;\n}\n\n.mat-column-actions {\n  flex: 0 0 120pt;\n  justify-content: flex-end;\n}\n\nmat-icon.a4\n{\n  position: relative;\n  top: 4pt;\n}\n\np.desc {\n  margin: 4pt 16pt;\n  font-size: 80%;\n  text-align: justify;\n}\n"

/***/ }),

/***/ "./src/app/vpnserver/vpnserver.component.html":
/*!****************************************************!*\
  !*** ./src/app/vpnserver/vpnserver.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"page-container\">\n  <mat-toolbar>\n    <span>Список ключей</span>\n    <span class=\"spacer\"></span>\n    <span class=\"add\"><button (click)=\"addKey()\" mat-button color=\"primary\"><mat-icon>add</mat-icon>Добавить ключ</button></span>\n  </mat-toolbar>\n\n  <p class=\"desc\">{{srv?.desc}}</p>\n  <p class=\"desc\">Сервер может иметь неограниченое количеств ключей, но ограничен {{srv?.maxclients}} одновременными подключениями.</p>\n\n  <div class=\"table-container\">\n    <mat-table #table [dataSource]=\"dataSource\" class=\"clients-table\" matSort aria-label=\"Elements\">\n\n      <!-- Status Column -->\n      <ng-container matColumnDef=\"blocked\">\n        <mat-header-cell mat-sort-header *matHeaderCellDef>\n            <mat-icon>vpn_lock</mat-icon>\n        </mat-header-cell>\n        <mat-cell *matCellDef=\"let row\">\n          <span *ngIf=\"row.blocked\"><mat-icon class=\"a4\">no_encryption</mat-icon></span>\n          <span *ngIf=\"!row.blocked\"><mat-icon class=\"a4\" color=\"primary\">vpn_lock</mat-icon></span>\n        </mat-cell>\n      </ng-container>\n \n      <!-- Code Column -->\n      <ng-container matColumnDef=\"code\">\n        <mat-header-cell mat-sort-header *matHeaderCellDef>Ключ</mat-header-cell>\n        <mat-cell *matCellDef=\"let row\">\n          {{row.code}}\n        </mat-cell>\n      </ng-container>\n\n      <!-- Actions Column -->\n      <ng-container matColumnDef=\"actions\">\n        <mat-header-cell *matHeaderCellDef>Действия</mat-header-cell>\n        <mat-cell *matCellDef=\"let row\">\n          <div *ngIf=\"_locked[row.code]\" style=\"width:100%\">\n            <mat-progress-bar mode=\"indeterminate\"></mat-progress-bar>\n          </div>\n          <div *ngIf=\"!_locked[row.code]\">\n\n            <div *ngIf=\"row.blocked\">\n              <button mat-icon-button disabled>\n                <mat-icon>get_app</mat-icon>\n              </button>\n  \n              <button\n                mat-icon-button\n                title=\"Разблокировать\"\n                color=\"primary\"\n                (click)=\"unlockKey(row.code)\"\n              >\n                <mat-icon>vpn_lock</mat-icon>\n              </button>\n            </div>\n\n            <div *ngIf=\"!row.blocked\">\n              <button\n                mat-icon-button\n                title=\"Скачать\"\n                color=\"primary\"\n                (click)=\"grabKey(row.code)\"\n              >\n                <mat-icon>get_app</mat-icon>\n              </button>\n \n              <button\n                mat-icon-button\n                color=\"warn\"\n                title=\"Заблокировать\"\n                (click)=\"lockKey(row.code)\"\n              >\n                <mat-icon>no_encryption</mat-icon>\n              </button>\n            </div>\n\n          </div>\n        </mat-cell>\n      </ng-container>\n\n      <mat-header-row *matHeaderRowDef=\"displayedColumns\"></mat-header-row>\n      <mat-row *matRowDef=\"let row; columns: displayedColumns;\"></mat-row>\n\n    </mat-table>\n    <mat-paginator #paginator\n      [length]=\"dataSource?.data.length\"\n      [pageIndex]=\"0\"\n      [pageSize]=\"10\"\n      [pageSizeOptions]=\"[5, 10, 25, 100]\"\n      >\n    </mat-paginator>\n  </div>\n</div>\n\n\n"

/***/ }),

/***/ "./src/app/vpnserver/vpnserver.component.ts":
/*!**************************************************!*\
  !*** ./src/app/vpnserver/vpnserver.component.ts ***!
  \**************************************************/
/*! exports provided: VpnserverComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VpnserverComponent", function() { return VpnserverComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/dialog */ "./node_modules/@angular/material/esm5/dialog.es5.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
/* harmony import */ var _vpnuserdialog_vpnuserdialog_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../vpnuserdialog/vpnuserdialog.component */ "./src/app/vpnuserdialog/vpnuserdialog.component.ts");
/* harmony import */ var _warn_dialog_warn_dialog_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../warn-dialog/warn-dialog.component */ "./src/app/warn-dialog/warn-dialog.component.ts");
/* harmony import */ var _vpnserver_datasource__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./vpnserver.datasource */ "./src/app/vpnserver/vpnserver.datasource.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var VpnserverComponent = /** @class */ (function () {
    function VpnserverComponent(dialog, api, router, route) {
        this.dialog = dialog;
        this.api = api;
        this.router = router;
        this.route = route;
        this.displayedColumns = ['blocked', 'code', 'actions'];
        this._locked = {};
    }
    VpnserverComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.api._hasMenu = true;
        this.route.paramMap.subscribe(function (p) {
            _this.reload(p.get('code'));
        });
    };
    VpnserverComponent.prototype.reload = function (code) {
        var _this = this;
        this.api.loadServer(code).subscribe(function (srv) {
            _this.srv = srv;
            _this.api._title = _this.srv.name;
            if (_this.srv.type == 'public')
                _this.api._ticon = 'cloud_queue';
            if (_this.srv.type == 'root')
                _this.api._ticon = 'cloud_off';
            if (_this.srv.type == 'dark')
                _this.api._ticon = 'cloud_circle';
            _this.dataSource = new _vpnserver_datasource__WEBPACK_IMPORTED_MODULE_7__["ClientsTableDataSource"](_this.srv.clients, _this.paginator, _this.sort);
            //this.dataSource = this.srv.clients
        });
    };
    VpnserverComponent.prototype.addKey = function () {
        var _this = this;
        var d = this.dialog.open(_vpnuserdialog_vpnuserdialog_component__WEBPACK_IMPORTED_MODULE_5__["VpnuserdialogComponent"], {
            width: '75%',
            data: this.srv.code
        });
        d.afterClosed().subscribe(function (acc) {
            if (acc)
                _this.reload(_this.srv.code);
        });
    };
    VpnserverComponent.prototype.grabKey = function (key) {
        this.api.grabKey(key + '@' + this.srv.code);
    };
    VpnserverComponent.prototype.lockKey = function (key) {
        var _this = this;
        var d = this.dialog.open(_warn_dialog_warn_dialog_component__WEBPACK_IMPORTED_MODULE_6__["WarnDialogComponent"], {
            width: '75%',
            data: {
                title: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043A\u043B\u044E\u0447 <" + key + ">?",
                message: 'Пользователь не сможет подключиться к vpn серверу.<br/>Если пользователь подключён в данный момент - соединение будет разорвано.',
                ok: 'Заблокировать'
            }
        });
        d.afterClosed().subscribe(function (doLock) {
            if (doLock === void 0) { doLock = false; }
            if (!doLock)
                return;
            _this._locked[key] = true;
            _this.api.lockKey(key + '@' + _this.srv.code).subscribe(function (res) {
                _this.reload(_this.srv.code);
                _this._locked[key] = false;
            });
        });
    };
    VpnserverComponent.prototype.unlockKey = function (key) {
        var _this = this;
        var d = this.dialog.open(_warn_dialog_warn_dialog_component__WEBPACK_IMPORTED_MODULE_6__["WarnDialogComponent"], {
            width: '75%',
            data: {
                title: "\u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043A\u043B\u044E\u0447 <" + key + ">?",
                message: 'Пользователь сможет подключиться к vpn серверу.',
                ok: 'Разблокировать'
            }
        });
        d.afterClosed().subscribe(function (doUnLock) {
            if (doUnLock === void 0) { doUnLock = false; }
            if (!doUnLock)
                return;
            _this._locked[key] = true;
            _this.api.unlockKey(key + '@' + _this.srv.code).subscribe(function (res) {
                _this.reload(_this.srv.code);
                _this._locked[key] = false;
            });
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatPaginator"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatPaginator"])
    ], VpnserverComponent.prototype, "paginator", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSort"]),
        __metadata("design:type", _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSort"])
    ], VpnserverComponent.prototype, "sort", void 0);
    VpnserverComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-vpnserver',
            template: __webpack_require__(/*! ./vpnserver.component.html */ "./src/app/vpnserver/vpnserver.component.html"),
            styles: [__webpack_require__(/*! ./vpnserver.component.css */ "./src/app/vpnserver/vpnserver.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MatDialog"], _api_service__WEBPACK_IMPORTED_MODULE_4__["APIService"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"]])
    ], VpnserverComponent);
    return VpnserverComponent;
}());



/***/ }),

/***/ "./src/app/vpnserver/vpnserver.datasource.ts":
/*!***************************************************!*\
  !*** ./src/app/vpnserver/vpnserver.datasource.ts ***!
  \***************************************************/
/*! exports provided: ClientsTableDataSource */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClientsTableDataSource", function() { return ClientsTableDataSource; });
/* harmony import */ var _angular_cdk_collections__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/cdk/collections */ "./node_modules/@angular/cdk/esm5/collections.es5.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var ClientsTableDataSource = /** @class */ (function (_super) {
    __extends(ClientsTableDataSource, _super);
    function ClientsTableDataSource(data, paginator, sort) {
        var _this = _super.call(this) || this;
        _this.data = data;
        _this.paginator = paginator;
        _this.sort = sort;
        return _this;
    }
    ClientsTableDataSource.prototype.connect = function () {
        var _this = this;
        var dataMutations = [
            Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(this.data),
            this.paginator.page,
            this.sort.sortChange
        ];
        this.paginator.length = this.data.length;
        return rxjs__WEBPACK_IMPORTED_MODULE_2__["merge"].apply(void 0, dataMutations).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function () {
            return _this.getPagedData(_this.getSortedData(_this.data.slice()));
        }));
    };
    ClientsTableDataSource.prototype.disconnect = function () { };
    ClientsTableDataSource.prototype.getPagedData = function (data) {
        var startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        return data.splice(startIndex, this.paginator.pageSize);
    };
    ClientsTableDataSource.prototype.getSortedData = function (data) {
        var _this = this;
        if (!this.sort.active || this.sort.direction === '') {
            return data;
        }
        return data.sort(function (a, b) {
            var isAsc = _this.sort.direction === 'asc';
            switch (_this.sort.active) {
                case 'code': return compare(a.code, b.code, isAsc);
                case 'blocked': return compare(!!a.blocked, !!b.blocked, isAsc);
                default: return 0;
            }
        });
    };
    return ClientsTableDataSource;
}(_angular_cdk_collections__WEBPACK_IMPORTED_MODULE_0__["DataSource"]));

function compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


/***/ }),

/***/ "./src/app/vpnuserdialog/vpnuserdialog.component.css":
/*!***********************************************************!*\
  !*** ./src/app/vpnuserdialog/vpnuserdialog.component.css ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".half-width {\n  width: 50%;\n}\n\n.ac {\n  text-align:center;\n}\n\n.spacer {\n  flex: 1 1 auto;\n}\n"

/***/ }),

/***/ "./src/app/vpnuserdialog/vpnuserdialog.component.html":
/*!************************************************************!*\
  !*** ./src/app/vpnuserdialog/vpnuserdialog.component.html ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 class=\"ac\" mat-dialog-title>Новый VPN ключ</h2>\n<mat-dialog-content class=\"ac\">\n  <mat-form-field class=\"half-width\">\n    <input\n      matInput\n      required\n      (keydown)=\"keyDownF($event)\"\n      maxlength=\"16\"\n      [disabled]=\"_lock\"\n      [(ngModel)]=\"_account\"\n      placeholder=\"Название аккаунта\">\n    <mat-hint>Английские буквы и цифры. Первый символ - буква.</mat-hint>\n    <mat-hint align=\"end\">{{_account.length}} / 16</mat-hint>\n  </mat-form-field>\n  <div class=\"p-body-1\" *ngIf=\"_err!=''\" style=\"color:#a00;\">{{_err}}</div>\n  <div *ngIf=\"_lock\" class=\"mat-body-1\" style=\"margin-top:20pt;\">\n    <mat-progress-bar mode=\"indeterminate\"></mat-progress-bar>\n  </div>\n</mat-dialog-content>\n<mat-dialog-actions >\n  <span class=\"spacer\"></span>\n  <button\n    [disabled]=\"_lock\"\n    mat-button\n    [mat-dialog-close]=\"null\"\n  >Отмена</button>\n  <!-- The mat-dialog-close directive optionally accepts a value as a result for the dialog. -->\n  <button\n    mat-button\n    [disabled]=\"_lock\"\n    (click)=\"go()\"\n    color=\"primary\"\n  >Создать</button>\n  <span class=\"spacer\"></span>\n</mat-dialog-actions>\n"

/***/ }),

/***/ "./src/app/vpnuserdialog/vpnuserdialog.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/vpnuserdialog/vpnuserdialog.component.ts ***!
  \**********************************************************/
/*! exports provided: VpnuserdialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VpnuserdialogComponent", function() { return VpnuserdialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/dialog */ "./node_modules/@angular/material/esm5/dialog.es5.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



var VpnuserdialogComponent = /** @class */ (function () {
    function VpnuserdialogComponent(api, dialogRef, data) {
        this.api = api;
        this.dialogRef = dialogRef;
        this.data = data;
        this._account = '';
        this._err = '';
        this._lock = false;
    }
    VpnuserdialogComponent.prototype.keyDownF = function (e) {
        if (e.keyCode == 13)
            this.go();
    };
    VpnuserdialogComponent.prototype.go = function () {
        var _this = this;
        var rx = /^[a-zA-Z][a-zA-Z0-9]{1,15}$/;
        if (!rx.test(this._account)) {
            this._err = 'Некорректно';
            setTimeout(function () {
                _this._err = '';
            }, 2000);
            return;
        }
        this._lock = true;
        this.api.createKey(this.data, this._account).subscribe(function (k2) {
            _this.dialogRef.close(_this._account);
        });
    };
    VpnuserdialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-vpnuserdialog',
            template: __webpack_require__(/*! ./vpnuserdialog.component.html */ "./src/app/vpnuserdialog/vpnuserdialog.component.html"),
            styles: [__webpack_require__(/*! ./vpnuserdialog.component.css */ "./src/app/vpnuserdialog/vpnuserdialog.component.css")]
        }),
        __param(2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_api_service__WEBPACK_IMPORTED_MODULE_2__["APIService"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object])
    ], VpnuserdialogComponent);
    return VpnuserdialogComponent;
}());



/***/ }),

/***/ "./src/app/warn-dialog/warn-dialog.component.css":
/*!*******************************************************!*\
  !*** ./src/app/warn-dialog/warn-dialog.component.css ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".half-width {\n  width: 50%;\n}\n\n.ac {\n  text-align:center;\n  padding-bottom: 4pt;\n}\n\n.spacer {\n  flex: 1 1 auto;\n}\n"

/***/ }),

/***/ "./src/app/warn-dialog/warn-dialog.component.html":
/*!********************************************************!*\
  !*** ./src/app/warn-dialog/warn-dialog.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 class=\"ac\" mat-dialog-title>{{data.title}}</h2>\n<mat-dialog-content class=\"ac\" [innerHtml]=\"data.message\">\n</mat-dialog-content>\n<mat-dialog-actions >\n  <span class=\"spacer\"></span>\n  <button mat-button [mat-dialog-close]=\"false\">Отмена</button>\n  <button mat-button color=\"primary\" [mat-dialog-close]=\"true\">{{data.ok}}</button>\n  <span class=\"spacer\"></span>\n</mat-dialog-actions>\n"

/***/ }),

/***/ "./src/app/warn-dialog/warn-dialog.component.ts":
/*!******************************************************!*\
  !*** ./src/app/warn-dialog/warn-dialog.component.ts ***!
  \******************************************************/
/*! exports provided: WarnDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WarnDialogComponent", function() { return WarnDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/dialog */ "./node_modules/@angular/material/esm5/dialog.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


var WarnDialogComponent = /** @class */ (function () {
    function WarnDialogComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    WarnDialogComponent.prototype.ngOnInit = function () {
    };
    WarnDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-warn-dialog',
            template: __webpack_require__(/*! ./warn-dialog.component.html */ "./src/app/warn-dialog/warn-dialog.component.html"),
            styles: [__webpack_require__(/*! ./warn-dialog.component.css */ "./src/app/warn-dialog/warn-dialog.component.css")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object])
    ], WarnDialogComponent);
    return WarnDialogComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/devop/dev/vpnface/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map
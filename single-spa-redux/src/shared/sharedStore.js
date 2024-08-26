"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEmail = exports.setName = void 0;
// src/shared/sharedStore.ts
var redux_1 = require("redux");
var initialState = {
    name: 'TestName',
    email: 'TestEmail'
};
// Action types
var SET_NAME = 'SET_NAME';
var SET_EMAIL = 'SET_EMAIL';
// Action creators
var setName = function (name) { return ({
    type: SET_NAME,
    payload: name
}); };
exports.setName = setName;
var setEmail = function (email) { return ({
    type: SET_EMAIL,
    payload: email
}); };
exports.setEmail = setEmail;
// Reducer function
function formReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case SET_NAME:
            return __assign(__assign({}, state), { name: action.payload });
        case SET_EMAIL:
            return __assign(__assign({}, state), { email: action.payload });
        default:
            return state;
    }
}
// Create the Redux store
var store = (0, redux_1.createStore)(formReducer);
exports.default = store;

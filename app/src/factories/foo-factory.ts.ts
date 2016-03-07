/**
 * @module
 * @name foo-factory
 * @description : factory for creating foo objects.
 *
 * Usage:
 *    let newFoo = Foo.create();
 **/

    export default class Foo {
        constructor() {
            this.bar = "baz";
        }
        bar:string;

        static create(args:string) {
            var instance = new Foo();
            instance.bar = args;
            return instance;
        }
    }

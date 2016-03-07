export default class Foo {
    constructor() {
        this.bar = "baz";
    }
    static create(args) {
        var instance = new Foo();
        instance.bar = args;
        return instance;
    }
}
//# sourceMappingURL=foo-factory.ts.js.map
//@flow
"use strict";

class Person {
    my_name: string;
    my_age: number;

    constructor(name: string, age: number){
        this.my_name = name;
        this.my_age = age;
    }
    greeting(): string {
        return "Hello, I'm " + this.my_name + ".";
    }
    get_age(): number {
        return this.my_age;
    }
}

export { Person };
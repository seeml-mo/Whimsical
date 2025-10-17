interface student {
    name: string;
    gpa: number;
    year: 1|2|3|4|5;
}

let s1:student = {name: "colin", gpa: 2.2, year: 3};
console.log(s1.name);
console.log(s1.gpa);
console.log(s1.year);
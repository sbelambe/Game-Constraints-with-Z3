import { init } from 'z3-solver';

const { Context } = await init();
const { Solver, Int, And, Or, Distinct } = new Context("main");

const solver = new Solver();

// const x = Int.const('x');  // x is a Z3 integer
// solver.add(And(x.le(10), x.ge(9)));  // x <= 10, x >=9

const Bob = Int.const("Bob");
const Mary = Int.const("Mary");
const Cathy = Int.const("Cathy");
const Sue = Int.const("Sue");

// dog = 0
// cat = 1
// fish = 2
// bird = 3

// 1. boy has a dog
// 2. sue has a pet with 2 legs
// 3. mary does not have a fish


solver.add(And(
    // force each name to only have one pet assigned
    // make sure that the column that was chosen for that row is blocked off for other names as well
    // make a 4x4 array of boolean variables, when someone has a pet, that variable is true
    // and everythign in row becoems flase and the other names in the row get false, else it makes it false

    Bob.ge(0), Bob.le(3),
    Mary.ge(0), Mary.le(3),
    Cathy.ge(0), Cathy.le(3),
    Sue.ge(0), Sue.le(3),
));

solver.add(Distinct(Bob, Mary, Cathy, Sue));
solver.add(Bob.eq(0));
solver.add(Sue.eq(3));
solver.add(Mary.neq(2));


// Run Z3 solver, find solution and sat/unsat

if ((await solver.check()) === "sat") {
    const model = solver.model();
    const petNames = ["Dog", "Cat", "Fish", "Bird"];
    console.log("SAT:");
    console.log("Bob has:", petNames[parseInt(model.eval(Bob).toString())]);
    console.log("Mary has:", petNames[parseInt(model.eval(Mary).toString())]);
    console.log("Cathy has:", petNames[parseInt(model.eval(Cathy).toString())]);
    console.log("Sue has:", petNames[parseInt(model.eval(Sue).toString())]);
  } else {
    console.log("UNSAT: No valid assignment");
  }
import { init } from 'z3-solver';
const { Context } = await init();
const { Solver, Int, And, Or, Distinct, Not } = new Context("main");

const solver = new Solver();

const x = Int.const('x');
const y = Int.const('y');  

const left = 5
const right = 10
const top = 15
const bottom = 25

//generating inside the fence
solver.add(And(
    x.ge(left+1), x.le(right-1),
    y.ge(top+1), y.le(bottom-1)
));

if ((await solver.check()) == "sat") {
    const model = solver.model();
    console.log("Inside Fence:", {
        x: model.eval(x).toString(),
        y: model.eval(y).toString()
      });
}

solver.reset();
const x2 = Int.const('x');
const y2 = Int.const('y');

//generating on the fence
solver.add(Or(
    And(x2.eq(left), y2.ge(top), y2.le(bottom)),  
    And(y2.eq(top), x2.ge(left), x2.le(right))    
));

if (await solver.check() == "sat") {
    const model = solver.model();
    console.log("On Fence:", {
        x: model.eval(x).toString(),
        y: model.eval(y).toString()
      });
}

solver.reset();
const x3 = Int.const('x');
const y3 = Int.const('y');

// generating outside the fence
solver.add(And(
    x3.ge(8), y3.ge(20),
    Or(
        x3.lt(left), x3.gt(right),  
        y3.lt(top), y3.gt(bottom)     
    )
));

if (await solver.check() == "sat") {
    const model = solver.model();
    console.log("Outside Fence:", {
        x: model.eval(x).toString(),
        y: model.eval(y).toString()
      });
}

solver.reset();

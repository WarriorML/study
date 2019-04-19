// 以下函数改造成函数式编程写法
// function loop_on_array(arr, body, i) {
// 	if (i < arr.length) {
// 		body(arr[i])
// 		loop_on_array(arr, body, i + 1)
// 	}
// }

// 改造后
const two_steps = step1 => step2 => param => step2(step1(param))
const body = item => console.log(item)
const loop = arr => body => i => i < arr.length ? two_steps(body)(_ => loop(arr)(body)(i + 1))(arr[i]) : undefined
const loop_on_array = arr => body => loop(arr)(body)(0)

loop_on_array([1, 2, 3, 4, 5])(body)

/** 函数式编程遵循规则
 * 禁用var/let，所有东西都用const定义，也就是说无变量了，强制immutable
 * 禁用分号，也就是不让“顺序执行”，接触过程式编程范式
 * 禁用if/else，但允许用条件表达式condition ? expr1 : expr2
 * 禁用for/while/do-while
 * 禁用prototype和this来接触JS中的面向对象编程范式
 * 禁用function和return关键字，禁用lambda表达式来编程（箭头函数）
 * 禁用多参数函数，只允许使用单个参数
 */

/** 实现map
 * 对于空数组，map返回的结果是空
 * 对于非空数组，将第一个元素使用f进行映射，结果作为返回值（数组）的第一个元素，再对后面的剩余数组递归调用map f xs，作为返回值（数组）的剩余部分
 */

const map = f => ([x, ...xs]) => x === undefined ? [] : [f(x), ...map(f)(xs)]

const double = arr => map(x => x * 2)(arr)

console.log(double([1, 2, 3, 4]))

// 实现sum

const sum = accumulator => ([x, ...xs]) =>
    x === undefined ?
    accumulator :
    sum(x + accumulator)(xs)

sum(0)([1, 2, 3, 4, 5]) // 结果是15

const _sum = accumulator => ([x, ...xs]) =>
    x === undefined ?
    accumulator :
    _sum(x + accumulator)(xs)
const sum1 = arr => _sum(0)(arr)

console.log(sum1([1, 2, 3, 4, 5]))

// 重写map
const _map = f => accumulator => ([x, ...xs]) => x === undefined ? accumulator : _map(f)([...accumulator, f(x)])(xs)

const map2 = f => xs => _map(f)([])(xs)

console.log(map2(x => x * 2)([1, 2, 3, 4, 5]))

// reduce

const _reduce = f => accumulator => ([x, ...xs]) => x === undefined ? accumulator : _reduce(f)(accumulator + f(x))(xs)

const reduce = f => xs => _reduce(f)(0)(xs)

console.log(reduce(x => x * 2)([1,2]))

/** foldr函数
 * f是一个fold函数，接受两个参数，第一个参数是当前值，第二个参数是累加器，f返回一个更新后的累加器，foldr会在数组上迭代，不断调用f以更新累加器，直到遇到空数组，迭代完成，则返回累加器的最后值
 */
const foldr = f => accumulator => ([x,...xs]) => x === undefined ? accumulator : f(x)(foldr(f)(accumulator)(xs))

// 使用folder更新sum和map

const f_map = f => foldr(x => acc => [f(x),...acc])([])

const f_sum = foldr(x => acc => x + acc)(0)

console.log(f_map(x => x * 2)([1,2]))
console.log(f_sum([1,2]))

// 重写loop_on_array

const f_loop = f => foldr(x => _ => f(x))(undefined)

f_loop(x => console.log(x))([1,2,3,4,5])

// 左折叠

const foldl = f => accumulator => ([x,...xs]) => x === undefined ? accumulator : foldl(f)(f(x)(accumulator))(xs)


const f_loop1 = f => foldl(x => _ => f(x))(undefined)

f_loop1(x => console.log(x))([1,2,3,4,5])

const foldl1 = function(f){
	return function(accumulator){
		return function([x,...xs]){
			if(x === undefined){
				return accumulator
			}else{
				return f(x)(foldl1(f)(accumulator)(xs))
			}
			// return x === undefined ? accumulator : f(x)(foldl1(f)(accumulator)(xs));
		}
	}
}

const f_loop2 = f => foldl1(x => _ => f(x))(undefined)

f_loop2(function(x){
	console.log(x)
})([1,2,3,4,5])

const local = a => f => f(a)

const getName = () => 'name from somewhere'
const greeting = word => local(getName())(name => word + ',' + name)

console.log(greeting('Hello'))
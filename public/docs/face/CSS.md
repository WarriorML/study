# CSS面试题

### translate属性与相对定位、绝对定位、margin的区别

> 1. 使用 CSS3 translate 属性和绝对定位、相对定位、margin属性加上 top、left 数值都可以使元素产生位移，但存在细微差别，表现在offsetLeft 和 offsetTop 属性。使用绝对定位、相对定位、margin属性加上 top、left ，会影响offsetTop和 offsetLeft 的值；使用 translate 的offsetTop和 offsetLeft 与没有产生位移的元素没有区别，即无论translate 的值为多少，这offsetTop和 offsetLeft 的值都是固定不变的。
> 2. 在支持 CSS3 属性的现代浏览器当中，可以利用CSS3的translate属性实现水平垂直居中。尤其是当子元素的width和height未知时，无法通过设置margin-left:-width/2和margin-top:-height/2来实现，这时候可以设置子元素的transform: translate(-50%,-50%)。
> 3. translate3d(0,0,0)可以触发硬件加速。尤其在动画时，可以让动画更流畅。
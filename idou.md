
# 自动化低代码的探索与实践

今天跟大家分享一下自动化低代码的探索和演进之路。

内容主要分四个部分。一是对低代码的简单介绍和我们的项目背景，二是我们遇到的问题和解决问题的思考，三是我们为了解决这些问题引出的自动化代码生成器的介绍，四是对未来的展望
## 低代码介绍及背景
关于可视化编程，是指通过可视化的环境平台，以更快捷的配置方式实现应用程序的生成。它有两个主要特征：一是可视化，二是可配置。

按目标代码划分，可分为以下两类

|     |  低代码  |  无代码  | 
|  ----  | ----   | ----  |
| 平台  | 可视化 | 可视化 |
| 编码  | 少编码 | 无编码 |
| 面向群体  | 开发 | 运营 |

按技术实现，可分为以下两类

|     |  运行时  |  非运行时  | 
|  ----  | ----   | ----  |
| 出码能力  | 不输出源码 | 输出源码 |
| 编排时机  | 运行时编排 | 编译时编排 |
| 运行效率  | 低（项目越复杂越明显） | 较高 |
| 灵活性  | 低 | 较高 |
| 维护成本  | 较低 | 较高 |
| 风险性  | 较高且影响广 | 较低 |
| 面向群体  | 运营 | 开发 |

当然运行时的灵活性也可能很高，如果设计成原子化编程，那么灵活性的确也可以很高，但这就违背了低代码提效的初衷，只是用另外一种方式编写代码罢了，有点本末倒置的感觉。

而非运行时会输出源码，后续一般由开发者接管，但也可实现无代码编程，这里先买个关子。

无论是低代码还是无代码，它们都有共同的目标，那就是降本、提效和赋能。

我认为搭建器最本质的作用就是提效。

于是乎，我们就有了面向H5的搭建器——哪吒搭建器；有了面向PC端的搭建器——翱翔天城搭建器

当然搭建器范围有点泛，我们今天主要讨论的是中后台领域的低代码搭建。

由于PC端的搭建器起步相对晚一些，没有很完善，并不能覆盖所有的业务场景。因此，在页面搭建器还没有完善起来之前，很多老业务系统还是使用传统的pro code方式进行开发的。
#### 现状和痛点
我们项目中存在各种各样的差异性问题，有的是有共性，有的是某个项目中特有的。首先是交互不统一的问题，这是由于内部系统大多都没有交互设计，而且迭代也比较快，设计资源也跟不上。其次，代码风格各异，代码繁杂，对维护成本造成一定的影响，同时可能出现隐藏的bug。第三，系统多业务重，对后端赋能的能力有限。第四，重复性开发太多，同时公共资源无法及时同步更新，对新手不友好。

![图片](https://cdn.poizon.com/node-common/267b9ff988320af71373aad817dd46c4.png)

## 问题和思考

传统的开发模式如何进一步提效呢？
### 分析
#### 页面类型
经过分析和观察，我们大多数中后台系统其实最多的就是列表页面，这一占比通常有65%以上，有的更高。其次，便是编辑页面和详情页面，占比25%以上，剩余10%都是其他类型的页面，当然这是普通的主流后台类型，其他如图表展示类系统除外。

![图片](https://cdn.poizon.com/node-common/ec1f1ea93eef825b4f7aac0b65e5d863.png)

#### 页面布局
由于我们公司已经有集成了布局组件（即头部+菜单），市面上也有比较成熟的方案，比如基于vue3的[fesjs](https://webank.gitee.io/fes.js/)。而我们日常中开发接触更多的应该是下面红色框内部页面的开发

![图片](https://cdn.poizon.com/node-common/c16891f52aad2816de75ce01a0438e60.png)

#### 语言特性
目前我们大多的项目框架是基于vue2和react进行开发的，而我们更多的需求都集中在vue这边，因此先要解决vue的需求，然后再求跨语言。

#### 结构特性
其实只要分析以下列表，查看，编辑页面的代码，只要类型相同，它们的代码结构都基本相同；尤其是列表。如下：

![图片](https://cdn.poizon.com/node-common/ff8d1f513a48be886e18c920d084d37c.png)

它组成的元素通常有4部分，分别为搜索栏，操作模块，表格和分页模块。我们公司内部主流的列表类都是这种结构。其他详情页和编辑页会有些差异，但都有主流结构样式，这里就不一一列举了。

## 目标
我们的目标是在现有的开发模式上进一步提效，

## 自动化生成器


## 展望


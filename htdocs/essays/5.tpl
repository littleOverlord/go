<p>译自：https%3A%2F%2Fmedium.com%2Ffree-code-camp%2Fjavascript-async-and-await-in-loops-30ecc5fb3939</p>
<p>async 与 await 的使用方式相对简单。 蛤当你尝试在循环中使用await时，事情就会变得复杂一些。</p>
<p>在本文中，分享一些在如果循环中使用await值得注意的问题。</p>
<h3>准备一个例子</h3>
<p>对于这篇文章，假设你想从水果篮中获取水果的数量。</p>
<pre>
const fruitBasket = {
    apple: 27,
    grape: 0,
    pear: 14
};
</pre>
<p>你想从fruitBasket获得每个水果的数量。 要获取水果的数量，可以使用getNumFruit函数。</p>
<pre>
const getNumFruit = fruit => {
    return fruitBasket[fruit];
};

const numApples = getNumFruit('apple');
console.log(numApples); //27
</pre>
<p>现在，假设fruitBasket是从服务器上获取，这里我们使用 setTimeout 来模拟。</p>
<pre>
const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
};

const getNumFruit = fruit => {
    return sleep(1000).then(v => fruitBasket[fruit]);
};

getNumFruit("apple").then(num => console.log(num)); // 27
</pre>
<p>最后，假设你想使用await和getNumFruit来获取异步函数中每个水果的数量。</p>
<pre>
const control = async _ => {
    console.log('Start')
    
    const numApples = await getNumFruit('apple');
    console.log(numApples);
    
    const numGrapes = await getNumFruit('grape');
    console.log(numGrapes);
    
    const numPears = await getNumFruit('pear');
    console.log(numPears);
    
    console.log('End')
}
</pre>
<p><img src="temp/16b24e9ec7a08e4c" /></p>
<h3>在 for 循环中使用 await</h3>
<p>首先定义一个存放水果的数组：</p>
<pre>
const fruitsToGet = [“apple”, “grape”, “pear”];
</pre>
<p>循环遍历这个数组：</p>
<pre>
const forLoop = async _ => {
    console.log('Start');
    
    for (let index = 0; index < fruitsToGet.length; index++) {
        // 得到每个水果的数量
    }
    
    console.log('End')
}
</pre>
<p>在for循环中，过上使用getNumFruit来获取每个水果的数量，并将数量打印到控制台。</p>
<p>由于getNumFruit返回一个promise，我们使用 await 来等待结果的返回并打印它。</p>
<pre>
const forLoop = async _ => {
    console.log('start');
    
    for (let index = 0; index < fruitsToGet.length; index ++) {
        const fruit = fruitsToGet[index];
        const numFruit = await getNumFruit(fruit);
        console.log(numFruit);
    }
    console.log('End')
}
</pre>
<p>当使用await时，希望JavaScript暂停执行，直到等待 promise 返回处理结果。这意味着for循环中的await 应该按顺序执行。</p>
<p>结果正如你所预料的那样。</p>
<pre>
“Start”;
“Apple: 27”;
“Grape: 0”;
“Pear: 14”;
“End”;
</pre>
<p><img src="temp/16b24ea4bb18a00c" /></p>
<p>这种行为适用于大多数循环(比如while和for-of循环)…</p>
<p>但是它不能处理需要回调的循环，如forEach、map、filter和reduce。在接下来的几节中，我们将研究await 如何影响forEach、map和filter。</p>
<h3>在 forEach 循环中使用 await</h3>
<p>首先，使用 forEach 对数组进行遍历。</p>
<pre>
const forEach = _ => {
    console.log('start');
    
    fruitsToGet.forEach(fruit => {
        //...
    })
    
    console.log('End')
}
</pre>
<p>接下来，我们将尝试使用getNumFruit获取水果数量。 （注意回调函数中的async关键字。我们需要这个async关键字，因为await在回调函数中）。</p>
<pre>
const forEachLoop = _ => {
    console.log('Start');
    
    fruitsToGet.forEach(async fruit => {
        const numFruit = await getNumFruit(fruit);
        console.log(numFruit)
    });
    
    console.log('End')
}
</pre>
<p>我期望控制台打印以下内容：</p>
<pre>
“Start”;
“27”;
“0”;
“14”;
“End”;
</pre>
<p>但实际结果是不同的。在forEach循环中等待返回结果之前，JavaScrip先执行了 console.log('End')。</p>
<p>实际控制台打印如下：</p>
<pre>
‘Start’
‘End’
‘27’
‘0’
‘14’
</pre>
<p><img src="temp/16b24eb112ee68bb" /></p>
<p>JavaScript 中的 forEach不支持 promise 感知，也不支持 async 和await，所以不能在 forEach 使用 await 。</p>
<h3>在 map 中使用 await</h3>
<p>如果在map中使用await, map 始终返回promise数组，这是因为异步函数总是返回promise。</p>
<pre>
const mapLoop = async _ => {
    console.log('Start')
    const numFruits = await fruitsToGet.map(async fruit => {
        const numFruit = await getNumFruit(fruit);
        return numFruit;
    })

    console.log(numFruits);

    console.log('End')
}
    

“Start”;
“[Promise, Promise, Promise]”;
“End”;
</pre>
<p><img src="temp/16b24ecb0d9180f6" /></p>
<p>如果你在 map 中使用 await，map 总是返回promises，你必须等待promises 数组得到处理。 或者通过await Promise.all(arrayOfPromises)来完成此操作。</p>
<pre>
const mapLoop = async _ => {
    console.log('Start');
    
    const promises = fruitsToGet.map(async fruit => {
        const numFruit = await getNumFruit(fruit);
        return numFruit;
    });
    
    const numFruits = await Promise.all(promises);
    console.log(numFruits);
    
    console.log('End')
}
</pre>
<p>运行结果如下：</p>
<p><img src="temp/16b24ecf1e9cd8ff" /></p>
<p>如果你愿意，可以在promise 中处理返回值，解析后的将是返回的值。</p>
<pre>
const mapLoop = _ => {
    // ...
    const promises = fruitsToGet.map(async fruit => {
        const numFruit = await getNumFruit(fruit);
        return numFruit + 100
    })
    // ...
}
    
“Start”;
“[127, 100, 114]”;
“End”;
</pre>
<h3>在 filter 循环中使用 await</h3>
<p>当你使用filter时，希望筛选具有特定结果的数组。假设过滤数量大于20的数组。</p>
<p>如果你正常使用filter （没有 await），如下：</p>
<pre>
const filterLoop =  _ => {
    console.log('Start')
    
    const moreThan20 =  fruitsToGet.filter(async fruit => {
        const numFruit = await fruitBasket[fruit]
        return numFruit > 20
    })
    
    console.log(moreThan20) 
    console.log('END')
}
</pre>
<p>运行结果</p>
<pre>
Start
["apple"]
END
</pre>
<p>filter 中的await不会以相同的方式工作。 事实上，它根本不起作用。</p>
<pre>
const filterLoop = async _ => {
    console.log('Start')
    
    const moreThan20 =  await fruitsToGet.filter(async fruit => {
        const numFruit = fruitBasket[fruit]
        return numFruit > 20
    })
    
    console.log(moreThan20) 
    console.log('END')
}


// 打印结果
Start
["apple", "grape", "pear"]
END
</pre>
<p><img src="temp/16b24ed2beb67c9a" /></p>
<p>为什么会发生这种情况?</p>
<p>当在filter 回调中使用await时，回调总是一个promise。由于promise 总是真的，数组中的所有项都通过filter 。在filter 使用 await类以下这段代码</p>
<pre>
const filtered = array.filter(true);
</pre>
<p>在filter使用 await 正确的三个步骤</p>
<ol>
    <li>使用map返回一个promise 数组</li>
    <li>使用 await 等待处理结果</li>
    <li>使用 filter 对返回的结果进行处理</li>
</ol>
<pre>
const filterLoop = async _ => {
    console.log('Start');
    const promises = await fruitsToGet.map(fruit => getNumFruit(fruit));
    const numFruits = await Promise.all(promises);
    const moreThan20 = fruitsToGet.filter((fruit, index) => {
    const numFruit = numFruits[index];
    return numFruit > 20;
    })
    console.log(moreThan20);
    console.log('End')
}
</pre>
<p><img src="temp/16b24ed6829a87ee" /></p>

<h3>在 reduce 循环中使用 await</h3>
<p>如果想要计算 fruitBastet中的水果总数。 通常，你可以使用reduce循环遍历数组并将数字相加。</p>
<pre>
const reduceLoop = _ => {
    console.log('Start');
    
    const sum = fruitsToGet.reduce((sum, fruit) => {
        const numFruit = fruitBasket[fruit];
        return sum + numFruit;
    }, 0)
    
    console.log(sum)
    console.log('End')
}
</pre>
<p>运行结果：</p>
<p><img src="temp/16b24ed986ac8181" /></p>
<p>当你在 reduce 中使用await时，结果会变得非常混乱。</p>
<pre>
const reduceLoop = async _ => {
    console.log('Start');
    
    const sum = await fruitsToGet.reduce(async (sum, fruit) => {
        const numFruit = await fruitBasket[fruit];
        return sum + numFruit;
    }, 0)
    
    console.log(sum)
    console.log('End')
}
</pre>
<p><img src="temp/16b24edc7c97b194" /></p>
<p>[object Promise]14 是什么 鬼？？</p>
<p>剖析这一点很有趣。</p>
<ol>
    <li>在第一次遍历中，sum为0。numFruit是27(通过getNumFruit(apple)的得到的值)，0 + 27 = 27。</li>
    <li>在第二次遍历中，sum是一个promise。 （为什么？因为异步函数总是返回promises！）numFruit是0.promise 无法正常添加到对象，因此JavaScript将其转换为[object Promise]字符串。 [object Promise] + 0 是object Promise] 0。</li>
    <li>在第三次遍历中，sum 也是一个promise。 numFruit是14. [object Promise] + 14是[object Promise] 14。</li>
</ol>
<p>解开谜团！</p>
<p>这意味着，你可以在reduce回调中使用await，但是你必须记住先等待累加器！</p>
<pre>
const reduceLoop = async _ => {
    console.log('Start');
    
    const sum = await fruitsToGet.reduce(async (promisedSum, fruit) => {
        const sum = await promisedSum;
        const numFruit = await fruitBasket[fruit];
        return sum + numFruit;
    }, 0)
    
    console.log(sum)
    console.log('End')
}
</pre>
<p><img src="temp/16b24ee2b36da78a" /></p>
<p>但是从上图中看到的那样，await 操作都需要很长时间。 发生这种情况是因为reduceLoop需要等待每次遍历完成promisedSum。</p>
<p>有一种方法可以加速reduce循环，如果你在等待promisedSum之前先等待getNumFruits()，那么reduceLoop只需要一秒钟即可完成：</p>
<pre>
const reduceLoop = async _ => {
    console.log('Start');
    
    const sum = await fruitsToGet.reduce(async (promisedSum, fruit) => {
        const numFruit = await fruitBasket[fruit];
        const sum = await promisedSum;
        return sum + numFruit;
    }, 0)
    
    console.log(sum)
    console.log('End')
}
</pre>
<p><img src="temp/16b24ee5cfaac32a" /></p>
<p>这是因为reduce可以在等待循环的下一个迭代之前触发所有三个getNumFruit promise。然而，这个方法有点令人困惑，因为你必须注意等待的顺序。</p>
<p>在reduce中使用wait最简单(也是最有效)的方法是</p>
<ol>
    <li>使用map返回一个promise 数组</li>
    <li>使用 await 等待处理结果</li>
    <li>使用 reduce 对返回的结果进行处理</li>
</ol>
<pre>
const reduceLoop = async _ => {
    console.log('Start');
    const promises = fruitsToGet.map(getNumFruit);
    const numFruits = await Promise.all(promises);
    const sum = numFruits.reduce((sum, fruit) => sum + fruit);
    console.log(sum)
    console.log('End')
}
</pre>
<p>这个版本易于阅读和理解，需要一秒钟来计算水果总数。</p>
<p><img src="temp/16b24ee8c9e5b312" /></p>
<h3>从上面看出来什么</h3>
<ol>
    <li>如果你想连续执行await调用，请使用for循环(或任何没有回调的循环)。</li>
    <li>永远不要和forEach一起使用await，而是使用for循环(或任何没有回调的循环)。</li>
    <li>不要在 filter 和 reduce 中使用 await，如果需要，先用 map 进一步骤处理，然后在使用 filter 和 reduce 进行处理。</li>
</ol>

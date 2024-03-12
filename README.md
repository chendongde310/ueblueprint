 
# UEBlueprint

UE的蓝图视觉语言的独立编辑器实现。(工作进行中)

## 特性：

- 与UE互通（可以双向复制节点）。
- 可以作为WEB库使用，以可视化、交互和修改蓝图图表。
- 可以在VS Code内使用，直接操作UE项目中的文件（将来的功能）。
- 图形显示与在UE中的显示像素相似。
- 图形的行为方式与在UE中的默认设置相同。
- 图中显示的所有信息仅为序列化文本中嵌入的信息（在VS Code中，还应能够访问资产）。
- 现代面向对象，清晰的JavaScript代码库。

## 演示：
[试试看！](https://barsdeveloper.github.io/ueblueprint/)

 
## 入门：

### 本地运行
1) 在主文件夹中打开一个终端。
2) 运行以下命令。
```sh
npm install
npm run build
npx http-server 

3) 打开最后一条打印消息中看到的链接。

### 在网页中使用

你可以查看`index.html`以获取一个工作示例，主要步骤如下：
1. 在你的页面中包含`dist/css/ueb-style.css`样式表。
2. 定义可能的CSS变量。
```HTML
<style>
    ueb-blueprint {
        --ueb-height: 500px;
    }
</style>
```
3. 在JavaScript中导入Blueprint类（此库使用模块）。
```HTML
<script type="module">
    import { Blueprint } from "./dist/ueblueprint.js"
</script>
```
4. 仅通过在`template`元素内部的`ueb-blueprint`中编写代码，定义你的蓝图。
```HTML
<ueb-blueprint>
    <template>
        ...                   
    </template>
</ueb-blueprint>
```

```
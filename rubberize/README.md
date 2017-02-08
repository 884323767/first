# rubberize

rubberize是一个网页基础布局工具，灵感来源于[lib-flexible](https://github.com/amfe/lib-flexible)。

## 解决的问题

### 高清（Retina）屏幕显示

* 1物理像素的边框（移动端）
* 1物理像素的分割线
* 最清晰最合适的图片或背景图

### 自适应布局

* 可使用rem为单位进行布局，布局可随屏幕宽度进行伸缩
* 可使用em为单位设置字体，字体在各类屏幕宽度下大小一定
* 可使用px为单位设置边框，px始终为物理像素（移动端）

## 使用方法

### 去掉原始的meta:vp标签，添加如下meta:rubberize标签

```html
<meta name="rubberize" content="base-width=1024, base-font_size=12 , min-dpr=1, max-dpr=3, min-rwidth=320, max-rwidth=1024, force-dpr=0, user-scalable=no">
```

* base-width：视觉稿（标注稿，dpr=1）的宽度，例如以iPhone5的屏幕宽度为基准的设计稿，base-width值为320，必须
* base-font_size：默认的字体大小，这个值会被设在body的style上，作为em单位的默认基准值，默认值12
* min-dpr：支持的最小的dpr（devicePixelRatio），默认值1
* max-dpr：支持的最大的dpr（devicePixelRatio），默认值3
* min-rwidth：最小的伸缩宽度，当屏幕宽度低于这个值之后，rem布局将不会再伸缩，默认值320
* max-rwidth：最大的伸缩宽度，当屏幕宽度大于这个值之后，rem布局将不会再伸缩，默认值1024
* force-dpr：强制设置dpr的值，默认值为0，不生效
* user-scalable：同meta:vp的设置是否允许用户进行缩放，默认值no

### 引入rubberize.js

```html
<script src="./rubberize.js"></script> 
```

建议在head标签中以内联的方式引入

### 引入rubberize.less

```less
@import "rubberize.less";
```

在less中，可以通过从新定义变量的方式改变默认的配置

* base-width：同meta:rubberize的中配置，两者必须保持一致
* base-font_size：同meta:rubberize的中配置，两者必须保持一致
* base-dprs：同meta:rubberize的中配的min-dpr到max-dpr的值，默认址1, 2, 3
* base-assets_path：静态文件的访问路径，默认值.（当前目录）

### 在less中使用，编写样式

```less
// 伸缩布局
width: 10/@rem;

// 固定字体
font-size: 12/@em;

// 1物理像素的边框（移动端）
border-width: 1/@px;

// 1物理像素的分割线
.hairline(top);

// 设置分割线颜色
.hairline-color(top, red);

// 移除分割线
.hairline-remove(top);

// 最清晰最合适的背景图
.background-image('logo');

// 使用条件判断，rubberize会在html标签中添加data-dpr="", data-platform=""属性
:root[data-dpr="1"] {
    // xxxxx
}
:root[data-platform="desktop"] {
    // xxxxx
}
:root[data-platform="mobile"] {
    // xxxxx
}

// 还可以写媒体查询，虽然麻烦一点点，但是兼容各种平台各种dpr
.loop (@i: 1) when (@i <= length(@base-dprs)) {
  @tmp-dpr_str: e(extract(@base-dprs, @i));
  @tmp-dpr: `Math.abs(parseInt(@{tmp-dpr_str}))`;
  // loop body
  :root[data-dpr="@{tmp-dpr}"][data-platform="desktop"] & {
    // [-1287]
    @media screen {
      .max-width(1280 - 1, @tmp-dpr, desktop);
      @media (max-width: @max-width) {
        width: 1024/@rem;
        padding-left: 40/@rem;
        padding-right: 60/@rem;
      }
    }
    // [1280-]
    @media screen {
      .min-width(1280, @tmp-dpr, desktop);
      @media (min-width: @min-width) {
        width: 1280/@rem;
        padding-left: 50/@rem;
        padding-right: 70/@rem;
      }
    }
  }
  :root[data-dpr="@{tmp-dpr}"][data-platform="mobile"] & {
    // [-1287]
    @media screen {
      .max-width(1280 - 1, @tmp-dpr, mobile);
      @media (max-width: @max-width) {
        width: 1024/@rem;
        padding-left: 40/@rem;
        padding-right: 60/@rem;
      }
    }
    // [1280-]
    @media screen {
      .min-width(1280, @tmp-dpr, mobile);
      @media (min-width: @min-width) {
        width: 1280/@rem;
        padding-left: 50/@rem;
        padding-right: 70/@rem;
      }
    }
  }
  // ./loop body
  .loop(@i + 1);
};
.loop();
```

### 在js中使用

在window.GLOBAL_API.rubberize中暴露出一些api

* dpr：当前dpr值
* platform：当前平台，desktop，mobile
* refreshRem：调用此函数可以立即刷新rem值
* onRefreshRem：当rem更新的时候，执行此回调（窗口大小改变时，会更新rem的值）
* px2rem：将设计稿的px值转成rem值，相当于less中的：/@rem

### 和lib-flexible的对比

* 支持桌面端，统一样式上下文
* 更灵活的配置，适合各种项目
* 更多有用的预设，如设置分割线，高清图，甚至连媒体查询都有
* 去掉了lib-flexible一些无用的功能

### 其他

兼容IE9，Android 4.0+.....

欢迎以后在新项目中尝试使用rubberize，(⁎⁍̴̛ᴗ⁍̴̛⁎)
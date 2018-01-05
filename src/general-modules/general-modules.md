## Index
 1. [Info Section](#infosection)
 2. [Value Selector](#valueselector)

## InfoSection
--------------
Render Markdown content with katex (Texmath) support

```typescript
export interface Sources{
  DOM:DOMSource
  props:{
      source: string
  }
}

export interface Sinks{
  DOM:O<VNode>
}
```

`props.source` : markdown file location

![InfoSection](./docs/infosection.png)

## ValueSelector
----------------
Number value selector

```typescript
export interface Sources{
  DOM:DOMSource
  props:{
    min:number;
    max:number;
    default:number;
  }
}

export interface Sinks{
  DOM:O<VNode>
}
```

![ValueSelector](./docs/valueselector.png)
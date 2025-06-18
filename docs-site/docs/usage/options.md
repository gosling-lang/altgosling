---
sidebar_position: 1
---

# Options

AltGosling can be used as a React component, and with several exported functions.

## React
### AltGosling and Gosling
AltGosling is mainly designed as a React Component. As a component, it encaptures a Gosling Component and adds AltGosling's features to it.

Gosling is a grammar-based genomics visualization toolkit. More can be read [here](http://gosling-lang.org). 

Gosling and AltGosling work with **specifications** or **specs**, which are described in-depth in Gosling's [Grammar Guide](http://gosling-lang.org/docs/category/grammar-guide).

### Properties
The properties added to the AltGosling Component, or the *AltGoslingCompProps*, are an extension of the Gosling properties or *GoslingCompProps*. 

```ts
interface GoslingCompProps {
    spec?: GoslingSpec;
    compiled?: CompiledCallbackFn;
    padding?: number;
    margin?: number;
    border?: string;
    id?: string;
    className?: string;
    theme?: Theme;
    templates?: TemplateTrackDef[];
    urlToFetchOptions?: UrlToFetchOptions;
    experimental?: {
        reactive?: boolean;
    };
}

interface AltGoslingCompProps extends GoslingCompProps {
    name?: string;
    layout?: 'vertical' | 'horizontal';
    layoutPanels?: 'vertical' | 'horizontal';
    download?: boolean;
}
```

- *name*: one can name a visualization. This name is used when downloading files.
- *layout*: whether to group the Gosling visualization and the panels vertically or horizontally. Default: vertical.
- *layoutPanels*: whether to group the visual and data panels vertically or horizontally. Default: vertical if layout is horizontal, horizontal otherwise.
- *download*: add a download button to the component to download the descriptions as text files.


## Without React
We are still working on the documentation and support for this option.

In order to have AltGosling working as a web page, the HiGlass stylesheet needs to be added to the header.

```bash
<link rel="stylesheet" href="https://unpkg.com/higlass@1.12/dist/hglib.css">
```
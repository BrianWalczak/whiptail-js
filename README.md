# whiptail-js

> `whiptail-js` is a lightweight terminal-style dialog library for the web, inspired by the classic Linux `whiptail` tool, featuring keyboard navigation and touch support for mobile devices.

## Getting Started

### Installation
```bash
npm install jquery
npm install whiptail-js
```

Or use a CDN:
```html
<link rel="stylesheet" href="https://unpkg.com/whiptail-js/dist/whiptail.css">
<script src="https://unpkg.com/jquery@3.6.0/dist/jquery.min.js"></script>
<script src="https://unpkg.com/whiptail-js/dist/whiptail.js"></script>
```

### Usage

First, add a container element where your UI will render:
```html
<div id="whiptail-container"></div>
```

Then create a new instance of `WhiptailJS`:
```js
const whiptail = new WhiptailJS({
    title: "Raspberry Pi Software Configuration Tool (raspi-config)",
    items: [
        { label: "1 System Options&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Configure system settings", focus: true },
        { label: "2 Display Options&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Configure display settings" },
        { label: "3 Interface Options&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Configure connections to peripherals" },
        { label: "4 Performance Options&nbsp;&nbsp;&nbsp;Configure performance settings" },
        { label: "5 Localisation Options&nbsp;&nbsp;Configure language and regional settings" },
        { label: "6 Advanced Options&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Configure advanced settings" },
        { label: "7 Update&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Update this tool to the latest version" },
        { label: "8 About raspi-config&nbsp;&nbsp;&nbsp;&nbsp;Information about this configuration tool" }
    ],
    footer: [{ label: "&lt;Select&gt;", id: 'select' }, { label: "&lt;Finish&gt;", id: 'close' }],
    id: "whiptail-container",
    onSelect: (item, btn) => {
        if(btn.id === 'close') {
            whiptail.destroy(); // destroy the instance
        } else if (btn.id === 'select') {
            alert(`You selected: ${item.textContent}`);
        }
    }
});
```

### Output

<img src="https://github.com/user-attachments/assets/5a3e6e73-94b4-489d-b410-c855d919e901" height="300" />

### Configuration Options

- **`title`** | *(string)* The dialog's header text.

- **`id`** | *(string)* The HTML id of the container element where the dialog will render.

- **`text`** | *(string, optional)* Additional text content to display in the dialog.

- **`items`** | *(array of objects, optional)* List of menu items, each with the following:
  - `label` *(string)* | The text content of the item.
  - `id` *(string, optional)* | The HTML id attribute for the item.
  - `class` *(string, optional)* | The HTML class attribute for the item.
  - `focus` *(boolean, optional)* | Whether this item is initially focused.
  - `active` *(boolean, optional)* | Whether this item is initially active (selected).

- **`footer`** | *(array of objects)* List of footer buttons, each with the same properties as `items`.

- **`onSelect`** | *(function)* Callback called when a user selects an item or footer button. Receives two arguments:
  - The selected item DOM element.
  - The selected footer button DOM element.


### API Methods

- **`constructor(config)`** | Creates a new whiptail dialog instance with the provided configuration options.

- **`get()`** | Returns the DOM element of the dialog container.

- **`status()`** | Returns an object with `item` and `footer` properties containing the currently focused menu item and footer button element.

- **`destroy()`** | Destroys the dialog from the DOM and cleans up all event listeners.

- **`onSelect(item, footerButton)`** | Callback triggered when a user makes a selection. Receives the selected item and footer button elements.
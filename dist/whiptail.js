/*!
 * whiptail-js
 * A lightweight terminal-style dialog library for the web
 * 
 * Copyright (c) 2025 Brian Walczak
 * Author: Brian Walczak (https://github.com/BrianWalczak)
 * Last Updated: 2025-08-03
 */

if (typeof window.jQuery === 'undefined') {
    throw new Error("jQuery not found. Please include the jQuery library before whiptail-js.");
} else {
    console.warn('whiptail-js has been successfully loaded.');
}

class WhiptailJS {
  constructor(config) {
    this.config = config;

    this._render();
    this._bindEvents();

    if(config.focus) {
        this.focus();
    }
  }

  get() {
    return this.$container;
  }

  focus() {
    if (this.$container) {
        this.$container.attr('tabindex', '-1');
        this.$container.focus();
    }
  }

  status() {
    return {
        item: this.$container.find('.items .item.focus')[0] || this.$container.find('.items .item.active')[0],
        footer: this.$container.find('.footer .item.focus')[0] || this.$container.find('.footer .item.active')[0]
    }
  }

  destroy() {
    this._unbindEvents();
    this.$container.remove();
  }

  _render() {
    this.$container = $(this.config.selector);
    if (this.$container.length === 0) {
      throw new Error(`WhiptailJS: An error occurred, item with selector ${this.config.selector} not found.`);
    }

    this.$container.empty();
    this.$container.addClass('whiptail-js container');
    
    const header = $('<div class="header"><p></p></div>');
    header.find('p').html(this.config.title);
    this.$container.append(header);

    const content = $('<div class="content"></div>');
    this.$container.append(content);

    const items = $('<div class="items"></div>');
    if(this.config.text) {
        const $text = $(`<p></p>`);
        $text.css('margin-top', '0');
        $text.css('margin-bottom', '1em');
        $text.html(this.config.text);
        items.append($text);
    }

    if(this.config.items) {
        this.config.items.forEach((item) => {
            const $item = $(`<div class="item"></div>`);
            if(item.focus) $item.addClass('focus');
            if(item.active) $item.addClass('active');
            if(item.id) $item.attr('id', item.id);
            if(item.class) $item.addClass(item.class);

            $item.html(item.label);
            items.append($item);
        });
    }

    const footer = $('<div class="footer"></div>');
    this.config.footer.forEach((button) => {
      const $button = $(`<div class="item"></div>`);
      if(button.focus) $button.addClass('focus');
      if(button.active) $button.addClass('active');
      if(button.id) $button.attr('id', button.id);
      if(button.class) $button.addClass(button.class);

      $button.html(button.label);
      footer.append($button);
    });

    content.append(items);
    content.append(footer);
  }

  _bindEvents() {
    const $items = this.$container.find('.items .item');
    const $footerItems = this.$container.find('.footer .item');

    let itemIndex = 0;
    let footerIndex = 0;
    let isFooter = false;

    function setFocus(i) {
        if (i < 0) i = 0;
        if (i >= $items.length) i = $items.length - 1;

        // Update current index and update focus class (to specified item)
        itemIndex = i;
        $items.removeClass('focus');
        $items.eq(itemIndex).addClass('focus');
    }

    function setFooterFocus(i) {
        if (i < 0) i = 0;
        if (i >= $footerItems.length) i = $footerItems.length - 1;

        // Update current index and update focus class (to specified footer item)
        footerIndex = i;
        $footerItems.removeClass('focus');
        $footerItems.eq(footerIndex).addClass('focus');
    }

    function enterFooter() {
        // Don't enter footer if there are no footer items
        if ($footerItems.length === 0) return;

        // Remove focus class, make active (blue color)
        $items.eq(itemIndex).removeClass('focus').addClass('active');

        // Update current index and update focus class (to first item)
        isFooter = true;
        footerIndex = 0;
        $footerItems.removeClass('focus');
        $footerItems.eq(footerIndex).addClass('focus');
    }

    function exitFooter() {
        // Don't exit footer if there are no items to go back to
        if ($items.length === 0) return;

        // Remove active class, make focus (red color, in the selection mode)
        $items.eq(itemIndex).removeClass('active').addClass('focus');

        // Remove focus class from all footer items
        $footerItems.removeClass('focus');
        isFooter = false;
    }

    const selectItem = (item, btn) => {
        if(this.config.onSelect) {
            return this.config.onSelect(item[0], btn[0]);
        }
    };

    const exitModal = () => {
        if(this.config.onClose) {
            return this.config.onClose();
        }
    };

    // Desktop support (arrow keys, enter/escape for selection)
    const keydownHandler = (event) => {
        if (event.key === 'ArrowUp') {
            event.preventDefault();

            if (!isFooter) {
                setFocus(itemIndex - 1);
            } else if (footerIndex === 0) {
                // Exit footer if at leftmost (back to main items)
                exitFooter();
            } else {
                setFooterFocus(footerIndex - 1);
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();

            if (!isFooter) {
                setFocus(itemIndex + 1);
            } else {
                setFooterFocus(footerIndex + 1);
            }
        } else if (event.key === 'ArrowLeft' && isFooter) {
            event.preventDefault();

            if (footerIndex === 0) {
                // Exit footer if at leftmost (back to main items)
                exitFooter();
            } else {
                setFooterFocus(footerIndex - 1);
            }
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();

            if (!isFooter) {
                enterFooter();
            } else {
                setFooterFocus(footerIndex + 1);
            }
        } else if (((event.key === 'Enter' || event.key === ' ') && isFooter) || event.key === 'Enter' && !isFooter) {
            event.preventDefault();

            selectItem($items.eq(itemIndex), $footerItems.eq(footerIndex));
        } else if (event.key === 'Escape') {
            event.preventDefault();
            
            exitModal();
        }
    };

    $(document).on('keydown', keydownHandler);
    this.keydownHandler = keydownHandler;

    // Mobile support (tap to select item)
    this.$container.find('.item').on('click', function () {
        const isFooterItem = $(this).closest('.footer').length > 0;
        const index = $(this).index();

        if (isFooterItem) {
            // Focus on item in footer (execute afterwards)
            if (!isFooter) enterFooter();
            setFooterFocus(index);

            selectItem($items.eq(itemIndex), $footerItems.eq(footerIndex));
        } else {
            // Focus on item in list (don't select yet)
            if (isFooter) exitFooter();
            setFocus(index);
        }
    });
  }
  _unbindEvents() {
    $(document).off('keydown', this.keydownHandler);
    this.$container.find('.item').off('click');
  }
}

window.WhiptailJS = WhiptailJS;
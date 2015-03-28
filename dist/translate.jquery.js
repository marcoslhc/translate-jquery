/**
 * The MIT License (MIT)

 * Copyright (c) <2015> <Marcos Luis Hernández>

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function($) {
  var Translate, _cache, _localeFolder;
  _cache = {};
  _localeFolder = 'locale/';
  Translate = (function() {
    function Translate(element, options) {
      this.init('translate', element, options);
    }

    Translate.prototype.init = function(type, element, options) {
      this.type = type;
      this.$element = $(element);
      this.options = {
        detectUrl: 'http://localhost:3000/languages',
        localeFolder: 'locale',
        language: 'en'
      };
      return this.option = $.extend(this.options, options);
    };

    Translate.prototype.doTranslation = function(data, cb) {
      i18n(data);
      if (this.$element.attr('placeholder')) {
        if (!this.$element.data('placeholder')) {
          this.$element.data('placeholder', this.$element.attr('placeholder'));
        }
        this.$element.attr('placeholder', i18n._(this.$element.data('placeholder')));
      }
      if (this.$element.attr('value')) {
        if (!this.$element.data('value')) {
          this.$element.data('value', this.$element.attr('value'));
        }
        this.$element.attr('value', i18n._(this.$element.data('value')));
      }
      if (!this.$element.data('text')) {
        this.$element.data('text', this.$element.html());
      }
      this.$element.html(i18n._(this.$element.data('text')));
      return cb && cb(data);
    };

    Translate.prototype.getLanguage = function(url, cb) {
      var languages;
      languages = $.ajax({
        url: url,
        dataType: 'json'
      });
      return languages.done(function(data) {
        return cb(data[0]);
      });
    };

    Translate.prototype.getTranslations = function(language, cb) {
      var translations;
      if (_cache[language]) {
        return cb(_cache[language]);
      } else {
        translations = $.ajax({
          url: this.options.localeFolder + '/' + language + '.json',
          dataType: 'json',
          contentType: "application/json; charset=utf-8"
        });
        return translations.done(function(data) {
          _cache[language] = data;
          return cb(data);
        });
      }
    };

    return Translate;

  })();
  $.fn.translate = function(options) {
    return this.each(function() {
      var $this, data, obj;
      $this = $(this);
      data = $this.data('translate');
      options = typeof options === 'object' && options;
      if (!data) {
        $this.data('translate', (data = new Translate(this, options)));
      } else if (options) {
        data.options = $.extend(data.options, options);
        $this.data('translate', data);
      }
      if (!options) {
        return;
      }
      obj = $this.data('translate');
      if (obj && !options.language) {
        return obj.getLanguage(obj.options.detectUrl, function(language) {
          return obj.getTranslations(language, function(data) {
            return obj.doTranslation(data, function() {
              return $this.trigger('translate:translated', [language]);
            });
          });
        });
      } else if (obj && !_cache[obj.options.language]) {
        return obj.getTranslations(obj.options.language, function(data) {
          return obj.doTranslation(data, function() {
            return $this.trigger('translate:translated', [obj.options.language]);
          });
        });
      } else if (obj) {
        return obj.doTranslation(_cache[obj.options.language], function() {
          return $this.trigger('translate:translated', [obj.options.language]);
        });
      }
    });
  };
  return $.fn.translate.Constructor = Translate;
})(jQuery);

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
        detectUrl: '',
        localeFolder: 'locale',
        language: 'en'
      };
      return this.option = $.extend(this.options, options);
    };

    Translate.prototype.doTranslation = function(data) {
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
      return this.$element.html(i18n._(this.$element.data('text')));
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
          url: _localeFolder + '/' + language + '.json',
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
      }
      obj = $this.data('translate');
      return obj != null ? obj.getLanguage(obj.options.detectUrl, function(language) {
        return obj != null ? obj.getTranslations(language, function(data) {
          return obj != null ? obj.doTranslation(data) : void 0;
        }) : void 0;
      }) : void 0;
    });
  };
  return $.fn.translate.Constructor = Translate;
})(jQuery);

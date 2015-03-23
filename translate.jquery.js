(function($) {
  var _cache, _localeFolder, getLanguage, getTranslations, translate;
  _cache = {};
  _localeFolder = 'locale/';
  translate = function(data, collection) {
    var $collection;
    i18n(data);
    $collection = $(collection);
    $collection.each(function(idx, elm) {
      var $elm;
      $elm = $(elm);
      if ($elm.attr('placeholder')) {
        if (!$elm.data('placeholder')) {
          $elm.data('placeholder', $elm.attr('placeholder'));
        }
        $elm.attr('placeholder', i18n._($elm.data('placeholder')));
      }
      if ($elm.attr('value')) {
        if (!$elm.data('value')) {
          $elm.data('value', $elm.attr('value'));
        }
        $elm.attr('value', i18n._($elm.data('value')));
      }
      if (!$elm.data('text')) {
        $elm.data('text', $elm.html());
      }
      return $elm.html(i18n._($elm.data('text')));
    });
    return $collection;
  };
  getLanguage = function(url, cb) {
    var languages;
    languages = $.ajax({
      url: url,
      dataType: 'json'
    });
    return languages.done(function(data) {
      data = data['Accept-Language'].split(';')[0].split(',')[1];
      return cb(data);
    });
  };
  getTranslations = function(language, cb) {
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
  return $.fn.translate = function(options) {
    var $this, _options;
    options = options || {};
    _options = {
      detectUrl: '',
      localeFolder: 'locale',
      language: 'en'
    };
    _options = $.extend(_options, options);
    $this = this;
    if (!options.language) {
      getLanguage(_options.detectUrl, function(language) {
        options.language = language;
        _options = $.extend(_options, options);
        return getTranslations(language, function(translation) {
          $this = translate(translation, $this);
          $this.trigger('translate:translated', [_options.language]);
          return $this;
        });
      });
    } else {
      getTranslations(_options.language, function(translation) {
        $this = translate(translation, $this);
        $this.trigger('translate:translated', [_options.language]);
        return $this;
      });
    }
    return $this;
  };
})(jQuery);

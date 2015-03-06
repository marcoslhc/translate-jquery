// Generated by CoffeeScript 1.8.0
(function($) {
  var getLanguage, getTranslations, translate, _cache, _localeFolder;
  _cache = {};
  _localeFolder = 'locale/';
  translate = function(data, collection) {
    var $collection;
    i18n(data);
    $collection = $(collection);
    $collection.each(function(idx, elm) {
      var $elm;
      $elm = $(elm);
      if (!$elm.data('placeholder')) {
        $elm.data('placeholder', $elm.attr('placeholder'));
      }
      if (!$elm.data('text')) {
        $elm.data('text', $elm.text());
      }
      if ($elm.attr('placeholder')) {
        $elm.attr('placeholder', i18n._($elm.attr('placeholder')));
      }
      return $elm.text(i18n._($elm.text()));
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
      detectUrl: 'http://irina.xiryvella.com/lib/get_language.php',
      localeFolder: 'locale',
      language: 'en'
    };
    _options = $.extend(_options, options);
    $this = this;
    if (!options.language) {
      getLanguage(_options.detectUrl, function(data) {
        return getTranslations(data, function(data) {
          return $this = translate(data, $this);
        });
      });
    } else {
      getTranslations(options.language, function(data) {
        return $this = translate(data, $this);
      });
    }
    return $this;
  };
})(jQuery);

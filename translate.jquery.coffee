(($) ->
    _cache = {}
    _localeFolder = 'locale/'
    translate = (data, collection) ->
        i18n data
        $collection = $ collection
        $collection.each (idx, elm)   ->
            $elm = $ elm
            if !$elm.data 'placeholder'
                $elm.data 'placeholder', $elm.attr 'placeholder'
            if !$elm.data 'text'
                $elm.data 'text', $elm.html()
            if $elm.attr 'placeholder'
                $elm.attr 'placeholder', i18n._ $elm.data 'placeholder'
            $elm.html i18n._ $elm.data 'text'
        return $collection

    getLanguage = (url, cb) ->
        languages = $.ajax
            url: url,
            dataType: 'json'
        languages.done (data)->
            data = data['Accept-Language'].split(';')[0].split(',')[1];
            cb(data)

    getTranslations = (language, cb) ->
        if _cache[language]
            cb _cache[language]
        else
            translations = $.ajax
                url: _localeFolder + '/' + language + '.json',
                dataType: 'json',
                contentType: "application/json; charset=utf-8"
            translations.done (data)->
                _cache[language] = data
                cb(data)

    $.fn.translate = (options)->
        options = options || {}
        _options =
            detectUrl: ''
            localeFolder: 'locale'
            language: 'en'
        _options = $.extend _options, options
        $this = this
        if !options.language
            getLanguage _options.detectUrl, (language)->
                options.language = language
                _options = $.extend _options, options
                getTranslations language, (translation)->
                    $this = translate translation, $this
                    $this.trigger('translate:translated', [_options.language])
                    $this
        else
            getTranslations _options.language, (translation)->
                $this = translate translation, $this
                $this.trigger('translate:translated', [_options.language])
                $this
        $this
) jQuery

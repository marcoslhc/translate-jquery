(($) ->
    _cache = {}
    _localeFolder = 'locale/'

    class Translate
        constructor: (element, options) ->
            @init('translate', element, options)
        init: (type, element, options)->
            @type = type;
            @$element = $(element)
            @options =
                detectUrl: ''
                localeFolder: 'locale'
                language: 'en'

            @option = $.extend @options, options

        doTranslation: (data)->
            i18n data
            if @$element.attr 'placeholder'
                if !@$element.data 'placeholder'
                    @$element.data 'placeholder', @$element.attr 'placeholder'
                @$element.attr 'placeholder', i18n._ @$element.data 'placeholder'

            if @$element.attr 'value'
                if !@$element.data 'value'
                    @$element.data 'value', @$element.attr 'value'
                @$element.attr 'value', i18n._ @$element.data 'value'

            if !@$element.data 'text'
                @$element.data 'text', @$element.html()
            @$element.html i18n._ @$element.data 'text'

        getLanguage: (url, cb)->
            languages = $.ajax
                url: url,
                dataType: 'json'
            languages.done (data)->
                cb(data[0])

        getTranslations: (language, cb)->
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
        return @each ()->
            $this = $(this)
            data = $this.data('translate')
            options = typeof options == 'object' && options

            if not data then $this.data 'translate', (data = new Translate this, options)

            obj = $this.data('translate')
            obj?.getLanguage obj.options.detectUrl, (language)->
                obj?.getTranslations language, (data)->
                    obj?.doTranslation data;

    $.fn.translate.Constructor = Translate;
) jQuery

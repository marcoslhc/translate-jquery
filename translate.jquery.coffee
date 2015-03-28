# The MIT License (MIT)
#
# Copyright (c) <year> <copyright holders>
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
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
                detectUrl: 'http://localhost:3000/languages'
                localeFolder: 'locale'
                language: 'en'

            @option = $.extend @options, options

        doTranslation: (data, cb)->
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
            cb && cb(data)

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
                    url: @options.localeFolder + '/' + language + '.json',
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

            if not data
                $this.data 'translate', (data = new Translate this, options)
            else if options
                 data.options = $.extend data.options, options
                 $this.data 'translate', data

            return if not options

            obj = $this.data('translate')

            if obj and not options.language
                obj.getLanguage obj.options.detectUrl, (language)->
                    obj.getTranslations language, (data)->
                        obj.doTranslation data, ()->
                            $this.trigger 'translate:translated', [language];

            else if obj and not _cache[obj.options.language]
                obj.getTranslations obj.options.language, (data)->
                    obj.doTranslation data, ()->
                        $this.trigger 'translate:translated', [obj.options.language];
            else if obj
                obj.doTranslation _cache[obj.options.language], ()->
                    $this.trigger 'translate:translated', [obj.options.language];

    $.fn.translate.Constructor = Translate;
) jQuery

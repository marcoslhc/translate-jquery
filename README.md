#jQuery Translate
jqury-translate is a very simple plugin for your website internationalization (i18n)

Uses the [i18n](https://github.com/andrefarzat/js-i18n) Library

##Example

### example.html
```html
    <p translate>Hello World</p>
```

### locale/es.json
```json
    {
        "Hello World":"Hola Mundo"
    }
```

### example.js
```javascript
    $('[translate]').translate({
        language: 'es'
    });
```


##Options

###`language`
`<string>` default: `en`

Language in ISO format

###`detectUrl`
`<string>` default: `''`

Url used for language browser detection. It should be an endpoint that outputs an array of languages, the first one will be use as default.

###`localeFolder`
`<string>` default `locale/`

Folder in which the json files are located

##Methods of $().translate
###`doTranslation(translation, callback)`
###`getTranslations(language, callback)`
###`getLanguage(url, callback)`

##Events fired by $().translate
###`translate:translated`
Triggered after the text substitution is made. The selected language is passed to the event callback.

####Example of use

```javascript
$('[translate]').translate({
	language: 'es'
}).on('translate:translated', function (e, language) {
	console.log(language)
});
```

##Notes
`$().translate()` should be called with at least one of `language` or `detectUrl` option in order to do the actual translation. Otherwise it will create the translate object and attach it to the selected elements but no substitution are done.

This software is released to the public under the MIT license included in the file `license.txt`, the source `.coffee` file and the _unminified_ `.js` file in `dist/`

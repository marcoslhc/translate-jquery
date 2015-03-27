+function ($, Q) {
    var testObject = $('<div>test</div>').translate();
        fixture = {
            "en": {
                "test": "test"
            },
            "es": {
                "test": "prueba"
            }
        };

    Q.test('test:DoTranslation', function (assert) {
        var language = 'es',
            value = '',
            expectedValue = fixture[language]["test"];

        value = testObject.data('translate')
                .doTranslation(fixture[language])
                .text();
        assert.equal(value, expectedValue);
    });

    Q.test('test:getTranslation', function (assert) {
        var done = assert.async();

        testObject.data('translate').getTranslations('en', function (data) {
            assert.deepEqual(data, fixture["en"]);
            done();
        });
    });

    Q.test('test:getLanguage', function (assert) {
        var done = assert.async();

        testObject.data('translate').getLanguage('fixtures/language.json', function (data) {
            assert.equal(data, "es");
            done();
        });
    });
    Q.test('test:Integration', function (assert) {
        var done = assert.async(),
            testObject = testObject = $('<div>test</div>').translate({
                detectUrl: 'fixtures/language.json',
                localeFolder: 'locale'
            });

        testObject.on('translate:translated', function(e){
            assert.equal(e.target.innerHTML,fixture.es["test"]);
            done();
        })
    })
}(jQuery, QUnit);

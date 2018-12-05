module.exports = {
  'Register coach'(browser) {
    browser
      .url('http://localhost:8080/register')
      .waitForElementVisible('body', 1000)
      .setValue('#firstName', 'nightwatch')
      .setValue('#lastName', 'nightwatch')
      .setValue('#email', generateEmail())
      .setValue('#password', '12345678')
      .waitForElementVisible('#register', 1000)
      .pause(1000)
      .click('#register')
      .pause(1000)
      .waitForElementVisible('.modal__content .box__title-name', 1000)
      .assert.containsText(".modal__content .box__title-name", "Witaj!")
      .end();
  },
  'Register pupil'(browser) {
    browser
      .url(`http://localhost:8080/register?ref=5bf3e3beb42df904d2c81848`)
      .waitForElementVisible('body', 1000)
      .setValue('#firstName', 'nighwatch')
      .setValue('#lastName', 'nightwatch')
      .setValue('#email', generateEmail())
      .setValue('#password', '12345678')
      .waitForElementVisible('#register', 1000)
      .pause(1000)
      .click('#register')
      .pause(1000)
      .waitForElementVisible('.modal__content .box__title-name', 1000)
      .assert.containsText(".modal__content .box__title-name", "Chcę Cię lepiej poznać.")
      .end();
  },
};

const generateEmail = () => {
  const e1 = Math.random().toString(36).replace('.', '');
  const e2 = Math.random().toString(36).replace('.', '');
  const e3 = Math.random().toString(36).replace('.', '');
  const e4 = Math.random().toString(36).replace(/[^a-z]+/g, '');
  return `${e1}.${e2}@${e3}.${e4}`;
}
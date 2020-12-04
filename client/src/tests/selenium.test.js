/* eslint-disable no-undef */
// Functional Tests
require('geckodriver');
// import selenium functions
const {
  Builder, By, Key, until,
} = require('selenium-webdriver');

// declare the -web- driver
let driver;

beforeAll(async () => {
  // initialize the driver before running the tests
  driver = await new Builder().forBrowser('firefox').build();
});

afterAll(async () => {
  // close the driver after running the tests
  await driver.quit();
});

// use the driver to mock user's actions
async function mockLoadPage() {
  // open the URL
  driver.wait(until.urlIs('http://localhost:3000/'));
  await driver.get('http://localhost:3000/');
  // locate the textbox, provide a timeout
  //const textbox = await driver.wait(until.elementLocated(By.id('namefield')), 10000);
  const div = await driver.wait(until.elementLocated(By.id('main')), 10000);
  // enter text in the textbox
  //await textbox.sendKeys('Raymond', Key.RETURN);
  // click on 'get weather' button
  //await driver.findElement(By.id("SignupForm-button-id")).click();
  // return the element contining the value to test
  return div;
}

async function mockNavBarUse() {
  driver.wait(until.urlIs('http://localhost:3000/'));
  await driver.get('http://localhost:3000/');
  await driver.findElements(By.className("nav-links")).then(async function(elements){
    elements.forEach(async function (element) {
        element.getText().then(async function(text){
            if(text === 'About') {
              await element.click();
            }
        });
    });
});
  const div = await driver.wait(until.elementLocated(By.id('AboutBox')), 10000);
  return div;
}
 //jest.setTimeout(15000);
it('test webpage updated correctly', async () => {
  // call the mock function
  const element = await mockLoadPage();
  expect(element).not.toBeNull();
});

it('test webpage routes correctly', async () => {
  // call the mock function
  const element = await mockNavBarUse();
  expect(element).not.toBeNull();
});
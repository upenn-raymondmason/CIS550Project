import {
  act, fireEvent, render, screen, waitFor, waitForElement,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../pages/App';
import About from '../pages/About';
import Features from '../pages/Features';
import LandingPage from '../pages/LandingPage';
import Profile from '../pages/Profile';
import Register from '../pages/Register';
import fetchMock from 'jest-fetch-mock';
require('jest-fetch-mock').enableMocks();
const renderer = require('react-test-renderer');

beforeEach(() => {
  fetch.resetMocks();
});

// snapshot tests
describe('Snapshot tests for each of the pages', () => {
  test('Landing Page matches snapshot', () => {
    const component = renderer.create(<LandingPage />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('About matches snapshot', () => {
    const component = renderer.create(<About />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Features matches snapshot', () => {
    const component = renderer.create(<Features />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Profile matches snapshot', () => {
    const component = renderer.create(<Profile />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Register matches snapshot', () => {
    const component = renderer.create(<Register />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// Test Components Presence
describe('the initial page loaded correctly', () => {
  test('Correct App page', () => {
    render(<App />);
    const divElement = screen.getByTestId('main');
    expect(divElement).toBeInTheDocument();
  });
  test('Correct landing page', () => {
    render(<LandingPage />);
    const divElement = screen.getByTestId('landing');
    expect(divElement).toBeInTheDocument();
  });
});

// Test routing
/* describe('Routing is working correctly', () => {
  test('Page routes to About', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/About/));
    let divEle = null;
    await waitFor(() => {divEle = screen.getByTestId('AboutBox');});
    expect(divEle).toBeInTheDocument();
    });
}); */

import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, useLocation } from 'react-router-dom';
import App from './App';
import { store } from './redux/store';

jest.mock('react-slick', () => {
  const React = require('react');
  return React.forwardRef(function MockSlider({ children }, ref) {
    React.useImperativeHandle(ref, () => ({ slickGoTo: jest.fn() }));
    return React.createElement('div', null, children);
  });
});

function CurrentPath() {
  const { pathname } = useLocation();
  return <div data-testid="current-path">{pathname}</div>;
}

test('renders the KFC order link', () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getAllByRole('link', { name: /start an order for pickup or delivery/i })[0]
  ).toBeInTheDocument();
});

test('Start Order navigates to the menu', () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
        <CurrentPath />
      </MemoryRouter>
    </Provider>
  );

  fireEvent.click(screen.getByRole('button', { name: /start order/i }));

  expect(screen.getByTestId('current-path')).toHaveTextContent('/menu');
});

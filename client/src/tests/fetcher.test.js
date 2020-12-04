/* eslint-disable no-undef */
import {createUser, getUsers, loginUser} from '../fetcher';
import fetchMock from 'jest-fetch-mock';
require('jest-fetch-mock').enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

it('mocking createPlayer', async () => {
  fetch.mockResponseOnce(JSON.stringify({ message: 'success', data: {username: 'Varun', email: 'test@gmail.com', password: 'password'} }));

  const res = await createUser('Varun', 'test@gmail.com', 'password');

  expect(res.data.username).toEqual('Varun');
});

it('mocking getUsers', async () => {
  fetch.mockResponseOnce(JSON.stringify({ message: 'success', data: [{username: 'Varun', email: 'test@gmail.com', password: 'password'}, {username: 'Raymond', email: 'test@user.com', password: 'passw0rd1!'}] }));

  const res = await getUsers();

  expect(res.data[0].username).toEqual('Varun');
  expect(res.data[1].username).toEqual('Raymond');
});

it('mocking login', async () => {
  fetch.mockResponseOnce(JSON.stringify({ message: 'success', data: {username: 'Varun', password: 'Passw0rd!'} }));

  const res = await loginUser('varun@gmail.com', 'Passw0rd!');

  expect(res.data.username).toEqual('Varun');
});
import { login, logout } from './auth';

test('login function should return a token for valid credentials', () => {
	expect(login('validUser', 'validPassword')).toBe('token123');
});

test('logout function should return a success message', () => {
	expect(logout()).toBe('Logged out successfully');
});
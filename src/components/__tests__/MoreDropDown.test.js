import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MoreDropdown, ProfileEditDropdown } from '../MoreDropdown';
import { BrowserRouter as Router } from 'react-router-dom';

const mockPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockPush,
  }),
}));

describe('MoreDropdown', () => {
  test('renders the dropdown and handles edit and delete actions', () => {
    const handleEdit = jest.fn();
    const handleDelete = jest.fn();

    render(
      <Router>
        <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete} />
      </Router>
    );

    // Click the custom dropdown toggle (ThreeDots)
    const toggleButton = screen.getByRole('button', {
      name: /toggle-dropdown/i,
    });
    fireEvent.click(toggleButton);

    // Check if edit and delete options are rendered
    expect(screen.getByLabelText('edit')).toBeInTheDocument();
    expect(screen.getByLabelText('delete')).toBeInTheDocument();

    // Click edit option
    fireEvent.click(screen.getByLabelText('edit'));
    expect(handleEdit).toHaveBeenCalledTimes(1);

    // Click delete option
    fireEvent.click(screen.getByLabelText('delete'));
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
});

describe('ProfileEditDropdown', () => {
  test('renders the profile edit dropdown and handles navigation', () => {
    render(
      <Router>
        <ProfileEditDropdown id="123" />
      </Router>
    );

    // Click the custom dropdown toggle (ThreeDots)
    const toggleButton = screen.getByRole('button', {
      name: /toggle-dropdown/i,
    });
    fireEvent.click(toggleButton);

    // Check if all profile edit options are rendered
    expect(screen.getByLabelText('edit-profile')).toBeInTheDocument();
    expect(screen.getByLabelText('edit-username')).toBeInTheDocument();
    expect(screen.getByLabelText('edit-password')).toBeInTheDocument();

    // Click edit profile option
    fireEvent.click(screen.getByLabelText('edit-profile'));
    expect(mockPush).toHaveBeenCalledWith('/profiles/123/edit');

    // Click edit username option
    fireEvent.click(screen.getByLabelText('edit-username'));
    expect(mockPush).toHaveBeenCalledWith('/profiles/123/edit/username');

    // Click edit password option
    fireEvent.click(screen.getByLabelText('edit-password'));
    expect(mockPush).toHaveBeenCalledWith('/profiles/123/edit/password');
  });
});
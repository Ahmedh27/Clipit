import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import TextInput from './TextInput' // Adjust the import path if needed

test('renders TextInput and handles input changes', () => {
  const onUpdateMock = jest.fn();

  render(
    <TextInput
      string="initial"
      inputType="text"
      placeholder="Enter text"
      error=""
      onUpdate={onUpdateMock}
    />
  );

  const inputElement = screen.getByPlaceholderText('Enter text');
  expect(inputElement).toBeInTheDocument();
  expect((inputElement as HTMLInputElement).value).toBe('initial');

  // Test updating value
  fireEvent.change(inputElement, { target: { value: 'new value' } });
  expect(onUpdateMock).toHaveBeenCalledWith('new value');
});

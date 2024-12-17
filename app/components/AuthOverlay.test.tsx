// AuthOverlay.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import AuthOverlay from './AuthOverlay' // Adjust the path based on your file structure

// Mock react-icons to avoid rendering actual SVGs
jest.mock('react-icons/ai', () => ({
  AiOutlineClose: () => <div data-testid="close-icon">CloseIcon</div>
}))

// Mock Zustand store: useGeneralStore
jest.mock('@/app/stores/general', () => ({
  useGeneralStore: () => ({
    setIsLoginOpen: jest.fn()
  })
}))

// Mock Login and Register components
jest.mock('@/app/components/auth/Login', () => () => <div data-testid="login-component">Login Component</div>)
jest.mock('@/app/components/auth/Register', () => () => <div data-testid="register-component">Register Component</div>)

describe('AuthOverlay Component', () => {
  // Import the mocked setIsLoginOpen after mocking
  const { useGeneralStore } = require('@/app/stores/general')

  it('renders AuthOverlay with Login component by default', () => {
    render(<AuthOverlay />)

    // Check if the overlay is present
    const overlay = screen.getByTestId('AuthOverlay')
    expect(overlay).toBeInTheDocument()

    // Check if the Login component is rendered
    const loginComponent = screen.getByTestId('login-component')
    expect(loginComponent).toBeInTheDocument()

    // Ensure Register component is not rendered
    const registerComponent = screen.queryByTestId('register-component')
    expect(registerComponent).not.toBeInTheDocument()
  })

  it('calls setIsLoginOpen(false) when close button is clicked', () => {
    render(<AuthOverlay />)

    // Access the mocked setIsLoginOpen
    const { setIsLoginOpen } = useGeneralStore()

    // Click the close button
    const closeButton = screen.getByRole('button', { name: /closeicon/i })
    fireEvent.click(closeButton)

    // Expect setIsLoginOpen to have been called with false
    expect(setIsLoginOpen).toHaveBeenCalledWith(false)
  })

  it('toggles between Login and Register components when toggle button is clicked', () => {
    render(<AuthOverlay />)

    // Initially, Login component should be visible
    const loginComponent = screen.getByTestId('login-component')
    expect(loginComponent).toBeInTheDocument()

    // Click the toggle button to switch to Register
    const toggleButton = screen.getByRole('button', { name: /register/i })
    fireEvent.click(toggleButton)

    // Now, Register component should be visible
    const registerComponent = screen.getByTestId('register-component')
    expect(registerComponent).toBeInTheDocument()

    // Login component should no longer be visible
    expect(screen.queryByTestId('login-component')).not.toBeInTheDocument()

    // The toggle button text should now be 'log in'
    const toggleButtonAfter = screen.getByRole('button', { name: /log in/i })
    expect(toggleButtonAfter).toBeInTheDocument()
  })
})

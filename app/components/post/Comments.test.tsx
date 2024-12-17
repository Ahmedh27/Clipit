// Comments.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Comments from './Comments' // Adjust the import path as needed.

// Mock hooks and dependencies
jest.mock('@/app/context/user', () => ({
  useUser: () => ({ user: { id: 'user1', name: 'Test User' } })
}));

jest.mock('@/app/stores/comment', () => ({
  useCommentStore: () => ({ commentsByPost: [], setCommentsByPost: jest.fn() })
}));

jest.mock('@/app/stores/general', () => ({
  useGeneralStore: () => ({ setIsLoginOpen: jest.fn() })
}));

jest.mock('@/app/hooks/useCreateComment', () => jest.fn());

const mockParams = {
  userId: 'user2',
  postId: 'post123'
};

test('renders the Comments component and shows "No comments..." when empty', () => {
  render(<Comments params={mockParams} />)
  expect(screen.getByText('No comments...')).toBeInTheDocument()
});
